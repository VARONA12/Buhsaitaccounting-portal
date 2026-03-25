"""
ЭлитФинанс — Weekly Article Generator
- Берёт новости за последнюю неделю из БД
- Через DeepSeek выбирает самую важную
- Генерирует экспертную статью (1500+ слов)
- Сохраняет в таблицу Article для публикации на /articles
"""

import os, sys, json, logging, re, time
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Setup ─────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
sys.path.insert(0, str(BASE_DIR))

from dotenv import load_dotenv
load_dotenv(BASE_DIR / "news-scraper/.env")
load_dotenv(BASE_DIR / "../.env", override=False)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("article-gen")

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

# ── Эксперты (выбираем по категории) ─────────────────────────────────────────
EXPERTS = {
    "Налоги": {"name": "Анна Туманян", "role": "Главный аудитор", "exp": "15 лет", "slug": "anna-tumanian"},
    "УСН": {"name": "Надежда Здоровец", "role": "Главный бухгалтер", "exp": "20 лет", "slug": "nadezhda-zdorovets"},
    "ОСНО": {"name": "Анна Туманян", "role": "Главный аудитор", "exp": "15 лет", "slug": "anna-tumanian"},
    "Бухгалтерия": {"name": "Мария Шукова", "role": "Операционный бухгалтер", "exp": "12 лет", "slug": "maria-shukova"},
    "Кадры": {"name": "Наталья Рыжичкина", "role": "Кадровый специалист", "exp": "10 лет", "slug": "natalia-ryzhichkina"},
    "115-ФЗ": {"name": "Надежда Здоровец", "role": "Главный бухгалтер", "exp": "20 лет", "slug": "nadezhda-zdorovets"},
    "Гранты": {"name": "Марина Абашева", "role": "Специалист по грантам", "exp": "14 лет", "slug": "marina-abasheva"},
}
DEFAULT_EXPERT = EXPERTS["Налоги"]


def get_db():
    import psycopg2
    url = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgres://")
    if "sslmode" not in url:
        url += "?sslmode=require"
    conn = psycopg2.connect(url)
    conn.autocommit = True
    return conn


def deepseek_call(prompt: str, max_tokens: int = 4000, temperature: float = 0.7) -> "str | None":
    """Call DeepSeek API and return response text."""
    import requests
    if not DEEPSEEK_API_KEY:
        log.error("DEEPSEEK_API_KEY not set")
        return None

    for attempt in range(3):
        try:
            resp = requests.post(
                DEEPSEEK_URL,
                headers={"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": "deepseek-chat",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
                timeout=120,
            )
            if resp.status_code != 200:
                log.warning(f"DeepSeek API error {resp.status_code}: {resp.text[:200]}")
                time.sleep(5 * (attempt + 1))
                continue
            return resp.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            log.warning(f"DeepSeek call error (attempt {attempt+1}): {e}")
            time.sleep(5 * (attempt + 1))
    return None


def fetch_weekly_news(conn) -> list:
    """Fetch all published news from the past 7 days."""
    cur = conn.cursor()
    cur.execute("""
        SELECT id, title, content, excerpt, source, "sourceUrl", category, "publishedAt"
        FROM "NewsItem"
        WHERE published = true
          AND "publishedAt" >= NOW() - INTERVAL '7 days'
        ORDER BY "publishedAt" DESC
    """)
    cols = [d[0] for d in cur.description]
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    cur.close()
    log.info(f"Найдено {len(rows)} новостей за последнюю неделю")
    return rows


def pick_best_news(news: list) -> "dict | None":
    """Use DeepSeek to pick the single most important news item."""
    if not news:
        return None
    if len(news) == 1:
        return news[0]

    lines = []
    for i, item in enumerate(news):
        title = item["title"][:200]
        excerpt = (item.get("excerpt") or item["content"][:300])[:300]
        source = item.get("source", "")
        lines.append(f"{i+1}. [{source}] {title} — {excerpt}")

    prompt = (
        "Ты главный редактор бухгалтерского издания для малого бизнеса в России.\n"
        "Выбери ОДНУ самую важную новость из списка, на основе которой стоит написать "
        "развёрнутую экспертную статью для владельцев ООО и ИП.\n\n"
        "Критерии выбора:\n"
        "- Практическая значимость (новые законы, изменение ставок, штрафы)\n"
        "- Актуальность (влияет на бизнес прямо сейчас или в ближайшее время)\n"
        "- Потенциал для экспертного разбора (есть что объяснить, дать рекомендации)\n\n"
        "Новости:\n" + "\n".join(lines) + "\n\n"
        "Ответь ТОЛЬКО JSON: {\"index\": N, \"reason\": \"почему эта новость\"}\n"
        "Где N — номер новости (начиная с 1)."
    )

    result = deepseek_call(prompt, max_tokens=200, temperature=0.1)
    if not result:
        log.warning("Не удалось выбрать новость через AI, беру первую")
        return news[0]

    try:
        # Extract JSON from response
        json_match = re.search(r'\{[^}]+\}', result)
        if json_match:
            data = json.loads(json_match.group())
            idx = data.get("index", 1) - 1
            if 0 <= idx < len(news):
                log.info(f"AI выбрал новость #{idx+1}: {news[idx]['title'][:80]}...")
                log.info(f"Причина: {data.get('reason', 'не указана')}")
                return news[idx]
    except (json.JSONDecodeError, KeyError) as e:
        log.warning(f"Ошибка парсинга ответа AI: {e}")

    return news[0]


def get_expert_for_category(category) -> dict:
    """Pick the right expert based on news category."""
    if not category:
        return DEFAULT_EXPERT
    for key, expert in EXPERTS.items():
        if key.lower() in (category or "").lower():
            return expert
    return DEFAULT_EXPERT


def generate_article(news_item: dict, expert: dict) -> "dict | None":
    """Generate a full expert article based on the news item."""
    title = news_item["title"]
    content = news_item["content"][:3000]
    source = news_item.get("source", "")
    source_url = news_item.get("sourceUrl", "")

    prompt = f"""Ты {expert['name']}, {expert['role']} компании ЭлитФинанс ({expert['exp']} опыта в бухгалтерии и налогах РФ).

Напиши экспертную аналитическую статью на основе этой новости:

ЗАГОЛОВОК НОВОСТИ: {title}
ТЕКСТ НОВОСТИ: {content}
ИСТОЧНИК: {source}

ТРЕБОВАНИЯ К СТАТЬЕ:

1. **Заголовок**: Напиши новый заголовок для статьи (не копируй новостной). Формат: чёткий, информативный, отвечает на вопрос "что изменилось и что делать". Без кавычек и эмодзи.

2. **Вступление** (2-3 абзаца): Кратко опиши суть изменения/события и почему это важно для бизнеса прямо сейчас.

3. **Основная часть** (5-7 разделов с подзаголовками ##):
   - Что конкретно изменилось (факты, цифры, даты вступления в силу)
   - Кого это затрагивает (ИП, ООО, конкретные режимы налогообложения)
   - Практические последствия для бизнеса
   - Пошаговые действия: что нужно сделать прямо сейчас
   - Риски при бездействии (штрафы, блокировки, доначисления)
   - Как ЭлитФинанс помогает в этой ситуации

4. **Заключение**: Краткий итог + рекомендация обратиться к эксперту.

СТИЛЬ:
- Профессиональный, но понятный (без канцелярита)
- Конкретные цифры, даты, ссылки на статьи НК РФ и федеральные законы
- Формат: Markdown с ## подзаголовками
- Объём: 1500-2000 слов
- Пиши от лица эксперта (первое лицо множественное: "мы рекомендуем", "в нашей практике")

ФОРМАТ ОТВЕТА — строго JSON:
{{
  "title": "Заголовок статьи",
  "excerpt": "Краткое описание статьи в 1-2 предложения (для карточки на сайте)",
  "content": "Полный текст статьи в Markdown"
}}

Только JSON, без обёрток и комментариев."""

    result = deepseek_call(prompt, max_tokens=6000, temperature=0.7)
    if not result:
        log.error("Не удалось сгенерировать статью")
        return None

    try:
        # Extract JSON - handle possible markdown code blocks
        clean = result.strip()
        if clean.startswith("```"):
            clean = re.sub(r'^```(?:json)?\s*', '', clean)
            clean = re.sub(r'\s*```$', '', clean)

        data = json.loads(clean)
        if "title" in data and "content" in data:
            return data
    except json.JSONDecodeError:
        # Try to find JSON in response
        json_match = re.search(r'\{[\s\S]*\}', result)
        if json_match:
            try:
                data = json.loads(json_match.group())
                if "title" in data and "content" in data:
                    return data
            except json.JSONDecodeError:
                pass

    log.error(f"Не удалось распарсить ответ AI: {result[:200]}...")
    return None


def save_article(conn, article: dict, expert: dict, source_news: dict) -> "str | None":
    """Save article to the Article table. Returns article ID."""
    cur = conn.cursor()

    # Check for duplicate by title
    cur.execute('SELECT id FROM "Article" WHERE title = %s', (article["title"],))
    if cur.fetchone():
        log.warning(f"Статья с таким заголовком уже существует: {article['title'][:60]}...")
        cur.close()
        return None

    # Add source attribution at the end of content
    source_note = ""
    if source_news.get("source"):
        source_note = f"\n\n---\n*Статья подготовлена на основе материалов: {source_news['source']}"
        if source_news.get("sourceUrl"):
            source_note += f" ([источник]({source_news['sourceUrl']}))"
        source_note += "*"

    full_content = article["content"] + source_note

    cur.execute(
        """INSERT INTO "Article" (id, title, content, excerpt, author, published, "createdAt", "updatedAt")
           VALUES (
               concat('cl', substr(md5(random()::text), 1, 23)),
               %s, %s, %s, %s, true, NOW(), NOW()
           )
           RETURNING id""",
        (
            article["title"],
            full_content,
            article.get("excerpt", article["title"]),
            expert["name"],
        ),
    )
    row = cur.fetchone()
    cur.close()

    if row:
        article_id = row[0]
        log.info(f"Статья сохранена! ID: {article_id}")
        log.info(f"URL: https://elitfinans.online/articles/{article_id}")
        return article_id
    return None


def main():
    log.info("=" * 60)
    log.info("ЭлитФинанс — Генерация еженедельной экспертной статьи")
    log.info("=" * 60)

    # 1. Connect to DB
    try:
        conn = get_db()
        log.info("Подключение к БД: OK")
    except Exception as e:
        log.error(f"Ошибка подключения к БД: {e}")
        return

    # 2. Fetch weekly news
    news = fetch_weekly_news(conn)
    if not news:
        log.warning("Нет новостей за последнюю неделю. Выход.")
        conn.close()
        return

    # 3. Pick the most important news
    log.info("Выбираю самую важную новость через AI...")
    best = pick_best_news(news)
    if not best:
        log.error("Не удалось выбрать новость")
        conn.close()
        return

    log.info(f"Выбрана: {best['title'][:80]}...")
    log.info(f"Категория: {best.get('category', 'не указана')}")
    log.info(f"Источник: {best.get('source', 'не указан')}")

    # 4. Pick expert
    expert = get_expert_for_category(best.get("category"))
    log.info(f"Эксперт: {expert['name']} ({expert['role']})")

    # 5. Generate article
    log.info("Генерирую экспертную статью...")
    article = generate_article(best, expert)
    if not article:
        log.error("Не удалось сгенерировать статью")
        conn.close()
        return

    log.info(f"Заголовок: {article['title']}")
    word_count = len(article["content"].split())
    log.info(f"Объём: {word_count} слов")

    # 6. Reconnect to DB (connection may have timed out during generation)
    try:
        conn.close()
    except Exception:
        pass
    conn = get_db()
    log.info("Переподключение к БД: OK")

    # 7. Save to DB
    article_id = save_article(conn, article, expert, best)
    if article_id:
        log.info("=" * 60)
        log.info("ГОТОВО! Статья опубликована.")
        log.info(f"https://elitfinans.online/articles/{article_id}")
        log.info("=" * 60)
    else:
        log.error("Не удалось сохранить статью")

    conn.close()


if __name__ == "__main__":
    main()

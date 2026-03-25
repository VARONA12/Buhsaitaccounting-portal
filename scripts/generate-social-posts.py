"""
ЭлитФинанс — Social Posts Generator
- Понедельник: пост по последней статье (из новостей)
- Среда: рандомный пост на основе контента сайта (FAQ / справочник / услуги / кейсы)
- Пятница: юмор на бухгалтерскую тему
- Сохраняет в JSON для просмотра (позже — автопостинг в VK)
"""

import os, sys, json, logging, re, time, random
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).parent
SITE_DIR = BASE_DIR.parent / "src" / "lib"
sys.path.insert(0, str(BASE_DIR))

from dotenv import load_dotenv
load_dotenv(BASE_DIR / "news-scraper/.env")
load_dotenv(BASE_DIR / "../.env", override=False)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("social-gen")

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

# ── Track used sources to avoid repeats ───────────────────────────────────────
HISTORY_PATH = BASE_DIR / "social-posts-history.json"

def load_history():
    if HISTORY_PATH.exists():
        try:
            return json.loads(HISTORY_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"used_sources": []}

def save_history(history):
    HISTORY_PATH.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding="utf-8")


# ── DB & AI helpers ───────────────────────────────────────────────────────────
def get_db():
    import psycopg2
    url = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgres://")
    if "sslmode" not in url:
        url += "?sslmode=require"
    conn = psycopg2.connect(url)
    conn.autocommit = True
    return conn


def deepseek_call(prompt, max_tokens=2000, temperature=0.8):
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
            log.warning(f"DeepSeek error (attempt {attempt+1}): {e}")
            time.sleep(5 * (attempt + 1))
    return None


def parse_json_response(result):
    """Extract JSON from AI response."""
    if not result:
        return None
    try:
        clean = result.strip()
        if clean.startswith("```"):
            clean = re.sub(r'^```(?:json)?\s*', '', clean)
            clean = re.sub(r'\s*```$', '', clean)
        return json.loads(clean)
    except json.JSONDecodeError:
        m = re.search(r'\{[\s\S]*\}', result)
        if m:
            try:
                return json.loads(m.group())
            except json.JSONDecodeError:
                pass
    return None


# ── Content sources for Wednesday ─────────────────────────────────────────────
def load_faq_items():
    """Parse FAQ items from TypeScript source."""
    path = SITE_DIR / "faq-data.ts"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    items = []
    for m in re.finditer(r'slug:\s*"([^"]+)"[\s\S]*?question:\s*"([^"]+)"[\s\S]*?shortAnswer:\s*"([^"]+)"', text):
        items.append({
            "type": "faq",
            "slug": m.group(1),
            "title": m.group(2),
            "content": m.group(3),
            "url": f"https://elitfinans.online/faq/{m.group(1)}"
        })
    return items


def load_handbook_items():
    """Parse handbook terms from TypeScript source."""
    path = SITE_DIR / "handbook-data.ts"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    items = []
    for m in re.finditer(r'slug:\s*"([^"]+)"[\s\S]*?term:\s*"([^"]+)"[\s\S]*?shortDef:\s*"([^"]+)"', text):
        items.append({
            "type": "handbook",
            "slug": m.group(1),
            "title": m.group(2),
            "content": m.group(3),
            "url": f"https://elitfinans.online/handbook/{m.group(1)}"
        })
    return items


def load_services_items():
    """Parse services from TypeScript source."""
    path = SITE_DIR / "services-data.ts"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    items = []
    for m in re.finditer(r'slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?subtitle:\s*"([^"]+)"', text):
        items.append({
            "type": "service",
            "slug": m.group(1),
            "title": m.group(2),
            "content": m.group(3),
            "url": f"https://elitfinans.online/services/{m.group(1)}"
        })
    return items


CASES = [
    {
        "type": "case",
        "slug": "okved-shtraf",
        "title": "Снижение штрафа ФНС вдвое за ошибки в ОКВЭД",
        "content": "Клиент получил претензию на 500 тыс. руб. Мы подготовили возражения и исправили реестр. Итог: штраф снижен до 250 тыс. руб.",
        "url": "https://elitfinans.online/cases#okved-shtraf"
    },
    {
        "type": "case",
        "slug": "uvolneniye",
        "title": "Увольнение конфликтного сотрудника без судов",
        "content": "Помогли владельцу расстаться с токсичным персоналом строго по ТК РФ. Ни одной претензии от ГИТ.",
        "url": "https://elitfinans.online/cases#uvolneniye"
    },
]


def pick_wednesday_source(history):
    """Pick a random content source for Wednesday, avoiding recent repeats."""
    all_items = []
    all_items.extend(load_faq_items())
    all_items.extend(load_handbook_items())
    all_items.extend(load_services_items())
    all_items.extend(CASES)

    if not all_items:
        return None

    used = set(history.get("used_sources", []))

    # Filter out recently used
    available = [i for i in all_items if f"{i['type']}:{i['slug']}" not in used]

    # If all used, reset history
    if not available:
        log.info("Все источники использованы, сбрасываю историю")
        history["used_sources"] = []
        available = all_items

    choice = random.choice(available)
    history["used_sources"].append(f"{choice['type']}:{choice['slug']}")

    # Keep history manageable (last 30)
    history["used_sources"] = history["used_sources"][-30:]

    return choice


# ── Post generators ───────────────────────────────────────────────────────────
def generate_monday_post(article):
    """Monday: post based on latest article."""
    title = article["title"]
    content = article["content"][:2000]
    article_url = f"https://elitfinans.online/articles/{article['id']}"

    prompt = f"""Ты SMM-менеджер бухгалтерской компании ЭлитФинанс. Напиши пост для VK на ПОНЕДЕЛЬНИК.

СТАТЬЯ: {title}
СОДЕРЖАНИЕ: {content}
ССЫЛКА: {article_url}

Выбери ОДИН формат (какой лучше подходит к теме):
1. "5 фактов о..." — ключевые факты списком
2. "Разбор: что изменилось" — краткий экспертный анализ
3. "Вопрос дня" — провокационный вопрос + ответ
4. "Цифры недели" — инфографика текстом с цифрами

Требования:
- 500-800 символов
- Конкретные цифры и факты из статьи
- В конце — ссылка на полную статью
- Эмодзи умеренно (3-5)
- Призыв подписаться

ФОРМАТ ОТВЕТА — JSON:
{{"format": "название формата", "text": "полный текст поста"}}"""

    result = deepseek_call(prompt, max_tokens=1000, temperature=0.8)
    data = parse_json_response(result)
    if data and "text" in data:
        return {"day": "Понедельник", "format": data.get("format", "экспертный"), "text": data["text"], "source": "article"}
    return None


def generate_wednesday_post(source):
    """Wednesday: post based on random site content."""
    type_labels = {
        "faq": "вопрос из FAQ",
        "handbook": "термин из справочника",
        "service": "услуга компании",
        "case": "реальный кейс",
    }

    format_options = {
        "faq": [
            '"Знали ли вы?" — неочевидный факт из ответа',
            '"Вопрос от подписчика" — как будто отвечаем на вопрос',
            '"Миф vs Реальность" — разоблачаем заблуждение',
        ],
        "handbook": [
            '"Термин дня" — простое объяснение сложного понятия',
            '"Объясни как пятилетнему" — максимально простой разбор',
            '"Шпаргалка" — краткая памятка по теме',
        ],
        "service": [
            '"А вы знали, что мы..." — раскрываем одну услугу',
            '"Кому подойдёт?" — описание целевой аудитории услуги',
            '"3 причины выбрать..." — аргументы в пользу услуги',
        ],
        "case": [
            '"История клиента" — короткий рассказ о реальном кейсе',
            '"Было/Стало" — результат работы ЭлитФинанс',
            '"Кейс недели" — разбор ситуации с выводами',
        ],
    }

    stype = source["type"]
    formats = format_options.get(stype, ['"Полезный пост"'])

    prompt = f"""Ты SMM-менеджер бухгалтерской компании ЭлитФинанс. Напиши пост для VK на СРЕДУ.

ИСТОЧНИК: {type_labels.get(stype, stype)}
ТЕМА: {source['title']}
СОДЕРЖАНИЕ: {source['content']}
ССЫЛКА: {source['url']}

Выбери ОДИН формат:
{chr(10).join(f'{i+1}. {f}' for i, f in enumerate(formats))}

Требования:
- 500-800 символов
- Практическая польза для владельца бизнеса
- В конце — ссылка на подробную страницу
- Эмодзи умеренно (3-5)
- Не упоминай что это "из справочника" или "из FAQ" — пиши как свежий авторский контент

ФОРМАТ ОТВЕТА — JSON:
{{"format": "название формата", "text": "полный текст поста"}}"""

    result = deepseek_call(prompt, max_tokens=1000, temperature=0.85)
    data = parse_json_response(result)
    if data and "text" in data:
        return {
            "day": "Среда",
            "format": data.get("format", "полезный"),
            "text": data["text"],
            "source": f"{stype}:{source['slug']}"
        }
    return None


def generate_friday_post(article, wednesday_source):
    """Friday: humor post on accounting theme."""
    # Collect topics from the week's posts for context
    topics = [article["title"]]
    if wednesday_source:
        topics.append(wednesday_source["title"])

    prompt = f"""Ты SMM-менеджер бухгалтерской компании ЭлитФинанс. Напиши ЮМОРИСТИЧЕСКИЙ пост для VK на ПЯТНИЦУ.

Темы этой недели (для контекста, но можно обыграть любую бухгалтерскую тему):
- {topics[0]}
{f'- {topics[1]}' if len(topics) > 1 else ''}

Выбери ОДИН формат (рандомно, чтобы не повторяться):
1. Мем-текст ("Когда узнал про новые ставки НДС и понял что...")
2. Диалог бухгалтера с директором (короткий смешной диалог)
3. "Топ-3 мысли бухгалтера, когда..." — ироничный список
4. "Бухгалтер в пятницу вечером..." — ситуационный юмор
5. "Переведи на русский" — бюрократический термин простыми словами с юмором
6. Бухгалтерский гороскоп / предсказание на неделю (ироничное)

Требования:
- 200-400 символов
- Реально смешно (не натянутый юмор)
- Без ссылок — чисто развлекательный
- Эмодзи по настроению
- В конце хэштеги: #бухгалтерия #юмор #элитфинанс #пятница

ФОРМАТ ОТВЕТА — JSON:
{{"format": "название формата", "text": "полный текст поста"}}"""

    result = deepseek_call(prompt, max_tokens=600, temperature=0.95)
    data = parse_json_response(result)
    if data and "text" in data:
        return {"day": "Пятница", "format": data.get("format", "юмор"), "text": data["text"], "source": "humor"}
    return None


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    log.info("=" * 60)
    log.info("ЭлитФинанс — Генерация постов для соцсетей")
    log.info("=" * 60)

    history = load_history()

    # 1. DB: get latest article
    try:
        conn = get_db()
        log.info("БД: OK")
    except Exception as e:
        log.error(f"Ошибка подключения к БД: {e}")
        return

    cur = conn.cursor()
    cur.execute("""
        SELECT id, title, content, excerpt, author
        FROM "Article" WHERE published = true
        ORDER BY "createdAt" DESC LIMIT 1
    """)
    cols = [d[0] for d in cur.description]
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        log.error("Нет опубликованных статей")
        return

    article = dict(zip(cols, row))
    log.info(f"Статья: {article['title'][:60]}...")

    # 2. Pick Wednesday source
    wed_source = pick_wednesday_source(history)
    if wed_source:
        log.info(f"Среда: [{wed_source['type']}] {wed_source['title'][:60]}...")
    else:
        log.warning("Нет контента для среды")

    posts = []

    # 3. Generate Monday post
    log.info("Генерирую пост на понедельник...")
    mon = generate_monday_post(article)
    if mon:
        posts.append(mon)
        log.info(f"  Формат: {mon['format']}")

    # 4. Generate Wednesday post
    if wed_source:
        log.info("Генерирую пост на среду...")
        wed = generate_wednesday_post(wed_source)
        if wed:
            posts.append(wed)
            log.info(f"  Формат: {wed['format']}")

    # 5. Generate Friday post
    log.info("Генерирую пост на пятницу...")
    fri = generate_friday_post(article, wed_source)
    if fri:
        posts.append(fri)
        log.info(f"  Формат: {fri['format']}")

    if not posts:
        log.error("Не удалось сгенерировать ни одного поста")
        return

    # 6. Save
    save_history(history)

    output = {
        "article_id": article["id"],
        "article_title": article["title"],
        "wednesday_source": f"{wed_source['type']}:{wed_source['slug']}" if wed_source else None,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "posts": posts,
    }

    out_path = BASE_DIR / "social-posts.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # 7. Print
    log.info("=" * 60)
    log.info(f"ГОТОВО! Сгенерировано {len(posts)} постов:")
    log.info("=" * 60)

    for post in posts:
        print(f"\n{'━' * 50}")
        print(f"{post['day']} | Формат: {post.get('format', '—')} | Источник: {post.get('source', '—')}")
        print(f"{'━' * 50}")
        print(post["text"])
        print(f"\n[{len(post['text'])} символов]")

    log.info(f"\nСохранено в: {out_path}")


if __name__ == "__main__":
    main()

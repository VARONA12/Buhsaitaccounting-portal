"""
ЭлитФинанс — Accounting News Scraper v2
- Парсит бухгалтерские новости с 3 источников
- AI-фильтр: убирает мусор (score >= 6)
- AI-дедупликация: убирает похожие темы с разных источников
- AI-рерайт: SEO-заголовок, excerpt, переработанный контент
- Все прошедшие фильтр новости публикуются
- Сохраняет в PostgreSQL (таблица NewsItem)
- 24/7, проверка каждые 30 минут
"""

import os, sys, json, logging, re, hashlib, time
import concurrent.futures
from typing import Optional, Tuple
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "../../.env", override=False)

LOG_DIR = BASE_DIR / "logs"
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOG_DIR / f"scraper_{datetime.now().strftime('%Y%m%d')}.log", encoding="utf-8"),
    ],
)
log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept-Language": "ru-RU,ru;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

ACCOUNTING_KEYWORDS = [
    "налог", "ндс", "усн", "осно", "фнс", "енп", "енс", "ндфл",
    "бухгалтер", "декларац", "проверк", "штраф", "взнос", "льгота",
    "вычет", "минфин", "сфр", "пфр", "отчетност", "прибыл",
    "налогообложен", "ифнс", "камерал", "выездн", "самозанят",
    "патент", "кудир", "страховые", "упрощенк", "расчет зарплат",
    " ип ", " ооо ", "предпринимател", "бизнес",
]

MIN_SCORE = 8  # Минимальный балл для публикации (1-10)
MIN_RAW_CONTENT = 150   # Минимум символов в исходном тексте перед рерайтом
MIN_FINAL_CONTENT = 200 # Минимум символов в готовой статье для сохранения
MIN_TITLE_LEN = 30      # Минимум символов в заголовке
MIN_PARAGRAPHS = 1      # Минимум абзацев в итоговом контенте

AD_MARKERS = [
    "система главбух", "системы главбух", "систему главбух",
    "реклама", "промокод", "скидка %", "попробуйте бесплатно",
    "подписка на сервис", "купить подписку", "акция до",
    "партнёрский материал", "партнерский материал",
    "на правах рекламы", "erid:", "erid",
    "оплаченный материал", "спонсорский",
]

def is_ad(text):
    """Detect advertorial/promotional content"""
    t = text.lower()
    return any(marker in t for marker in AD_MARKERS)

def is_accounting(text):
    t = text.lower()
    return any(kw in t for kw in ACCOUNTING_KEYWORDS)

def classify(text):
    t = text.lower()
    if any(w in t for w in ["ндс", "вычет ндс"]): return "НДС"
    if any(w in t for w in ["усн", "упрощенк"]): return "УСН"
    if any(w in t for w in ["енп", "енс", "единый налог"]): return "ЕНП"
    if any(w in t for w in ["ндфл", "подоходн"]): return "НДФЛ"
    if any(w in t for w in ["страховые взносы", "пфр", "сфр"]): return "Взносы"
    if any(w in t for w in ["проверк", "штраф", "ифнс"]): return "Налоговый контроль"
    if any(w in t for w in ["зарплат", "кадров", "трудов"]): return "Кадры"
    if any(w in t for w in ["самозанят", "нпд"]): return "Самозанятые"
    return "Налоги"

def normalize(text):
    t = re.sub(r"[^\w\s]", "", text.lower())
    return re.sub(r"\s+", " ", t).strip()[:300]

def make_hash(text):
    return hashlib.md5(normalize(text).encode()).hexdigest()

def get_with_retry(url, retries=3, timeout=20):
    for attempt in range(retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=timeout)
            if resp.status_code == 200:
                return resp
            log.warning(f"  HTTP {resp.status_code}: {url[:60]}")
            return None
        except requests.Timeout:
            log.warning(f"  Timeout attempt {attempt+1}/{retries}: {url[:60]}")
            if attempt < retries - 1:
                time.sleep(3 * (attempt + 1))
        except Exception as e:
            log.warning(f"  Error: {e}")
            return None
    return None


# ── AI ────────────────────────────────────────────────────────────────────────
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

def deepseek_call(prompt, max_tokens=500, temperature=0.1):
    if not DEEPSEEK_API_KEY:
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
                timeout=60,
            )
            if resp.status_code != 200:
                log.warning(f"  DeepSeek {resp.status_code}: {resp.text[:200]}")
                time.sleep(5 * (attempt + 1))
                continue
            return resp.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            log.warning(f"  DeepSeek error (attempt {attempt+1}): {e}")
            time.sleep(5 * (attempt + 1))
    return None


def ai_filter_and_rank(items):
    """Score news 1-10, keep only >= 8, return sorted by score desc."""
    if not items or not DEEPSEEK_API_KEY:
        return items

    lines = []
    for i, item in enumerate(items):
        title = item["title"][:200]
        excerpt = item.get("excerpt", "")[:200]
        lines.append(f'{i+1}. [{item["source"]}] {title}. {excerpt}')

    prompt = (
        "Ты главный редактор бухгалтерского издания для малого бизнеса (ИП и ООО) в России.\n"
        "Оцени каждую новость по шкале 1-10:\n"
        "10 = критически важно: новый закон, изменение ставок/сроков, новые штрафы\n"
        "8-9 = очень важно: разъяснения ФНС/Минфина, практические изменения\n"
        "5-7 = средне: общие обзоры, мнения, несрочное\n"
        "1-4 = мусор: реклама, пресс-релизы, новости для крупного бизнеса, повторы\n"
        "0-1 = РЕКЛАМА: статьи продвигающие конкретный сервис/продукт (Система Главбух, Контур, 1С-рейтинг и т.д.), "
        "написанные от первого лица как «история успеха», рекламные кейсы, партнёрские материалы, тексты с ERID\n\n"
        "ВАЖНО: будь строгим! Рекламные статьи замаскированные под новости — ВСЕГДА 1 балл.\n\n"
        "Новости:\n" + "\n".join(lines) + "\n\n"
        "Ответь ТОЛЬКО JSON:\n"
        '[{"index": 1, "score": 8}, {"index": 2, "score": 3}, ...]\n'
    )

    result = deepseek_call(prompt, max_tokens=500, temperature=0.1)
    if not result:
        return items

    try:
        json_match = re.search(r'\[.*\]', result, re.DOTALL)
        if not json_match:
            return items

        scores = json.loads(json_match.group())
        score_map = {s["index"]: s["score"] for s in scores}

        # Add score to items and filter
        scored = []
        for i, item in enumerate(items):
            score = score_map.get(i + 1, 0)
            if score >= MIN_SCORE:
                item["_score"] = score
                scored.append(item)

        # Sort by score descending
        scored.sort(key=lambda x: x.get("_score", 0), reverse=True)

        log.info(f"  AI фильтр: {len(items)} -> {len(scored)} (порог {MIN_SCORE}/10)")
        return scored

    except Exception as e:
        log.warning(f"  AI filter parse error: {e}")
        return items


def ai_dedup(items):
    """Remove items covering the same topic, keep the one with best content."""
    if len(items) <= 1:
        return items

    lines = [f'{i+1}. [{it["source"]}] {it["title"][:150]}' for i, it in enumerate(items)]

    prompt = (
        "Вот список новостей. Некоторые могут быть про ОДНО И ТО ЖЕ событие из разных источников.\n"
        "Определи дубли и для каждой группы выбери лучшую версию.\n\n"
        + "\n".join(lines) + "\n\n"
        "Ответь JSON — список номеров новостей которые ОСТАВИТЬ (без дублей):\n"
        '{"keep": [1, 3, 5]}\n'
    )

    result = deepseek_call(prompt, max_tokens=200, temperature=0.1)
    if not result:
        return items

    try:
        m = re.search(r'\{[^}]+\}', result)
        if m:
            data = json.loads(m.group())
            keep_ids = set(data.get("keep", []))
            if keep_ids:
                deduped = [it for i, it in enumerate(items) if (i + 1) in keep_ids]
                log.info(f"  Дедупликация: {len(items)} -> {len(deduped)}")
                return deduped if deduped else items
    except Exception as e:
        log.warning(f"  Dedup parse error: {e}")

    return items


def ai_rewrite(item):
    """Rewrite title, excerpt, and content for the site."""
    original_title = item["title"]
    original_content = item["content"][:3000]
    source = item["source"]
    source_url = item.get("url", "")

    prompt = f"""Перепиши новость для публикации на сайте бухгалтерской компании ЭлитФинанс.

ОРИГИНАЛ:
Заголовок: {original_title}
Источник: {source}
Текст: {original_content}

ТРЕБОВАНИЯ:

1. ЗАГОЛОВОК (title):
   - НИКАКИХ эмодзи, иконок, спецсимволов — только текст
   - Обычный регистр: первая буква заглавная, остальные строчные (НЕ КАПСЛОК)
   - Информативный — отвечает на "что произошло"
   - SEO-оптимизированный — содержит ключевые слова которые люди гуглят
   - 60-90 символов
   - Пример хорошего: "ФНС расширила список расходов на УСН с 2026 года"
   - Пример плохого: "💢 ВАЖНЫЕ ИЗМЕНЕНИЯ! УЗНАЙТЕ ЧТО НОВОГО"
   - Пример плохого: "❗ В НК закрепят новое правило"

2. КРАТКОЕ ОПИСАНИЕ (excerpt):
   - 1-2 предложения, 100-200 символов
   - Суть новости для карточки на сайте
   - Конкретика: цифры, даты, кого касается

3. ТЕКСТ НОВОСТИ (content):
   - Объём — ровно столько, сколько нужно: короткая новость = 2-4 абзаца, развёрнутая = 5-7
   - НЕ растягивай текст водой — лучше короткий и точный, чем длинный и пустой
   - Пиши от третьего лица (НЕ "я", НЕ "мы", НЕ от первого лица)
   - Дели на смысловые абзацы с подзаголовками где это уместно
   - Подзаголовок: **Текст подзаголовка** на отдельной строке, двойной перенос до и после
   - Структура: Что произошло → Кого касается → Что делать бизнесу
   - Конкретные факты, цифры, даты, ссылки на статьи НК РФ если есть
   - НИКАКОЙ воды, общих фраз, очевидных выводов
   - НИКАКИХ эмодзи в тексте
   - В конце: "Источник: {source}"

ФОРМАТ — строго JSON:
{{"title": "...", "excerpt": "...", "content": "..."}}"""

    result = deepseek_call(prompt, max_tokens=2000, temperature=0.4)
    if not result:
        log.warning(f"  Рерайт не удался (нет ответа AI): {item['title'][:60]}")
        return None  # Не сохраняем без рерайта

    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"
        "\U0001F300-\U0001F5FF"
        "\U0001F680-\U0001F6FF"
        "\U0001F1E0-\U0001F1FF"
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "\U0001f900-\U0001f9FF"
        "\U00002600-\U000026FF"
        "\U0000FE00-\U0000FE0F"
        "\U0000200D"
        "\U00002B50-\U00002B55"
        "\U0000203C-\U00003299"
        "\U0001FA00-\U0001FA6F"
        "\U0001FA70-\U0001FAFF"
        "]+", flags=re.UNICODE
    )

    try:
        clean = result.strip()
        if clean.startswith("```"):
            clean = re.sub(r'^```(?:json)?\s*', '', clean)
            clean = re.sub(r'\s*```$', '', clean)
        data = json.loads(clean)

        # Валидация обязательных полей
        if not all(k in data for k in ["title", "excerpt", "content"]):
            log.warning(f"  Рерайт: неполный JSON (нет нужных полей)")
            return None

        new_title = emoji_pattern.sub('', data["title"]).strip()
        new_excerpt = emoji_pattern.sub('', data["excerpt"]).strip()
        new_content = data["content"].strip()

        # Строгая валидация после рерайта
        if len(new_title) < MIN_TITLE_LEN:
            log.warning(f"  Рерайт отброшен: заголовок слишком короткий ({len(new_title)} симв.)")
            return None
        if len(new_content) < MIN_FINAL_CONTENT:
            log.warning(f"  Рерайт отброшен: контент слишком короткий ({len(new_content)} симв.)")
            return None
        paragraphs = [p for p in new_content.split("\n\n") if p.strip()]
        if len(paragraphs) < MIN_PARAGRAPHS:
            log.warning(f"  Рерайт отброшен: мало абзацев ({len(paragraphs)})")
            return None

        # Добавить источник
        if source_url:
            new_content += f"\n\nИсточник: [{source}]({source_url})"
        elif source:
            new_content += f"\n\nИсточник: {source}"

        item["title"] = new_title
        item["excerpt"] = new_excerpt
        item["content"] = new_content
        item["hash"] = make_hash(new_title + new_content[:200])

        log.info(f"  ✅ Рерайт OK: {new_title[:70]}")
        return item

    except Exception as e:
        log.warning(f"  Rewrite parse error: {e}")
        return None  # Не сохраняем с битым рерайтом


# ── Website scraping ──────────────────────────────────────────────────────────
def fetch_article_body(url):
    resp = get_with_retry(url, timeout=15)
    if not resp:
        return "", datetime.now(timezone.utc)

    soup = BeautifulSoup(resp.text, "html.parser")

    pub_time = datetime.now(timezone.utc)
    for prop in ["article:published_time", "datePublished", "og:updated_time"]:
        el = soup.find("meta", property=prop) or soup.find("meta", itemprop=prop)
        if el:
            try:
                pub_time = datetime.fromisoformat(el.get("content", "").replace("Z", "+00:00"))
                break
            except Exception:
                pass

    content = ""
    for sel in ["article", ".article__text", ".article-body", ".content-body",
                ".news-text", ".detail-text", ".article-content", "main"]:
        target = soup.select_one(sel)
        if target:
            parts = [p.get_text(separator=" ", strip=True) for p in target.find_all(["p", "li"]) if len(p.get_text(separator=" ", strip=True)) > 40]
            content = "\n\n".join(parts[:20])
            if len(content) > 200:
                break

    return content[:5000], pub_time


def fetch_website(task):
    name = task["name"]
    url = task["url"]
    base = task.get("base", "")
    sel = task["selector"]
    min_len = task.get("min_title_len", 30)

    log.info(f"  {name}")
    resp = get_with_retry(url, timeout=20)
    if not resp:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    candidates = []
    seen = set()

    for el in soup.select(sel):
        a = el if el.name == "a" else el.find("a")
        if not a:
            continue
        href = a.get("href", "")
        if not href:
            continue
        full_url = href if href.startswith("http") else base + "/" + href.lstrip("/")
        title = a.get_text(separator=" ", strip=True)[:300]
        if len(title) < min_len or full_url in seen:
            continue
        if not is_accounting(title):
            continue
        candidates.append({"url": full_url, "title": title})
        seen.add(full_url)
        if len(candidates) >= 15:
            break

    log.info(f"    {len(candidates)} кандидатов")
    posts = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = {ex.submit(fetch_article_body, c["url"]): c for c in candidates}
        for future in concurrent.futures.as_completed(futures):
            c = futures[future]
            try:
                content, pub_time = future.result()
                # Строго: только реальный контент, не заголовок
                if not content or len(content) < MIN_RAW_CONTENT:
                    log.info(f"    ❌ Мало контента ({len(content) if content else 0} симв.): {c['title'][:60]}")
                    continue
                # Filter out advertorials
                if is_ad(c["title"] + " " + content):
                    log.info(f"    ❌ Реклама: {c['title'][:60]}")
                    continue
                excerpt = content[:400].replace("\n", " ")
                posts.append({
                    "title": c["title"],
                    "content": content,
                    "excerpt": excerpt,
                    "source": name,
                    "source_type": "website",
                    "url": c["url"],
                    "published_at": pub_time,
                    "hash": make_hash(c["title"] + content[:200]),
                    "category": classify(c["title"] + " " + content[:300]),
                })
            except Exception as e:
                log.warning(f"  Article error: {e}")

    log.info(f"    {len(posts)} статей собрано")
    return posts


# ── Database ──────────────────────────────────────────────────────────────────
def get_db():
    import psycopg2
    url = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgres://")
    if "sslmode" not in url:
        url += "?sslmode=require"
    conn = psycopg2.connect(url)
    conn.autocommit = True
    return conn


def save_news(conn, items):
    import psycopg2
    if not items:
        return 0
    saved = 0
    for item in items:
        # Skip items without proper content (not rewritten)
        if len(item.get("content", "")) < MIN_FINAL_CONTENT:
            log.info(f"  Пропуск (короткий контент): {item['title'][:60]}...")
            continue
        if len(item.get("title", "")) < MIN_TITLE_LEN:
            log.info(f"  Пропуск (короткий заголовок): {item['title'][:60]}...")
            continue
        cur = None
        try:
            cur = conn.cursor()
            cur.execute(
                """INSERT INTO "NewsItem"
                   (id, title, content, excerpt, source, "sourceType", "sourceUrl",
                    hash, category, published, "publishedAt", "createdAt")
                   VALUES (gen_random_uuid()::text, %s, %s, %s, %s, %s, %s, %s, %s, true, %s, NOW())
                   ON CONFLICT (hash) DO NOTHING""",
                (
                    item["title"][:500],
                    item["content"][:10000],
                    item.get("excerpt", "")[:500],
                    item["source"][:100],
                    item["source_type"],
                    item.get("url", "")[:1000],
                    item["hash"],
                    item.get("category", "Налоги"),
                    item["published_at"],
                ),
            )
            if cur.rowcount > 0:
                saved += 1
            cur.close()
        except psycopg2.OperationalError as e:
            log.warning(f"DB connection lost: {e}")
            try:
                if cur:
                    cur.close()
            except Exception:
                pass
            raise
        except Exception as e:
            log.warning(f"DB insert error: {e}")
            try:
                if cur:
                    cur.close()
            except Exception:
                pass
    return saved


# ── Main pipeline ─────────────────────────────────────────────────────────────
def run_once(sources):
    log.info("=" * 50)
    log.info("Сбор новостей...")

    # 1. Scrape all sources
    all_items = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
        futures = [ex.submit(fetch_website, task) for task in sources.get("websites", [])]
        for f in concurrent.futures.as_completed(futures):
            try:
                all_items.extend(f.result())
            except Exception as e:
                log.warning(f"Web error: {e}")

    log.info(f"Собрано: {len(all_items)} новостей")
    if not all_items:
        return 0

    # 2. AI filter + rank
    log.info("AI фильтрация...")
    filtered = []
    batch_size = 20
    for i in range(0, len(all_items), batch_size):
        batch = all_items[i:i + batch_size]
        filtered.extend(ai_filter_and_rank(batch))

    if not filtered:
        log.info("Ни одна новость не прошла фильтр. Пропускаем.")
        return 0

    # 3. Deduplicate similar topics
    log.info("Дедупликация...")
    deduped = ai_dedup(filtered)

    # 4. AI rewrite each
    log.info(f"Рерайт {len(deduped)} новостей...")
    rewritten = []
    for item in deduped:
        result = ai_rewrite(item)
        if result is not None:  # None = рерайт не удался или не прошёл валидацию
            rewritten.append(result)
        time.sleep(2)  # Rate limit
    log.info(f"После рерайта: {len(rewritten)} из {len(deduped)} прошли валидацию")

    # 6. Save to DB
    conn = get_db()
    log.info("БД подключена")
    saved = save_news(conn, rewritten)
    try:
        conn.close()
    except Exception:
        pass

    log.info(f"Сохранено: {saved} новых")
    log.info("=" * 50)
    return saved


def main():
    INTERVAL = int(os.getenv("SCRAPER_INTERVAL_MIN", "30")) * 60
    log.info(f"ЭлитФинанс News Scraper v2 | интервал: {INTERVAL // 60} мин | порог: {MIN_SCORE}/10")

    with open(BASE_DIR / "sources.json", encoding="utf-8") as f:
        sources = json.load(f)

    while True:
        try:
            run_once(sources)
        except Exception as e:
            if "psycopg2" in str(type(e)):
                log.error(f"БД недоступна: {e}. Retry через 60 сек.")
                time.sleep(60)
                continue
            log.error(f"Ошибка: {e}", exc_info=True)

        log.info(f"Следующий запуск через {INTERVAL // 60} мин")
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()

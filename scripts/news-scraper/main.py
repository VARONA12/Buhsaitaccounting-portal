"""
ЭлитФинанс — Accounting News Scraper
- Парсит бухгалтерские новости с сайтов
- Фильтрует через DeepSeek AI (оставляет только важные новости)
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

def is_accounting(text: str) -> bool:
    t = text.lower()
    return any(kw in t for kw in ACCOUNTING_KEYWORDS)

def classify(text: str) -> str:
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

def normalize(text: str) -> str:
    t = re.sub(r"[^\w\s]", "", text.lower())
    return re.sub(r"\s+", " ", t).strip()[:300]

def make_hash(text: str) -> str:
    return hashlib.md5(normalize(text).encode()).hexdigest()

def get_with_retry(url: str, retries: int = 3, timeout: int = 20) -> Optional[requests.Response]:
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

# ── AI Filtering ───────────────────────────────────────────────────────────────
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

def ai_filter(items: list) -> list:
    """Send batch of news to DeepSeek, keep only important ones (score >= 7)."""
    if not items or not DEEPSEEK_API_KEY:
        return items

    # Build numbered list for prompt
    lines = []
    for i, item in enumerate(items):
        title = item["title"][:200]
        excerpt = item.get("excerpt", "")[:300]
        lines.append(f'{i+1}. {title}. {excerpt}')

    prompt = (
        "Ты эксперт в российском налоговом законодательстве и бухгалтерии.\n"
        "Оцени каждую новость по шкале 1-10, насколько она важна для владельцев малого бизнеса (ИП и ООО в России).\n"
        "10 = критически важно (новый закон, изменение ставок, новые требования ФНС)\n"
        "1 = нерелевантно (реклама, общие слова, крупный корпоративный бизнес)\n\n"
        "Новости:\n" + "\n".join(lines) + "\n\n"
        "Ответь ТОЛЬКО валидным JSON массивом оценок в формате:\n"
        '[{"index": 1, "score": 8}, {"index": 2, "score": 3}, ...]\n'
        "Без пояснений, только JSON."
    )

    try:
        resp = requests.post(
            DEEPSEEK_URL,
            headers={"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "max_tokens": 500,
            },
            timeout=30,
        )
        if resp.status_code != 200:
            log.warning(f"  DeepSeek API error {resp.status_code}: {resp.text[:200]}")
            return items

        content = resp.json()["choices"][0]["message"]["content"].strip()

        # Extract JSON from response (may be wrapped in ```json ... ```)
        json_match = re.search(r'\[.*\]', content, re.DOTALL)
        if not json_match:
            log.warning("  DeepSeek: no JSON found in response")
            return items

        scores = json.loads(json_match.group())
        score_map = {s["index"]: s["score"] for s in scores}

        kept = []
        for i, item in enumerate(items):
            score = score_map.get(i + 1, 5)
            if score >= 7:
                kept.append(item)

        log.info(f"  🤖 AI filter: {len(items)} → {len(kept)} новостей (порог 7/10)")
        return kept

    except Exception as e:
        log.warning(f"  DeepSeek filter failed: {e}. Пропускаем фильтрацию.")
        return items

# ── Websites ───────────────────────────────────────────────────────────────────
def fetch_article_body(url: str) -> Tuple[str, datetime]:
    resp = get_with_retry(url, timeout=15)
    if not resp:
        return "", datetime.now(timezone.utc)

    soup = BeautifulSoup(resp.text, "html.parser")

    # Дата публикации
    pub_time = datetime.now(timezone.utc)
    for prop in ["article:published_time", "datePublished", "og:updated_time"]:
        el = soup.find("meta", property=prop) or soup.find("meta", itemprop=prop)
        if el:
            try:
                pub_time = datetime.fromisoformat(el.get("content","").replace("Z","+00:00"))
                break
            except Exception:
                pass

    # Контент
    content = ""
    for sel in ["article", ".article__text", ".article-body", ".content-body",
                ".news-text", ".detail-text", ".article-content", "main"]:
        target = soup.select_one(sel)
        if target:
            parts = [p.get_text(strip=True) for p in target.find_all(["p","li"]) if len(p.get_text(strip=True)) > 40]
            content = "\n\n".join(parts[:20])
            if len(content) > 200:
                break

    return content[:5000], pub_time

def fetch_website(task: dict) -> list:
    name = task["name"]
    url  = task["url"]
    base = task.get("base", "")
    sel  = task["selector"]
    min_len = task.get("min_title_len", 30)

    log.info(f"🌐 Web: {name}")
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
        title = a.get_text(strip=True)[:300]
        if len(title) < min_len or full_url in seen:
            continue
        if not is_accounting(title):
            continue
        candidates.append({"url": full_url, "title": title})
        seen.add(full_url)
        if len(candidates) >= 15:
            break

    log.info(f"  🔍 {name}: {len(candidates)} кандидатов")
    posts = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = {ex.submit(fetch_article_body, c["url"]): c for c in candidates}
        for future in concurrent.futures.as_completed(futures):
            c = futures[future]
            try:
                content, pub_time = future.result()
                body = content or c["title"]
                if len(body) < 40:
                    continue
                excerpt = body[:400].replace("\n", " ")
                posts.append({
                    "title": c["title"],
                    "content": body,
                    "excerpt": excerpt,
                    "source": name,
                    "source_type": "website",
                    "url": c["url"],
                    "published_at": pub_time,
                    "hash": make_hash(c["title"] + body[:200]),
                    "category": classify(c["title"] + " " + body[:300]),
                })
            except Exception as e:
                log.warning(f"  Article error: {e}")

    log.info(f"  ✅ {name}: {len(posts)} статей")
    return posts

# ── Database ───────────────────────────────────────────────────────────────────
def get_db():
    import psycopg2
    url = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgres://")
    if "sslmode" not in url:
        url += "?sslmode=disable"
    conn = psycopg2.connect(url)
    conn.autocommit = True
    return conn

def save_news(conn, items: list) -> int:
    import psycopg2
    if not items:
        return 0
    saved = 0
    cur = conn.cursor()
    for item in items:
        try:
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
        except Exception as e:
            log.warning(f"DB insert error: {e}")
    cur.close()
    return saved

# ── Main loop ──────────────────────────────────────────────────────────────────
def run_once(sources: dict, conn) -> int:
    all_items = []

    # Websites
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
        futures = [ex.submit(fetch_website, task) for task in sources.get("websites", [])]
        for f in concurrent.futures.as_completed(futures):
            try:
                all_items.extend(f.result())
            except Exception as e:
                log.warning(f"Web error: {e}")

    log.info(f"📥 Собрано: {len(all_items)} новостей до фильтрации")

    # AI filtering — send in batches of 20
    if all_items:
        filtered = []
        batch_size = 20
        for i in range(0, len(all_items), batch_size):
            batch = all_items[i:i + batch_size]
            filtered.extend(ai_filter(batch))
        all_items = filtered

    log.info(f"✅ После AI-фильтра: {len(all_items)} новостей")
    saved = save_news(conn, all_items)
    log.info(f"💾 Новых в БД: {saved}")
    return saved

def main():
    INTERVAL = int(os.getenv("SCRAPER_INTERVAL_MIN", "30")) * 60
    log.info(f"🚀 ЭлитФинанс News Scraper | интервал: {INTERVAL//60} мин")

    with open(BASE_DIR / "sources.json", encoding="utf-8") as f:
        sources = json.load(f)

    conn = None
    while True:
        try:
            if conn is None or getattr(conn, "closed", True):
                conn = get_db()
                log.info("✅ БД подключена")
            run_once(sources, conn)
        except Exception as e:
            if "psycopg2" in type(e).__module__:
                log.error(f"❌ БД недоступна: {e}. Retry в 60 сек.")
                conn = None
                time.sleep(60)
                continue
            log.error(f"❌ Ошибка: {e}", exc_info=True)

        log.info(f"⏳ Следующий запуск через {INTERVAL//60} мин")
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()

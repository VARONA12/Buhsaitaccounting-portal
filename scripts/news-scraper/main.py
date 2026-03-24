"""
ЭлитФинанс — News Scraper
Парсит бухгалтерские новости из Telegram-каналов и сайтов.
Сохраняет в PostgreSQL (таблица NewsItem).
Работает 24/7 — проверка каждые 30 минут.
"""

import os
import sys
import json
import logging
import re
import hashlib
import time
import concurrent.futures
import requests
import psycopg2
import psycopg2.extras
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone
from pathlib import Path
from dotenv import load_dotenv

# ── Setup ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "../../.env")  # fallback: Website/.env

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
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

# Ключевые слова — фильтр только бухгалтерских/налоговых новостей
ACCOUNTING_KEYWORDS = [
    "налог", "ндс", "усн", "осно", "фнс", "енп", "енс", "ндфл", "ип ", "ооо",
    "бухгалтер", "декларац", "проверк", "штраф", "ставк", "взнос", "льгота",
    "вычет", "минфин", "сфр", "пфр", "отчетност", "баланс", "прибыл",
    "налогообложен", "налоговая", "бухгалтерск", "расчет", "ифнс", "камерал",
    "выездн", "самозанят", "патент", "лимит", "упрощенк", "кудир", "едо",
    "первичк", "ликвидац", "оквэд", "каникул", "страховые", "пенсионн",
]

# Категории
def classify(text: str) -> str:
    t = text.lower()
    if any(w in t for w in ["ндс", "вычет ндс", "ставка ндс"]): return "НДС"
    if any(w in t for w in ["усн", "упрощенк", "6%", "15%"]): return "УСН"
    if any(w in t for w in ["енп", "енс", "единый налог"]): return "ЕНП"
    if any(w in t for w in ["ндфл", "подоходн"]): return "НДФЛ"
    if any(w in t for w in ["страховые взносы", "пфр", "сфр", "взносы"]): return "Взносы"
    if any(w in t for w in ["проверк", "штраф", "ифнс", "фнс"]): return "Налоговый контроль"
    if any(w in t for w in ["кадров", "трудов", "сотрудник", "зарплат"]): return "Кадры"
    if any(w in t for w in ["самозанят", "нпд"]): return "Самозанятые"
    if any(w in t for w in ["ип ", "индивидуальный предприним"]): return "ИП"
    return "Налоги"

def normalize(text: str) -> str:
    t = text.lower()
    t = re.sub(r"[^\w\s]", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t[:300]

def make_hash(text: str) -> str:
    return hashlib.md5(normalize(text).encode()).hexdigest()

def is_accounting(text: str) -> bool:
    t = text.lower()
    return any(kw in t for kw in ACCOUNTING_KEYWORDS)

# ── Database ───────────────────────────────────────────────────────────────────
def get_db():
    url = os.getenv("DATABASE_URL", "")
    # Prisma uses postgresql://, psycopg2 needs it too
    url = url.replace("postgresql://", "postgres://") if url.startswith("postgresql://") else url
    conn = psycopg2.connect(url)
    conn.autocommit = True
    return conn

def save_news(conn, items: list) -> int:
    if not items:
        return 0
    saved = 0
    cur = conn.cursor()
    for item in items:
        try:
            cur.execute(
                """
                INSERT INTO "NewsItem" (id, title, content, excerpt, source, "sourceType", "sourceUrl",
                    hash, category, published, "publishedAt", "createdAt")
                VALUES (gen_random_uuid()::text, %s, %s, %s, %s, %s, %s, %s, %s, true, %s, NOW())
                ON CONFLICT (hash) DO NOTHING
                """,
                (
                    item["title"][:500],
                    item["content"][:10000],
                    item["excerpt"][:500] if item.get("excerpt") else None,
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

# ── Telegram collector ─────────────────────────────────────────────────────────
def fetch_telegram(channel_id: str, url: str) -> list:
    log.info(f"📡 TG: @{channel_id}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
    except Exception as e:
        log.warning(f"TG @{channel_id} error: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    posts = []
    for wrap in soup.select(".tgme_widget_message_wrap, .js-widget_message_wrap"):
        try:
            text_el = wrap.select_one(".tgme_widget_message_text")
            if not text_el:
                continue
            raw = text_el.get_text(separator="\n", strip=True)
            if len(raw) < 60 or not is_accounting(raw):
                continue

            link_el = wrap.select_one(".tgme_widget_message_date a")
            post_url = link_el["href"] if link_el else url

            time_el = wrap.select_one("time")
            pub_time = datetime.now(timezone.utc)
            if time_el and time_el.get("datetime"):
                try:
                    pub_time = datetime.fromisoformat(time_el["datetime"].replace("Z", "+00:00"))
                except Exception:
                    pass

            # Первая строка — заголовок
            lines = [l.strip() for l in raw.split("\n") if l.strip()]
            title = lines[0][:300] if lines else raw[:300]
            excerpt = " ".join(lines[:3])[:400] if len(lines) > 1 else title

            posts.append({
                "title": title,
                "content": raw[:5000],
                "excerpt": excerpt,
                "source": f"@{channel_id}",
                "source_type": "telegram",
                "url": post_url,
                "published_at": pub_time,
                "hash": make_hash(raw),
                "category": classify(raw),
            })
        except Exception:
            continue
    log.info(f"  ✅ @{channel_id}: {len(posts)} новостей")
    return posts

# ── Website collector ──────────────────────────────────────────────────────────
def fetch_article(url: str) -> dict:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return {}
        soup = BeautifulSoup(resp.text, "html.parser")

        pub_date = ""
        for meta in ["article:published_time", "datePublished", "og:updated_time"]:
            el = soup.find("meta", property=meta) or soup.find("meta", itemprop=meta)
            if el:
                pub_date = el.get("content", "")
                break

        # Find content container
        content = ""
        for sel in ["article", ".article__text", ".article-body", ".content-body", ".news-text", ".detail-text", "main p"]:
            target = soup.select_one(sel)
            if target:
                parts = [p.get_text(strip=True) for p in target.find_all(["p", "li"]) if len(p.get_text(strip=True)) > 40]
                content = "\n\n".join(parts)[:5000]
                if len(content) > 200:
                    break

        return {"content": content, "date": pub_date}
    except Exception:
        return {}

def fetch_website(task: dict) -> list:
    name = task["name"]
    url = task["url"]
    log.info(f"🌐 Web: {name}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        if resp.status_code != 200:
            return []
        soup = BeautifulSoup(resp.text, "html.parser")
        links = []
        seen = set()
        for el in soup.select(task["selector"]):
            href = el.get("href", "") if el.name == "a" else (el.find("a") or {}).get("href", "")
            if not href:
                continue
            full_url = href if href.startswith("http") else f"{url.rstrip('/')}/{href.lstrip('/')}"
            title = el.get_text(strip=True)[:300]
            if full_url not in seen and len(title) > 20 and is_accounting(title):
                links.append({"url": full_url, "title": title})
                seen.add(full_url)
            if len(links) >= 15:
                break

        posts = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
            futures = {ex.submit(fetch_article, l["url"]): l for l in links}
            for future in concurrent.futures.as_completed(futures):
                link = futures[future]
                try:
                    data = future.result()
                    content = data.get("content", "") or link["title"]
                    if len(content) < 50:
                        continue
                    pub_str = data.get("date", "")
                    try:
                        pub_time = datetime.fromisoformat(pub_str.replace("Z", "+00:00")) if pub_str and "T" in pub_str else datetime.now(timezone.utc)
                    except Exception:
                        pub_time = datetime.now(timezone.utc)
                    excerpt = content[:400].replace("\n", " ")
                    posts.append({
                        "title": link["title"],
                        "content": content,
                        "excerpt": excerpt,
                        "source": name,
                        "source_type": "website",
                        "url": link["url"],
                        "published_at": pub_time,
                        "hash": make_hash(link["title"] + content[:200]),
                        "category": classify(link["title"] + " " + content[:300]),
                    })
                except Exception:
                    continue
        log.info(f"  ✅ {name}: {len(posts)} статей")
        return posts
    except Exception as e:
        log.warning(f"  ❌ {name}: {e}")
        return []

# ── Main loop ──────────────────────────────────────────────────────────────────
def run_once(sources: dict, conn) -> int:
    all_items = []

    # Telegram
    channels = [ch for ch in sources.get("telegram_channels", []) if ch.get("enabled")]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
        futures = [ex.submit(fetch_telegram, ch["id"], ch["url"]) for ch in channels]
        for f in concurrent.futures.as_completed(futures):
            try:
                all_items.extend(f.result())
            except Exception as e:
                log.warning(f"TG error: {e}")

    # Websites
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = [ex.submit(fetch_website, task) for task in sources.get("websites", [])]
        for f in concurrent.futures.as_completed(futures):
            try:
                all_items.extend(f.result())
            except Exception as e:
                log.warning(f"Web error: {e}")

    log.info(f"📥 Собрано: {len(all_items)} новостей")
    saved = save_news(conn, all_items)
    log.info(f"💾 Сохранено новых: {saved}")
    return saved

def main():
    INTERVAL = int(os.getenv("SCRAPER_INTERVAL_MIN", "30")) * 60  # секунды
    log.info(f"🚀 ЭлитФинанс News Scraper запущен. Интервал: {INTERVAL//60} мин")

    with open(BASE_DIR / "sources.json", encoding="utf-8") as f:
        sources = json.load(f)

    conn = None
    while True:
        try:
            if conn is None or conn.closed:
                conn = get_db()
                log.info("✅ Подключено к БД")
            run_once(sources, conn)
        except psycopg2.OperationalError as e:
            log.error(f"❌ БД недоступна: {e}. Повтор через 60 сек.")
            conn = None
            time.sleep(60)
            continue
        except Exception as e:
            log.error(f"❌ Ошибка: {e}", exc_info=True)

        log.info(f"⏳ Следующий запуск через {INTERVAL//60} мин...")
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()

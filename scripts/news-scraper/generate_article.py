"""
ЭлитФинанс — Article Generator
Каждый день в заданное время (по умолчанию 09:00):
  1. Читает новости за последние 7 дней из БД
  2. Шаг 1 — AI выбирает самую важную тему и строит план
  3. Шаг 2 — AI пишет статью 1000+ слов
  4. Сохраняет статью в таблицу Article
"""

import os
import sys
import json
import time
import logging
import psycopg2
import requests
from datetime import datetime, timedelta, timezone, time as dtime
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "../../.env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger(__name__)

DEEPSEEK_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
PUBLISH_HOUR = int(os.getenv("ARTICLE_HOUR", "9"))   # час публикации (UTC+8)

# ── DB ──────────────────────────────────────────────────────────────────────
def get_db():
    url = os.getenv("DATABASE_URL", "").replace("postgresql://", "postgres://")
    conn = psycopg2.connect(url)
    conn.autocommit = True
    return conn

def get_recent_news(conn, days: int = 7) -> list:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        """SELECT title, excerpt, category, "publishedAt", source
           FROM "NewsItem"
           WHERE "publishedAt" > %s AND published = true
           ORDER BY "publishedAt" DESC LIMIT 60""",
        (cutoff,),
    )
    rows = cur.fetchall()
    cur.close()
    return [dict(r) for r in rows]

def get_past_titles(conn, days: int = 60) -> list:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    cur = conn.cursor()
    cur.execute('SELECT title FROM "Article" WHERE "createdAt" > %s', (cutoff,))
    rows = cur.fetchall()
    cur.close()
    return [r[0] for r in rows]

def save_article(conn, title: str, content: str, excerpt: str):
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO "Article" (id, title, content, excerpt, author, published, "createdAt", "updatedAt")
           VALUES (gen_random_uuid()::text, %s, %s, %s, 'Анна Туманян', true, NOW(), NOW())""",
        (title, content, excerpt),
    )
    cur.close()
    log.info(f"💾 Статья сохранена: {title}")

# ── AI ───────────────────────────────────────────────────────────────────────
def ask_deepseek(prompt: str, max_tokens: int = 4000) -> str:
    for attempt in range(3):
        try:
            resp = requests.post(
                DEEPSEEK_URL,
                headers={"Authorization": f"Bearer {DEEPSEEK_KEY}", "Content-Type": "application/json"},
                json={"model": "deepseek-chat", "messages": [{"role": "user", "content": prompt}],
                      "max_tokens": max_tokens, "temperature": 0.7},
                timeout=120,
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            log.warning(f"DeepSeek attempt {attempt+1}/3: {e}")
            if attempt < 2:
                time.sleep(10 * (attempt + 1))
    raise RuntimeError("DeepSeek недоступен после 3 попыток")

def step1_select_topic(news_items: list, past_titles: list) -> dict:
    news_list = "\n".join(
        f"- [{item['category']}] {item['title']} ({item['source']})"
        for item in news_items[:40]
    )
    past_list = "\n".join(f"- {t}" for t in past_titles[:30])

    prompt = f"""Действуй как главный редактор делового медиа для предпринимателей России.

Твоя задача — выбрать из списка новостей за прошлую неделю ОДНУ самую важную для владельцев малого и среднего бизнеса (ИП и ООО).

Условия:
1. Выбранная новость должна напрямую влиять на деньги, налоги, риски или ответственность предпринимателя.
2. Сравни с прошлыми темами — если тема уже освещалась недавно, выбери следующую по важности.
3. Сформулируй цепляющий заголовок и план статьи из 4 пунктов: суть новости, влияние на бизнес, риски, конкретные действия.

Список новостей за неделю:
{news_list}

Список прошлых тем:
{past_list if past_list else "Нет"}

Ответ строго в JSON:
{{
  "selected_news": "точное название выбранной новости",
  "title": "заголовок статьи",
  "excerpt": "2-3 предложения — о чём статья",
  "plan": ["пункт 1", "пункт 2", "пункт 3", "пункт 4"]
}}"""

    raw = ask_deepseek(prompt, max_tokens=800)
    # Извлекаем JSON из ответа
    match = __import__("re").search(r"\{.*\}", raw, __import__("re").DOTALL)
    if not match:
        raise ValueError(f"Нет JSON в ответе: {raw[:200]}")
    return json.loads(match.group())

def step2_write_article(topic: dict, source_news: str) -> str:
    plan = "\n".join(f"{i+1}. {p}" for i, p in enumerate(topic["plan"]))
    prompt = f"""Действуй как финансовый директор и налоговый консультант с 15-летним опытом (Анна Туманян).

Напиши аналитическую статью на 1000-1200 слов для владельцев ИП и ООО на тему:
Новость: {topic['selected_news']}
Заголовок: {topic['title']}

План:
{plan}

Требования:
- Объясни суть простым языком без бухгалтерского сленга
- Сфокусируйся на последствиях для бизнеса: изменения в расходах, штрафы, договоры
- Дай пошаговую инструкцию: что сделать владельцу бизнеса прямо сейчас
- Используй короткие абзацы, подзаголовки (##), нумерованные списки
- Тон: спокойный, экспертный, защита бизнеса
- В конце: призыв обратиться к бухгалтеру

Пиши только текст статьи, без преамбул."""

    return ask_deepseek(prompt, max_tokens=4000)

# ── Runner ───────────────────────────────────────────────────────────────────
def run_generation():
    log.info("🤖 Запуск генерации статьи...")
    conn = get_db()

    news = get_recent_news(conn, days=7)
    if not news:
        log.warning("⚠️ Нет новостей за 7 дней. Пропускаю.")
        conn.close()
        return

    log.info(f"📰 Новостей для анализа: {len(news)}")
    past_titles = get_past_titles(conn, days=60)

    # Шаг 1: выбор темы
    log.info("📋 Шаг 1: выбор темы...")
    topic = step1_select_topic(news, past_titles)
    log.info(f"✅ Выбрана тема: {topic['title']}")

    # Шаг 2: написание статьи
    log.info("✍️  Шаг 2: написание статьи...")
    content = step2_write_article(topic, topic["selected_news"])
    log.info(f"✅ Статья написана ({len(content)} символов)")

    # Сохранение
    save_article(conn, topic["title"], content, topic["excerpt"])
    conn.close()

def seconds_until(hour: int) -> int:
    """Секунд до следующего наступления часа (UTC+8)."""
    from datetime import timezone, timedelta
    tz_8 = timezone(timedelta(hours=8))
    now = datetime.now(tz_8)
    target = now.replace(hour=hour, minute=0, second=0, microsecond=0)
    if target <= now:
        target += timedelta(days=1)
    return int((target - now).total_seconds())

def main():
    log.info(f"🚀 Article Generator запущен. Публикация каждый день в {PUBLISH_HOUR}:00 (UTC+8)")
    while True:
        wait = seconds_until(PUBLISH_HOUR)
        h, m = divmod(wait // 60, 60)
        log.info(f"⏳ До следующей генерации: {h}ч {m}мин")
        time.sleep(wait)
        try:
            run_generation()
        except Exception as e:
            log.error(f"❌ Ошибка генерации: {e}", exc_info=True)

if __name__ == "__main__":
    # Запуск сразу (для теста): python generate_article.py --now
    if "--now" in sys.argv:
        run_generation()
    else:
        main()

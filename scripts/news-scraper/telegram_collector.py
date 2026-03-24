import hashlib
import logging
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone

log = logging.getLogger(__name__)


def _normalize_for_hash(text: str) -> str:
    t = text.lower()
    t = re.sub(r'[^\w\s]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    result = str(t)
    return result[:300]


def fetch_telegram_channel(channel_id: str, url: str) -> list:
    """Fetch posts from a public Telegram channel using BeautifulSoup."""
    log.info(f"📡 Telegram: @{channel_id}")
    try:
        resp = requests.get(url, timeout=20)
        resp.raise_for_status()
    except Exception as e:
        log.error(f"Failed channel {channel_id}: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    posts = []
    wrappers = soup.select(".tgme_widget_message_wrap, .js-widget_message_wrap")

    for wrap in wrappers:
        try:
            link_el = wrap.select_one(".tgme_widget_message_date a, a[href*='t.me/']")
            post_url = link_el["href"] if link_el else url

            text_el = wrap.select_one(".tgme_widget_message_text")
            if not text_el: continue

            raw_text = text_el.get_text(separator="\n", strip=True)
            if len(raw_text) < 50: continue

            time_el = wrap.select_one("time")
            post_time = datetime.now(timezone.utc)
            if time_el and time_el.get("datetime"):
                try:
                    post_time = datetime.fromisoformat(time_el["datetime"].replace("Z", "+00:00"))
                except: pass

            posts.append({
                "source": channel_id,
                "source_type": "telegram",
                "text": raw_text[:2000],
                "url": post_url,
                "published_at": post_time.isoformat(),
                "hash": hashlib.md5(_normalize_for_hash(raw_text).encode()).hexdigest(),
            })
        except: continue
    return posts

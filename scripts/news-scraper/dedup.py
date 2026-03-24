import sqlite3
import logging
from pathlib import Path

log = logging.getLogger(__name__)

class NewsArchive:
    def __init__(self, db_path: Path):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("""
                CREATE TABLE IF NOT EXISTS archive (
                    hash TEXT PRIMARY KEY,
                    source TEXT,
                    text TEXT,
                    published_at TEXT,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS summaries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()


    def save_summary(self, content: str):
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute("INSERT INTO summaries (content) VALUES (?)", (content,))
                conn.commit()
                log.info("🎯 Summary saved to database.")
        except Exception as e:
            log.error(f"❌ Failed to save summary: {e}")

    def is_duplicate(self, post_hash: str) -> bool:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("SELECT 1 FROM archive WHERE hash = ?", (post_hash,))
            return cursor.fetchone() is not None

    def add_post(self, post: dict):
        try:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute(
                    "INSERT OR IGNORE INTO archive (hash, source, text, published_at) VALUES (?, ?, ?, ?)",
                    (post["hash"], post["source"], post["text"], post["published_at"])
                )
                conn.commit()
        except Exception as e:
            log.error(f"Failed to archive post: {e}")

    def cleanup(self, hours: int = 48):
        """Remove records older than X hours (Step 3.2)."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM archive WHERE added_at < datetime('now', ?)", (f'-{hours} hours',))
            conn.commit()

-- Newsletter subscribers.
--
-- Addresses are stored lowercased and UNIQUE so a repeat signup updates the
-- existing row instead of creating a duplicate. A subscriber only counts as
-- reachable once confirmed_at is set — that's the double opt-in gate, and it
-- means someone typing a stranger's address into the form can't subscribe them.
CREATE TABLE IF NOT EXISTS subscribers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  -- Single-use secret for the confirm link. Cleared once confirmed.
  confirm_token TEXT,
  -- Long-lived secret for the unsubscribe link in every email we send.
  unsub_token   TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  confirmed_at  TEXT,
  unsubscribed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscribers_confirm ON subscribers (confirm_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsub   ON subscribers (unsub_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_active  ON subscribers (confirmed_at, unsubscribed_at);

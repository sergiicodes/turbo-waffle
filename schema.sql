CREATE TABLE IF NOT EXISTS meetings (
    id TEXT PRIMARY KEY,
    date TEXT,
    body TEXT,
    archive_link TEXT
);

CREATE TABLE IF NOT EXISTS agenda_items (
    id TEXT PRIMARY KEY,
    meeting_id TEXT,
    title TEXT,
    ai_summary TEXT,
    category TEXT,
    status TEXT,
    FOREIGN KEY(meeting_id) REFERENCES meetings(id)
);

CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY,
    item_id TEXT,
    member_name TEXT,
    vote_cast TEXT,
    ward TEXT,
    FOREIGN KEY(item_id) REFERENCES agenda_items(id)
);

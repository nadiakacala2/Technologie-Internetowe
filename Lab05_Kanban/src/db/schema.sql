PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    ord INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    col_id INTEGER NOT NULL,
    ord INTEGER NOT NULL,
    FOREIGN KEY (col_id) REFERENCES columns(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_columns_ord ON columns(ord);
CREATE INDEX IF NOT EXISTS idx_tasks_col_ord ON tasks(col_id, ord);

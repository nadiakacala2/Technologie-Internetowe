const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Œcie¿ka do pliku bazy
const dbPath = path.join(__dirname, "database.sqlite");

// Po³¹czenie z baz¹
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("B³¹d po³¹czenia z baz¹ SQLite:", err.message);
    } else {
        console.log("Po³¹czono z baz¹ SQLite");
    }
});

module.exports = db;

db.serialize(() => {
    // Tabela posts
    db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Tabela comments
    db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      approved INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);

    // Indeks pod komentarze posta + moderacjê
    db.run(`
    CREATE INDEX IF NOT EXISTS idx_comments_post
    ON comments(post_id, approved, created_at)
  `);
});

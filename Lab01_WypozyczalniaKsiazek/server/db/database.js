const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'library.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('B³¹d po³¹czenia z baz¹', err);
    } else {
        console.log('Po³¹czono z SQLite');
    }
});

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      copies INTEGER NOT NULL DEFAULT 1
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      loan_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      return_date TEXT,
      FOREIGN KEY (member_id) REFERENCES members(id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    )
  `);
});

module.exports = db;
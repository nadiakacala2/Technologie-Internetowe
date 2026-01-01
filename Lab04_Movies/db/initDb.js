const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve("db/movies.db");

function initDb() {
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON");

        db.run(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER NOT NULL CHECK (year >= 1888)
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_id INTEGER NOT NULL,
        score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
        FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
      )
    `);

        db.run("CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year)");
        db.run("CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings(movie_id)");
    });

    return db;
}

module.exports = { initDb };

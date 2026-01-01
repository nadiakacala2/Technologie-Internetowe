const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve("db/movies.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Filmy
    db.run(
        `INSERT INTO movies (title, year) VALUES (?, ?)`,
        ["Incepcja", 2010]
    );
    db.run(
        `INSERT INTO movies (title, year) VALUES (?, ?)`,
        ["Matrix", 1999]
    );
    db.run(
        `INSERT INTO movies (title, year) VALUES (?, ?)`,
        ["Interstellar", 2014]
    );

    // Oceny
    db.run(
        `INSERT INTO ratings (movie_id, score) VALUES (?, ?)`,
        [1, 5]
    );
    db.run(
        `INSERT INTO ratings (movie_id, score) VALUES (?, ?)`,
        [1, 4]
    );
    db.run(
        `INSERT INTO ratings (movie_id, score) VALUES (?, ?)`,
        [2, 5]
    );
    db.run(
        `INSERT INTO ratings (movie_id, score) VALUES (?, ?)`,
        [3, 5]
    );
    db.run(
        `INSERT INTO ratings (movie_id, score) VALUES (?, ?)`,
        [3, 4]
    );
});

db.close(() => {
    console.log("Seed danych testowych wykonany poprawnie.");
});

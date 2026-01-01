const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve("db/movies.db");
const db = new sqlite3.Database(dbPath);

db.all(
    "SELECT name FROM sqlite_master WHERE type='table'",
    (err, rows) => {
        if (err) {
            console.error("B³¹d:", err.message);
        } else {
            console.log("Tabele w bazie:");
            rows.forEach(r => console.log("-", r.name));
        }
        db.close();
    }
);

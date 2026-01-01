const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "database.db");
const db = new sqlite3.Database(dbPath);

console.log("=== TABLES ===");

db.all(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
    (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        rows.forEach((row) => {
            console.log(row.name);
        });

        console.log("\n=== NOTES STRUCTURE ===");
        db.all("PRAGMA table_info(notes);", (err, rows) => {
            rows.forEach((r) => console.log(r));

            console.log("\n=== TAGS STRUCTURE ===");
            db.all("PRAGMA table_info(tags);", (err, rows) => {
                rows.forEach((r) => console.log(r));

                console.log("\n=== NOTE_TAGS STRUCTURE ===");
                db.all("PRAGMA table_info(note_tags);", (err, rows) => {
                    rows.forEach((r) => console.log(r));
                    db.close();
                });
            });
        });
    }
);

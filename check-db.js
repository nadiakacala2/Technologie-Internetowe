const db = require("./db/db");

db.all(
    "SELECT name FROM sqlite_master WHERE type='table'",
    (err, rows) => {
        if (err) {
            console.error("B³¹d zapytania:", err.message);
        } else {
            console.log("Tabele w bazie:");
            console.table(rows);
        }

        db.close();
    }
);
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "database.db");
const sqlPath = path.join(__dirname, "init.sql");

const sql = fs.readFileSync(sqlPath, "utf8");

const db = new sqlite3.Database(dbPath);

db.exec(sql, (err) => {
    if (err) {
        console.error("DB INIT ERROR:", err.message);
    } else {
        console.log("DB INIT OK");
    }
    db.close();
});

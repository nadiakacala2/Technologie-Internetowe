const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "kanban.db");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DB connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Inicjalizacja schematu
const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema, (err) => {
    if (err) {
        console.error("Schema init error:", err.message);
    } else {
        console.log("Database schema initialized.");
    }
});

// seed
const seedPath = path.join(__dirname, "seed.sql");

const seed = fs.readFileSync(seedPath, "utf8");
db.exec(seed, (err) => {
    if (err) {
        console.error("Seed error:", err.message);
    } else {
        console.log("Seed data inserted.");
    }
});

module.exports = db;

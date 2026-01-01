const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const dbPath = path.join(__dirname, "..", "db", "database.db");

// GET /api/tags
router.get("/", (req, res) => {
    const db = new sqlite3.Database(dbPath);

    const sql = `
        SELECT id, name
        FROM tags
        ORDER BY name ASC
    `;

    db.all(sql, [], (err, rows) => {
        db.close();

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

module.exports = router;

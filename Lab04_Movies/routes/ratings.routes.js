const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const router = express.Router();

const dbPath = path.resolve("db/movies.db");
const db = new sqlite3.Database(dbPath);

// POST /api/ratings
router.post("/", (req, res) => {
    const { movie_id, score } = req.body;

    if (!movie_id || !score) {
        return res.status(422).json({
            error: "movie_id and score are required"
        });
    }

    if (!Number.isInteger(score) || score < 1 || score > 5) {
        return res.status(422).json({
            error: "score must be between 1 and 5"
        });
    }

    const query = `
        INSERT INTO ratings (movie_id, score)
        VALUES (?, ?)
    `;

    db.run(query, [movie_id, score], function (err) {
        if (err) {
            if (err.message.includes("FOREIGN KEY")) {
                return res.status(404).json({
                    error: "movie not found"
                });
            }

            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ id: this.lastID });
    });
});


module.exports = router;

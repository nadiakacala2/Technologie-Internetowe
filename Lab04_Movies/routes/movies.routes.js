const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const router = express.Router();

const dbPath = path.resolve("db/movies.db");
const db = new sqlite3.Database(dbPath);

// POST /api/movies
router.post("/", (req, res) => {
    const { title, year } = req.body;

    if (!title || !year) {
        return res.status(422).json({
            error: "title and year are required"
        });
    }

    if (typeof title !== "string" || !Number.isInteger(year)) {
        return res.status(422).json({
            error: "invalid data types"
        });
    }

    const query = `
        INSERT INTO movies (title, year)
        VALUES (?, ?)
    `;

    db.run(query, [title, year], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res
            .status(201)
            .location(`/api/movies/${this.lastID}`)
            .json({ id: this.lastID });
    });
});

// GET /api/movies (opcjonalne filtrowanie po roku)
router.get("/", (req, res) => {
    const { year } = req.query;

    let query = `
        SELECT
          m.id,
          m.title,
          m.year,
          ROUND(AVG(r.score), 2) AS avg_score,
          COUNT(r.id) AS votes
        FROM movies m
        LEFT JOIN ratings r ON r.movie_id = m.id
    `;

    const params = [];

    if (year) {
        query += " WHERE m.year = ?";
        params.push(year);
    }

    query += `
        GROUP BY m.id
        ORDER BY avg_score DESC
    `;

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

// GET /api/movies/top?limit=5
router.get("/top", (req, res) => {
    let { limit } = req.query;

    // domyœlny limit
    limit = parseInt(limit, 10) || 5;

    const query = `
        SELECT
          m.id,
          m.title,
          m.year,
          ROUND(AVG(r.score), 2) AS avg_score,
          COUNT(r.id) AS votes
        FROM movies m
        LEFT JOIN ratings r ON r.movie_id = m.id
        GROUP BY m.id
        ORDER BY avg_score DESC
        LIMIT ?
    `;

    db.all(query, [limit], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});


module.exports = router;

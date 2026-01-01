const express = require("express");
const router = express.Router();
const db = require("../db/db");

// GET /api/posts — lista postów
router.get("/", (req, res, next) => {
    const sql = `
    SELECT id, title, body, created_at
    FROM posts
    ORDER BY created_at DESC
  `;

    db.all(sql, [], (err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
});

// GET /api/posts/:id — szczegó³y posta
router.get("/:id", (req, res, next) => {
    const { id } = req.params;

    const sql = `
    SELECT id, title, body, created_at
    FROM posts
    WHERE id = ?
  `;

    db.get(sql, [id], (err, row) => {
        if (err) return next(err);
        if (!row) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json(row);
    });
});

// POST /api/posts — dodanie posta
router.post("/", (req, res, next) => {
    const { title, body } = req.body;

    // Walidacja
    if (!title || !body) {
        return res.status(422).json({
            error: "Title and body are required"
        });
    }

    const sql = `
    INSERT INTO posts (title, body)
    VALUES (?, ?)
  `;

    db.run(sql, [title, body], function (err) {
        if (err) return next(err);

        res.status(201).json({
            id: this.lastID,
            title,
            body
        });
    });
});

module.exports = router;

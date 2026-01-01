const express = require("express");
const router = express.Router();
const db = require("../db/db");
const antiSpam = require("../middleware/antiSpam");
const adminAuth = require("../middleware/adminAuth");

// POST /api/posts/:id/comments
// Dodanie komentarza do posta (approved = 0)
router.post("/posts/:id/comments", antiSpam, (req, res, next) => {
    const { id } = req.params;
    const { author, body } = req.body;

    // Walidacja
    if (!author || !body) {
        return res.status(422).json({
            error: "Author and body are required"
        });
    }

    // Sprawdzenie czy post istnieje
    db.get(
        "SELECT id FROM posts WHERE id = ?",
        [id],
        (err, post) => {
            if (err) return next(err);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Dodanie komentarza (approved = 0)
            db.run(
                `
        INSERT INTO comments (post_id, author, body, approved)
        VALUES (?, ?, ?, 0)
        `,
                [id, author, body],
                function (err) {
                    if (err) return next(err);

                    res.status(201).json({
                        id: this.lastID,
                        post_id: Number(id),
                        approved: 0
                    });
                }
            );
        }
    );
});

// GET /api/posts/:id/comments
// Publiczny widok komentarzy (tylko approved = 1)
router.get("/posts/:id/comments", (req, res, next) => {
    const { id } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    // Bezpieczeñstwo parametrów
    if (page < 1 || limit < 1 || limit > 50) {
        return res.status(422).json({
            error: "Invalid pagination parameters"
        });
    }

    const sql = `
    SELECT id, author, body, created_at
    FROM comments
    WHERE post_id = ? AND approved = 1
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

    db.all(sql, [id, limit, offset], (err, rows) => {
        if (err) return next(err);

        res.json({
            page,
            limit,
            count: rows.length,
            data: rows
        });
    });
});

// POST /api/comments/:id/approve
// Moderacja komentarza (approved = 1)
router.post(
    "/comments/:id/approve",
    adminAuth,
    (req, res, next) => {
        const { id } = req.params;

        db.run(
            `
      UPDATE comments
      SET approved = 1
      WHERE id = ?
      `,
            [id],
            function (err) {
                if (err) return next(err);

                if (this.changes === 0) {
                    return res.status(404).json({ error: "Comment not found" });
                }

                res.json({ message: "Comment approved" });
            }
        );
    }
);

// GET /api/comments/pending
// Lista komentarzy oczekuj¹cych na moderacjê
router.get("/comments/pending", (req, res, next) => {
    const sql = `
        SELECT id, post_id, author, body, created_at
        FROM comments
        WHERE approved = 0
        ORDER BY created_at ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return next(err);
        res.json(rows);
    });
});

module.exports = router;

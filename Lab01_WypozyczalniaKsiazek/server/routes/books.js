const express = require('express');
const router = express.Router();
const db = require('../db/database');


// GET /api/books — lista ksi¹¿ek z available

router.get('/', (req, res) => {
    const sql = `
    SELECT
      b.id,
      b.title,
      b.author,
      b.copies,
      b.copies AS available
    FROM books b
  `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});


// POST /api/books — dodanie ksi¹¿ki

router.post('/', (req, res) => {
    let { title, author, copies } = req.body;

    if (!title || !author) {
        return res.status(400).json({
            error: 'Title and author are required'
        });
    }

    if (copies === undefined) {
        copies = 1;
    }

    if (!Number.isInteger(copies) || copies < 1) {
        return res.status(400).json({
            error: 'Copies must be a positive integer'
        });
    }

    const sql = `
    INSERT INTO books (title, author, copies)
    VALUES (?, ?, ?)
  `;

    db.run(sql, [title, author, copies], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res
            .status(201)
            .location(`/api/books/${this.lastID}`)
            .json({
                id: this.lastID,
                title,
                author,
                copies
            });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/members — lista czytelników

router.get('/', (req, res) => {
    db.all(
        'SELECT id, name, email FROM members',
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        }
    );
});

// POST /api/members — dodanie czytelnika

router.post('/', (req, res) => {
    const { name, email } = req.body;

    // walidacja wejœcia
    if (!name || !email) {
        return res.status(400).json({
            error: 'Name and email are required'
        });
    }

    const sql = `
    INSERT INTO members (name, email)
    VALUES (?, ?)
  `;

    db.run(sql, [name, email], function (err) {
        if (err) {
            // unikalnoœæ email
            if (err.message.includes('UNIQUE')) {
                return res.status(409).json({
                    error: 'Email already exists'
                });
            }
            return res.status(500).json({ error: 'Database error' });
        }

        res
            .status(201)
            .location(`/api/members/${this.lastID}`)
            .json({
                id: this.lastID,
                name,
                email
            });
    });
});

module.exports = router;

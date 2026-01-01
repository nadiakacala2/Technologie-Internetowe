const express = require('express');
const router = express.Router();
const db = require('../db/database');


// GET /api/loans — lista wypo¿yczeñ

router.get('/', (req, res) => {
    const sql = `
    SELECT
      l.id,
      m.name AS member,
      b.title AS book,
      l.loan_date,
      l.due_date,
      l.return_date
    FROM loans l
    JOIN members m ON m.id = l.member_id
    JOIN books b ON b.id = l.book_id
    ORDER BY l.loan_date DESC
  `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});


// POST /api/loans/borrow — wypo¿yczenie

router.post('/borrow', (req, res) => {
    const { member_id, book_id, days } = req.body;

    if (!member_id || !book_id) {
        return res.status(400).json({
            error: 'member_id and book_id are required'
        });
    }

    const loanDays = days && Number.isInteger(days) ? days : 14;

    // SprawdŸ liczbê egzemplarzy
    const copiesSql = `SELECT copies FROM books WHERE id = ?`;
    db.get(copiesSql, [book_id], (err, book) => {
        if (err || !book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Policz aktywne wypo¿yczenia
        const activeLoansSql = `
      SELECT COUNT(*) AS count
      FROM loans
      WHERE book_id = ? AND return_date IS NULL
    `;

        db.get(activeLoansSql, [book_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (result.count >= book.copies) {
                return res.status(409).json({
                    error: 'No copies available'
                });
            }

            // Wstaw wypo¿yczenie
            const loanDate = new Date().toISOString().split('T')[0];
            const dueDate = new Date(
                Date.now() + loanDays * 24 * 60 * 60 * 1000
            ).toISOString().split('T')[0];

            const insertSql = `
        INSERT INTO loans (member_id, book_id, loan_date, due_date)
        VALUES (?, ?, ?, ?)
      `;

            db.run(
                insertSql,
                [member_id, book_id, loanDate, dueDate],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }

                    res.status(201).json({
                        id: this.lastID,
                        member_id,
                        book_id,
                        loan_date: loanDate,
                        due_date: dueDate
                    });
                }
            );
        });
    });
});


// POST /api/loans/return — zwrot

router.post('/return', (req, res) => {
    const { loan_id } = req.body;

    if (!loan_id) {
        return res.status(400).json({
            error: 'loan_id is required'
        });
    }

    const sqlCheck = `
    SELECT return_date
    FROM loans
    WHERE id = ?
  `;

    db.get(sqlCheck, [loan_id], (err, loan) => {
        if (err || !loan) {
            return res.status(404).json({ error: 'Loan not found' });
        }

        if (loan.return_date) {
            return res.status(409).json({
                error: 'Loan already returned'
            });
        }

        const returnDate = new Date().toISOString().split('T')[0];

        const sqlUpdate = `
      UPDATE loans
      SET return_date = ?
      WHERE id = ?
    `;

        db.run(sqlUpdate, [returnDate, loan_id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({
                message: 'Book returned',
                return_date: returnDate
            });
        });
    });
});

module.exports = router;

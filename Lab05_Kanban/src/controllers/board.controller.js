const db = require("../db/db");

exports.getBoard = (req, res) => {
    const colsQuery = `
    SELECT id, name, ord
    FROM columns
    ORDER BY ord
  `;

    const tasksQuery = `
    SELECT id, title, col_id, ord
    FROM tasks
    ORDER BY col_id, ord
  `;

    db.all(colsQuery, [], (err, cols) => {
        if (err) {
            return res.status(500).json({ error: "Database error (columns)" });
        }

        db.all(tasksQuery, [], (err, tasks) => {
            if (err) {
                return res.status(500).json({ error: "Database error (tasks)" });
            }

            res.json({
                cols,
                tasks
            });
        });
    });
};

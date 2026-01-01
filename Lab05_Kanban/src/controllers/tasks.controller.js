const db = require("../db/db");

// POST /api/tasks
exports.createTask = (req, res) => {
    const { title, col_id } = req.body;

    const ordQuery = `
    SELECT COALESCE(MAX(ord), 0) + 1 AS nextOrd
    FROM tasks
    WHERE col_id = ?
  `;

    db.get(ordQuery, [col_id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error (ord)" });
        }

        const insertQuery = `
      INSERT INTO tasks (title, col_id, ord)
      VALUES (?, ?, ?)
    `;

        db.run(insertQuery, [title, col_id, row.nextOrd], function (err) {
            if (err) {
                return res.status(500).json({ error: "Database error (insert)" });
            }

            res.status(201)
                .location(`/api/tasks/${this.lastID}`)
                .json({
                    id: this.lastID,
                    title,
                    col_id,
                    ord: row.nextOrd
                });
        });
    });
};

// POST /api/tasks/:id/move  — STABILNA KOLEJNOŒÆ
exports.moveTask = (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { col_id: newColId, ord: newOrd } = req.body;

    if (!Number.isInteger(taskId)) {
        return res.status(422).json({ error: "Invalid task id" });
    }

    // 1) Pobierz aktualne dane zadania
    db.get(
        "SELECT id, col_id AS oldColId, ord AS oldOrd FROM tasks WHERE id = ?",
        [taskId],
        (err, task) => {
            if (err) return res.status(500).json({ error: "Database error (select)" });
            if (!task) return res.status(404).json({ error: "Task not found" });

            const { oldColId, oldOrd } = task;

            // 2) Transakcja
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                // A) Zamknij lukê w kolumnie Ÿród³owej
                db.run(
                    `
          UPDATE tasks
          SET ord = ord - 1
          WHERE col_id = ?
            AND ord > ?
          `,
                    [oldColId, oldOrd]
                );

                // B) Zrób miejsce w kolumnie docelowej
                db.run(
                    `
          UPDATE tasks
          SET ord = ord + 1
          WHERE col_id = ?
            AND ord >= ?
          `,
                    [newColId, newOrd]
                );

                // C) Przenieœ zadanie na docelowe miejsce
                db.run(
                    `
          UPDATE tasks
          SET col_id = ?, ord = ?
          WHERE id = ?
          `,
                    [newColId, newOrd, taskId],
                    function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return res.status(500).json({ error: "Database error (move)" });
                        }

                        db.run("COMMIT");
                        res.json({ id: taskId, col_id: newColId, ord: newOrd });
                    }
                );
            });
        }
    );
};
exports.deleteTask = (req, res) => {
    const id = parseInt(req.params.id, 10);

    db.run(
        "DELETE FROM tasks WHERE id = ?",
        [id],
        function (err) {
            if (err) return res.status(500).json({ error: "Database error" });
            if (this.changes === 0)
                return res.status(404).json({ error: "Task not found" });

            res.status(204).end();
        }
    );
};

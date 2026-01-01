const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const dbPath = path.join(__dirname, "..", "db", "database.db");

function isNonEmptyString(value, minLength = 1) {
    return typeof value === "string" && value.trim().length >= minLength;
}

// POST /api/notes
// Dodawanie notatki
router.post("/", (req, res) => {
    const { title, body } = req.body;

    if (!isNonEmptyString(title, 3) || !isNonEmptyString(body, 3)) {
        return res.status(422).json({
            error: "title and body are required (min. 3 characters)"
        });
    }

    const db = new sqlite3.Database(dbPath);

    const sql = `
        INSERT INTO notes (title, body)
        VALUES (?, ?)
    `;

    db.run(sql, [title.trim(), body.trim()], function (err) {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }

        const newId = this.lastID;
        db.close();

        res
            .status(201)
            .set("Location", `/api/notes/${newId}`)
            .json({
                id: newId,
                title: title.trim(),
                body: body.trim()
            });
    });
});


// GET /api/notes
// Lista notatek + wyszukiwanie q + filtr tag
router.get("/", (req, res) => {
    const { q, tag } = req.query;
    const db = new sqlite3.Database(dbPath);

    let sql = `
    SELECT DISTINCT n.id, n.title, n.body, n.created_at
    FROM notes n
  `;
    const params = [];

    // JOIN tylko jeśli filtrujemy po tagu
    if (tag) {
        sql += `
      INNER JOIN note_tags nt ON nt.note_id = n.id
      INNER JOIN tags t ON t.id = nt.tag_id
    `;
    }

    const where = [];

    // filtr q
    if (q) {
        where.push(`(n.title LIKE ? OR n.body LIKE ?)`);
        params.push(`%${q}%`, `%${q}%`);
    }

    // filtr tag
    if (tag) {
        where.push(`t.name = ?`);
        params.push(tag);
    }

    if (where.length) {
        sql += ` WHERE ` + where.join(" AND ");
    }

    sql += `
    ORDER BY datetime(n.created_at) DESC
  `;

    db.all(sql, params, (err, rows) => {
        db.close();
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


router.post("/:id/tags", (req, res) => {
    const noteId = Number(req.params.id);
    const cleanTags = cleanTagsArray(req.body.tags);

    if (!isValidId(noteId)) {
        return res.status(400).json({ error: "Invalid note id" });
    }

    if (!cleanTags) {
        return res.status(422).json({
            error: "tags must be a non-empty array of strings"
        });
    }

    const db = new sqlite3.Database(dbPath);

    db.get(
        "SELECT id FROM notes WHERE id = ?",
        [noteId],
        (err, note) => {
            if (err) {
                db.close();
                return res.status(500).json({ error: err.message });
            }

            if (!note) {
                db.close();
                return res.status(404).json({ error: "note not found" });
            }

            const tasks = cleanTags.map(tagName => {
                return new Promise((resolve, reject) => {
                    db.run(
                        "INSERT OR IGNORE INTO tags (name) VALUES (?)",
                        [tagName],
                        err => {
                            if (err) return reject(err);

                            db.get(
                                "SELECT id FROM tags WHERE name = ?",
                                [tagName],
                                (err, tag) => {
                                    if (err) return reject(err);

                                    db.run(
                                        "INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)",
                                        [noteId, tag.id],
                                        err => {
                                            if (err) return reject(err);
                                            resolve();
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            });

            Promise.all(tasks)
                .then(() => {
                    db.close();
                    res.json({
                        note_id: noteId,
                        tags: cleanTags
                    });
                })
                .catch(e => {
                    db.close();
                    res.status(500).json({ error: e.message });
                });
        }
    );
});



module.exports = router;

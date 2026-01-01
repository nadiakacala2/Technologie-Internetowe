const db = require("./db");

console.log("Sprawdzanie zawartoœci tabeli columns...");

db.all(
    "SELECT id, name, ord FROM columns ORDER BY ord",
    [],
    (err, rows) => {
        if (err) {
            console.error("B³¹d zapytania:", err.message);
            process.exit(1);
        }

        if (rows.length === 0) {
            console.log("Tabela columns jest pusta.");
        } else {
            console.log("Kolumny Kanban:");
            rows.forEach((row) => {
                console.log(`id=${row.id}, name=${row.name}, ord=${row.ord}`);
            });
        }

        db.close();
    }
);
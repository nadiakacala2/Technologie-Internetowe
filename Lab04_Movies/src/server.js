const { initDb } = require("../db/initDb");
const app = require("./app");

const PORT = process.env.PORT || 3000;

// inicjalizacja bazy
initDb();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");

const notesRouter = require("./routes/notes.routes");
const tagsRouter = require("./routes/tags.routes");

const app = express();
const PORT = 3000;
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//Nag³ówki bezpieczeñstwa

app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
});

//Endpoint techniczny
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/notes", notesRouter);
app.use("/api/tags", tagsRouter);

//start serwera
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


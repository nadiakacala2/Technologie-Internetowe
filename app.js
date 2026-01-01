const express = require("express");
const app = express();

require("./db/db");

const postsRouter = require("./routes/posts.routes");
const commentsRouter = require("./routes/comments.routes");
const securityHeaders = require("./middleware/securityHeaders");
const errorHandler = require("./middleware/errorHandler");

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(securityHeaders);

app.use(express.static("public"));

// logowanie
app.use((req, res, next) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
});

// API
app.use("/api/posts", postsRouter);
app.use("/api", commentsRouter);

// test API
app.get("/api/health", (req, res) => {
    res.send("Lab03 Blog API działa");
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server działa na http://localhost:${PORT}`);
});

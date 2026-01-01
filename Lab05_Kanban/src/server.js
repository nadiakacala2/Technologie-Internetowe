const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

require("./db/db");

const errorHandler = require("./middleware/errorHandler");
const boardRoutes = require("./routes/board.routes");
const tasksRoutes = require("./routes/tasks.routes");

const app = express();
const PORT = 3000;

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Static frontend
app.use(express.static(path.join(__dirname, "../public")));

// API routes
app.use("/api", boardRoutes);
app.use("/api", tasksRoutes);

// Test endpoint (techniczny)
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

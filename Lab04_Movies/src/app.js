const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

// Security headers
app.use(helmet({
    contentSecurityPolicy: false 
}));

// Logger 
app.use(morgan("dev"));

// JSON 
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Routes (podpinamy teraz, logika póŸniej)
const moviesRoutes = require("../routes/movies.routes");
const ratingsRoutes = require("../routes/ratings.routes");

app.use("/api/movies", moviesRoutes);
app.use("/api/ratings", ratingsRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

// Error handler
const errorHandler = require("../middleware/errorHandler");
app.use(errorHandler);

module.exports = app;


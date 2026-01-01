const express = require("express");
const morgan = require("morgan");

const securityHeaders = require("./middleware/security");
const errorHandler = require("./middleware/errors");

const productsRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart").router;
const checkoutRoutes = require("./routes/checkout");

require("./db");

const app = express();


// parsowanie JSON
app.use(express.json());

// logowanie ¿¹dañ HTTP
app.use(morgan("dev"));

// nag³ówki bezpieczeñstwa
app.use(securityHeaders);

// Frontend
app.use(express.static("public"));

// API
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

// obs³uga b³êdów
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/", (req, res) => {
    const products = db.prepare("SELECT id, name, price FROM products").all();
    res.json(products);
});

router.post("/", (req, res) => {
    const { name, price } = req.body;

    // Walidacja
    if (!name || typeof name !== "string") {
        return res.status(422).json({ error: "Name is required" });
    }
    if (price === undefined || typeof price !== "number" || price < 0) {
        return res.status(422).json({ error: "Price must be a number >= 0" });
    }

    const result = db
        .prepare("INSERT INTO products (name, price) VALUES (?, ?)")
        .run(name, price);

    res
        .status(201)
        .location(`/api/products/${result.lastInsertRowid}`)
        .json({
            id: result.lastInsertRowid,
            name,
            price,
        });
});

module.exports = router;

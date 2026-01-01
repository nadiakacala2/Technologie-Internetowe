const express = require("express");
const db = require("../db");
const router = express.Router();

// In-memory cart: product_id -> { product_id, qty }
const cart = new Map();

router.get("/", (req, res) => {
    res.json(Array.from(cart.values()));
});

router.post("/add", (req, res) => {
    const { product_id, qty } = req.body;

    if (!product_id || typeof qty !== "number" || qty < 1) {
        return res.status(422).json({ error: "Invalid product_id or qty" });
    }

    const product = db
        .prepare("SELECT id FROM products WHERE id = ?")
        .get(product_id);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    const existing = cart.get(product_id) || { product_id, qty: 0 };
    existing.qty += qty;
    cart.set(product_id, existing);

    res.status(200).json(existing);
});

router.patch("/item", (req, res) => {
    const { product_id, qty } = req.body;

    if (!product_id || typeof qty !== "number" || qty < 1) {
        return res.status(422).json({ error: "Invalid product_id or qty" });
    }

    if (!cart.has(product_id)) {
        return res.status(404).json({ error: "Item not in cart" });
    }

    cart.set(product_id, { product_id, qty });
    res.json({ product_id, qty });
});

router.delete("/item/:product_id", (req, res) => {
    const product_id = Number(req.params.product_id);

    if (!cart.has(product_id)) {
        return res.status(404).json({ error: "Item not in cart" });
    }

    cart.delete(product_id);
    res.status(204).end();
});

module.exports = { router, cart };

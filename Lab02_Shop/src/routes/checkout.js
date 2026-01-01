const express = require("express");
const db = require("../db");
const { cart } = require("./cart");

const router = express.Router();

router.post("/", (req, res) => {
    if (cart.size === 0) {
        return res.status(409).json({ error: "Cart is empty" });
    }

    const items = Array.from(cart.values());

    const productIds = items.map(i => i.product_id);
    const placeholders = productIds.map(() => "?").join(",");

    const products = db
        .prepare(
            `SELECT id, price FROM products WHERE id IN (${placeholders})`
        )
        .all(...productIds);

    if (products.length !== items.length) {
        return res.status(409).json({ error: "Product mismatch" });
    }

    const priceMap = {};
    products.forEach(p => {
        priceMap[p.id] = p.price;
    });

    let total = 0;
    items.forEach(i => {
        total += priceMap[i.product_id] * i.qty;
    });

    const insertOrder = db.prepare(
        "INSERT INTO orders DEFAULT VALUES"
    );
    const orderResult = insertOrder.run();
    const orderId = orderResult.lastInsertRowid;

    const insertItem = db.prepare(
        `INSERT INTO order_items
     (order_id, product_id, qty, price)
     VALUES (?, ?, ?, ?)`
    );

    const transaction = db.transaction(() => {
        items.forEach(i => {
            insertItem.run(
                orderId,
                i.product_id,
                i.qty,
                priceMap[i.product_id]
            );
        });
    });

    transaction();

    cart.clear();

    res.status(201).json({
        order_id: orderId,
        total: total
    });
});

module.exports = router;
const db = require("./src/db");

console.log("ORDERS:");
console.log(db.prepare("SELECT * FROM orders").all());

console.log("ORDER ITEMS:");
console.log(db.prepare("SELECT * FROM order_items").all());

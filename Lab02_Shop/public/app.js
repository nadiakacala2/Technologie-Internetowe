const productsEl = document.getElementById("products");
const cartEl = document.getElementById("cart");
const checkoutBtn = document.getElementById("checkoutBtn");

// PRODUKTY
async function loadProducts() {
    const res = await fetch("/api/products");
    const products = await res.json();

    productsEl.innerHTML = "";

    products.forEach(product => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>${product.name} – ${product.price} PLN</span>
            <button>Dodaj do koszyka</button>
        `;

        li.querySelector("button").addEventListener("click", () => {
            addToCart(product.id);
        });

        productsEl.appendChild(li);
    });
}

// KOSZYK
async function loadCart() {
    const res = await fetch("/api/cart");
    const cart = await res.json();

    cartEl.innerHTML = "";

    if (cart.length === 0) {
        cartEl.innerHTML = "<li>Koszyk jest pusty</li>";
        return;
    }

    // pobranie produktów do mapowania nazw
    const productsRes = await fetch("/api/products");
    const products = await productsRes.json();

    cart.forEach(item => {
        const product = products.find(p => p.id === item.product_id);

        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${product ? product.name : "Produkt"} – ilość: ${item.qty}
            </span>
            <div>
                <button data-action="dec">−</button>
                <button data-action="inc">+</button>
                <button data-action="del">Usuń</button>
            </div>
        `;

        // zmniejsz ilość
        li.querySelector('[data-action="dec"]').addEventListener("click", () => {
            if (item.qty > 1) {
                updateQty(item.product_id, item.qty - 1);
            }
        });

        // zwiększ ilość
        li.querySelector('[data-action="inc"]').addEventListener("click", () => {
            updateQty(item.product_id, item.qty + 1);
        });

        // usuń produkt
        li.querySelector('[data-action="del"]').addEventListener("click", () => {
            removeFromCart(item.product_id);
        });

        cartEl.appendChild(li);
    });
}

// OPERACJE NA KOSZYKU
async function addToCart(productId) {
    await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, qty: 1 })
    });

    loadCart();
}

async function updateQty(productId, qty) {
    await fetch("/api/cart/item", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, qty })
    });

    loadCart();
}

async function removeFromCart(productId) {
    await fetch(`/api/cart/item/${productId}`, {
        method: "DELETE"
    });

    loadCart();
}

// CHECKOUT
checkoutBtn.addEventListener("click", async () => {
    const res = await fetch("/api/checkout", { method: "POST" });

    if (!res.ok) {
        alert("Koszyk jest pusty.");
        return;
    }

    const data = await res.json();

    alert(
        `Zamówienie złożone!\n` +
        `ID zamówienia: ${data.order_id}\n` +
        `Suma: ${data.total} PLN`
    );

    loadCart();
});

// START
loadProducts();
loadCart();

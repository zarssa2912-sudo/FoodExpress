
"use strict";

// Catálogo de productos de FoodExpress
const products = [
    {
        id: 1,
        name: "Hamburguesa clásica",
        category: "Hamburguesas",
        price: 129,
        description: "Carne, queso, lechuga, tomate y aderezo.",
        tag: "Más vendido",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Hamburguesa BBQ",
        category: "Hamburguesas",
        price: 149,
        description: "Carne, tocino, queso y salsa BBQ.",
        tag: "Favorito",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Pizza pepperoni",
        category: "Pizza",
        price: 179,
        description: "Queso mozzarella y pepperoni recién horneado.",
        tag: "Popular",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Pizza margarita",
        category: "Pizza",
        price: 159,
        description: "Tomate, mozzarella y albahaca.",
        tag: "Clásico",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Tacos al pastor",
        category: "Tacos",
        price: 95,
        description: "Orden de cuatro tacos con piña y cilantro.",
        tag: "Favorito",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Ensalada fresca",
        category: "Ensaladas",
        price: 109,
        description: "Lechuga, jitomate, pepino y aguacate.",
        tag: "Fresco",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Pastel de chocolate",
        category: "Postres",
        price: 79,
        description: "Pastel suave con chocolate y ganache.",
        tag: "Dulce antojo",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Malteada de fresa",
        category: "Bebidas",
        price: 69,
        description: "Malteada cremosa con sabor a fresa.",
        tag: "Refrescante",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80"
    }
];

// Elementos de la página
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");
const emptyMessage = document.getElementById("empty-message");

const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutTotal = document.getElementById("checkout-total");
const cartBottom = document.getElementById("cart-bottom");

const checkoutModal = document.getElementById("checkout-modal");
const checkoutForm = document.getElementById("checkout-form");
const successModal = document.getElementById("success-modal");
const toast = document.getElementById("toast");

let cart = [];
let selectedCategory = "Todos";
let toastTimeout;

// Formato de moneda mexicana
const money = amount =>
    amount.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });

// Mostrar los productos del menú
function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "Todos" ||
            product.category === selectedCategory;

        const searchableText =
            `${product.name} ${product.category} ${product.description}`
                .toLowerCase();

        return matchesCategory && searchableText.includes(searchTerm);
    });

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">
                <span class="product-tag">${product.tag}</span>
            </div>

            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>

                <div class="product-footer">
                    <span class="product-price">${money(product.price)}</span>
                    <button
                        class="add-button"
                        data-add="${product.id}"
                        aria-label="Agregar ${product.name} al carrito">
                        +
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    emptyMessage.hidden = filteredProducts.length !== 0;
}

// Agregar un alimento al carrito
function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    renderCart();
    showToast(`${product.name} se agregó a tu carrito.`);
}

// Cambiar la cantidad de un producto
function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Calcular total de unidades y precio
function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

// Dibujar el contenido del carrito
function renderCart() {
    cartCount.textContent = getCartCount();
    cartTotal.textContent = money(getCartTotal());
    checkoutTotal.textContent = money(getCartTotal());

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div style="font-size:48px">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Explora el menú y agrega algo delicioso.</p>
            </div>
        `;

        cartBottom.hidden = true;
        return;
    }

    cartBottom.hidden = false;

    cartItems.innerHTML = cart.map(item => `
        <article class="cart-item">
            <img src="${item.image}" alt="${item.name}">

            <div>
                <h3>${item.name}</h3>
                <p>${money(item.price)} por unidad</p>

                <div class="quantity-control">
                    <button
                        data-change="${item.id}"
                        data-amount="-1"
                        aria-label="Restar una unidad">−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-change="${item.id}"
                        data-amount="1"
                        aria-label="Agregar una unidad">+</button>
                </div>

                <button class="remove-button" data-remove="${item.id}">
                    Eliminar
                </button>
            </div>

            <strong>${money(item.price * item.quantity)}</strong>
        </article>
    `).join("");
}

// Abrir y cerrar el carrito
function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("visible");
    document.body.classList.add("no-scroll");
    document.getElementById("close-cart").focus();
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("visible");
    document.body.classList.remove("no-scroll");
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Delegar los clics de los productos
productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (button) {
        addToCart(Number(button.dataset.add));
    }
});

// Delegar los clics del carrito
cartItems.addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-change]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.change),
            Number(quantityButton.dataset.amount)
        );
    }

    if (removeButton) {
        removeFromCart(Number(removeButton.dataset.remove));
    }
});

// Filtrar por categoría
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category").forEach(categoryButton => {
            const isActive = categoryButton === button;

            categoryButton.classList.toggle("active", isActive);
            categoryButton.setAttribute("aria-pressed", String(isActive));
        });

        renderProducts();
    });
});

// Buscar alimentos por nombre o descripción
searchInput.addEventListener("input", renderProducts);

// Mostrar mensajes temporales
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("visible");
    }, 2500);
}

// Abrir el formulario de pedido
document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Primero agrega productos a tu carrito.");
        return;
    }

    closeCart();
    checkoutTotal.textContent = money(getCartTotal());
    checkoutModal.classList.add("visible");
    document.body.classList.add("no-scroll");
    document.getElementById("customer-name").focus();
});

// Cerrar formulario de pedido
function closeCheckout() {
    checkoutModal.classList.remove("visible");
    document.body.classList.remove("no-scroll");
}

document.getElementById("close-checkout").addEventListener("click", closeCheckout);

// Registrar pedido de demostración
checkoutForm.addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        closeCheckout();
        showToast("Tu carrito está vacío.");
        return;
    }

    const formData = new FormData(checkoutForm);
    const customerName = String(formData.get("name")).trim();
    const customerAddress = String(formData.get("address")).trim();
    const payment = String(formData.get("payment"));

    if (!customerName || !customerAddress) {
        showToast("Completa tu nombre y dirección.");
        return;
    }

    // Resumen del pedido antes de vaciar el carrito
    const orderNumber = "FE-" + Date.now().toString().slice(-8);
    const total = getCartTotal();
    const orderSummary = cart.map(item =>
        `${item.quantity} × ${item.name}`
    ).join("\n");

    document.getElementById("success-message").textContent =
        `Gracias, ${customerName}. Tu pedido de demostración quedó registrado.`;

    document.getElementById("order-details").textContent =
        `Pedido: ${orderNumber}\n` +
        `Dirección: ${customerAddress}\n` +
        `Productos:\n${orderSummary}\n` +
        `Pago seleccionado: ${payment}\n` +
        `Total: ${money(total)}`;

    closeCheckout();
    successModal.classList.add("visible");
    document.body.classList.add("no-scroll");

    cart = [];
    renderCart();
    checkoutForm.reset();
});

// Finalizar y volver al menú
document.getElementById("finish-order").addEventListener("click", () => {
    successModal.classList.remove("visible");
    document.body.classList.remove("no-scroll");

    document.getElementById("inicio").scrollIntoView({
        behavior: "smooth"
    });
});

// Cerrar ventanas con Escape
document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (successModal.classList.contains("visible")) {
        successModal.classList.remove("visible");
        document.body.classList.remove("no-scroll");
    } else if (checkoutModal.classList.contains("visible")) {
        closeCheckout();
    } else {
        closeCart();
    }
});

// Iniciar la página
renderProducts();
renderCart();

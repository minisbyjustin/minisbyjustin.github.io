/*
 * Stripe checkout configuration.
 * After deploying the Cloudflare Worker, replace this URL with its HTTPS URL.
 */
const CHECKOUT_API_URL = "https://minisbyjustin-checkout.minisbyjustin.workers.dev";

/*
 * Product data
 *
 * To add your own miniature:
 * 1. Copy one of the product objects below.
 * 2. Change the id, name, price, and image paths.
 * 3. Put your photos in the images/ folder.
 *
 * Example:
 * images/goblin/1.jpg
 * images/goblin/2.jpg
 * images/goblin/3.jpg
 */

const products = [
    {
        id: "minotaur",
        name: "Minotaur",
        price: 8.00,
        images: [
            "images/minis/minotaur/1.jpg",
            "images/minis/minotaur/2.jpg",
            "images/minis/minotaur/3.jpg",
            "images/minis/minotaur/4.jpg",
            "images/minis/minotaur/5.jpg",
        ]
    },
    {
        id: "frogrider",
        name: "Frog and Rider",
        price: 5.00,
        images: [
            "images/minis/frog_rider/5.jpg",
            "images/minis/frog_rider/3.jpg",
            "images/minis/frog_rider/2.jpg",
            "images/minis/frog_rider/4.jpg",
            "images/minis/frog_rider/1.jpg"
        ]
    },
    {
        id: "Merman",
        name: "Merman on Wave",
        price: 7.00,
        images: [
            "images/minis/merman/1.jpeg",
            "images/minis/merman/2.jpeg",
            "images/minis/merman/3.jpeg",
            "images/minis/merman/4.jpeg"
        ]
    },
    {
        id: "wizard",
        name: "Wizard with Wand",
        price: 5.00,
        images: [
            "images/minis/wand_wizard/1.jpg",
            "images/minis/wand_wizard/2.jpg",
            "images/minis/wand_wizard/3.jpg",
            "images/minis/wand_wizard/4.jpg"
        ]
    },
    {
        id: "lichqueen",
        name: "Lich Queen",
        price: 5.00,
        images: [
            "images/minis/lich_queen/1.jpg",
            "images/minis/lich_queen/2.jpg",
            "images/minis/lich_queen/3.jpg"
        ]
    },
    {
        id: "elementalist",
        name: "Elementalist",
        price: 5.00,
        images: [
            "images/minis/fem_elementalist/1.jpeg",
            "images/minis/fem_elementalist/2.jpg",
            "images/minis/fem_elementalist/3.jpg"
        ]
    },
    {
        id: "kobold_rogue",
        name: "Kobold Rogue",
        price: 4.00,
        images: [
            "images/minis/kobold_rogue/1.jpeg",
            "images/minis/kobold_rogue/2.jpeg",
            "images/minis/kobold_rogue/3.jpeg"
        ]
    },
    {
        id: "pirate",
        name: "Pirate Captain",
        price: 5.00,
        images: [
            "images/minis/pirate/1.jpg",
            "images/minis/pirate/2.jpg",
            "images/minis/pirate/3.jpg"
        ]
    },
    {
        id: "dwarf",
        name: "Dwarf Smith",
        price: 5.00,
        images: [
            "images/minis/dwarf/dwarf0.jpeg",
            "images/minis/dwarf/dwarf1.jpeg"
        ]
    },
    {
        id: "zombie",
        name: "Business Zombie",
        price: 5.00,
        images: [
            "images/minis/zombie/1.jpg",
            "images/minis/zombie/2.jpg",
            "images/minis/zombie/3.jpg",
            "images/minis/zombie/4.jpg",
            "images/minis/zombie/5.jpg"
        ]
    },
    {
        id: "monk",
        name: "Monk",
        price: 5.00,
        images: [
            "images/minis/monk/2.jpg",
            "images/minis/monk/1.jpg"
        ]
    },
    {
        id: "archer",
        name: "Archer",
        price: 5.00,
        images: [
            "images/minis/archer/5.jpg",
            "images/minis/archer/4.jpg",
            "images/minis/archer/2.jpg",
            "images/minis/archer/3.jpg",
            "images/minis/archer/1.jpg"
        ]
    }
];

let cart = JSON.parse(localStorage.getItem("minisByJustinCart")) || [];
const galleryPositions = {};

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem("minisByJustinCart", JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    document.querySelectorAll("#cart-count").forEach(element => {
        element.textContent = count;
    });
}

function renderProducts() {
    const grid = document.getElementById("product-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = products.map(product => {
        galleryPositions[product.id] = 0;

        return `
            <article class="product-card">
                <div class="product-image-container">
                    <button
                        class="gallery-button previous"
                        data-product="${product.id}"
                        aria-label="Previous photo"
                    >&lsaquo;</button>

                    <img
                        class="product-image"
                        id="image-${product.id}"
                        src="${product.images[0]}"
                        alt="${product.name}"
                    >

                    <button
                        class="gallery-button next"
                        data-product="${product.id}"
                        aria-label="Next photo"
                    >&rsaquo;</button>
                </div>

                <div class="image-dots" id="dots-${product.id}">
                    ${product.images.map((_, index) => `
                        <span class="image-dot ${index === 0 ? "active" : ""}"></span>
                    `).join("")}
                </div>

                <h2>${product.name}</h2>
                <p class="product-price">${formatPrice(product.price)}</p>

                <button
                    class="add-to-cart"
                    data-add-product="${product.id}"
                >
                    Add to Cart
                </button>
            </article>
        `;
    }).join("");
}

function changeGallery(productId, direction) {
    const product = products.find(item => item.id === productId);

    if (!product) {
        return;
    }

    let position = galleryPositions[productId] || 0;
    position += direction;

    if (position < 0) {
        position = product.images.length - 1;
    }

    if (position >= product.images.length) {
        position = 0;
    }

    galleryPositions[productId] = position;

    const image = document.getElementById(`image-${productId}`);
    image.src = product.images[position];

    const dots = document.querySelectorAll(`#dots-${productId} .image-dot`);

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === position);
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) {
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("cart-subtotal");
    const shippingElement = document.getElementById("cart-shipping");
    const totalElement = document.getElementById("cart-total");

    if (!container || !totalElement) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        if (subtotalElement) subtotalElement.textContent = "$0.00";
        if (shippingElement) shippingElement.textContent = "$0.00";
        totalElement.textContent = "$0.00";
        return;
    }

    // Display prices from the trusted product list, not old localStorage values.
    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return "";
        const quantity = Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
        subtotal += product.price * quantity;

        return `
            <div class="cart-item">
                <img class="cart-item-image" src="${product.images[0]}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>${quantity} × ${formatPrice(product.price)}</p>
                </div>
                <button class="remove-item" data-remove-product="${product.id}" aria-label="Remove ${product.name}">Remove</button>
            </div>
        `;
    }).join("");

    const shipping = subtotal >= 20 ? 0 : 8;
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement) shippingElement.textContent = subtotal >= 20 ? "Free" : formatPrice(shipping);
    totalElement.textContent = formatPrice(subtotal + shipping);
}

function showCheckoutMessage(message) {
    const element = document.getElementById("checkout-message");
    if (element) element.textContent = message;
    const pageElement = document.getElementById("page-checkout-message");
    if (pageElement) {
        pageElement.textContent = message;
        pageElement.hidden = !message;
    }
}

async function handleCheckoutReturn() {
    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");
    const sessionId = params.get("session_id");

    if (checkoutStatus === "cancelled") {
        showCheckoutMessage("Checkout was cancelled. Your cart is still saved.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
    }

    if (checkoutStatus !== "success" || !sessionId) return;

    showCheckoutMessage("Checking your payment status…");
    try {
        const response = await fetch(`${CHECKOUT_API_URL}/session-status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not verify payment.");

        if (data.payment_status === "paid") {
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
            showCheckoutMessage("Thank you! Your payment was successful. Your order is confirmed.");
        } else {
            showCheckoutMessage("Your payment is not marked as complete yet. Please contact us if you believe this is an error.");
        }
    } catch (error) {
        showCheckoutMessage("We couldn't verify the payment status automatically. Please don't submit payment again; contact us if you need help.");
    }
    window.history.replaceState({}, document.title, window.location.pathname);
}

function openCart() {
    const panel = document.getElementById("cart-panel");
    const overlay = document.getElementById("cart-overlay");

    if (panel && overlay) {
        panel.classList.add("open");
        overlay.classList.add("open");
    }
}

function closeCart() {
    const panel = document.getElementById("cart-panel");
    const overlay = document.getElementById("cart-overlay");

    if (panel && overlay) {
        panel.classList.remove("open");
        overlay.classList.remove("open");
    }
}

document.addEventListener("click", event => {
    const previousButton = event.target.closest(".gallery-button.previous");
    const nextButton = event.target.closest(".gallery-button.next");
    const addButton = event.target.closest("[data-add-product]");
    const removeButton = event.target.closest("[data-remove-product]");

    if (previousButton) {
        changeGallery(previousButton.dataset.product, -1);
    }

    if (nextButton) {
        changeGallery(nextButton.dataset.product, 1);
    }

    if (addButton) {
        addToCart(addButton.dataset.addProduct);
    }

    if (removeButton) {
        removeFromCart(removeButton.dataset.removeProduct);
    }
});

document.getElementById("cart-button")?.addEventListener("click", openCart);
document.getElementById("close-cart")?.addEventListener("click", closeCart);
document.getElementById("cart-overlay")?.addEventListener("click", closeCart);

document.getElementById("checkout-button")?.addEventListener("click", async event => {
    const button = event.currentTarget;
    if (!cart.length) {
        showCheckoutMessage("Your cart is empty. Add a miniature before checking out.");
        return;
    }
    if (CHECKOUT_API_URL.includes("YOUR-WORKER-NAME")) {
        showCheckoutMessage("Checkout setup is not finished yet. The site owner needs to configure the checkout API URL.");
        return;
    }

    button.disabled = true;
    button.textContent = "Connecting to Stripe…";
    showCheckoutMessage("");
    try {
        // Send only product IDs and quantities. The server determines names and prices.
        const response = await fetch(`${CHECKOUT_API_URL}/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart.map(item => ({ id: item.id, quantity: item.quantity })) })
        });
        const data = await response.json();
        if (!response.ok || !data.url) throw new Error(data.error || "Unable to start checkout.");
        window.location.assign(data.url);
    } catch (error) {
        showCheckoutMessage("We couldn't start checkout. Please try again in a moment.");
        button.disabled = false;
        button.textContent = "Checkout with Stripe";
    }
});

renderProducts();
updateCartCount();
renderCart();
handleCheckoutReturn();

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
        price: 12.00,
        images: [
            "images/minis/minotaur/1.jpeg",
        ]
    },
    {
        id: "wizard",
        name: "Wizard with Wand",
        price: 6.00,
        images: [
            "images/minis/wand_wizard/1.jpeg",
            "images/minis/wand_wizard/2.jpeg",
            "images/minis/wand_wizard/3.jpeg"
        ]
    },
    {
        id: "lichqueen",
        name: "Lich Queen",
        price: 6.00,
        images: [
            "images/minis/lich_queen/1.jpeg",
            "images/minis/lich_queen/2.jpeg"
        ]
    },
    {
        id: "elementalist",
        name: "Elementalist",
        price: 7.00,
        images: [
            "images/minis/fem_elementalist/1.jpeg"
        ]
    },
    {
        id: "kobold_rogue",
        name: "Kobold Rogue",
        price: 5.00,
        images: [
            "images/minis/kobold_rogue/1.jpeg",
            "images/minis/kobold_rogue/2.jpeg",
            "images/minis/kobold_rogue/3.jpeg"
        ]
    },
    {
        id: "pirate",
        name: "Pirate Captain",
        price: 6.00,
        images: [
            "images/minis/pirate/1.jpeg",
            "images/minis/pirate/2.jpeg",
            "images/minis/pirate/3.jpeg"
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
    const totalElement = document.getElementById("cart-total");

    if (!container || !totalElement) {
        return;
    }

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        totalElement.textContent = "$0.00";
        return;
    }

    let total = 0;

    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;

        return `
            <div class="cart-item">
                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>
                    <h3>${item.name}</h3>
                    <p>${item.quantity} × ${formatPrice(item.price)}</p>
                </div>

                <button
                    class="remove-item"
                    data-remove-product="${item.id}"
                    aria-label="Remove ${item.name}"
                >
                    Remove
                </button>
            </div>
        `;
    }).join("");

    totalElement.textContent = formatPrice(total);
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

document.getElementById("checkout-button")?.addEventListener("click", () => {
    alert(
        "Sorry, I haven't set up a payment service yet. If you really want something, DM me on instagram @minis_by_justin"
    );
});

renderProducts();
updateCartCount();
renderCart();

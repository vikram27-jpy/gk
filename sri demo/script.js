// State
let cart = JSON.parse(localStorage.getItem('sri_murugan_cart')) || [];
let products = JSON.parse(localStorage.getItem('sri_murugan_products')) || [];

const defaultProducts = [
    { id: 'p1', name: 'Crimson Kanchipuram Silk', price: 15000, img: 'images/saree_red.png', category: 'Kanchipuram' },
    { id: 'p2', name: 'Royal Blue Banarasi', price: 12500, img: 'images/saree_blue.png', category: 'Banarasi' },
    { id: 'p3', name: 'Emerald Green Mysore Silk', price: 9800, img: 'images/saree_green.png', category: 'Mysore Silk' },
    { id: 'p4', name: 'Golden Yellow Silk', price: 11000, img: 'images/saree_yellow.png', category: 'Traditional' }
];

// Initialize Products on Load
function initProducts() {
    if (products.length === 0) {
        products = defaultProducts;
        localStorage.setItem('sri_murugan_products', JSON.stringify(products));
    }
}

// Render Products in index.html
function renderProducts(productsToRender = products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '';
    if (productsToRender.length === 0) {
        grid.innerHTML = '<p>No products found matching your search.</p>';
        return;
    }

    productsToRender.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="product-category" style="color:#666; font-size:0.9rem;">${p.category || 'Saree'}</p>
                    <p class="product-price">₹${parseInt(p.price).toLocaleString('en-IN')}</p>
                    <button class="add-btn" onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.img}')">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

// Search Products
function searchProducts() {
    const q = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.category && p.category.toLowerCase().includes(q))
    );
    renderProducts(filtered);
}

// Cart UI
function updateCartCount() {
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Cart (${totalItems})`;
    }
}

function addToCart(id, name, price, img) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }
    saveCart();
    alert(`${name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('sri_murugan_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart(); // Trigger if on cart page
}

// Render Cart Page
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const totalCountEl = document.getElementById('total-count');

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    let totalCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            totalPrice += item.price * item.quantity;
            totalCount += item.quantity;

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Price: ₹${parseInt(item.price).toLocaleString('en-IN')}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeItem(${index})">Remove ❌</button>
                        <p class="item-total">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            `;
        });
    }

    if (totalPriceEl) totalPriceEl.textContent = totalPrice.toLocaleString('en-IN');
    if (totalCountEl) totalCountEl.textContent = totalCount;
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) removeItem(index);
    else saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function clearCart() {
    if(cart.length > 0 && confirm("Are you sure you want to clear the cart?")) {
        cart = [];
        saveCart();
    }
}

// Checkout and Generate Order
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Create new order
    const orders = JSON.parse(localStorage.getItem('sri_murugan_orders')) || [];
    const total = cart.reduce((s, item) => s + (item.price * item.quantity), 0);
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const date = new Date().toLocaleString('en-IN');
    
    const newOrder = {
        orderId,
        date,
        items: [...cart],
        total,
        status: 'Completed'
    };
    
    orders.push(newOrder);
    localStorage.setItem('sri_murugan_orders', JSON.stringify(orders));

    alert(`Order Confirmed!\nYour Order ID: ${orderId}\nThank you for shopping at Sri Murugan Silks.`);
    cart = [];
    saveCart();
    window.location.href = 'index.html';
}

// Initialize System on load
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    updateCartCount();
    renderProducts(); // if index.html
    renderCart(); // if cart.html
});

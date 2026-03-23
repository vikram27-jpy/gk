// Auth Check
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('sri_murugan_admin_logged_in');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
});

function login() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    if (user === 'admin' && pass === '1234') {
        localStorage.setItem('sri_murugan_admin_logged_in', 'true');
        showDashboard();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('sri_murugan_admin_logged_in');
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    document.getElementById('logout-btn').style.display = 'inline-block';
    renderAdminProducts();
    renderAdminOrders();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    
    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.onclick.toString().includes(tabId));
    if(activeBtn) activeBtn.classList.add('active');
    
    document.getElementById(`tab-${tabId}`).style.display = 'block';
}

// Product Management
function getProducts() {
    return JSON.parse(localStorage.getItem('sri_murugan_products')) || [];
}

function saveProducts(products) {
    localStorage.setItem('sri_murugan_products', JSON.stringify(products));
    renderAdminProducts();
}

function renderAdminProducts() {
    const tbody = document.getElementById('admin-product-list');
    const products = getProducts();
    tbody.innerHTML = '';
    products.forEach((p, index) => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${p.img}" alt="${p.name}" width="50" height="50" style="object-fit:cover; border-radius:4px;"></td>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.category || 'N/A'}</td>
                <td>₹${parseInt(p.price).toLocaleString('en-IN')}</td>
                <td>
                    <button class="btn btn-outline" style="padding:5px 10px; font-size:0.9rem" onclick="deleteProduct(${index})">Delete 🗑️</button>
                </td>
            </tr>
        `;
    });
}

function addProduct() {
    const id = document.getElementById('p-id').value;
    const name = document.getElementById('p-name').value;
    const category = document.getElementById('p-category').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;

    if (!id || !name || !price || !img) {
        alert("Please fill all required fields (ID, Name, Price, Image URL)");
        return;
    }

    const products = getProducts();
    if(products.find(p => p.id === id)) {
        alert("Product ID already exists!");
        return;
    }

    products.push({ id, name, category, price: Number(price), img });
    saveProducts(products);

    // Clear inputs
    document.querySelectorAll('.form-group input').forEach(input => input.value = '');
    alert("Product added successfully!");
}

function deleteProduct(index) {
    if(confirm("Are you sure you want to delete this product?")) {
        const products = getProducts();
        products.splice(index, 1);
        saveProducts(products);
    }
}

// Order Management
function renderAdminOrders() {
    const tbody = document.getElementById('admin-order-list');
    const orders = JSON.parse(localStorage.getItem('sri_murugan_orders')) || [];
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No orders yet. Start shopping!</td></tr>';
        return;
    }

    orders.slice().reverse().forEach(o => {
        const itemSummary = o.items.map(i => `${i.quantity}x ${i.name}`).join(', ');
        tbody.innerHTML += `
            <tr>
                <td><strong>${o.orderId}</strong></td>
                <td>${o.date}</td>
                <td style="max-width:300px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${itemSummary}">${itemSummary}</td>
                <td><strong>₹${parseInt(o.total).toLocaleString('en-IN')}</strong></td>
                <td><span style="color:var(--primary-color); font-weight:bold;">${o.status} ✅</span></td>
            </tr>
        `;
    });
}

const products = [
    { id: 1, name: "Burger Clasic", desc: "Carne vită 100%, cheddar, sos special", price: 120, unit: "buc", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "Pizza Margherita", desc: "Sos roșii San Marzano, mozzarella fior di latte", price: 140, unit: "buc", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Cartofi Prăjiți", desc: "Cartofi proaspeți, tăiați manual", price: 45, unit: "porție", img: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Sos Usturoi", desc: "Preparat în casă", price: 15, unit: "buc", img: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Limonadă Fresh", desc: "Lămâi stoarse, miere, mentă", price: 50, unit: "500ml", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80" }
];


const screens = document.querySelectorAll('.screen'); //navigarea
const navBtns = document.querySelectorAll('.nav-btn');

function navigateTo(screenId) {
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if(screenId !== 'checkout-screen') {
        navBtns.forEach(btn => btn.classList.remove('active-nav'));
        document.getElementById(screenId === 'catalog-screen' ? 'nav-catalog' : 'nav-cart').classList.add('active-nav');
    }
}

document.getElementById('nav-catalog').addEventListener('click', () => navigateTo('catalog-screen'));
document.getElementById('nav-cart').addEventListener('click', () => navigateTo('cart-screen'));
document.getElementById('btn-checkout').addEventListener('click', () => navigateTo('checkout-screen'));
document.getElementById('btn-back-cart').addEventListener('click', () => navigateTo('cart-screen'));


let cart = JSON.parse(localStorage.getItem('restaurant_cart')) || {}; //cosul

function renderCatalog() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="price-row">
          <span class="price">${product.price} MDL <span style="font-size:12px;color:#636e72">/${product.unit}</span></span>
          <button class="add-btn" onclick="window.addToCart(${product.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.addToCart = function(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    updateCartState();
};

window.updateQuantity = function(productId, change) {
    if (cart[productId]) {
        cart[productId] += change;
        if (cart[productId] <= 0) delete cart[productId];
        updateCartState();
    }
};

function updateCartState() {
    localStorage.setItem('restaurant_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    let subtotal = 0, totalItems = 0;
    container.innerHTML = '';

    Object.keys(cart).forEach(id => {
        const p = products.find(prod => prod.id == parseInt(id));
        if (p) {
            const q = cart[id];
            const itemTotal = q * p.price;
            subtotal += itemTotal;
            totalItems += q;

            container.innerHTML += `
        <div class="cart-item">
          <img src="${p.img}" class="cart-item-img">
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <span>${p.price} MDL / ${p.unit}</span>
          </div>
          <div class="cart-controls">
            <button onclick="window.updateQuantity(${id}, -1)">-</button>
            <span>${q}</span>
            <button onclick="window.updateQuantity(${id}, 1)">+</button>
          </div>
          <div class="item-total">${itemTotal} MDL</div>
        </div>
      `;
        }
    });

    if (totalItems === 0) {
        container.innerHTML = `
      <div style="text-align:center; padding: 40px; background: white; border-radius: 16px;">
        <h3 style="color:#636e72; margin-bottom: 15px;">Coșul este gol</h3>
        <button class="btn-secondary" onclick="window.navigateTo('catalog-screen')">Înapoi la meniu</button>
      </div>`;
    }

    document.getElementById('cart-count').innerText = totalItems;
    document.getElementById('cart-subtotal').innerText = subtotal;
}

window.navigateTo = navigateTo;
renderCatalog();
renderCart();
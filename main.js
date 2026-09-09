const screens = document.querySelectorAll('.screen');
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
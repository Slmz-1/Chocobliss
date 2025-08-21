/* ===================== CHOCOLATE DUST CANVAS ===================== */
const canvas = document.getElementById('particles');
const ctx = canvas?.getContext('2d');

function resizeCanvas() {
  if(!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const dots = Array.from({length: 80}).map(() => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.8 + 0.6,
  dx: (Math.random() - 0.5) * 0.25,
  dy: (Math.random() - 0.5) * 0.25
}));

function drawDots() {
  if(!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(120,72,60,0.14)';
  dots.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx; p.y += p.dy - 0.08;
    if(p.x < -10) p.x = canvas.width + 10;
    if(p.x > canvas.width + 10) p.x = -10;
    if(p.y < -10) p.y = canvas.height + 10;
  });
  requestAnimationFrame(drawDots);
}
drawDots();

/* ===================== FADE-IN ON SCROLL ===================== */
const faders = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {threshold:0.2});
faders.forEach(el => observer.observe(el));

/* ===================== BACK TO TOP ===================== */
const backBtn = document.getElementById('backToTop');
if(backBtn){
  window.addEventListener('scroll', () => {
    backBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({top:0, behavior:'smooth'});
  });
}

/* ===================== CART FUNCTIONALITY ===================== */
let cart = JSON.parse(localStorage.getItem('chocoCart')) || [];

const cartCountEl = document.getElementById('cartCount');
const cartListEl = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');

function updateCartDisplay() {
  if(cartCountEl) cartCountEl.textContent = cart.length;
  if(cartListEl){
    cartListEl.innerHTML = '';
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.style.marginLeft = '8px';
      removeBtn.onclick = () => { removeFromCart(index); };
      li.appendChild(removeBtn);
      cartListEl.appendChild(li);
    });
  }
  if(cartTotalEl){
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function addToCart(name, price){
  cart.push({name, price});
  localStorage.setItem('chocoCart', JSON.stringify(cart));
  updateCartDisplay();
}

function removeFromCart(index){
  cart.splice(index,1);
  localStorage.setItem('chocoCart', JSON.stringify(cart));
  updateCartDisplay();
}

updateCartDisplay();

/* Add event listeners for all Add to Cart buttons */
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.menu-item');
    if(!parent) return;
    const name = parent.dataset.name;
    const price = parseFloat(parent.dataset.price);
    addToCart(name, price);
    alert(`${name} added to cart!`);
  });
});

/* ===================== CART TOGGLE ===================== */
const cartBtn = document.getElementById('cartBtn');
const cartDiv = document.getElementById('cartItems');
if(cartBtn && cartDiv){
  cartBtn.addEventListener('click', () => {
    cartDiv.style.display = cartDiv.style.display === 'block' ? 'none' : 'block';
  });
}

/* ===================== PAYMENT SIMULATION ===================== */
document.querySelectorAll('.pay-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if(cart.length === 0){
      alert("Cart is empty!");
      return;
    }
    const method = btn.textContent;
    alert(`Simulated payment via ${method} successful!\nTotal: $${cart.reduce((sum,i)=>sum+i.price,0).toFixed(2)}`);
    cart = [];
    localStorage.setItem('chocoCart', JSON.stringify(cart));
    updateCartDisplay();
    if(cartDiv) cartDiv.style.display = 'none';
  });
});

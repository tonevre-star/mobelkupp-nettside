/* =====================================================
   MØBELKUPP — script.js (forsiden)
   Produktdata ligger i products-data.js, handlekurv-logikk
   ligger i cart.js. Denne filen tar seg av selve forsiden:
   karuseller, meny, søk og statistikk-animasjonen.
   ===================================================== */

function buildProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <a href="product.html?id=${p.id}" class="product-media">
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      <span class="badge-save">-${savePct(p.priceNow, p.priceWas)}%</span>
      <span class="badge-condition">${p.condition}</span>
    </a>
    <div class="product-body">
      <span class="product-vendor">${p.vendor}</span>
      <a href="product.html?id=${p.id}" class="product-title">${p.title}</a>
      <div class="product-price-row">
        <span class="price-now">${formatKr(p.priceNow)}</span>
        <span class="price-was">${formatKr(p.priceWas)}</span>
      </div>
      <span class="product-stock">${p.stock} på lager</span>
      <button class="add-to-cart-btn">Legg i handlekurv</button>
    </div>
  `;
  card.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
    addToCart(p.id, 1);
    const btn = e.currentTarget;
    const original = btn.textContent;
    btn.textContent = "Lagt i kurven ✓";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1400);
  });
  return card;
}

function renderCarousels() {
  document.querySelectorAll("[data-carousel]").forEach(el => {
    const category = el.dataset.carousel;
    getProductsByCategory(category).forEach(p => el.appendChild(buildProductCard(p)));
  });
}

// ---------- UI: MENY OG SØK ----------
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchBar").classList.toggle("open");
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

// ---------- STATISTIKK: TELL OPP NÅR SYNLIG ----------
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString("nb-NO");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach(el => statsObserver.observe(el));

// ---------- FOOTER ÅR ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- INIT ----------
renderCarousels();

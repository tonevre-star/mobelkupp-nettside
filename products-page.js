/* =====================================================
   MØBELKUPP — products-page.js (kun for products.html)
   ===================================================== */

function buildGridCard(p) {
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

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category") || "",
    q: (params.get("q") || "").toLowerCase().trim(),
  };
}

function applyFiltersAndRender() {
  const category = document.getElementById("filterCategory").value;
  const condition = document.getElementById("filterCondition").value;
  const sortBy = document.getElementById("sortBy").value;
  const q = getFiltersFromURL().q;

  let list = PRODUCTS.filter(p => {
    if (category && p.category !== category) return false;
    if (condition && p.condition !== condition) return false;
    if (q && !p.title.toLowerCase().includes(q) && !p.vendor.toLowerCase().includes(q)) return false;
    return true;
  });

  if (sortBy === "price-asc") list = list.slice().sort((a, b) => a.priceNow - b.priceNow);
  else if (sortBy === "price-desc") list = list.slice().sort((a, b) => b.priceNow - a.priceNow);
  else if (sortBy === "discount") list = list.slice().sort((a, b) => savePct(b.priceNow, b.priceWas) - savePct(a.priceNow, a.priceWas));

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  list.forEach(p => grid.appendChild(buildGridCard(p)));

  document.getElementById("resultCount").textContent = list.length;
  document.getElementById("noResults").style.display = list.length ? "none" : "block";

  const title = category ? (CATEGORY_LABELS[category] || "Alle møbler") : (q ? `Søk: "${q}"` : "Alle møbler");
  document.getElementById("catalogTitle").textContent = title;
  document.getElementById("breadcrumbLabel").textContent = title;
  document.title = `${title} – Møbelkupp`;
}

function initFromURL() {
  const { category, q } = getFiltersFromURL();
  if (category) document.getElementById("filterCategory").value = category;
  if (q) document.getElementById("searchInput").value = q;
}

document.getElementById("filterCategory").addEventListener("change", applyFiltersAndRender);
document.getElementById("filterCondition").addEventListener("change", applyFiltersAndRender);
document.getElementById("sortBy").addEventListener("change", applyFiltersAndRender);
document.getElementById("clearFilters").addEventListener("click", () => {
  document.getElementById("filterCategory").value = "";
  document.getElementById("filterCondition").value = "";
  document.getElementById("sortBy").value = "popular";
  window.history.replaceState({}, "", "products.html");
  applyFiltersAndRender();
});

document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchBar").classList.toggle("open");
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

document.getElementById("year").textContent = new Date().getFullYear();

initFromURL();
applyFiltersAndRender();

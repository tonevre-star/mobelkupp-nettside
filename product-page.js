/* =====================================================
   MØBELKUPP — product-page.js (kun for product.html)
   ===================================================== */

function getIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function isØstfoldPostnummer(postnr) {
  // Enkel, omtrentlig sjekk — Østfolds postnummer ligger stort sett i 15xx–19xx.
  // Bytt ut med en ordentlig postnummer-liste eller et API for nøyaktig dekning.
  const n = parseInt(postnr, 10);
  return n >= 1500 && n <= 1999;
}

function buildRelatedCard(p) {
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
    btn.textContent = "Lagt i kurven ✓";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = "Legg i handlekurv"; btn.disabled = false; }, 1400);
  });
  return card;
}

function render() {
  const id = getIdFromURL();
  const product = getProductById(id);

  if (!product) {
    document.querySelector(".product-detail").innerHTML =
      `<p>Fant ikke produktet. <a href="products.html">Se alle møbler →</a></p>`;
    document.querySelector(".product-description").style.display = "none";
    return;
  }

  document.getElementById("pageTitle").textContent = `${product.title} – Møbelkupp`;
  document.getElementById("breadcrumbCategory").textContent = product.categoryLabel;
  document.getElementById("breadcrumbCategory").href = `products.html?category=${product.category}`;
  document.getElementById("breadcrumbTitle").textContent = product.title;

  document.getElementById("galleryMainImg").src = product.img;
  document.getElementById("galleryMainImg").alt = product.title;

  const thumbsWrap = document.getElementById("galleryThumbs");
  // Plassholder-galleri: samme bilde flere ganger. Bytt ut src med egne bilder av produktet.
  [product.img, product.img, product.img].forEach((src, i) => {
    const btn = document.createElement("button");
    btn.className = i === 0 ? "active" : "";
    btn.innerHTML = `<img src="${src}" alt="Bilde ${i + 1}">`;
    btn.addEventListener("click", () => {
      document.getElementById("galleryMainImg").src = src;
      thumbsWrap.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
    thumbsWrap.appendChild(btn);
  });

  document.getElementById("productTitle").textContent = product.title;
  document.getElementById("productVendor").textContent = product.vendor;
  document.getElementById("priceNow").textContent = formatKr(product.priceNow);
  document.getElementById("priceWas").textContent = formatKr(product.priceWas);
  document.getElementById("saveBadge").textContent = `-${savePct(product.priceNow, product.priceWas)}%`;
  document.getElementById("conditionPill").textContent = product.condition;
  document.getElementById("stockPill").textContent = `${product.stock} på lager`;
  document.getElementById("stockNote").textContent = product.stock > 0 ? "På lager" : "Utsolgt";
  document.getElementById("productDescription").textContent = product.description;

  const specTable = document.getElementById("specTable");
  Object.entries(product.specs).forEach(([key, value]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${key}</td><td>${value}</td>`;
    specTable.appendChild(row);
  });

  // ---- mengde-velger ----
  let qty = 1;
  const qtyValueEl = document.getElementById("qtyValue");
  document.getElementById("qtyMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qtyValueEl.textContent = qty;
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    qty = Math.min(product.stock, qty + 1);
    qtyValueEl.textContent = qty;
  });

  // ---- legg i handlekurv / kjøp nå ----
  const addedMsg = document.getElementById("addedMsg");
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product.id, qty);
    addedMsg.classList.add("show");
    setTimeout(() => addedMsg.classList.remove("show"), 2200);
  });
  document.getElementById("buyNowBtn").addEventListener("click", () => {
    addToCart(product.id, qty);
    // lenken går videre til cart.html som normalt
  });

  // ---- leveringssjekk ----
  document.getElementById("postnrCheck").addEventListener("click", () => {
    const val = document.getElementById("postnrInput").value.trim();
    const resultEl = document.getElementById("deliveryResult");
    if (!/^\d{4}$/.test(val)) {
      resultEl.textContent = "Skriv inn et gyldig postnummer (4 sifre).";
      resultEl.className = "delivery-result show no";
      return;
    }
    if (isØstfoldPostnummer(val)) {
      resultEl.textContent = "✓ Vi leverer til dette området, vanligvis innen 2–4 virkedager.";
      resultEl.className = "delivery-result show ok";
    } else {
      resultEl.textContent = "Dette ligger utenfor vårt faste leveringsområde. Ta kontakt, så finner vi en løsning.";
      resultEl.className = "delivery-result show no";
    }
  });

  // ---- relaterte produkter ----
  const related = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 6);
  const relatedWrap = document.getElementById("relatedCarousel");
  related.forEach(p => relatedWrap.appendChild(buildRelatedCard(p)));
}

document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchBar").classList.toggle("open");
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});
document.getElementById("year").textContent = new Date().getFullYear();

render();

/* =====================================================
   MØBELKUPP — cart-page.js (kun for cart.html)

   Om betaling:
   "Fullfør bestilling" kaller /api/create-vipps-payment
   eller /api/create-checkout-session (Stripe) avhengig av
   valgt betalingsmåte, og sender kunden videre til ekte
   Vipps/kort-betaling. Disse endepunktene krever at dere
   har lagt inn ekte API-nøkler som miljøvariabler (se
   .env.example og DEPLOY.md).

   Inntil nøklene er på plass — eller hvis kallet feiler av
   andre grunner — faller siden automatisk tilbake til å
   sende bestillingen som e-post, slik at nettsiden alltid
   er brukelig.
   ===================================================== */

let selectedPayment = "vipps";
let østfoldPostnr = "1600";

function isØstfoldPostnummer(postnr) {
  const n = parseInt(postnr, 10);
  return n >= 1500 && n <= 1999;
}

function renderEmpty() {
  document.getElementById("cartContent").innerHTML = `
    <div class="empty-cart">
      <h1>Handlekurven din er tom</h1>
      <a href="products.html" class="btn btn-primary">Fortsett å handle</a>
    </div>
  `;
}

function renderCartPage() {
  const lines = cartLinesWithProducts();
  if (lines.length === 0) {
    renderEmpty();
    return;
  }

  const subtotal = cartSubtotal();

  document.getElementById("cartContent").innerHTML = `
    <div class="cart-page">
      <h1>Handlekurv</h1>
      <div class="cart-page-grid">
        <div class="cart-line-list" id="cartLineList"></div>

        <aside class="cart-summary">
          <h3>Oppsummering</h3>
          <div class="summary-row"><span>Delsum</span><span id="sumSubtotal">${formatKr(subtotal)}</span></div>
          <div class="summary-row"><span>Frakt</span><span>Beregnes ved postnummer</span></div>

          <div class="delivery-check" style="margin:14px 0; padding:14px;">
            <h3 style="font-size:13px;">Sjekk levering</h3>
            <div class="delivery-check-row">
              <input type="text" id="postnrInput" placeholder="Postnummer" inputmode="numeric" maxlength="4">
              <button id="postnrCheck">Sjekk</button>
            </div>
            <p class="delivery-result" id="deliveryResult"></p>
          </div>

          <div class="summary-row total"><span>Totalt</span><span id="sumTotal">${formatKr(subtotal)}</span></div>

          <p style="font-size:13px; font-weight:700; margin:18px 0 0;">Velg betalingsmåte</p>
          <div class="payment-method-row">
            <div class="payment-method-option selected" data-method="vipps">
              <span class="pm-icon">📱</span>Vipps
            </div>
            <div class="payment-method-option" data-method="kort">
              <span class="pm-icon">💳</span>Kort
            </div>
          </div>

          <button class="btn btn-primary checkout-btn" id="checkoutBtn">Fullfør bestilling</button>
          <p style="font-size:11px; color:var(--ink-soft); margin-top:10px; line-height:1.5;">
            Ved å fullføre bestillingen sender du en forespørsel til Møbelkupp.
            Vi bekrefter betaling og henting/levering på e-post.
          </p>
        </aside>
      </div>
    </div>
  `;

  const listEl = document.getElementById("cartLineList");
  lines.forEach(line => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${line.product.img}" alt="${line.product.title}">
      <div>
        <div class="cart-row-title">${line.product.title}</div>
        <div class="cart-row-vendor">${line.product.vendor}</div>
        <button class="cart-row-remove" data-id="${line.id}">Fjern</button>
      </div>
      <div class="qty-stepper" data-id="${line.id}">
        <button class="qty-dec">−</button>
        <span>${line.qty}</span>
        <button class="qty-inc">+</button>
      </div>
      <div class="cart-row-price">${formatKr(line.product.priceNow * line.qty)}</div>
    `;
    listEl.appendChild(row);
  });

  // ---- fjern-knapper ----
  listEl.querySelectorAll(".cart-row-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.dataset.id);
      renderCartPage();
    });
  });

  // ---- mengde +/- ----
  listEl.querySelectorAll(".qty-stepper").forEach(stepper => {
    const id = stepper.dataset.id;
    const line = lines.find(l => l.id === id);
    stepper.querySelector(".qty-dec").addEventListener("click", () => {
      updateCartQty(id, Math.max(0, line.qty - 1));
      renderCartPage();
    });
    stepper.querySelector(".qty-inc").addEventListener("click", () => {
      updateCartQty(id, Math.min(line.product.stock, line.qty + 1));
      renderCartPage();
    });
  });

  // ---- betalingsmetode ----
  document.querySelectorAll(".payment-method-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".payment-method-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedPayment = opt.dataset.method;
    });
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
    østfoldPostnr = val;
    if (isØstfoldPostnummer(val)) {
      resultEl.textContent = "✓ Vi leverer hit.";
      resultEl.className = "delivery-result show ok";
    } else {
      resultEl.textContent = "Utenfor fast leveringsområde — ta kontakt.";
      resultEl.className = "delivery-result show no";
    }
  });

  // ---- fullfør bestilling: ekte Vipps/kort-betaling via /api, med e-post som fallback ----
  document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const btn = document.getElementById("checkoutBtn");
    const lines = cartLinesWithProducts();
    const orderId = "MK-" + Date.now();
    const total = cartSubtotal();

    btn.disabled = true;
    btn.textContent = "Sender deg videre …";

    try {
      let response;
      if (selectedPayment === "vipps") {
        response = await fetch("/api/create-vipps-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amountInOre: Math.round(total * 100),
            description: `Møbelkupp-bestilling ${orderId}`,
            lines: lines.map(l => ({ title: l.product.title, priceNow: l.product.priceNow, qty: l.qty })),
          }),
        });
      } else {
        response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            lines: lines.map(l => ({ title: l.product.title, priceNow: l.product.priceNow, qty: l.qty })),
          }),
        });
      }

      if (!response.ok) throw new Error("Betalingstjenesten svarte med en feil");
      const data = await response.json();
      if (!data.redirectUrl) throw new Error("Fikk ingen betalingslenke tilbake");

      window.location.href = data.redirectUrl;
    } catch (err) {
      console.warn("Ekte betaling ikke tilgjengelig ennå, faller tilbake til e-postbestilling:", err);
      sendOrderByEmail(lines, total, orderId);
    }
  });
}

function sendOrderByEmail(lines, total, orderId) {
  const orderLines = lines
    .map(l => `- ${l.qty} x ${l.product.title} (${formatKr(l.product.priceNow)} stk) = ${formatKr(l.product.priceNow * l.qty)}`)
    .join("%0D%0A");
  const method = selectedPayment === "vipps" ? "Vipps" : "Kort";
  const subject = encodeURIComponent(`Ny bestilling fra Møbelkupp-nettsiden (${orderId})`);
  const body =
    `Hei, jeg vil bestille følgende:%0D%0A%0D%0A${orderLines}%0D%0A%0D%0ATotalt: ${formatKr(total)}%0D%0A` +
    `Ønsket betalingsmåte: ${method}%0D%0APostnummer for levering: ${østfoldPostnr}%0D%0A%0D%0A` +
    `(Automatisk betaling er ikke koblet til ennå, så denne bestillingen sendes som e-post i mellomtiden.)`;
  window.location.href = `mailto:post@møbelkupp.no?subject=${subject}&body=${body}`;
}

document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchBar").classList.toggle("open");
});
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});
document.getElementById("year").textContent = new Date().getFullYear();

renderCartPage();

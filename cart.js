/* =====================================================
   MØBELKUPP — cart.js
   Handlekurven lagres i nettleserens localStorage, slik
   at den følger kunden mellom forsiden, produktsidene og
   handlekurv-siden. Ingen server er involvert i dette —
   det er bare til for at handleopplevelsen skal fungere.
   ===================================================== */

const CART_KEY = "mobelkupp_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(line => line.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(line => line.id !== productId);
  } else {
    const line = cart.find(l => l.id === productId);
    if (line) line.qty = qty;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(line => line.id !== productId);
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, line) => sum + line.qty, 0);
}

function cartLinesWithProducts() {
  return getCart()
    .map(line => {
      const product = getProductById(line.id);
      return product ? { ...line, product } : null;
    })
    .filter(Boolean);
}

function cartSubtotal() {
  return cartLinesWithProducts().reduce((sum, line) => sum + line.product.priceNow * line.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = cartCount();
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);

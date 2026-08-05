// /api/_kv.js
//
// Vipps' betalings-API tar ikke imot en handlekurv med varelinjer —
// bare et beløp. For å likevel vite HVA kunden kjøpte når Vipps
// bekrefter betalingen, lagrer vi handlekurven midlertidig her
// (nøkkelen er ordre-ID), og henter den frem igjen i vipps-callback.js.
//
// Bruker Upstash Redis sitt gratis REST-API — ingen server å drifte.
// Krever:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

const TTL_SECONDS = 60 * 60 * 24 * 3; // 3 dager er mer enn nok til at en betaling fullføres

function upstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function saveOrderLines(orderId, lines) {
  if (!upstashConfigured()) {
    console.warn("Upstash er ikke konfigurert — kan ikke lagre varelinjer for", orderId);
    return;
  }
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/order:${orderId}?EX=${TTL_SECONDS}`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lines),
  });
}

export async function getOrderLines(orderId) {
  if (!upstashConfigured()) return null;
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/order:${orderId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.result) return null;
  try {
    return JSON.parse(data.result);
  } catch {
    return null;
  }
}

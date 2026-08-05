// /api/vipps-callback.js
//
// Vipps kaller denne URL-en når en betalings status endrer seg
// (f.eks. når kunden har godkjent betalingen i appen).
// Registrer denne URL-en i Vipps-portalen under
// "Nettbutikk → Innstillinger → Callbacks":
//   https://din-side.no/api/vipps-callback
//
// Krever (valgfritt, for e-postvarsel — se DEPLOY.md):
//   RESEND_API_KEY
//   NOTIFY_EMAIL   (f.eks. post@møbelkupp.no)
// Krever (for å vise HVA kunden kjøpte, se _kv.js):
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

import { getOrderLines } from "./_kv.js";

function formatOrderLines(lines) {
  if (!lines || lines.length === 0) {
    return "(Fant ikke detaljer om hvilke varer som ble kjøpt — sjekk Vipps-portalen for beløp, og match mot ordre-ID.)";
  }
  const rows = lines.map(l => `- ${l.qty} x ${l.title} (${l.priceNow} kr stk) = ${l.priceNow * l.qty} kr`);
  const total = lines.reduce((sum, l) => sum + l.priceNow * l.qty, 0);
  return `${rows.join("\n")}\n\nTotalt: ${total} kr`;
}

async function sendOrderEmail(subject, text) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.log("E-postvarsel hoppet over (RESEND_API_KEY/NOTIFY_EMAIL ikke satt):", subject, text);
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Møbelkupp nettside <ordre@møbelkupp.no>",
        to: [process.env.NOTIFY_EMAIL],
        subject,
        text,
      }),
    });
  } catch (err) {
    console.error("Klarte ikke sende e-postvarsel:", err);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const event = req.body;
  console.log("Vipps callback mottatt:", JSON.stringify(event));

  const reference = event?.reference;
  const state = event?.name; // f.eks. "AUTHORIZED", "TERMINATED", "EXPIRED"

  if (reference && state === "AUTHORIZED") {
    const lines = await getOrderLines(reference);
    await sendOrderEmail(
      `Ny Vipps-betaling godkjent — ordre ${reference}`,
      `En kunde har betalt med Vipps for ordre ${reference}.\n\nVarer i bestillingen:\n${formatOrderLines(lines)}\n\nSjekk Vipps-portalen for full betalingsdetalj, og send ut/klargjør varene.`
    );
  }

  // Vipps forventer 200 OK for å vite at callback-en er mottatt
  return res.status(200).json({ received: true });
}

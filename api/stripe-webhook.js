// /api/stripe-webhook.js
//
// Stripe kaller denne URL-en når en betaling er fullført.
// Registreres i Stripe dashboard → Developers → Webhooks:
//   https://din-side.no/api/stripe-webhook
//   Event å lytte på: checkout.session.completed
//
// Krever:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET   (vises når du oppretter webhooken i Stripe)
//   RESEND_API_KEY, NOTIFY_EMAIL   (valgfritt, for e-postvarsel)

import Stripe from "stripe";

export const config = {
  api: { bodyParser: false }, // Stripe krever rå request-body for signaturverifisering
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function sendOrderEmail(subject, text) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.log("E-postvarsel hoppet over:", subject, text);
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Møbelkupp nettside <ordre@mobelkupp.no>",
      to: [process.env.NOTIFY_EMAIL],
      subject,
      text,
    }),
  });
}

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook-signatur ugyldig:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await sendOrderEmail(
      `Ny kortbetaling godkjent — ordre ${session.client_reference_id}`,
      `En kunde har betalt med kort for ordre ${session.client_reference_id}. Beløp: ${(session.amount_total / 100).toFixed(2)} kr. Sjekk Stripe dashboard for detaljer.`
    );
  }

  return res.status(200).json({ received: true });
}

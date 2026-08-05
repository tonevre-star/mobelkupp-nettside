// /api/create-checkout-session.js
//
// Oppretter en Stripe Checkout-økt for kortbetaling og returnerer
// URL-en kunden skal sendes til.
//
// Krever:
//   STRIPE_SECRET_KEY   (fra dashboard.stripe.com → Developers → API keys)
//   PUBLIC_SITE_URL

import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST er støttet" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { orderId, lines } = req.body;
    // lines: [{ title: "Zeta sidebord", priceNow: 1720, qty: 1 }, ...]

    if (!orderId || !Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: "Ugyldig ordre" });
    }

    const line_items = lines.map((line) => ({
      price_data: {
        currency: "nok",
        product_data: { name: line.title },
        unit_amount: Math.round(line.priceNow * 100), // øre
      },
      quantity: line.qty,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      client_reference_id: orderId,
      success_url: `${process.env.PUBLIC_SITE_URL}/success.html?orderId=${orderId}&method=kort`,
      cancel_url: `${process.env.PUBLIC_SITE_URL}/cart.html`,
    });

    return res.status(200).json({ redirectUrl: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Noe gikk galt ved oppretting av kortbetaling" });
  }
}

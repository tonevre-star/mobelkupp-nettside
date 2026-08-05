// /api/create-vipps-payment.js
//
// Oppretter en Vipps-betaling og returnerer en redirectUrl som
// nettleseren skal sendes til (der kunden godkjenner i Vipps-appen).
//
// Krever disse miljøvariablene (settes i Vercel → Settings → Environment Variables):
//   VIPPS_CLIENT_ID
//   VIPPS_CLIENT_SECRET
//   VIPPS_SUBSCRIPTION_KEY      (Ocp-Apim-Subscription-Key fra Vipps-portalen)
//   VIPPS_MERCHANT_SERIAL_NUMBER
//   VIPPS_MODE                 "test" eller "production"
//   PUBLIC_SITE_URL             f.eks. https://møbelkupp.no (ingen trailing slash)
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN   (for å huske hva som ble kjøpt, se _kv.js)

import { saveOrderLines } from "./_kv.js";

function vippsBaseUrl() {
  return process.env.VIPPS_MODE === "production"
    ? "https://api.vipps.no"
    : "https://apitest.vipps.no";
}

async function getVippsAccessToken() {
  const res = await fetch(`${vippsBaseUrl()}/accesstoken/get`, {
    method: "POST",
    headers: {
      client_id: process.env.VIPPS_CLIENT_ID,
      client_secret: process.env.VIPPS_CLIENT_SECRET,
      "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY,
    },
  });
  if (!res.ok) {
    throw new Error(`Klarte ikke hente Vipps access token (${res.status})`);
  }
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Kun POST er støttet" });
  }

  try {
    const { orderId, amountInOre, description, lines } = req.body;

    if (!orderId || !amountInOre || amountInOre < 100) {
      return res.status(400).json({ error: "Ugyldig ordre (mangler orderId eller for lavt beløp)" });
    }

    if (Array.isArray(lines) && lines.length > 0) {
      await saveOrderLines(orderId, lines);
    }

    const accessToken = await getVippsAccessToken();

    const paymentRes = await fetch(`${vippsBaseUrl()}/epayment/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY,
        "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NUMBER,
        "Vipps-System-Name": "mobelkupp-nettside",
        "Vipps-System-Version": "1.0.0",
        "Idempotency-Key": orderId,
      },
      body: JSON.stringify({
        amount: { currency: "NOK", value: amountInOre },
        paymentMethod: { type: "WALLET" },
        reference: orderId,
        userFlow: "WEB_REDIRECT",
        returnUrl: `${process.env.PUBLIC_SITE_URL}/success.html?orderId=${orderId}&method=vipps`,
        paymentDescription: description || "Bestilling hos Møbelkupp",
      }),
    });

    if (!paymentRes.ok) {
      const errBody = await paymentRes.text();
      console.error("Vipps create-payment feilet:", errBody);
      return res.status(502).json({ error: "Vipps avviste betalingsforespørselen" });
    }

    const paymentData = await paymentRes.json();
    return res.status(200).json({ redirectUrl: paymentData.redirectUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Noe gikk galt ved oppretting av Vipps-betaling" });
  }
}

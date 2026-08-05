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
//   NOTIFY_EMAIL   (f.eks. post@mobelkupp.no)

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
        from: "Møbelkupp nettside <ordre@mobelkupp.no>",
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
    await sendOrderEmail(
      `Ny Vipps-betaling godkjent — ordre ${reference}`,
      `En kunde har godkjent betaling for ordre ${reference} via Vipps. Sjekk Vipps-portalen for detaljer og send ut/klargjør varen.`
    );
  }

  // Vipps forventer 200 OK for å vite at callback-en er mottatt
  return res.status(200).json({ received: true });
}

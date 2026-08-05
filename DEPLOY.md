# Møbelkupp — sette nettsiden live med ekte betaling

Denne guiden tar deg fra "filer på disken" til en nettside på nett som
kan ta imot ekte Vipps- og kortbetalinger. Gjør stegene i rekkefølge —
du kan stoppe etter steg 3 og allerede ha en live nettside (bestillinger
går da via e-post inntil du fullfører steg 4–7).

## 1. Legg koden på GitHub

1. Opprett en gratis konto på [github.com](https://github.com) hvis du ikke har
2. Opprett et nytt, **privat** repo (f.eks. `mobelkupp-nettside`)
3. Last opp hele mappen (alle filene i denne zip-en) til repoet
   - Enkleste måte uten kommandolinje: bruk "Add file → Upload files" på GitHub-siden og dra inn alt

## 2. Deploy på Vercel (gratis)

1. Opprett konto på [vercel.com](https://vercel.com) — logg inn med GitHub-kontoen din
2. Klikk **"Add New… → Project"**
3. Velg repoet du lastet opp
4. Vercel oppdager automatisk at det er en statisk side + `/api`-mappe. Trykk **Deploy**
5. Du får nå en gratis URL, f.eks. `mobelkupp-nettside.vercel.app` — nettsiden er live!

På dette tidspunktet fungerer alt **unntatt** ekte Vipps/kort-betaling —
"Fullfør bestilling" faller automatisk tilbake til å sende bestillingen
på e-post, så nettsiden er fullt brukelig allerede nå.

## 3. Sett riktig nettadresse

1. I Vercel-prosjektet: **Settings → Environment Variables**
2. Legg til `PUBLIC_SITE_URL` = din Vercel-URL (f.eks. `https://mobelkupp-nettside.vercel.app`), uten skråstrek på slutten
3. Trykk **Deployments → … → Redeploy** for at endringen skal tas i bruk

*(Når dere kjøper eget domene, f.eks. mobelkupp.no, kobler dere det til under Settings → Domains, og oppdaterer PUBLIC_SITE_URL til det.)*

## 4. Koble til Vipps (test-modus først)

1. Gå til [portal.vipps.no](https://portal.vipps.no) og logg inn med Møbelkupp/Concordes org.nr
2. Bestill avtalen **"Vipps Nettbetaling / ePayment"** for nettbutikk
3. Når avtalen er godkjent (vanligvis noen virkedager): gå inn i portalen og finn:
   - **Client ID**
   - **Client Secret**
   - **Ocp-Apim-Subscription-Key** (Subscription key)
   - **Merchant Serial Number** (MSN)
4. I Vercel → Settings → Environment Variables, legg inn:
   ```
   VIPPS_CLIENT_ID=...
   VIPPS_CLIENT_SECRET=...
   VIPPS_SUBSCRIPTION_KEY=...
   VIPPS_MERCHANT_SERIAL_NUMBER=...
   VIPPS_MODE=test
   ```
5. Redeploy
6. I Vipps-portalen, under nettbutikk-avtalen → **Callbacks**, legg inn:
   ```
   https://din-vercel-url.vercel.app/api/vipps-callback
   ```
7. Test: legg en vare i handlekurven på nettsiden, velg Vipps, fullfør — du sendes til Vipps' testmiljø. Vipps-portalen har test-brukere du kan bruke til å simulere betaling.

## 5. Koble til Stripe (kortbetaling)

1. Opprett konto på [dashboard.stripe.com](https://dashboard.stripe.com)
2. Fyll inn bedriftsinfo (Concorde Transport Service AS / Møbelkupp) under **Settings → Business details**
3. Gå til **Developers → API keys** — kopier **Secret key** (starter med `sk_test_...` i testmodus)
4. I Vercel, legg inn:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   ```
5. Redeploy
6. Test: legg en vare i handlekurven, velg Kort, fullfør — du sendes til en ekte Stripe Checkout-side. Bruk Stripes testkort `4242 4242 4242 4242`, hvilken som helst fremtidig dato og CVC.

### Stripe webhook (for automatisk ordrebekreftelse)
1. I Stripe dashboard: **Developers → Webhooks → Add endpoint**
2. URL: `https://din-vercel-url.vercel.app/api/stripe-webhook`
3. Velg event: `checkout.session.completed`
4. Kopier **Signing secret** (starter med `whsec_...`) inn i Vercel som:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Redeploy

## 6. E-postvarsel ved ny ordre (valgfritt, men anbefalt)

1. Opprett gratis konto på [resend.com](https://resend.com)
2. Verifiser domenet deres (mobelkupp.no) etter Resends instruksjoner (noen DNS-oppføringer)
3. Lag en API-nøkkel under **API Keys**
4. I Vercel, legg inn:
   ```
   RESEND_API_KEY=re_...
   NOTIFY_EMAIL=post@mobelkupp.no
   ```
5. Redeploy

Uten dette steget fungerer betalingen fortsatt fint — dere ser bare
ordrene i Vipps-/Stripe-dashbordet i stedet for i innboksen.

## 7. Gå fra test til ekte betaling (live)

Når dere har testet grundig og er klare til å ta imot ekte penger:

1. **Vipps**: sett `VIPPS_MODE=production` i Vercel, og bytt ut test-nøklene med
   produksjonsnøklene dere får i Vipps-portalen når avtalen er fullt godkjent
2. **Stripe**: aktiver kontoen for live-betalinger (Stripe ber om
   bedriftsdokumentasjon/bankkonto), og bytt `STRIPE_SECRET_KEY` til
   nøkkelen som starter med `sk_live_...`. Husk å opprette webhooken på
   nytt i live-modus også (egen `whsec_...`)
3. Redeploy
4. Gjør én ekte testbestilling med lite beløp for å bekrefte at alt fungerer

## Oppsummert rekkefølge
GitHub → Vercel → test Vipps → test Stripe → (valgfritt: e-postvarsel) → bytt til live-nøkler

Si ifra i chatten hvis noe av dette stopper opp — send gjerne en
skjermdump av feilmeldingen, så hjelper jeg deg videre steg for steg.

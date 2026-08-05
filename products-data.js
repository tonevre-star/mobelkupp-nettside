/* =====================================================
   MØBELKUPP — products-data.js
   Dette er den ENE plassen du trenger å redigere for å
   endre, legge til eller fjerne produkter. Alle sider
   (forside, produktoversikt, produktside, handlekurv)
   henter data herfra.

   Felt du kan endre fritt:
   - title, vendor, category, priceNow, priceWas,
     condition, stock, img, description, specs
   Ikke slett "id" på et produkt som allerede er i en
   handlekurv hos en kunde (localStorage husker id-en).
   ===================================================== */

const PRODUCTS = [
  // ---------- STUE ----------
  { id: "stue-1", title: "3-seter sofa fra IKEA, gråmelert", vendor: "IKEA", category: "stue", categoryLabel: "Stue", priceNow: 2990, priceWas: 8990, condition: "God stand", stock: 1, img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=900&auto=format&fit=crop", description: "Romslig 3-seter sofa i gråmelert stoff. Sittekomfortabel, godt vedlikeholdt og fri for flekker og lukt. Passer fint som hovedsofa i de fleste stuer.", specs: { "Mål (BxDxH)": "210 x 95 x 85 cm", "Materiale": "Polyesterstoff, tremme", "Farge": "Gråmelert" } },
  { id: "stue-2", title: "Rundt sofabord i mørk eik", vendor: "Bolia", category: "stue", categoryLabel: "Stue", priceNow: 990, priceWas: 2490, condition: "Utmerket stand", stock: 3, img: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=900&auto=format&fit=crop", description: "Elegant rundt sofabord i massiv mørk eik. Nesten som nytt, ingen synlige riper eller merker.", specs: { "Mål (ØxH)": "70 x 45 cm", "Materiale": "Massiv eik", "Farge": "Mørk eik" } },
  { id: "stue-3", title: "Lenestol i beige bouclé", vendor: "Hjellegjerde", category: "stue", categoryLabel: "Stue", priceNow: 1490, priceWas: 4200, condition: "Godt brukt", stock: 2, img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=900&auto=format&fit=crop", description: "Myk og koselig lenestol trukket i beige bouclé-stoff. Noe synlig bruk på armlenene, ellers i fin stand.", specs: { "Mål (BxDxH)": "80 x 85 x 90 cm", "Materiale": "Bouclé-stoff, tre", "Farge": "Beige" } },
  { id: "stue-4", title: "Hjørnesofa i mørk grå", vendor: "Skeidar", category: "stue", categoryLabel: "Stue", priceNow: 3990, priceWas: 12990, condition: "God stand", stock: 1, img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop", description: "Stor hjørnesofa som passer godt i familiestuer. God fjæring, ingen synlig slitasje på setene.", specs: { "Mål (BxDxH)": "280 x 170 x 80 cm", "Materiale": "Polyesterstoff", "Farge": "Mørk grå" } },
  { id: "stue-5", title: "Bokhylle i lys eik, 180 cm", vendor: "IKEA", category: "stue", categoryLabel: "Stue", priceNow: 690, priceWas: 1990, condition: "Utmerket stand", stock: 4, img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=900&auto=format&fit=crop", description: "Praktisk bokhylle med god lagringsplass. Som ny, ingen skader.", specs: { "Mål (BxDxH)": "80 x 30 x 180 cm", "Materiale": "Sponplate, eikefinér", "Farge": "Lys eik" } },
  { id: "stue-6", title: "Loungestol i sort skinn", vendor: "HAY", category: "stue", categoryLabel: "Stue", priceNow: 2200, priceWas: 6500, condition: "God stand", stock: 1, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=900&auto=format&fit=crop", description: "Design-loungestol i ekte skinn. Naturlig patina, ellers i god stand.", specs: { "Mål (BxDxH)": "75 x 80 x 95 cm", "Materiale": "Skinn, stål", "Farge": "Sort" } },

  // ---------- STUDENT ----------
  { id: "student-1", title: "Skrivebord, hvit, 120x60", vendor: "IKEA", category: "student", categoryLabel: "Studentpakker", priceNow: 490, priceWas: 1490, condition: "God stand", stock: 6, img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=900&auto=format&fit=crop", description: "Enkelt og solid skrivebord, perfekt for hybel eller studentbolig.", specs: { "Mål (BxDxH)": "120 x 60 x 73 cm", "Materiale": "Sponplate", "Farge": "Hvit" } },
  { id: "student-2", title: "Kontorstol, sort nett", vendor: "AJ Produkter", category: "student", categoryLabel: "Studentpakker", priceNow: 590, priceWas: 1990, condition: "Utmerket stand", stock: 8, img: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=900&auto=format&fit=crop", description: "God kontorstol med nettrygg for lange lesekvelder. Justerbar høyde.", specs: { "Mål (BxDxH)": "60 x 60 x 95-105 cm", "Materiale": "Nettstoff, plast", "Farge": "Sort" } },
  { id: "student-3", title: "Sengeramme 90x200 med madrass", vendor: "JYSK", category: "student", categoryLabel: "Studentpakker", priceNow: 890, priceWas: 2490, condition: "God stand", stock: 3, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop", description: "Komplett seng med ramme og madrass — bare å flytte inn.", specs: { "Mål": "90 x 200 cm", "Materiale": "Tre, skum", "Farge": "Lys eik" } },
  { id: "student-4", title: "Bokhylle, smal, 60 cm", vendor: "IKEA", category: "student", categoryLabel: "Studentpakker", priceNow: 349, priceWas: 890, condition: "Godt brukt", stock: 5, img: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=900&auto=format&fit=crop", description: "Smal og plassbesparende bokhylle, perfekt for en liten hybel.", specs: { "Mål (BxDxH)": "60 x 25 x 150 cm", "Materiale": "Sponplate", "Farge": "Hvit" } },
  { id: "student-5", title: "Skrivebordslampe, justerbar", vendor: "IKEA", category: "student", categoryLabel: "Studentpakker", priceNow: 149, priceWas: 399, condition: "Utmerket stand", stock: 10, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop", description: "Justerbar skrivebordslampe med god lysspredning.", specs: { "Mål (H)": "45 cm", "Materiale": "Metall", "Farge": "Sort" } },
  { id: "student-6", title: "Liten kommode, 3 skuffer", vendor: "IKEA", category: "student", categoryLabel: "Studentpakker", priceNow: 390, priceWas: 990, condition: "God stand", stock: 2, img: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=900&auto=format&fit=crop", description: "Kompakt kommode med tre skuffer, god plass til klær og småting.", specs: { "Mål (BxDxH)": "60 x 40 x 70 cm", "Materiale": "Sponplate", "Farge": "Hvit" } },

  // ---------- SOVEROM ----------
  { id: "soverom-1", title: "Sengegavl, stoff, 160 cm", vendor: "A-Møbler", category: "soverom", categoryLabel: "Soverom", priceNow: 790, priceWas: 2200, condition: "God stand", stock: 2, img: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=900&auto=format&fit=crop", description: "Stilren stoffgavl som løfter hele soverommet.", specs: { "Mål (BxH)": "160 x 120 cm", "Materiale": "Stoff, tre", "Farge": "Beige" } },
  { id: "soverom-2", title: "Dobbeltseng 160x200 i eik", vendor: "IKEA", category: "soverom", categoryLabel: "Soverom", priceNow: 1890, priceWas: 4990, condition: "Utmerket stand", stock: 1, img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=900&auto=format&fit=crop", description: "Solid dobbeltseng i eik, som ny.", specs: { "Mål": "160 x 200 cm", "Materiale": "Eik", "Farge": "Naturell" } },
  { id: "soverom-3", title: "Nattbord i lys eik, sett à 2", vendor: "IKEA", category: "soverom", categoryLabel: "Soverom", priceNow: 590, priceWas: 1490, condition: "God stand", stock: 3, img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=900&auto=format&fit=crop", description: "To like nattbord i lys eik med praktisk skuff.", specs: { "Mål (BxDxH)": "40 x 35 x 55 cm", "Materiale": "Eikefinér", "Farge": "Lys eik" } },
  { id: "soverom-4", title: "Klesskap, 3 dører, hvit", vendor: "JYSK", category: "soverom", categoryLabel: "Soverom", priceNow: 1290, priceWas: 3490, condition: "God stand", stock: 1, img: "https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=900&auto=format&fit=crop", description: "Romslig klesskap med god oppbevaringsplass.", specs: { "Mål (BxDxH)": "150 x 60 x 200 cm", "Materiale": "Sponplate", "Farge": "Hvit" } },
  { id: "soverom-5", title: "Speil, ovalt, gullramme", vendor: "Home&Cottage", category: "soverom", categoryLabel: "Soverom", priceNow: 390, priceWas: 990, condition: "Utmerket stand", stock: 2, img: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop", description: "Dekorativt ovalt speil med gullramme.", specs: { "Mål (BxH)": "60 x 90 cm", "Materiale": "Metall, glass", "Farge": "Gull" } },
  { id: "soverom-6", title: "Pledd og pyntepute-sett", vendor: "IKEA", category: "soverom", categoryLabel: "Soverom", priceNow: 249, priceWas: 590, condition: "Helt nytt", stock: 6, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=900&auto=format&fit=crop", description: "Koselig sett med pledd og to pynteputer, ubrukt.", specs: { "Materiale": "Bomull", "Farge": "Terrakotta" } },

  // ---------- KJØKKEN ----------
  { id: "kjokken-1", title: "Spisebord i eik, 6 personer", vendor: "IKEA", category: "kjokken", categoryLabel: "Kjøkken & spising", priceNow: 1590, priceWas: 4200, condition: "God stand", stock: 1, img: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?q=80&w=900&auto=format&fit=crop", description: "Solid spisebord med plass til hele familien.", specs: { "Mål (LxBxH)": "180 x 90 x 74 cm", "Materiale": "Eik", "Farge": "Naturell" } },
  { id: "kjokken-2", title: "Spisestoler, sett à 4, sort", vendor: "IKEA", category: "kjokken", categoryLabel: "Kjøkken & spising", priceNow: 990, priceWas: 2800, condition: "Utmerket stand", stock: 3, img: "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=900&auto=format&fit=crop", description: "Fire matchende spisestoler i sort. Som nye.", specs: { "Mål (H)": "85 cm", "Materiale": "Tre, stoff", "Farge": "Sort" } },
  { id: "kjokken-3", title: "Barkrakker, sett à 2", vendor: "JYSK", category: "kjokken", categoryLabel: "Kjøkken & spising", priceNow: 590, priceWas: 1490, condition: "God stand", stock: 2, img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=900&auto=format&fit=crop", description: "To stabile barkrakker, gode til kjøkkenøya.", specs: { "Mål (H)": "75 cm", "Materiale": "Metall, tre", "Farge": "Sort/eik" } },
  { id: "kjokken-4", title: "Kjøkkenøy på hjul", vendor: "IKEA", category: "kjokken", categoryLabel: "Kjøkken & spising", priceNow: 890, priceWas: 2200, condition: "God stand", stock: 1, img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=900&auto=format&fit=crop", description: "Praktisk kjøkkenøy med hjul og oppbevaring.", specs: { "Mål (BxDxH)": "90 x 50 x 90 cm", "Materiale": "Tre, rustfritt stål", "Farge": "Hvit" } },
  { id: "kjokken-5", title: "Skjenk i valnøtt", vendor: "Bolia", category: "kjokken", categoryLabel: "Kjøkken & spising", priceNow: 2490, priceWas: 6900, condition: "Utmerket stand", stock: 1, img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=900&auto=format&fit=crop", description: "Vakker skjenk i valnøtt med god lagringsplass.", specs: { "Mål (BxDxH)": "160 x 45 x 80 cm", "Materiale": "Valnøtt", "Farge": "Mørk brun" } },
  { id: "kjokken-6", title: "Servise-sett, 16 deler", vendor: "IKEA", category: "kjokken", categoryLabel: "Kjøkken & spising", priceNow: 290, priceWas: 690, condition: "Helt nytt", stock: 4, img: "https://images.unsplash.com/photo-1584346133934-a3afd2cd0d5e?q=80&w=900&auto=format&fit=crop", description: "Komplett servise for fire personer, ubrukt i original emballasje.", specs: { "Materiale": "Porselen", "Farge": "Hvit" } },

  // ---------- KONTOR ----------
  { id: "kontor-1", title: "Hev/senk-skrivebord, elektrisk", vendor: "AJ Produkter", category: "kontor", categoryLabel: "Hjemmekontor", priceNow: 1990, priceWas: 5990, condition: "God stand", stock: 2, img: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=900&auto=format&fit=crop", description: "Elektrisk hev/senk-bord, fungerer feilfritt.", specs: { "Mål (BxD)": "140 x 70 cm", "Materiale": "Metall, laminat", "Farge": "Hvit/eik" } },
  { id: "kontor-2", title: "Kontorstol med nakkestøtte", vendor: "HÅG", category: "kontor", categoryLabel: "Hjemmekontor", priceNow: 1490, priceWas: 3990, condition: "Utmerket stand", stock: 3, img: "https://images.unsplash.com/photo-1505797149-0c40679f8434?q=80&w=900&auto=format&fit=crop", description: "Ergonomisk kontorstol med nakkestøtte, godt vedlikeholdt.", specs: { "Mål (H)": "110-125 cm", "Materiale": "Stoff, metall", "Farge": "Sort" } },
  { id: "kontor-3", title: "PC-skjerm, 27 tommer", vendor: "LG", category: "kontor", categoryLabel: "Hjemmekontor", priceNow: 990, priceWas: 2490, condition: "God stand", stock: 5, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=900&auto=format&fit=crop", description: "Skarp 27-tommers skjerm, ingen døde piksler.", specs: { "Størrelse": "27 tommer", "Oppløsning": "1920x1080" } },
  { id: "kontor-4", title: "Skrivebordslampe med LED", vendor: "IKEA", category: "kontor", categoryLabel: "Hjemmekontor", priceNow: 190, priceWas: 450, condition: "Utmerket stand", stock: 6, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=900&auto=format&fit=crop", description: "Energieffektiv LED-lampe med justerbar arm.", specs: { "Materiale": "Metall", "Farge": "Sort" } },
  { id: "kontor-5", title: "Reol/skap til hjemmekontoret", vendor: "IKEA", category: "kontor", categoryLabel: "Hjemmekontor", priceNow: 690, priceWas: 1790, condition: "God stand", stock: 2, img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=900&auto=format&fit=crop", description: "Praktisk reol for permer og kontorrekvisita.", specs: { "Mål (BxDxH)": "80 x 30 x 180 cm", "Materiale": "Sponplate", "Farge": "Hvit" } },
  { id: "kontor-6", title: "Whiteboard, 90x60 cm", vendor: "AJ Produkter", category: "kontor", categoryLabel: "Hjemmekontor", priceNow: 250, priceWas: 690, condition: "God stand", stock: 4, img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=900&auto=format&fit=crop", description: "Whiteboard med aluminiumsramme, tørkes lett rent.", specs: { "Mål": "90 x 60 cm" } },
];

// ---------- HJELPEFUNKSJONER (brukes på alle sider) ----------
function formatKr(n) {
  return n.toLocaleString("nb-NO") + " kr";
}
function savePct(now, was) {
  return Math.round(100 - (now / was) * 100);
}
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}
function getProductsByCategory(category) {
  return category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;
}
const CATEGORY_LABELS = {
  stue: "Stue",
  soverom: "Soverom",
  kjokken: "Kjøkken & spising",
  kontor: "Hjemmekontor",
  student: "Studentpakker",
};

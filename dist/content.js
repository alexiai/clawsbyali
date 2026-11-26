const shop = {
  whatsapp: '40754552481',
  leiPerEuro: 5,
  shipping: { pickup: 11.5, address: 19.5 },
  tiers: [
    ['Culoare uni|Solid color', 80, 'lily'],
    ['Design simplu|Simple design', 100, 'peony'],
    ['Design intermediar|Intermediate design', 130, 'hibiscus'],
    ['Design complex|Complex design', 170, 'rose']
  ],
  photos: [
    ['strawberry','Unghii cu căpșuni|Strawberry nail art'],
    ['tiger','Unghii inspirate de tigru|Tiger-inspired nails'],
    ['forest','Unghii cu motive de pădure|Woodland-inspired nails'],
    ['portrait','Portret cu unghii pictate|Portrait with hand-painted nails'],
    ['violet','Unghii cu flori mov și pisică|Purple flowers and cat nail art'],
    ['gold','Unghii aurii cu trandafiri|Gold and rose nail art'],
    ['coffee','Detaliu floral lângă o ceașcă|Floral nail detail beside a cup'],
    ['lilac','Unghii lila cu accente aurii|Lilac nails with gold accents'],
    ['clock','Unghii cu motive vintage|Vintage clock nail art']
  ]
};

const sizingSteps = [
  'Lipește o bucată de bandă transparentă peste unghia naturală și preseaz-o pe toată curbura.|Press clear tape across the natural nail so it follows the curve.',
  'Marchează marginile unghiei în punctul cel mai lat.|Mark both edges at the widest point.',
  'Mută banda pe o suprafață plană și măsoară distanța dintre semne în milimetri.|Flatten the tape and measure the distance between the marks in millimetres.',
  'Repetă pentru toate degetele ambelor mâini. Dacă măsura cade între două valori, notează valoarea mai mare.|Repeat for every finger on both hands. If you are between measurements, round up.'
];

const faq = [
  ["Cum comand?|How do I place an order?", "Alege designul, forma și lungimea, introdu măsurătorile și trimite formularul. Se va deschide WhatsApp, unde confirmăm detaliile, disponibilitatea, livrarea și plata înainte de a începe lucrul.\n\nPoți comanda fără cont. Alege unghiile dorite și ne ocupăm noi de restul.", "Choose your favourite design, shape and length, enter your nail measurements and submit the order form. You'll be redirected to WhatsApp, where we'll confirm the details, availability, delivery and payment before your set is made.\n\nNo account needed. Just choose your nails and we'll take it from there."],
  ["Pot personaliza setul?|Can I customise my set?", "Sigur! Alege culorile, forma, lungimea, finisajele și detaliile care ți se potrivesc. Trimite-ne ideile sau fotografiile de inspirație pe WhatsApp și discutăm ce putem realiza.", "Absolutely! Your nails should feel like yours. Request custom colours, shapes, lengths, finishes or details. Send us your ideas or inspiration photos on WhatsApp, and we'll discuss what's possible before production."],
  ["Ce conține un set?|What comes in a set?", "Fiecare set lucrat manual include unghiile press-on, o pilă mini, un bețișor de lemn pentru cuticule și instrucțiuni de aplicare.\n\nPentru o fixare bună, recomandăm adezivul KISS. Poți adăuga un flacon la comandă pentru 20 lei. Ajunge pentru mai multe aplicări.", "Every handmade set includes your press-on nails, a mini nail file, a wooden cuticle stick and application instructions.\n\nFor the best hold, we recommend KISS nail glue. You can add a full-size bottle to your order for just 20 lei. One bottle lasts for multiple applications."],
  ["Cum îmi găsesc mărimea?|How do I find my size?", "Avem mărimile XS, S, M și L. Consultă ghidul de mărimi. Dacă ai dubii, scrie-ne pe WhatsApp și te ajutăm să alegi.", "We offer XS, S, M and L. Check our Size Guide to find your fit. Not sure? Message us on WhatsApp and we'll help you choose."],
  ["Cât rezistă?|How long do they last?", "Cu pregătirea și aplicarea corectă, unghiile press-on pot rezista peste o lună. Contează adezivul ales și îngrijirea.", "With proper nail preparation and application, your press-ons can last over a month. The right adhesive and a little care make all the difference."],
  ["Le pot refolosi?|Can I reuse them?", "Da! Dacă le îndepărtezi cu grijă și le depozitezi corect, poți purta setul preferat de mai multe ori. Reutilizarea depinde de starea unghiilor după fiecare purtare.", "Yes! That's one of the best things about press-ons. With gentle removal and proper storage, you can enjoy your favourite set more than once. Reusability depends on the condition of the nails after each wear."],
  ["Setul va arăta exact ca în fotografii?|Will my set look exactly like the pictures?", "Fiecare set este lucrat manual, așa că pot apărea mici variații de culoare, poziționare sau finisaj. Lumina și setările ecranului pot influența aspectul culorilor.", "Every set is made by hand, so tiny variations in colour, placement or finish are part of what makes each one unique. Screen settings and lighting may also affect how colours appear."],
  ["Unde livrați?|Where do you ship?", "Momentan livrăm în toată România. Sperăm să extindem livrarea în curând, așa că urmărește-ne pe rețelele sociale pentru noutăți.", "We currently ship throughout Romania. We're hoping to expand soon, so follow us on social media for updates."],
  ["Cât costă livrarea și cât durează?|How much is shipping and how long does it take?", "Realizarea durează de obicei 5–7 zile lucrătoare, iar livrarea încă aproximativ 1–3 zile lucrătoare. Costul depinde de destinație și de metoda aleasă. Confirmăm totalul și termenul estimat înainte de a accepta comanda.", "Production usually takes 5–7 business days, followed by approximately 1–3 business days for delivery. Shipping costs depend on your location and chosen delivery method. We'll confirm the total and estimated timeframe with you before accepting your order."],
  ["Cum plătesc?|How do I pay?", "După confirmarea modelului și a livrării, îți trimitem instrucțiunile de plată. Poți plăti prin transfer bancar sau prin altă metodă convenită. Începem să lucrăm la set după ce primim plata.", "Once we've confirmed your design and delivery details, we'll send you the payment instructions. Payment is made by bank transfer or another agreed method. Your set goes into production once payment is received."],
  ["Îmi pot urmări comanda?|Can I track my order?", "Da. Dacă metoda de livrare permite urmărirea, îți trimitem datele de urmărire imediat ce coletul pleacă spre tine.", "Yes, whenever tracking is available through the selected delivery service, we'll send you the tracking details as soon as your parcel is on its way."],
  ["Îmi pot returna comanda?|Can I return my order?", "Pentru comenzile online există, în general, drept de retragere timp de 14 zile de la primire. Anumite produse realizate la comandă sau clar personalizate pot fi exceptate în temeiul legii aplicabile. Pentru detalii, consultă politica de retururi și rambursări sau contactează-ne.", "Online purchases generally come with a 14-day right of withdrawal from the day you receive your order. Certain clearly personalised or custom-made items may be exempt under applicable law. For full details, please see our Returns & Refunds Policy or contact us."],
  ["Ce fac dacă e o problemă cu comanda?|What if something is wrong with my order?", "Dacă setul ajunge deteriorat sau ceva nu este în regulă, scrie-ne cât mai curând pe WhatsApp sau prin e-mail, cu detaliile comenzii și fotografii. Vom analiza situația și vom căuta o soluție în acord cu drepturile tale de consumator.", "Your satisfaction matters. If your order arrives damaged or something isn't right, message us as soon as possible on WhatsApp or email, with your order details and photos. We'll look into it and help find a solution in line with your consumer rights."],
  ["Ai o întrebare?|Have a question?", "Te ajutăm cu drag! Scrie-ne pe WhatsApp, trimite un e-mail la ilariailariaaa8@gmail.com sau caută-ne pe TikTok @clawsbyalix.", "We're happy to help! Reach us on WhatsApp, email us at ilariailariaaa8@gmail.com, or find us on TikTok @clawsbyalix."]
];

const shippingPolicy = [
  ['Destinații|Shipping destinations','Livrăm în România. Putem adăuga în viitor și livrare internațională.'],
  ['Confirmare și procesare|Order confirmation and processing','Completează cererea și trimite mesajul pregătit pe WhatsApp. Confirmăm designul, dimensiunile, personalizarea, disponibilitatea, termenul, transportul și plata. Acceptăm comanda după ce stabilim detaliile împreună. Începem lucrul după primirea plății, dacă nu convenim altfel.'],
  ['Timp de realizare|Production time','Realizarea durează aproximativ 5–7 zile lucrătoare. Complexitatea și volumul comenzilor pot schimba termenul. Îți comunicăm termenele înainte de confirmare.'],
  ['Metode de livrare|Shipping methods','În funcție de destinație și disponibilitate, poți alege un punct Cargus SHIP & GO sau livrarea prin curier la adresă.'],
  ['Cost de livrare|Shipping costs','Transportul se calculează separat. Confirmăm costul final și totalul de plată pe WhatsApp, înainte de plată.'],
  ['Timp de transport|Delivery time','Transportul durează estimativ 1–3 zile după expediere. Îți confirmăm termenul înainte de acceptarea comenzii. Dacă nu convenim expres alt termen, limita legală aplicabilă este de 30 de zile de la încheierea contractului.'],
  ['Urmărirea coletului|Order tracking','Îți trimitem detaliile de urmărire după expediere, dacă serviciul le oferă.'],
  ['Date de livrare incorecte|Incorrect delivery information','Verifică datele înainte de trimiterea cererii. Dacă ai făcut o greșeală, scrie-ne pe WhatsApp cât mai repede. După expediere, modificarea depinde de curier și poate fi imposibilă.'],
  ['Colete întârziate, pierdute sau deteriorate|Delayed, lost or damaged parcels','Contactează-ne pentru a verifica situația cu serviciul de curierat. Dacă ambalajul este vizibil deteriorat, fotografiază-l înainte de deschidere. Drepturile tale legale rămân aplicabile.'],
  ['Contact|Contact','Pentru întrebări despre livrare, scrie-ne pe WhatsApp sau la ilariailariaaa8@gmail.com.']
];
const shippingEnglish = [
  'We ship within Romania. International delivery may be available in the future.',
  'Fill out the request and send the prepared WhatsApp message. We confirm the design, measurements, customisation, availability, lead time, shipping and payment. We accept the order once we agree the details with you. Production starts after payment unless we agree otherwise.',
  'Production typically takes 5–7 business days. Design complexity and order volume can affect this estimate. We share the expected timeframe before confirmation.',
  'Depending on the destination and availability, choose a Cargus SHIP & GO location or courier delivery to your address.',
  'Shipping is calculated separately. We confirm the final delivery cost and total on WhatsApp before payment.',
  'Courier delivery takes an estimated 1–3 days after dispatch. We confirm the timing before accepting your order. Unless expressly agreed otherwise, the applicable legal delivery limit is 30 days from the conclusion of the contract.',
  'If your selected service offers tracking, we share the details after dispatch.',
  'Check your delivery details before submitting the request. Contact us promptly on WhatsApp if you spot an error. After dispatch, changes depend on the courier and may be unavailable.',
  'Contact us so we can investigate with the courier. If the parcel is visibly damaged, photograph it before opening. Your statutory consumer rights apply.',
  'For shipping questions, contact us on WhatsApp or email ilariailariaaa8@gmail.com.'
];



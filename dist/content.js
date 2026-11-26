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
  ['Comenzi|Ordering', [
    ['Cum plasez o comandă?|How can I place an order?', 'Alege categoria, forma și lungimea, apoi introdu dimensiunile și completează datele din coș. Trimite mesajul pregătit în WhatsApp. Confirmăm împreună modelul, disponibilitatea, termenul, transportul și plata. Comanda devine fermă după confirmarea noastră.'],
    ['Am nevoie de cont?|Do I need to create an account?', 'Poți naviga și trimite o cerere fără cont.'],
    ['Pot personaliza unghiile?|Can I customise my press-on nails?', 'Da. Poți alege culorile, forma, lungimea, finisajul și detaliile. Descrie ideea în formular sau discutăm pe WhatsApp. Confirmăm designul înainte de lucru.'],
    ['Pot modifica cererea?|Can I change my order after submitting the form?', 'Putem discuta modificările pe WhatsApp înainte de confirmare. După începerea lucrului, unele schimbări pot fi imposibile.']
  ]],
  ['Produse și mărimi|Products & Sizing', [
    ['Ce conține comanda?|What is included in my order?', 'Setul handmade vine cu o pilă mini, un bețișor de lemn pentru cuticule și instrucțiuni de aplicare. Adezivul și benzile adezive nu sunt incluse. Adezivele mini din comerț nu oferă fixarea pe care o caut, așa că recomand KISS. Îl poți cumpăra separat sau îl pot adăuga la comandă pentru 20 lei. Flaconul ajunge pentru mai multe aplicări.'],
    ['Cum aleg mărimea?|How do I choose the correct nail size?', 'Avem mărimile XS, S, M și L. Consultă ghidul de mărimi și scrie-ne pe WhatsApp dacă ai nevoie de ajutor.'],
    ['Includeți lipici?|Do you include nail glue?', 'Poți adăuga un flacon de adeziv KISS la comandă pentru 20 lei. Urmează instrucțiunile producătorului la aplicare.'],
    ['Cât rezistă unghiile press-on?|How long do press-on nails last?', 'Cu o pregătire și o aplicare corectă, pot rezista peste o lună. Durata depinde de tehnica de aplicare, adeziv și activitățile zilnice. Urmează instrucțiunile de aplicare din set.'],
    ['Pot refolosi setul?|Can I reuse my press-on nails?', 'De cele mai multe ori, da. Acesta e unul dintre avantajele unghiilor press-on, dar depinde de cum le aplici, le îndepărtezi și le depozitezi. Îndepărtează-le cu grijă și verifică starea fiecărei unghii.'],
    ['Seturile arată exact ca în poze?|Are all sets exactly the same as the pictures?', 'Fiecare set este lucrat manual, așa că pot exista mici diferențe de culoare, poziționare sau finisaj. Lumina și ecranul pot schimba aspectul culorilor.']
  ]],
  ['Livrare și plată|Shipping & Payment', [
    ['Unde livrați?|Where do you ship?', 'Livrăm în România. Urmărește-ne pe social media pentru eventuale opțiuni internaționale.'],
    ['Cât costă transportul?|How much does shipping cost?', 'Costul depinde de destinație și metoda de livrare. Îl confirmăm pe WhatsApp înainte de acceptarea comenzii.'],
    ['Cât durează livrarea?|How long does delivery take?', 'Estimarea este de 5–7 zile lucrătoare pentru realizare, apoi 1–3 zile pentru transport. Confirmăm termenele înainte să accepți comanda.'],
    ['Cum plătesc?|How do I pay?', 'Primești instrucțiunile după ce confirmăm setul și livrarea. Plata se face prin transfer bancar sau prin metoda convenită. Începem lucrul după primirea plății, dacă nu stabilim altfel.'],
    ['Pot urmări coletul?|Can I track my order?', 'Îți trimitem numărul sau linkul de urmărire după expediere, când serviciul ales îl oferă.']
  ]],
  ['Retururi și asistență|Returns & Customer Support', [
    ['Pot returna comanda?|Can I return my order?', 'Pentru cumpărăturile online există în general un termen de retragere de 14 zile de la primire. Produsele realizate după specificațiile clientului sau personalizate clar pot fi exceptate. Contactează-ne pentru detalii despre cazul tău.'],
    ['Ce fac dacă produsul e deteriorat sau greșit?|What if my order arrives damaged or incorrect?', 'Scrie-ne cât mai repede pe WhatsApp sau prin e-mail. Include detaliile comenzii și fotografii, dacă sunt relevante. Rezolvăm situația în conformitate cu drepturile tale de consumator.'],
    ['Cum vă contactez?|How can I contact you?', 'Ne găsești pe WhatsApp, la ilariailariaaa8@gmail.com sau pe TikTok @clawsbyalix.']
  ]]
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
const faqEnglish = [
  [
    'Choose a design tier, shape and length, enter your measurements, then complete the checkout details. Send the prepared WhatsApp message so we can confirm the design, availability, timings, shipping and payment. Your order is confirmed once we agree the details with you.',
    'You can browse and submit an order request without creating an account.',
    'Yes. Request custom colours, shapes, lengths, finishes or details. Describe your idea in the form or get in touch on WhatsApp. We confirm the design before production.',
    'We can discuss changes on WhatsApp before confirmation. Some changes may be unavailable once production starts.'
  ], [
    'Each handmade set comes with a mini nail file, wooden cuticle stick and application instructions. The set comes without glue or adhesive tabs. I find the mini nail glues sold in stores less reliable, so I recommend KISS. You can buy it yourself or add it to your order for 20 lei. One full-size bottle lasts for multiple applications.',
    'We offer XS, S, M and L. Consult the Size Guide and contact us on WhatsApp if you need help.',
    'You can add a full-size bottle of KISS nail glue to your order for 20 lei. Follow the manufacturer’s instructions for application.',
    'With proper preparation and application, they can last over a month. Wear time depends on technique, adhesive and day-to-day activity. Follow the application instructions included in the set.',
    'Mostly yes, that’s why press-on nails are such a great option, but it depends on how they were applied, removed and stored. Remove the nails gently and check the condition of each one before reuse.',
    'Each set is handmade, so small variations in colour, placement and finish are possible. Colours can also vary with your screen and lighting.'
  ], [
    'We currently ship within Romania. Follow us on social media for future shipping updates.',
    'The cost depends on the destination and delivery method. We confirm it on WhatsApp before accepting the order.',
    'Allow about 5–7 business days for production plus 1–3 days for courier delivery. We confirm estimates before you accept the order.',
    'We send payment instructions once your order and delivery details are confirmed. Pay by bank transfer or another agreed method. Production starts when payment arrives unless otherwise agreed.',
    'When the chosen delivery service offers tracking, we share the details after dispatch.'
  ], [
    'Online purchases generally have a 14-day withdrawal period starting on receipt. Goods made to the customer’s specifications or clearly personalised may be exempt. Contact us for details about your order.',
    'Get in touch as soon as possible by WhatsApp or email. Include your order details and relevant photos. We will help resolve the issue in line with your consumer rights.',
    'Find us on WhatsApp, by email at ilariailariaaa8@gmail.com, or on TikTok @clawsbyalix.'
  ]
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



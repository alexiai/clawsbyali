(function () {
const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const t = (value) => value.split('|')[language === 'en' ? 1 : 0] ?? value;
const el = (tag, content) => {
  const node = document.createElement(tag);
  if (content !== undefined) node.textContent = content;
  return node;
};
const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let language = localStorage.getItem('claws-language') === 'ro' ? 'ro' : 'en';
let currency = localStorage.getItem('claws-currency') === 'EUR' ? 'EUR' : 'RON';
const items = [];
const drafts = new Map();
let delivery = { method: 'pickup' };
let carouselPosition = 2;
let statusTimer;
let preferredSizing = 'measure';
const nav = [['home','Acasă|Home'],['custom','Seturi la comandă|Custom sets'],['nails','Seturi gata făcute|Nail sets'],['sizing','Ghid de mărimi|Sizing'],['faq','Întrebări frecvente|FAQ'],['shipping','Livrare|Shipping'],['contact','Contact']];
const homeSections = new Set(['home', 'custom', 'nails', 'home-links', 'contact']);
const glueCost = 20;
const urlFor = (id) => id === 'home' ? './' : '?page=' + id;
const fingers = ['Police|Thumb','Arătător|Index','Mijlociu|Middle','Inelar|Ring','Mic|Pinky'];
const sides = ['Mâna stângă|Left hand','Mâna dreaptă|Right hand'];
const shapes = ['Migdală|Almond','Pătrat|Square','Stiletto','Coffin','Oval'];
const lengths = ['Scurtă|Short','Medie|Medium','Lungă|Long'];
const dialog = $('#dialog');
const dialogBody = $('#dialog-body');

const price = (lei) => new Intl.NumberFormat(language === 'ro' ? 'ro-RO' : 'en-IE', {style:'currency',currency}).format(currency === 'EUR' ? lei / shop.leiPerEuro : lei);
function status(message) {
  $('#status').textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { $('#status').textContent = ''; }, 3300);
}
function setMenu(open) {
  $('#menu-panel').hidden = !open;
  $('#menu-shade').hidden = !open;
  $('#menu').setAttribute('aria-expanded', open);
  $('#menu').setAttribute('aria-label', open ? t('Închide meniul|Close menu') : t('Meniu|Menu'));
}
function currentPage() {
  const requested = new URLSearchParams(location.search).get('page') || location.hash.slice(1);
  if (requested === 'product' && productIndex() >= 0) return 'product';
  return nav.some(([id]) => id === requested) ? requested : 'home';
}
function productIndex() {
  const key = new URLSearchParams(location.search).get('set');
  return shop.tiers.findIndex(tier => tier[2] === key);
}
function updateNav() {
  const page = currentPage();
  document.body.dataset.page = page;
  document.title = page === 'product' ? t(shop.tiers[productIndex()][0]) + ' — Claws by Ali' : page === 'home' ? 'Claws by Ali — Press-on nails' : t(nav.find(([id]) => id === page)[1]) + ' — Claws by Ali';
  all('main > [id]').forEach(section => {
    section.hidden = page === 'home' ? !homeSections.has(section.id) : section.id !== page;
  });
  if (page === 'product') configure(productIndex());
  else $('#product').replaceChildren();
  const shippingDetails = $('#shipping details');
  if (page === 'shipping') shippingDetails.open = true;
  all('#nav a, #desktop-nav a').forEach(link => {
    if (link.dataset.page === page || (page === 'product' && link.dataset.page === 'custom')) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
function navigate(id) {
  if (currentPage() !== id || location.hash) history.pushState(null, '', urlFor(id));
  setMenu(false);
  $('.desktop-preferences').open = false;
  updateNav();
  window.scrollTo({top: 0, behavior: 'instant'});
}
function accordion(question, answer) {
  const node = el('details');
  node.append(el('summary', question), el('p', answer));
  return node;
}
function renderContent() {
  document.documentElement.lang = language;
  all('[data-copy]').forEach(node => { node.textContent = t(node.dataset.copy); });
  all('[data-lang]').forEach(node => node.setAttribute('aria-pressed', node.dataset.lang === language));
  all('[data-currency]').forEach(node => node.setAttribute('aria-pressed', node.dataset.currency === currency));
  all('[data-label]').forEach(node => node.setAttribute('aria-label', t(node.dataset.label)));
  $('#locale-summary').textContent = currency + ' / ' + language.toUpperCase();
  $('#menu').setAttribute('aria-label', $('#menu-panel').hidden ? t('Meniu|Menu') : t('Închide meniul|Close menu'));
  $('#close').setAttribute('aria-label', t('Închide|Close'));
  for (const selector of ['#nav', '#desktop-nav']) $(selector).replaceChildren(...nav.map(([id, name]) => {
    const link = el('a',t(name));
    link.href = urlFor(id);
    link.dataset.page = id;
    return link;
  }));
  updateNav();
  drawCarousel();
  $('#tiers').replaceChildren(...shop.tiers.map(([name, cost, flower]) => {
    const button = el('a');
    button.className = 'tier';
    button.href = '?page=product&set=' + flower;
    button.innerHTML = '<span class="tier-art"><img loading="lazy" src="assets/' + flower + '.jpg" alt=""><strong>' + t(name) + '</strong></span><span class="tier-price">' + price(cost) + '</span>';
    button.onclick = event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState(null, '', button.href);
      updateNav();
      window.scrollTo({top: 0, behavior: 'instant'});
      $('#product-title').focus({preventScroll:true});
    };
    return button;
  }));
  $('#kit').textContent = t('Alege sizing kit |Choose sizing kit ') + '· ' + price(10);
  $('#size-steps').replaceChildren(...sizingSteps.map(step => el('li', t(step))));
  const sizeRows = [['XS',14,11,12,10,8],['S',15,12,13,11,8],['M',16,12,13,11,9],['L',18,13,14,12,10]];
  $('#size-table').innerHTML = '<p>' + t('Valorile în mm sunt orientative. Pentru un set la comandă, notează lățimea exactă pentru fiecare unghie.|Widths in mm are a reference. For a custom set, provide the actual width of each nail.') + '</p><div class="table-scroll"><table><thead><tr><th>' + t('Mărime|Size') + '</th>' + fingers.map(finger => '<th scope="col">' + t(finger) + '</th>').join('') + '</tr></thead><tbody>' + sizeRows.map(row => '<tr><th scope="row">' + row[0] + '</th>' + row.slice(1).map(value => '<td>' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const faqLinks = {
    'Size Guide': '?page=sizing',
    'ghidul de mărimi': '?page=sizing',
    'WhatsApp': 'https://wa.me/' + shop.whatsapp,
    'ilariailariaaa8@gmail.com': 'mailto:ilariailariaaa8@gmail.com',
    '@clawsbyalix': 'https://www.tiktok.com/@clawsbyalix'
  };
  $('#questions').replaceChildren(...faq.map(([question, ro, en]) => {
    const entry = accordion(t(question), '');
    const answer = entry.querySelector('p');
    const parts = (language === 'ro' ? ro : en).split(/(Size Guide|ghidul de mărimi|WhatsApp|ilariailariaaa8@gmail\.com|@clawsbyalix)/);
    parts.forEach(part => {
      if (!Object.hasOwn(faqLinks, part)) {
        answer.append(part);
        return;
      }
      const link = el('a', part);
      link.href = faqLinks[part];
      link.className = 'text-link';
      if (link.href === new URL('?page=sizing', location.href).href) link.dataset.page = 'sizing';
      answer.append(link);
    });
    return entry;
  }));
  const lastUpdated = new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {dateStyle:'long',timeZone:'UTC'}).format(new Date('2026-11-26'));
  $('#policy').replaceChildren(el('p', t('Actualizată la |Last updated ') + lastUpdated), ...shippingPolicy.flatMap(([title, body], index) => [el('h3', (index + 1) + '. ' + t(title)), el('p', language === 'en' ? shippingEnglish[index] : body)]));
}
function showDialog(title, markup, mode = '') {
  dialog.className = mode;
  $('#dialog-title').textContent = title;
  dialogBody.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
function optionButtons(name, label, options, selected) {
  return '<fieldset class="product-choices"><legend>' + t(label) + '</legend><div>' + options.map(([value, text]) =>
    '<label><input type="radio" name="' + name + '" value="' + value + '" required' +
    (String(value) === selected ? ' checked' : '') + '><span>' + t(text) + '</span></label>'
  ).join('') + '</div></fieldset>';
}
function hand(side, draft) {
  return '<fieldset><legend>' + t(sides[side]) + '</legend><svg class="hand" viewBox="0 0 120 106" aria-hidden="true"><path ' + (side ? 'transform="translate(120) scale(-1 1)" ' : '') + 'd="M38 103 Q36 87 23 76 L9 57 Q5 49 10 46 Q15 43 22 49 L31 59 L26 25 Q25 18 31 17 Q37 16 39 23 L44 45 L43 10 Q43 3 49 3 Q55 3 56 10 L59 43 L64 8 Q65 2 71 3 Q77 4 76 11 L73 46 L82 18 Q84 12 90 14 Q95 16 94 23 L88 54 L89 70 Q95 88 81 96 L81 103 Z"/></svg><div class="finger-grid">' + fingers.map((finger, index) => {
    const key = 'finger-' + side + '-' + index;
    return '<label>' + t(finger) + '<input aria-label="' + t(sides[side]) + ' · ' + t(finger) + ' (mm)" name="' + key + '" type="number" inputmode="decimal" min="1" max="40" step="any" required value="' + escape(draft[key] || '') + '" placeholder="mm"></label>';
  }).join('') + '</div></fieldset>';
}
function configure(index) {
  const kit = index === -1;
  const [name, cost] = kit ? ['Sizing kit',10] : shop.tiers[index];
  const draft = drafts.get(index) || {};
  const sizing = draft.sizing || preferredSizing;
  const sizingChoice = optionButtons('sizing', 'Metoda de măsurare|Sizing method', [
    ['measure', 'Introduc măsurătorile mele|Enter my measurements'],
    ['kit', t('Comand un sizing kit|Order a sizing kit') + ' · +' + price(10)]
  ], sizing);
  const variants = optionButtons('shape', 'Formă|Shape', shapes.map((value, i) => [i,value]), draft.shape) +
    optionButtons('length', 'Lungime|Length', lengths.map((value, i) => [i,value]), draft.length);
  const glueChoice = '<label class="add-on"><input type="checkbox" name="glue"' + (draft.glue ? ' checked' : '') + '>' + t('Adaugă adeziv KISS|Add KISS nail glue') + ' · ' + price(glueCost) + '</label>';
  const markup = '<form id="configure">' + variants + (kit ? '' :
    '<label>' + t('Descrie designul dorit|Describe your design') + '<textarea name="description" rows="3" maxlength="700" required placeholder="' + t('Culori, finisaj, detalii sau idei…|Colours, finish, details or ideas…') + '">' + escape(draft.description || '') + '</textarea></label><p class="notice">' + t('Dacă încă nu ai un model exact, alege categoria cea mai apropiată și scrie-ne ce ți-ar plăcea. Putem discuta și pe|If you are still exploring, choose the closest tier and tell us what you like. You can also reach out on') + ' <a class="text-link" href="https://www.tiktok.com/@clawsbyalix" target="_blank" rel="noopener">TikTok</a>.</p><label>' + t('Fotografii de referință (opțional)|Reference photos (optional)') + '<input type="file" accept="image/*" multiple id="refs"></label><p id="file-list" class="notice"></p><p class="notice">' + t('Pozele selectate se păstrează în această sesiune. Le vei atașa în conversația WhatsApp.|Selected photos stay in this session. Attach them in your WhatsApp conversation.') + '</p>' + sizingChoice + '<div id="measurement-fields"><div class="inline"><strong>' + t('Lățimea fiecărei unghii în mm|Width of each nail in mm') + '</strong><a class="text-link" href="?page=sizing" data-page="sizing" id="open-guide">' + t('Ai nevoie de ajutor cu măsurătorile?|Need help with sizing?') + '</a></div><div class="hands">' + hand(0,draft) + hand(1,draft) + '</div></div><p class="notice" id="kit-note" hidden>' + t('Îți trimitem întâi kitul în forma și lungimea alese. Ne comunici mărimile pe WhatsApp înainte să realizăm setul.|We’ll send the kit in your chosen shape and length first. Share your sizes on WhatsApp before we make the set.') + '</p>' + glueChoice) + '<button class="action" type="submit">' + t('Adaugă în coș|Add to bag') + ' ↗</button></form>';
  if (kit) {
    showDialog(t(name) + ' · ' + price(cost), markup);
  } else {
    const flower = shop.tiers[index][2];
    $('#product').innerHTML = '<a class="text-link product-back" href="?page=custom" data-page="custom">← ' + t('Seturi la comandă|Custom sets') + '</a>' +
      '<div class="product-layout"><img class="product-image" src="assets/' + flower + '.jpg" alt=""><article>' +
      '<h1 tabindex="-1" id="product-title">' + t(name) + '</h1><p class="product-price">' + price(cost) + '</p>' +
      '<p class="product-description">' + t('Un set lucrat manual cu 10 unghii press-on, creat după ideea ta. Include o pilă mini, un bețișor pentru cuticule și instrucțiuni de aplicare. Confirmăm detaliile pe WhatsApp.|Ten handmade press-on nails designed around your idea, with a mini nail file, cuticle stick and application instructions. We confirm the details on WhatsApp.') + '</p>' + markup + '</article></div>';
  }
  const form = (kit ? dialogBody : $('#product')).querySelector('#configure');
  let files = draft.files || [];
  const saveDraft = () => drafts.set(index, {...Object.fromEntries(new FormData(form)), ...(kit ? {} : Object.fromEntries([...form.querySelectorAll('#measurement-fields input')].map(input => [input.name, input.value]))), files});
  form.addEventListener('input', saveDraft);
  if (!kit) {
    const measurementFields = $('#measurement-fields');
    const updateSizing = () => {
      const wantsKit = form.elements.sizing.value === 'kit';
      measurementFields.hidden = wantsKit;
      $('#kit-note').hidden = !wantsKit;
      measurementFields.querySelectorAll('input').forEach(input => { input.disabled = wantsKit; });
    };
    form.querySelectorAll('[name=sizing]').forEach(input => input.addEventListener('change', updateSizing));
    updateSizing();
    const list = () => { $('#file-list').textContent = files.map(file => file.name).join(', '); };
    list();
    $('#refs').onchange = event => {
      files = [...event.target.files].filter(file => file.type.startsWith('image/'));
      list();
      saveDraft();
    };
    $('#open-guide').onclick = saveDraft;
  }
  form.onsubmit = (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    if (!kit && !fields.description.trim()) {
      const description = form.elements.description;
      description.value = '';
      description.reportValidity();
      return;
    }
    items.push({index, name, cost, fields, files});
    drafts.delete(index);
    updateCount();
    if (kit) dialog.close();
    else configure(index);
    checkout();
    status(t('Adăugat în coș|Added to your bag'));
  };
}
function updateCount() {
  $('#count').textContent = items.length;
}
function itemVariant(item) {
  const parts = [t(shapes[item.fields.shape]), t(lengths[item.fields.length])];
  if (item.fields.sizing === 'kit') parts.push('Sizing kit (+' + price(10) + ')');
  if (item.fields.glue) parts.push(t('Adeziv KISS|KISS nail glue') + ' (+' + price(glueCost) + ')');
  return parts.join(' · ');
}
function orderMessage() {
  const lines = [t('Bună! Aș vrea să trimit o cerere pentru Claws by Ali.|Hi! I would like to send an order request to Claws by Ali.'), ''];
  items.forEach((item, index) => {
    lines.push((index + 1) + '. ' + t(item.name) + ' · ' + price(item.cost) + ' · ' + itemVariant(item));
    if (item.index !== -1) {
      lines.push(item.fields.description.trim());
      if (item.fields.sizing === 'kit') lines.push(t('Trimite kitul întâi. Mărimile vor fi comunicate pe WhatsApp.|Send the sizing kit first. Measurements will follow on WhatsApp.'));
      else sides.forEach((side, sideIndex) => lines.push(t(side) + ': ' + fingers.map((finger, fingerIndex) => t(finger) + ' ' + item.fields['finger-' + sideIndex + '-' + fingerIndex] + ' mm').join(', ')));
      if (item.files.length) lines.push(t('Fotografii de atașat: |Photos to attach: ') + item.files.map(file => file.name).join(', '));
    }
    lines.push('');
  });
  lines.push(t('Telefon: |Phone: ') + delivery.phone, t('Adresă: |Address: ') + delivery.address, t('Localitate și județ: |City and county: ') + delivery.city, t('Metoda de livrare: |Delivery method: ') + methodName(delivery.method));
  if (delivery.method === 'pickup') lines.push('SHIP & GO: ' + delivery.pickup);
  lines.push(t('Transport estimat: |Estimated shipping: ') + price(shop.shipping[delivery.method]), t('Total estimat: |Estimated total: ') + price(subtotal() + shop.shipping[delivery.method]));
  if (currency === 'EUR') lines.push(t('Prețuri orientative în EUR. Total estimat în lei: |Indicative EUR prices. Estimated total in RON: ') + (subtotal() + shop.shipping[delivery.method]));
  return lines.join('\n');
}
const subtotal = () => items.reduce((sum,item) => sum + item.cost + (item.fields.glue ? glueCost : 0) + (item.fields.sizing === 'kit' ? 10 : 0), 0);
const methodName = (method) => method === 'pickup' ? 'Cargus SHIP & GO' : t('Cargus la adresă|Cargus to your address');
function checkout() {
  const title = t('Coșul tău|Your cart');
  if (!items.length) {
    showDialog(title, '<div class="empty-cart"><h3>' + t('Coșul tău este gol|Your cart is empty') + '</h3><a class="action" href="?page=custom" data-page="custom" id="browse">' + t('Continuă cumpărăturile|Continue shopping') + '</a></div>', 'empty-cart-drawer');
    $('#browse').onclick = () => dialog.close();
    return;
  }
  const field = (name, label, type, autocomplete) => '<label>' + t(label) + '<input maxlength="160" required type="' + type + '" name="' + name + '" autocomplete="' + autocomplete + '" value="' + escape(delivery[name] || '') + '"></label>';
  showDialog(title, items.map((item, index) => '<div class="line-item"><div><strong>' + t(item.name) + ' · ' + price(item.cost) + '</strong><small>' + itemVariant(item) + '</small></div><button type="button" class="text-link" data-remove="' + index + '">' + t('Elimină|Remove') + '</button></div>').join('') + '<form id="checkout"><dl class="totals"><div><dt>' + t('Subtotal|Subtotal') + '</dt><dd>' + price(subtotal()) + '</dd></div><div><dt>' + t('Transport estimat|Estimated shipping') + '</dt><dd id="shipping-price"></dd></div><div><dt><strong>' + t('Total estimat|Estimated total') + '</strong></dt><dd id="total"></dd></div></dl><p class="notice">' + t('Costul final se confirmă pe WhatsApp. Realizare în 5–7 zile lucrătoare, apoi 1–3 zile pentru transport.|Final cost is confirmed on WhatsApp. Allow 5–7 business days for production and 1–3 days for shipping.') + (currency === 'EUR' ? ' ' + t('Prețurile în EUR sunt orientative (5 lei/€).|EUR prices are indicative (5 RON/€).') : '') + '</p><label>' + t('Metodă de livrare|Delivery method') + '<select name="method"><option value="pickup">' + methodName('pickup') + '</option><option value="address">' + methodName('address') + '</option></select></label>' + field('city','Localitate și județ|City and county','text','address-level2') + field('address','Adresă completă|Full address','text','street-address') + '<div id="pickup-field">' + field('pickup','Punct SHIP & GO preferat|Preferred SHIP & GO location','text','off') + '</div>' + field('phone','Telefon|Phone number','tel','tel') + '<button class="action" type="submit">' + (shop.whatsapp ? t('Deschide WhatsApp|Open WhatsApp') : t('Pregătește cererea|Prepare request')) + ' ↗</button><div id="request-output"></div></form>', 'cart-drawer');
  const form = $('#checkout');
  form.elements.method.value = delivery.method;
  function updateDelivery() {
    const method = form.elements.method.value;
    const pickup = method === 'pickup';
    $('#pickup-field').hidden = !pickup;
    form.elements.pickup.required = pickup;
    $('#shipping-price').textContent = price(shop.shipping[method]);
    $('#total').textContent = price(subtotal() + shop.shipping[method]);
  }
  updateDelivery();
  const readDelivery = () => { delivery = Object.fromEntries(new FormData(form)); };
  form.addEventListener('input', () => { readDelivery(); updateDelivery(); $('#request-output').replaceChildren(); });
  all('[data-remove]').forEach(button => {
    button.onclick = () => {
      readDelivery();
      items.splice(Number(button.dataset.remove), 1);
      updateCount();
      checkout();
    };
  });
  form.onsubmit = (event) => {
    event.preventDefault();
    readDelivery();
    const message = orderMessage();
    const photos = items.flatMap(item => item.files);
    const whatsappUrl = shop.whatsapp && ('https://wa.me/' + shop.whatsapp + '?text=' + encodeURIComponent(message));
    if (whatsappUrl) window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    const output = $('#request-output');
    output.replaceChildren(el('p', shop.whatsapp ? t('Trimite mesajul în conversație și atașează acolo fotografiile alese.|Send the message in the chat and attach your selected photos there.') : t('Numărul de WhatsApp al atelierului nu este configurat. Poți copia cererea sau o poți deschide în aplicația de e-mail.|The studio’s WhatsApp number has not been configured. You can copy the request or open it in your email app.')));
    const preview = el('textarea');
    preview.value = message;
    preview.readOnly = true;
    preview.rows = 6;
    preview.setAttribute('aria-label', t('Mesajul comenzii|Order message'));
    const copy = el('button', t('Copiază mesajul|Copy message'));
    copy.type = 'button';
    copy.className = 'text-link';
    copy.onclick = async () => {
      preview.select();
      try {
        await navigator.clipboard.writeText(message);
        status(t('Mesaj copiat|Message copied'));
      } catch {
        status(t('Text selectat pentru copiere|Text selected for copying'));
      }
    };
    const email = el('a', t('Deschide e-mailul|Open email'));
    email.href = 'mailto:ilariailariaaa8@gmail.com?subject=' + encodeURIComponent('Claws by Ali') + '&body=' + encodeURIComponent(message);
    email.className = 'text-link';
    const actions = el('div');
    actions.className = 'inline';
    if (whatsappUrl) {
      const whatsapp = el('a', t('Deschide WhatsApp|Open WhatsApp'));
      whatsapp.href = whatsappUrl;
      whatsapp.target = '_blank';
      whatsapp.rel = 'noopener noreferrer';
      whatsapp.className = 'text-link';
      actions.append(whatsapp);
    }
    actions.append(copy,email);
    output.append(preview,actions);
    if (photos.length) output.append(el('p', t('De atașat: |To attach: ') + photos.map(file => file.name).join(', ')));
  };
}
$('#menu').onclick = () => {
  const open = $('#menu-panel').hidden;
  setMenu(open);
  if (open) $('#nav a').focus();
};
$('#menu-shade').onclick = () => { setMenu(false); $('#menu').focus(); };
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-page]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(link.dataset.page);
});
$('#bag').onclick = checkout;
$('#kit').onclick = () => configure(-1);
dialog.addEventListener('close', () => { if (!dialog.open) dialogBody.replaceChildren(); });
$('#close').onclick = () => dialog.close();
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
$('#kit-sizing').onclick = () => { preferredSizing = 'kit'; };
const carousel = $('.editorial');
const ring = $('.carousel-ring');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const slots = [-1, 0, 1].map(offset => {
  const card = el('figure');
  card.className = 'photo photo-slot';
  const layers = [el('img'), el('img')];
  const photoWindow = el('div');
  photoWindow.className = 'slot-window';
  layers.forEach(image => { image.alt = ''; photoWindow.append(image); });
  card.append(photoWindow);
  return {offset, card, layers};
});
ring.replaceChildren(...slots.map(slot => slot.card));
let frame;
let drag;
function drawCarousel() {
  const count = shop.photos.length;
  const indexFor = step => ((step % count) + count) % count;
  const base = Math.floor(carouselPosition);
  const progress = carouselPosition - base;
  const active = indexFor(Math.round(carouselPosition));
  slots.forEach(({offset, card, layers}) => {
    const from = base + offset;
    layers.forEach((image, layer) => {
      const file = 'assets/' + shop.photos[indexFor(from + layer)][0] + '.jpg';
      if (image.getAttribute('src') !== file) image.src = file;
      image.style.setProperty('--shift', ((layer - progress) * 38).toFixed(2) + '%');
      image.style.setProperty('--turn', ((layer - progress) * 14).toFixed(2) + 'deg');
      image.style.opacity = layer === 0 ? 1 : progress;
    });
    card.setAttribute('aria-hidden', offset !== 0);
    layers[0].alt = offset === 0 ? t(shop.photos[active][1]) : '';
  });
  const countLabel = (active + 1) + ' / ' + count;
  if ($('#slide-count').textContent !== countLabel) $('#slide-count').textContent = countLabel;
}

function settleCarousel(target) {
  cancelAnimationFrame(frame);
  const start = carouselPosition;
  const started = performance.now();
  const duration = reducedMotion.matches ? 0 : 360 + Math.min(180, Math.abs(target - start) * 90);
  function tick(now) {
    const progress = duration ? Math.min(1, (now - started) / duration) : 1;
    carouselPosition = start + (target - start) * (1 - (1 - progress) ** 3);
    drawCarousel();
    if (progress < 1) frame = requestAnimationFrame(tick);
  }
  frame = requestAnimationFrame(tick);
}

carousel.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  cancelAnimationFrame(frame);
  drag = {
    id: event.pointerId, startX: event.clientX, lastX: event.clientX,
    lastTime: performance.now(), velocity: 0, start: carouselPosition,
    step: Math.max(70, Math.min(240, carousel.clientWidth * .22))
  };
  carousel.setPointerCapture(event.pointerId);
  carousel.classList.add('dragging');
});
carousel.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  const now = performance.now();
  drag.velocity = (drag.velocity + (drag.lastX - event.clientX) / Math.max(8, now - drag.lastTime) / drag.step) / 2;
  drag.lastTime = now;
  drag.lastX = event.clientX;
  carouselPosition = drag.start + (drag.startX - event.clientX) / drag.step;
  drawCarousel();
});
function finishDrag(event) {
  if (drag?.id !== event.pointerId) return;
  const fling = event.type === 'pointerup' && performance.now() - drag.lastTime < 100
    ? Math.max(-2, Math.min(2, drag.velocity * 150)) : 0;
  drag = undefined;
  carousel.classList.remove('dragging');
  settleCarousel(Math.round(carouselPosition + fling));
}
carousel.addEventListener('pointerup', finishDrag);
carousel.addEventListener('pointercancel', finishDrag);
carousel.addEventListener('lostpointercapture', finishDrag);
carousel.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  settleCarousel(Math.round(carouselPosition) + (event.key === 'ArrowRight' ? 1 : -1));
});
window.addEventListener('hashchange', updateNav);
window.addEventListener('popstate', updateNav);
window.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#menu-panel').hidden) { setMenu(false); $('#menu').focus(); } });
all('[data-lang]').forEach(button => { button.onclick = () => {
  language = button.dataset.lang;
  localStorage.setItem('claws-language', language);
  renderContent();
}; });
all('[data-currency]').forEach(button => { button.onclick = () => {
  currency = button.dataset.currency;
  localStorage.setItem('claws-currency', currency);
  renderContent();
}; });
renderContent();

})();



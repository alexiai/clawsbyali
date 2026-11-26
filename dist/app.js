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
let currentPhoto = 0;
let timer;
let statusTimer;
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  return nav.some(([id]) => id === requested) ? requested : 'home';
}
function updateNav() {
  const page = currentPage();
  document.body.dataset.page = page;
  document.title = page === 'home' ? 'Claws by Ali — Press-on nails' : t(nav.find(([id]) => id === page)[1]) + ' — Claws by Ali';
  all('main > [id]').forEach(section => {
    section.hidden = page === 'home' ? !homeSections.has(section.id) : section.id !== page;
  });
  const shippingDetails = $('#shipping details');
  if (page === 'shipping') shippingDetails.open = true;
  all('#nav a').forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
function navigate(id) {
  if (currentPage() !== id || location.hash) history.pushState(null, '', urlFor(id));
  setMenu(false);
  updateNav();
  window.scrollTo({top: 0, behavior: 'instant'});
}
function syncPhoto() {
  const photo = (offset) => shop.photos[(currentPhoto + offset + shop.photos.length) % shop.photos.length];
  $('#slide').src = 'assets/' + photo(0)[0] + '.jpg';
  $('#slide').alt = t(photo(0)[1]);
  $('#prev-photo').src = 'assets/' + photo(-1)[0] + '.jpg';
  $('#next-photo').src = 'assets/' + photo(1)[0] + '.jpg';
  $('#slide-count').textContent = (currentPhoto + 1) + ' / ' + shop.photos.length;
  $('#pause').textContent = paused ? '▶' : 'Ⅱ';
  $('#pause').setAttribute('aria-label', paused ? t('Pornește caruselul|Play carousel') : t('Oprește caruselul|Pause carousel'));
}
function cyclePhoto(direction) {
  currentPhoto = (currentPhoto + direction + shop.photos.length) % shop.photos.length;
  syncPhoto();
}
function restartCarousel() {
  clearInterval(timer);
  if (!paused) timer = setInterval(() => {
    if (!document.hidden && !dialog.open && !$('.editorial').matches(':focus-within, :hover')) cyclePhoto(1);
  }, 4800);
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
  $('#previous').setAttribute('aria-label', t('Fotografia anterioară|Previous photo'));
  $('#next').setAttribute('aria-label', t('Fotografia următoare|Next photo'));
  $('#menu').setAttribute('aria-label', $('#menu-panel').hidden ? t('Meniu|Menu') : t('Închide meniul|Close menu'));
  $('#close').setAttribute('aria-label', t('Închide|Close'));
  $('#nav').replaceChildren(...nav.map(([id, name]) => {
    const link = el('a',t(name));
    link.href = urlFor(id);
    link.dataset.page = id;
    return link;
  }));
  updateNav();
  syncPhoto();
  $('#tiers').replaceChildren(...shop.tiers.map(([name, cost, flower], index) => {
    const button = el('button');
    button.className = 'tier';
    button.innerHTML = '<img loading="lazy" src="assets/' + flower + '.jpg" alt=""><span class="arrow" aria-hidden="true">↗</span><strong>' + t(name) + '</strong><span>' + price(cost) + '</span>';
    button.onclick = () => configure(index);
    return button;
  }));
  $('#kit').textContent = t('Alege sizing kit |Choose sizing kit ') + '· ' + price(10);
  $('#size-steps').replaceChildren(...sizingSteps.map(step => el('li', t(step))));
  const sizeRows = [['XS',14,11,12,10,8],['S',15,12,13,11,8],['M',16,12,13,11,9],['L',18,13,14,12,10]];
  $('#size-table').innerHTML = '<p>' + t('Valorile în mm sunt orientative. Pentru un set la comandă, notează lățimea exactă pentru fiecare unghie.|Widths in mm are a reference. For a custom set, provide the actual width of each nail.') + '</p><div class="table-scroll"><table><thead><tr><th>' + t('Mărime|Size') + '</th>' + fingers.map(finger => '<th scope="col">' + t(finger) + '</th>').join('') + '</tr></thead><tbody>' + sizeRows.map(row => '<tr><th scope="row">' + row[0] + '</th>' + row.slice(1).map(value => '<td>' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  $('#questions').replaceChildren(...faq.map(([category, entries], group) => {
    const section = el('section');
    section.append(el('h3', t(category)), ...entries.map(([question, answer], index) => accordion(t(question), language === 'en' ? faqEnglish[group][index] : answer)));
    return section;
  }));
  const lastUpdated = new Intl.DateTimeFormat(language === 'ro' ? 'ro-RO' : 'en-GB', {dateStyle:'long',timeZone:'UTC'}).format(new Date('2026-11-26'));
  $('#policy').replaceChildren(el('p', t('Actualizată la |Last updated ') + lastUpdated), ...shippingPolicy.flatMap(([title, body], index) => [el('h3', (index + 1) + '. ' + t(title)), el('p', language === 'en' ? shippingEnglish[index] : body)]));
}
function showDialog(title, markup) {
  $('#dialog-title').textContent = title;
  dialogBody.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
function optionList(values, current) {
  return values.map((value, index) => '<option value="' + index + '"' + (String(index) === current ? ' selected' : '') + '>' + t(value) + '</option>').join('');
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
  const glueChoice = '<label class="add-on"><input type="checkbox" name="glue"' + (draft.glue ? ' checked' : '') + '>' + t('Adaugă adeziv KISS|Add KISS nail glue') + ' · ' + price(glueCost) + '</label>';
  showDialog(t(name) + ' · ' + price(cost), '<form id="configure"><p class="notice">' + t('Site-ul pregătește cererea pentru WhatsApp. Stabilim acolo designul, costul final și plata.|The site prepares your request for WhatsApp. We confirm the design, final price and payment there.') + '</p><div class="pair"><label>' + t('Formă|Shape') + '<select name="shape" required><option value="">—</option>' + optionList(shapes,draft.shape) + '</select></label><label>' + t('Lungime|Length') + '<select name="length" required><option value="">—</option>' + optionList(lengths,draft.length) + '</select></label></div>' + (kit ? '' :
    '<label>' + t('Descrie designul dorit|Describe your design') + '<textarea name="description" rows="3" maxlength="700" required placeholder="' + t('Culori, finisaj, detalii sau idei…|Colours, finish, details or ideas…') + '">' + escape(draft.description || '') + '</textarea></label><p class="notice">' + t('Dacă încă nu ai un model exact, alege categoria cea mai apropiată și scrie-ne ce ți-ar plăcea. Putem discuta și pe|If you are still exploring, choose the closest tier and tell us what you like. You can also reach out on') + ' <a class="text-link" href="https://www.tiktok.com/@clawsbyalix" target="_blank" rel="noopener">TikTok</a>.</p><label>' + t('Fotografii de referință (opțional)|Reference photos (optional)') + '<input type="file" accept="image/*" multiple id="refs"></label><p id="file-list" class="notice"></p><p class="notice">' + t('Pozele selectate se păstrează în această sesiune. Le vei atașa în conversația WhatsApp.|Selected photos stay in this session. Attach them in your WhatsApp conversation.') + '</p><div class="inline"><strong>' + t('Lățimea fiecărei unghii în mm|Width of each nail in mm') + '</strong><a class="text-link" href="?page=sizing" data-page="sizing" id="open-guide">' + t('Vezi ghidul|See size guide') + '</a></div><div class="hands">' + hand(0,draft) + hand(1,draft) + '</div>' + glueChoice) + '<button class="action" type="submit">' + t('Adaugă în coș|Add to bag') + ' ↗</button></form>');
  const form = $('#configure');
  let files = draft.files || [];
  const saveDraft = () => drafts.set(index, {...Object.fromEntries(new FormData(form)), files});
  form.addEventListener('input', saveDraft);
  if (!kit) {
    const list = () => { $('#file-list').textContent = files.map(file => file.name).join(', '); };
    list();
    $('#refs').onchange = event => {
      files = [...event.target.files].filter(file => file.type.startsWith('image/'));
      list();
      saveDraft();
    };
    $('#open-guide').onclick = () => { saveDraft(); dialog.close(); };
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
    dialog.close();
    status(t('Adăugat în coș|Added to your bag'));
  };
}
function updateCount() {
  $('#count').textContent = items.length;
}
function itemVariant(item) {
  const variant = t(shapes[item.fields.shape]) + ' · ' + t(lengths[item.fields.length]);
  return item.fields.glue ? variant + ' · ' + t('Adeziv KISS|KISS nail glue') + ' (+' + price(glueCost) + ')' : variant;
}
function orderMessage() {
  const lines = [t('Bună! Aș vrea să trimit o cerere pentru Claws by Ali.|Hi! I would like to send an order request to Claws by Ali.'), ''];
  items.forEach((item, index) => {
    lines.push((index + 1) + '. ' + t(item.name) + ' · ' + price(item.cost) + ' · ' + itemVariant(item));
    if (item.index !== -1) {
      lines.push(item.fields.description.trim());
      sides.forEach((side, sideIndex) => lines.push(t(side) + ': ' + fingers.map((finger, fingerIndex) => t(finger) + ' ' + item.fields['finger-' + sideIndex + '-' + fingerIndex] + ' mm').join(', ')));
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
const subtotal = () => items.reduce((sum,item) => sum + item.cost + (item.fields.glue ? glueCost : 0), 0);
const methodName = (method) => method === 'pickup' ? 'Cargus SHIP & GO' : t('Cargus la adresă|Cargus to your address');
function checkout() {
  const title = t('Coșul tău|Your bag');
  if (!items.length) {
    showDialog(title, '<p>' + t('Coșul este gol.|Your bag is empty.') + '</p><p><a class="text-link" href="?page=custom" data-page="custom" id="browse">' + t('Explorează seturile|Explore custom sets') + ' ↗</a></p>');
    $('#browse').onclick = () => dialog.close();
    return;
  }
  const field = (name, label, type, autocomplete) => '<label>' + t(label) + '<input maxlength="160" required type="' + type + '" name="' + name + '" autocomplete="' + autocomplete + '" value="' + escape(delivery[name] || '') + '"></label>';
  showDialog(title, items.map((item, index) => '<div class="line-item"><div><strong>' + t(item.name) + ' · ' + price(item.cost) + '</strong><small>' + itemVariant(item) + '</small></div><button type="button" class="text-link" data-remove="' + index + '">' + t('Elimină|Remove') + '</button></div>').join('') + '<form id="checkout"><dl class="totals"><div><dt>' + t('Subtotal|Subtotal') + '</dt><dd>' + price(subtotal()) + '</dd></div><div><dt>' + t('Transport estimat|Estimated shipping') + '</dt><dd id="shipping-price"></dd></div><div><dt><strong>' + t('Total estimat|Estimated total') + '</strong></dt><dd id="total"></dd></div></dl><p class="notice">' + t('Costul final se confirmă pe WhatsApp. Realizare în 5–7 zile lucrătoare, apoi 1–3 zile pentru transport.|Final cost is confirmed on WhatsApp. Allow 5–7 business days for production and 1–3 days for shipping.') + (currency === 'EUR' ? ' ' + t('Prețurile în EUR sunt orientative (5 lei/€).|EUR prices are indicative (5 RON/€).') : '') + '</p><label>' + t('Metodă de livrare|Delivery method') + '<select name="method"><option value="pickup">' + methodName('pickup') + '</option><option value="address">' + methodName('address') + '</option></select></label>' + field('city','Localitate și județ|City and county','text','address-level2') + field('address','Adresă completă|Full address','text','street-address') + '<div id="pickup-field">' + field('pickup','Punct SHIP & GO preferat|Preferred SHIP & GO location','text','off') + '</div>' + field('phone','Telefon|Phone number','tel','tel') + '<button class="action" type="submit">' + (shop.whatsapp ? t('Deschide WhatsApp|Open WhatsApp') : t('Pregătește cererea|Prepare request')) + ' ↗</button><div id="request-output"></div></form>');
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
    if (shop.whatsapp) window.open('https://wa.me/' + shop.whatsapp + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
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
$('#close').onclick = () => dialog.close();
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
$('#previous').onclick = () => { cyclePhoto(-1); restartCarousel(); };
$('#next').onclick = () => { cyclePhoto(1); restartCarousel(); };
$('#pause').onclick = () => { paused = !paused; syncPhoto(); restartCarousel(); };
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
restartCarousel();
})();



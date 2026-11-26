const cargusLocator = 'https://www.cargus.ro/personal/locatii-shipandgo/';
let deliveryData;

function loadDeliveryData() {
  deliveryData ??= Promise.all(['romania', 'cargus-points'].map(async file => {
    const response = await fetch('assets/' + file + '.json');
    if (!response.ok) throw new Error(file);
    return response.json();
  })).catch(error => { deliveryData = undefined; throw error; });
  return deliveryData;
}

function deliveryFields(t, delivery, escape) {
  const input = (name, label, autocomplete) =>
    '<label>' + t(label) + '<input required name="' + name + '" list="' + name +
    '-options" autocomplete="' + autocomplete + '" value="' + escape(delivery[name] || '') +
    '"></label><datalist id="' + name + '-options"></datalist>';
  return '<div class="delivery-fields">' + input('county', 'Județ|County', 'address-level1') +
    input('city', 'Localitate|Locality', 'address-level2') + '<p class="notice" id="delivery-status" role="status"></p></div>' +
    '<div id="pickup-field" class="pickup-panel"><p id="pickup-selection"></p><input name="pickup" type="hidden">' +
    '<button type="button" id="pickup-toggle" class="text-link" aria-expanded="false" aria-controls="pickup-options">' +
    t('Alege pe hartă un punct SHIP & GO|Choose a SHIP & GO point on the map') + '</button>' +
    '<div id="pickup-options" hidden><label>' + t('Caută după punct, stradă sau localitate|Search by point, street or locality') +
    '<input id="pickup-search" type="search"></label><div class="pickup-map" aria-label="' +
    t('Hartă Cargus SHIP & GO|Cargus SHIP & GO map') + '"></div><div class="pickup-results" aria-live="polite"></div></div>' +
    '<a class="text-link" href="' + cargusLocator + '" target="_blank" rel="noopener noreferrer">' +
    t('Verifică disponibilitatea pe harta Cargus ↗|Check availability on the Cargus map ↗') + '</a></div>';
}

const deliveryKey = value => value.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim();

function initDeliverySelector(form, t, saved) {
  const find = selector => form.querySelector(selector);
  const {county, city, pickup} = form.elements;
  const selection = find('#pickup-selection');
  const panel = find('#pickup-options');
  const toggle = find('#pickup-toggle');
  const search = find('#pickup-search');
  const results = find('.pickup-results');
  const status = find('#delivery-status');
  let counties = {};
  let points = [];
  let countyName;
  let locality;
  let chosenId = saved.pickupId || '';
  let map;
  let markers;
  const invalid = t('Alege o opțiune din listă.|Choose a value from the list.');
  const emptyPickup = t('Niciun punct SHIP & GO selectat.|No SHIP & GO point selected.');
  let pickupEnabled = true;

  function populate(list, names) {
    list.replaceChildren(...names.map(name => {
      const option = document.createElement('option');
      option.value = name;
      return option;
    }));
  }

  function setPoint(point) {
    chosenId = point?.[0] || '';
    pickup.value = point ? [point[1], point[2], point[0]].join(' · ') : '';
    selection.textContent = pickup.value || emptyPickup;
  }

  function matchesLocality(point) {
    const requested = deliveryKey(locality?.[1] || '');
    const pointCity = deliveryKey(point[4]);
    if (!requested) return false;
    const sector = requested.match(/^bucuresti sectorul (\d)$/);
    if (sector) {
      const postal = point[2].match(/\b0([1-6])\d{4}\b/);
      return pointCity.startsWith('bucuresti') && (deliveryKey(String(point[7])).endsWith(sector[1]) ||
        pointCity.endsWith(' ' + sector[1]) || postal?.[1] === sector[1]);
    }
    return pointCity === requested || (requested === 'bucuresti' && pointCity.startsWith('bucuresti'));
  }

  function renderPoints(recenter = true) {
    if (panel.hidden) return;
    const query = deliveryKey(search.value);
    const countyPoints = points.filter(point => deliveryKey(point[3]) === deliveryKey(countyName || ''));
    const exact = countyPoints.filter(matchesLocality);
    const center = exact[0];
    const nearby = center ? countyPoints.filter(point => !matchesLocality(point)).sort((a, b) =>
      ((a[5]-center[5])**2 + (a[6]-center[6])**2) - ((b[5]-center[5])**2 + (b[6]-center[6])**2)
    ) : countyPoints;
    const shown = [...exact, ...nearby].filter(point => !query || deliveryKey(point.slice(0,5).join(' ')).includes(query)).slice(0, 24);
    if (!map && typeof L !== 'undefined') {
      map = L.map(find('.pickup-map'), {scrollWheelZoom:false}).setView([45.8,24.9], 6);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom:19
      }).addTo(map);
      markers = L.layerGroup().addTo(map);
    }
    markers?.clearLayers();
    results.replaceChildren();
    const positions = [];
    shown.forEach((point, index) => {
      const label = document.createElement('button');
      label.type = 'button';
      const selected = point[0] === chosenId;
      label.setAttribute('aria-pressed', selected);
      label.textContent = (index + 1) + '. ' + point[1];
      const address = document.createElement('small');
      address.textContent = point[2];
      label.append(address);
      function choose() {
        setPoint(point);
        renderPoints(false);
        map?.panTo([point[5],point[6]]);
        form.dispatchEvent(new Event('input', {bubbles:true}));
      }
      label.onclick = choose;
      results.append(label);
      const position = [point[5],point[6]];
      positions.push(position);
      if (markers) L.marker(position, {title:point[1], icon:L.divIcon({
        className:'pickup-pin' + (selected ? ' selected' : ''), html:String(index+1), iconSize:[23,23], iconAnchor:[11,11]
      })}).on('click',choose).addTo(markers);
    });
    if (!shown.length) results.textContent = t('Nu am găsit puncte pentru căutarea ta.|No pickup points match your search.');
    if (map && positions.length && recenter) map.fitBounds(positions, {maxZoom:14,padding:[18,18]});
  }

  function updatePlaces(clearCity = false) {
    const nextCounty = Object.keys(counties).find(name => deliveryKey(name) === deliveryKey(county.value));
    if (nextCounty !== countyName) {
      countyName = nextCounty;
      if (clearCity) city.value = '';
      populate(find('#city-options'), (counties[countyName] || []).map(place => place[0]));
    }
    county.setCustomValidity(county.value && !countyName ? invalid : '');
    city.disabled = !countyName;
    locality = (counties[countyName] || []).find(place => deliveryKey(place[0]) === deliveryKey(city.value));
    city.setCustomValidity(city.value && !locality ? invalid : '');
    toggle.disabled = !locality;
    if (!locality) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded','false');
    }
    renderPoints();
  }

  county.oninput = () => { if (deliveryKey(county.value) !== deliveryKey(countyName || '')) setPoint(); updatePlaces(true); };
  city.oninput = () => { if (deliveryKey(city.value) !== deliveryKey(locality?.[0] || '')) setPoint(); updatePlaces(); };
  toggle.onclick = () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', !panel.hidden);
    renderPoints();
    if (!panel.hidden) { map?.invalidateSize(); search.focus(); }
  };
  search.oninput = renderPoints;
  selection.textContent = emptyPickup;
  city.disabled = true;
  toggle.disabled = true;
  status.textContent = t('Se încarcă lista localităților…|Loading the list of localities…');
  loadDeliveryData().then(([places, locations]) => {
    if (!form.isConnected) return;
    counties = places;
    points = locations;
    populate(find('#county-options'), Object.keys(counties).sort((a,b) => a.localeCompare(b,'ro')));
    updatePlaces();
    if (chosenId && locality) setPoint(points.find(point => point[0] === chosenId && deliveryKey(point[3]) === deliveryKey(countyName)));
    status.textContent = '';
  }).catch(() => {
    if (form.isConnected) status.textContent = t('Lista localităților nu s-a încărcat. Redeschide coșul pentru a reîncerca.|The locality list did not load. Reopen the cart to try again.');
  });

  return {
    setPickupEnabled(enabled) { pickupEnabled = enabled; pickup.disabled = !enabled; },
    complete(delivery) {
      if (!countyName || !locality) {
        status.textContent = invalid;
        (countyName ? city : county).focus();
        return false;
      }
      if (pickupEnabled && !chosenId) {
        status.textContent = t('Alege un punct SHIP & GO pentru a continua.|Select a SHIP & GO point to continue.');
        toggle.focus();
        return false;
      }
      status.textContent = '';
      delivery.county = countyName;
      delivery.city = locality[0];
      delivery.pickupId = chosenId;
      return true;
    },
    pointId() { return chosenId; },
    dispose() { map?.remove(); }
  };
}

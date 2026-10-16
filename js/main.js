(function () {
  'use strict';

  var LANGS = ['ro', 'ru', 'en'];
  var dict = window.I18N || {};

  // ---------- Language ----------
  // Each translatable node remembers its Romanian original so we can switch back.
  var textNodes = toArray(document.querySelectorAll('[data-i18n]'));
  var htmlNodes = toArray(document.querySelectorAll('[data-i18n-html]'));
  var attrNodes = toArray(document.querySelectorAll('[data-i18n-attr]'));

  textNodes.forEach(function (el) { el.dataset.ro = el.textContent; });
  htmlNodes.forEach(function (el) { el.dataset.roHtml = el.innerHTML; });
  attrNodes.forEach(function (el) {
    parseAttrSpec(el).forEach(function (pair) {
      el.setAttribute('data-ro-' + pair.attr, el.getAttribute(pair.attr) || '');
    });
  });

  function parseAttrSpec(el) {
    // data-i18n-attr="alt:img.hero;title:loc.map"
    return el.dataset.i18nAttr.split(';').map(function (s) {
      var i = s.indexOf(':');
      return { attr: s.slice(0, i).trim(), key: s.slice(i + 1).trim() };
    });
  }

  function t(lang, key, fallback) {
    if (lang === 'ro') return fallback;
    var table = dict[lang] || {};
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : fallback;
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = 'ro';

    textNodes.forEach(function (el) { el.textContent = t(lang, el.dataset.i18n, el.dataset.ro); });
    htmlNodes.forEach(function (el) { el.innerHTML = t(lang, el.dataset.i18nHtml, el.dataset.roHtml); });
    attrNodes.forEach(function (el) {
      parseAttrSpec(el).forEach(function (pair) {
        el.setAttribute(pair.attr, t(lang, pair.key, el.getAttribute('data-ro-' + pair.attr)));
      });
    });

    document.documentElement.lang = lang;
    toArray(document.querySelectorAll('[data-lang]')).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    updateToggleLabel();
    renderTech();
    try { localStorage.setItem('lang', lang); } catch (e) { /* private mode */ }
  }

  function detectLang() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    try {
      var saved = localStorage.getItem('lang');
      if (saved && LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* ignore */ }
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (LANGS.indexOf(code) !== -1) return code;
    }
    return 'ro';
  }

  toArray(document.querySelectorAll('[data-lang]')).forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  // ---------- Mobile menu ----------
  var header = document.getElementById('header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function updateToggleLabel() {
    if (!toggle) return;
    var open = header.classList.contains('is-open');
    var lang = document.documentElement.lang;
    var key = open ? 'a11y.menuClose' : 'a11y.menuOpen';
    var fallback = open ? 'Închide meniul' : 'Deschide meniul';
    toggle.setAttribute('aria-label', t(lang, key, fallback));
  }

  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    updateToggleLabel();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', function (e) { if (!header.contains(e.target)) setMenu(false); });
  }

  // ---------- Technique tiles ----------
  // Tapping a tile copies its hidden .tech-info into the shared detail panel.
  var tiles = toArray(document.querySelectorAll('.tech'));
  var detail = document.getElementById('tech-detail');
  var currentTile = tiles[0] || null;

  function renderTech() {
    if (!detail || !currentTile) return;
    var info = currentTile.parentNode.querySelector('.tech-info');
    var icon = currentTile.querySelector('use').getAttribute('href');
    detail.querySelector('use').setAttribute('href', icon);
    detail.querySelector('.tech-detail-body').innerHTML = info.innerHTML;
    tiles.forEach(function (tile) { tile.setAttribute('aria-pressed', String(tile === currentTile)); });
  }

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      currentTile = tile;
      renderTech();
    });
  });

  // ---------- Gallery scroll buttons (desktop only) ----------
  var gallery = document.getElementById('gallery');
  toArray(document.querySelectorAll('[data-scroll]')).forEach(function (b) {
    b.addEventListener('click', function () {
      var card = gallery.querySelector('li');
      var step = card ? card.getBoundingClientRect().width + 14 : 300;
      gallery.scrollBy({ left: step * Number(b.dataset.scroll), behavior: 'smooth' });
    });
  });

  // ---------- Init ----------
  var initial = detectLang();
  if (initial !== 'ro') setLang(initial);
  else { updateToggleLabel(); renderTech(); }

  function toArray(list) { return Array.prototype.slice.call(list); }
})();

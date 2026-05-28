/**
 * Sublizme — site.js
 * Module partagé : nav, contact+footer, curseur, mode dark/light, restauration scroll
 * ── CSS pages projet inclus ici → modifier pour changer le template global ──
 */
(function () {
  'use strict';

  /* ── Thème persistant (localStorage) ─────────────────────────── */
  var _saved = localStorage.getItem('sublizme_theme');
  if (_saved === 'light') document.body.classList.add('light');

  /* ── SVG Wordmark — fill="currentColor" s'adapte au thème ───── */
  var _wm = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1382.81 239.48" fill="currentColor" aria-label="Sublizme" role="img">'
    + '<path d="M114.4,103.4l-28.28-5.66c-14.46-3.14-17.6-11-17.6-16.66,0-8.49,5.97-18.54,25.77-18.54,14.77,0,30.17,5.03,28.91,23.89h61.91c0-50.28-36.46-72.91-89.26-72.91S5.97,34.88,5.97,81.08c0,43.69,33.63,57.83,66.31,64.11l31.74,6.29c16.97,3.46,23.26,8.49,23.26,18.23,0,13.83-12.57,20.74-30.8,20.74-25.14,0-33.63-14.14-34.57-30.8H0c0,53.74,38.34,79.83,96.17,79.83,49.97,0,94.28-18.86,94.28-70.09,0-32.06-17.28-54.37-76.06-66Z"/>'
    + '<path d="M315.85,163.74c0,21.06-12.57,27.97-26.08,27.97s-22.94-6.91-22.94-27.97v-90.83h-58.14v105.29c0,39.29,23.57,61.28,55,61.28s46.51-20.74,49.66-38.34h2.51v35.2h58.14V72.91h-58.14v90.83Z"/>'
    + '<path d="M497.5,69.77c-21.69,0-37.71,10.06-42.43,18.86V16.34h-58.14v220h58.14v-15.72c4.72,8.8,20.74,18.86,42.43,18.86,33.63,0,70.08-23.89,70.08-84.86s-36.46-84.86-70.08-84.86ZM482.42,191.39c-14.14,0-29.86-11.31-29.86-36.77s15.71-36.77,29.86-36.77,30.48,11.31,30.48,36.77-16.03,36.77-30.48,36.77Z"/>'
    + '<rect x="582.67" y="16.34" width="58.14" height="220"/>'
    + '<rect x="663.75" y="72.91" width="58.14" height="163.43"/>'
    + '<path d="M692.66,0c-16.03,0-30.48,13.2-30.48,30.8s14.46,30.49,30.48,30.49,30.8-12.88,30.8-30.49-14.46-30.8-30.8-30.8Z"/>'
    + '<path d="M1149.3,69.77c-27.34,0-46.83,20.11-49.34,37.4h-.32c-7.23-24.2-26.08-37.4-48.08-37.4-25.46,0-43.06,20.75-45.57,38.34h-2.51v-35.2h-58.14v163.43h58.14v-90.83c0-21.06,10.69-27.97,21.37-27.97s19.8,6.91,19.8,27.97v90.83h58.14v-90.83c0-21.06,10.69-27.97,21.37-27.97s19.8,6.91,19.8,27.97v90.83h58.14v-105.28c0-39.29-21.69-61.29-52.8-61.29Z"/>'
    + '<path d="M1382.81,155.57c0-66-38.34-85.8-80.46-85.8s-85.17,22.31-85.17,83.91c0,65.05,45.57,85.8,84.86,85.8,42.43,0,71.97-22.95,78.57-60.66h-50.6c-1.89,7.54-5.66,16.97-27.03,16.97-16.97,0-27.66-6.91-30.48-27.03h109.37c.63-3.77.94-6.91.94-13.2ZM1272.81,136.08c2.83-14.77,11.32-22.63,27.97-22.63,21.69,0,26.4,13.51,27.34,22.63h-55.31Z"/>'
    + '<path d="M833.61,214.08c-.08-16.27-5.33-30.99-13.8-41.72-7.46-9.45-20.74-11.79-31.1-5.65-23.82,14.12-39.65,39.43-39.65,69.63h173.32v-81.71h-41.36c-26.12.19-47.27,26.7-47.42,59.45Z"/>'
    + '<path d="M833.61,95.17c.08,16.27,5.33,30.99,13.8,41.72,7.46,9.45,20.74,11.79,31.1,5.65,23.82-14.12,39.65-39.43,39.65-69.63h-173.32v81.71h41.37c26.12-.19,47.26-26.7,47.41-59.45Z"/>'
    + '</svg>';

  /* ── CSS commun injecté dynamiquement ─────────────────────────── */
  var sharedCSS = [
    /* ── Nav ── */
    '.site-nav{position:fixed;top:0;left:0;right:0;z-index:80;',
    'display:grid;grid-template-columns:auto 1fr;align-items:center;',
    'padding:16px var(--pad);',
    'background:rgba(10,10,10,.55);',
    'backdrop-filter:blur(22px) saturate(180%);',
    '-webkit-backdrop-filter:blur(22px) saturate(180%);',
    'border-bottom:1px solid rgba(255,255,255,.07);',
    'font-size:12px;letter-spacing:.06em;font-weight:500;text-transform:uppercase;',
    'color:var(--ink);animation:siteNavIn .35s cubic-bezier(.2,.8,.2,1) both}',
    '@keyframes siteNavIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}',
    'body.light .site-nav{background:rgba(242,242,239,.65);border-bottom-color:rgba(0,0,0,.07)}',
    '.sn-left{display:flex;align-items:center}',
    '.sn-logo{display:flex;align-items:center;cursor:none;transition:opacity .2s}',
    '.sn-logo:hover{opacity:.6}',
    '.sn-logo svg{height:17px;width:auto;display:block}',
    '.sn-back{display:flex;align-items:center;gap:9px;cursor:none;color:var(--ink-dim);transition:opacity .2s,color .2s}',
    '.sn-back:hover{opacity:.75;color:var(--ink)}',
    '.sn-arr{display:inline-block;transition:transform .25s}',
    '.sn-back:hover .sn-arr{transform:translateX(-5px)}',
    '.sn-socials{display:flex;justify-content:center;gap:6px;color:var(--ink-dim)}',
    '.sn-socials .sn-sep{color:var(--ink-mute)}',
    '.sn-socials a,.sn-links a{cursor:none;transition:opacity .2s}',
    '.sn-socials a:hover,.sn-links a:hover{opacity:.55}',
    '.sn-links{display:flex;justify-content:flex-end;align-items:center;gap:28px}',
    /* ── Mode btn ── */
    '.mode-btn{background:none;border:1px solid var(--ink-mute);border-radius:999px;',
    'color:var(--ink);font-family:var(--sans);font-size:11px;font-weight:500;',
    'letter-spacing:.04em;padding:4px 11px;cursor:none;',
    'transition:border-color .25s,color .25s;line-height:1.4}',
    '.mode-btn:hover{border-color:var(--ink)}',
    'body.light .mode-btn{border-color:rgba(0,0,0,.2);color:#0a0a0a}',
    '.lang-btn{background:none;border:1px solid var(--ink-mute);border-radius:999px;color:var(--ink);font-family:var(--sans);font-size:11px;font-weight:600;letter-spacing:.06em;padding:4px 11px;cursor:none;transition:border-color .25s,color .25s;line-height:1.4}',
    '.lang-btn:hover{border-color:var(--ink)}',
    'body.light .lang-btn{border-color:rgba(0,0,0,.2);color:#0a0a0a}',
    /* ── Contact section ── */
    '.contact{background:var(--bg);color:var(--ink);padding:140px var(--pad) 0;position:relative;overflow:hidden}',
    '.contact-head{padding-bottom:32px;border-bottom:1px solid var(--line);margin-bottom:48px}',
    '.contact-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}',
    '.contact-head .label{font-size:12px;letter-spacing:.1em;font-weight:500;text-transform:uppercase;color:var(--ink-dim)}',
    '.avail{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.06em;font-weight:500;text-transform:uppercase;color:var(--ink-dim);border:1px solid var(--line);border-radius:999px;padding:5px 13px}',
    '.avail-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0;box-shadow:0 0 7px rgba(34,197,94,.7);animation:sfPulse 2.2s ease-in-out infinite}',
    '@keyframes sfPulse{0%,100%{opacity:1}50%{opacity:.35}}',
    '.contact h1{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim)}',
    '.contact-email-cta{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:40px 0;border-bottom:1px solid var(--line);margin-bottom:72px;cursor:none}',
    '.contact-email-cta a{font-family:var(--sans);font-weight:700;font-size:clamp(24px,3.5vw,60px);letter-spacing:-.03em;color:var(--ink);transition:opacity .25s}',
    '.contact-email-cta:hover a{opacity:.55}',
    '.contact-email-cta .cta-arr{font-size:clamp(20px,3vw,50px);color:var(--ink-mute);transition:transform .35s cubic-bezier(.2,.8,.2,1),color .25s;flex-shrink:0}',
    '.contact-email-cta:hover .cta-arr{transform:translateX(10px);color:var(--ink)}',
    '.contact-cols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:48px;padding-bottom:100px;border-bottom:1px solid var(--line)}',
    '.contact-col .col-label{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim);font-weight:500;margin-bottom:22px}',
    '.contact-col .link-row{display:flex;align-items:center;justify-content:space-between;font-size:17px;font-weight:600;letter-spacing:-.01em;padding:12px 0;border-bottom:1px solid var(--line);cursor:none;transition:opacity .2s}',
    '.contact-col .link-row:first-of-type{border-top:1px solid var(--line)}',
    '.contact-col .link-row .arr{color:var(--ink-dim);font-size:13px;transition:transform .25s}',
    '.contact-col .link-row:hover{opacity:.55}',
    '.contact-col .link-row:hover .arr{transform:translate(3px,-3px)}',
    '.contact-col p{font-size:14px;line-height:1.7;color:var(--ink-dim);font-weight:300;max-width:26ch}',
    '.contact-col .response-badge{display:inline-flex;align-items:center;gap:6px;margin-top:18px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-dim);border:1px solid var(--line);border-radius:999px;padding:4px 12px}',
    /* ── Footer ── */
    '.contact-footer{position:relative;padding-top:72px}',
    '.contact-footer-bar{position:relative;z-index:2;',
    'display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;',
    'font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;',
    'color:var(--ink-mute);padding-bottom:48px;border-bottom:1px solid var(--line)}',
    '.contact-footer-bar .f-socials{display:flex;gap:20px;justify-content:center}',
    '.contact-footer-bar .f-nav{display:flex;gap:20px;justify-content:flex-end}',
    '.contact-footer-bar a{cursor:none;transition:color .2s;color:var(--ink-mute)}',
    '.contact-footer-bar a:hover{color:var(--ink)}',
    '.footer-name-zone{position:relative;overflow:hidden}',
    '.halftone{position:absolute;inset:30px 0 100px 0;z-index:0;opacity:.8;pointer-events:none;',
    'background-image:radial-gradient(circle,var(--accent) 1.6px,transparent 2px);',
    'background-size:7px 7px;',
    '-webkit-mask-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1600 600\' preserveAspectRatio=\'xMidYMid slice\'><defs><filter id=\'b\' x=\'-20%25\' y=\'-20%25\' width=\'140%25\' height=\'140%25\'><feGaussianBlur stdDeviation=\'14\'/></filter></defs><g fill=\'%23000\' filter=\'url(%23b)\'><ellipse cx=\'240\' cy=\'220\' rx=\'240\' ry=\'110\'/><ellipse cx=\'420\' cy=\'280\' rx=\'120\' ry=\'70\'/><ellipse cx=\'520\' cy=\'200\' rx=\'60\' ry=\'40\'/><ellipse cx=\'150\' cy=\'320\' rx=\'130\' ry=\'60\'/><ellipse cx=\'1150\' cy=\'320\' rx=\'320\' ry=\'130\'/><ellipse cx=\'1430\' cy=\'370\' rx=\'130\' ry=\'70\'/><ellipse cx=\'950\' cy=\'240\' rx=\'90\' ry=\'50\'/><ellipse cx=\'1050\' cy=\'430\' rx=\'150\' ry=\'60\'/></g></svg>");',
    'mask-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1600 600\' preserveAspectRatio=\'xMidYMid slice\'><defs><filter id=\'b\' x=\'-20%25\' y=\'-20%25\' width=\'140%25\' height=\'140%25\'><feGaussianBlur stdDeviation=\'14\'/></filter></defs><g fill=\'%23000\' filter=\'url(%23b)\'><ellipse cx=\'240\' cy=\'220\' rx=\'240\' ry=\'110\'/><ellipse cx=\'420\' cy=\'280\' rx=\'120\' ry=\'70\'/><ellipse cx=\'520\' cy=\'200\' rx=\'60\' ry=\'40\'/><ellipse cx=\'150\' cy=\'320\' rx=\'130\' ry=\'60\'/><ellipse cx=\'1150\' cy=\'320\' rx=\'320\' ry=\'130\'/><ellipse cx=\'1430\' cy=\'370\' rx=\'130\' ry=\'70\'/><ellipse cx=\'950\' cy=\'240\' rx=\'90\' ry=\'50\'/><ellipse cx=\'1050\' cy=\'430\' rx=\'150\' ry=\'60\'/></g></svg>");',
    '-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}',
    '.footer-logo-zone{position:relative;z-index:1;padding:60px var(--pad) 24px}',
    '.footer-logo-zone svg{width:100%;height:auto;display:block}',
    /* ═══════════════════════════════════════════════════════════════ */
    /* ── TEMPLATE GLOBAL — PAGES PROJET ────────────────────────── */
    /* Modifier ici pour changer le layout de TOUS les projets      */
    /* ═══════════════════════════════════════════════════════════════ */
    '.ph{min-height:100vh;padding:120px var(--pad) 80px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden}',
    '.ph-num{font-family:var(--sans);font-weight:800;font-size:clamp(100px,20vw,340px);line-height:.82;letter-spacing:-.06em;color:rgba(255,255,255,.04);position:absolute;right:var(--pad);bottom:80px;user-select:none;pointer-events:none}',
    '.ph-kicker{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim);font-weight:500;margin-bottom:24px}',
    '.ph-kicker .dot{color:var(--accent);margin-right:6px}',
    '.ph h1{font-family:var(--sans);font-weight:800;font-size:clamp(64px,9vw,160px);line-height:.9;letter-spacing:-.04em;max-width:14ch;margin-bottom:48px}',
    '.ph-tags{display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
    '.ph-tag{padding:6px 14px;border:1px solid var(--line);border-radius:999px;font-size:12px;letter-spacing:.04em;color:var(--ink-dim);font-weight:500}',
    '.ph-tag.accent{border-color:rgba(255,31,31,.4);color:var(--accent)}',
    '.ph-divider{position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--line)}',
    '.pc-cover{width:100%;aspect-ratio:16/7;position:relative;overflow:hidden;background:#0a0a0a}',
    '.pc-cover img{width:100%;height:100%;object-fit:cover;object-position:center}',
    '.pc-cover .cover-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(10,10,10,.4))}',
    '.pc-cover .cover-label{position:absolute;bottom:32px;right:var(--pad);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);font-weight:500}',
    '.pi{padding:100px var(--pad);display:grid;grid-template-columns:1fr .42fr;gap:10vw;align-items:start;border-bottom:1px solid var(--line)}',
    '.pi-desc .pi-intro{font-family:var(--sans);font-weight:300;font-size:clamp(22px,2.4vw,38px);line-height:1.25;letter-spacing:-.015em;color:var(--ink);margin-bottom:40px}',
    '.pi-desc .pi-intro em{font-style:italic}',
    '.pi-desc p{font-size:15px;line-height:1.7;color:var(--ink-dim);font-weight:300;max-width:52ch}',
    '.pi-meta{display:flex;flex-direction:column;gap:0;padding-top:6px}',
    '.pi-meta-row{padding:18px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:.9fr 1fr;gap:16px}',
    '.pi-meta-row:first-child{border-top:1px solid var(--line)}',
    '.pi-meta-row .mk{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-dim);font-weight:500;padding-top:2px}',
    '.pi-meta-row .mv{font-size:14px;font-weight:500;color:var(--ink);line-height:1.5}',
    '.pi-img-full{width:100%;aspect-ratio:21/8;overflow:hidden;background:#0a0a0a;position:relative}',
    '.pi-img-full img{width:100%;height:100%;object-fit:cover;object-position:center top}',
    '.pi-quote{padding:100px var(--pad);display:flex;flex-direction:column;align-items:center;text-align:center;border-bottom:1px solid var(--line)}',
    '.pi-quote .q-mark{font-family:var(--sans);font-weight:800;font-size:clamp(60px,10vw,140px);line-height:.7;color:rgba(255,31,31,.15);margin-bottom:24px;user-select:none}',
    '.pi-quote blockquote{font-family:var(--sans);font-weight:300;font-size:clamp(22px,2.6vw,42px);line-height:1.2;letter-spacing:-.015em;max-width:22ch;color:var(--ink)}',
    '.pi-quote blockquote em{font-style:italic}',
    '.pi-quote .q-src{margin-top:28px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-dim);font-weight:500}',
    '.pi-duo{display:grid;grid-template-columns:1fr 1fr;gap:3px}',
    '.pi-duo-img{aspect-ratio:4/3;overflow:hidden;position:relative;background:#0a0a0a}',
    '.pi-duo-img img{width:100%;height:100%;object-fit:cover;object-position:center}',
    '.pn{padding:100px var(--pad);display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:48px;border-top:1px solid var(--line);cursor:none}',
    '.pn:hover .pn-title{opacity:.6}',
    '.pn:hover .pn-arrow{transform:translateX(14px)}',
    '.pn .pn-label{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-dim);font-weight:500;margin-bottom:16px}',
    '.pn .pn-title{font-family:var(--sans);font-weight:800;font-size:clamp(36px,5vw,88px);line-height:.9;letter-spacing:-.04em;transition:opacity .3s}',
    '.pn-right{display:flex;justify-content:flex-end;align-items:center}',
    '.pn-arrow{font-size:clamp(40px,5vw,80px);color:var(--ink-dim);transition:transform .4s cubic-bezier(.2,.8,.2,1),color .3s;line-height:1}',
    '.pn:hover .pn-arrow{color:var(--ink)}',
    /* ── Responsive ── */
    '@media(max-width:960px){',
    '.site-nav{grid-template-columns:1fr auto}',
    '.sn-socials{display:none}',
    '.contact-cols,.contact-footer-bar{grid-template-columns:1fr}',
    '.contact-cols{gap:40px}',
    '.contact-email-cta a{font-size:22px}',
    '.contact h1{font-size:clamp(60px,14vw,140px)}}',
    '@media(max-width:900px){',
    '.pi{grid-template-columns:1fr;gap:60px}',
    '.pn{grid-template-columns:1fr}',
    '.pn-right{justify-content:flex-start}',
    '.pi-img-full{aspect-ratio:16/7}',
    '.pi-duo{grid-template-columns:1fr}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = sharedCSS;
  document.head.appendChild(styleEl);

  /* ── Met à jour l'icône des boutons mode ────────────────────── */
  function _syncModeIcons() {
    var isLight = document.body.classList.contains('light');
    document.querySelectorAll('.mode-btn').forEach(function(b){ b.textContent = isLight ? '◐' : '◑'; });
  }
  _syncModeIcons();

  function _syncLangBtns() {
    var lang = localStorage.getItem('sublizme_lang') || 'FR';
    document.querySelectorAll('.lang-btn').forEach(function(b){ b.textContent = lang; });
  }
  _syncLangBtns();

  /* ── Curseur ─────────────────────────────────────────────────── */
  var cur, ring;

  function initCursor() {
    if (!document.querySelector('.cursor')) {
      var frag = document.createDocumentFragment();
      var c = document.createElement('div');
      c.className = 'cursor'; c.setAttribute('aria-hidden','true');
      var r = document.createElement('div');
      r.className = 'cursor-ring'; r.setAttribute('aria-hidden','true');
      frag.appendChild(c); frag.appendChild(r);
      document.body.prepend(frag);
    }
    cur  = document.querySelector('.cursor');
    ring = document.querySelector('.cursor-ring');
    if (!cur || !ring) return;
    var cx=0,cy=0,rx=0,ry=0;
    document.addEventListener('mousemove', function(e){ cx=e.clientX; cy=e.clientY; cur.style.left=cx+'px'; cur.style.top=cy+'px'; });
    (function anim(){ rx+=(cx-rx)*.12; ry+=(cy-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(anim); })();
    _addHoverAll('a,button');
  }

  function _addHover(el) {
    if (!cur) return;
    el.addEventListener('mouseenter', function(){ cur.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', function(){ cur.classList.remove('hover'); ring.classList.remove('hover'); });
  }

  function _addHoverAll(selector) {
    document.querySelectorAll(selector).forEach(_addHover);
  }

  /* ── Mode dark / light (avec persistance) ───────────────────── */
  document.addEventListener('click', function(e) {
    if (e.target.closest && e.target.closest('.mode-btn')) {
      document.body.classList.toggle('light');
      var isLight = document.body.classList.contains('light');
      localStorage.setItem('sublizme_theme', isLight ? 'light' : 'dark');
      _syncModeIcons();
      return;
    }
    if (e.target.closest && e.target.closest('.lang-btn')) {
      var lang = (localStorage.getItem('sublizme_lang') || 'FR') === 'FR' ? 'EN' : 'FR';
      localStorage.setItem('sublizme_lang', lang);
      _syncLangBtns();
      return;
    }
  });

  /* ── API publique ────────────────────────────────────────────── */
  window.SublizmeSite = {

    /* Injecte la nav commune */
    injectNav: function(opts) {
      if (document.querySelector('.site-nav')) return;
      opts = opts || {};
      var isLight = document.body.classList.contains('light');
      var leftHTML = opts.back
        ? '<a href="' + opts.back + '" class="sn-back"><span class="sn-arr">←</span>' + (opts.label || 'Projets') + '</a>'
        : '<a href="index.html" class="sn-logo">' + _wm + '</a>';

      var nav = document.createElement('nav');
      nav.className = 'site-nav';
      nav.id = 'site-nav';
      nav.innerHTML =
        '<div class="sn-left">' + leftHTML + '</div>' +
        '<div class="sn-links">' +
          '<a href="index.html#contact">Contact</a>' +
          '<button class="lang-btn" id="lang-btn">' + (localStorage.getItem('sublizme_lang') || 'FR') + '</button>' +
          '<button class="mode-btn" id="mode-btn">' + (isLight ? '◐' : '◑') + '</button>' +
        '</div>';

      document.body.prepend(nav);
      nav.querySelectorAll('a,button').forEach(_addHover);
    },

    /* Injecte le contact + footer commun */
    injectFooter: function() {
      if (document.getElementById('contact')) return;

      var section = document.createElement('section');
      section.className = 'contact';
      section.id = 'contact';
      section.innerHTML =
        '<div class="contact-head">' +
          '<div class="contact-head-top">' +
            '<span class="label">Parlons-en</span>' +
            '<span class="avail"><span class="avail-dot"></span>Disponible</span>' +
          '</div>' +
          '<h1>Contact</h1>' +
        '</div>' +
        '<div class="contact-email-cta">' +
          '<a href="mailto:hello@sublizme.fr">hello@sublizme.fr</a>' +
          '<span class="cta-arr">→</span>' +
        '</div>' +
        '<div class="contact-cols">' +
          '<div class="contact-col">' +
            '<div class="col-label">Un projet ?</div>' +
            '<p>Un brief, une idée,<br>une ambition à construire.<br>On vous répond sous 48h.</p>' +
            '<span class="response-badge"><span class="avail-dot"></span>Réponse sous 48h</span>' +
          '</div>' +
          '<div class="contact-col">' +
            '<div class="col-label">Réseaux</div>' +
            '<a href="#" class="link-row">Instagram<span class="arr">↗</span></a>' +
            '<a href="#" class="link-row">Behance<span class="arr">↗</span></a>' +
            '<a href="#" class="link-row">LinkedIn<span class="arr">↗</span></a>' +
          '</div>' +
          '<div class="contact-col">' +
            '<div class="col-label">Basé à</div>' +
            '<p>Paris, France.<br>Disponible à<br><em>l\'international.</em></p>' +
          '</div>' +
        '</div>' +
        '<div class="contact-footer">' +
          '<div class="contact-footer-bar">' +
            '<span>© 2026 Sublizme</span>' +
            '<div class="f-nav">' +
              '<a href="index.html#about">Studio</a>' +
              '<a href="index.html#projects">Projets</a>' +
              '<a href="index.html#contact">Contact</a>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(section);
      section.querySelectorAll('a').forEach(_addHover);
    },

    /* Ajoute les effets curseur hover sur des sélecteurs supplémentaires */
    addCursorHover: function(selector) {
      _addHoverAll(selector);
    },

    /* Sauvegarde + restauration du scroll */
    initScrollRestore: function() {
      document.querySelectorAll('a.project-row').forEach(function(a) {
        a.addEventListener('click', function() {
          sessionStorage.setItem('sublizme_scrollY', String(Math.round(window.scrollY)));
        });
      });

      var saved = sessionStorage.getItem('sublizme_scrollY');
      if (saved !== null) {
        sessionStorage.removeItem('sublizme_scrollY');
        document.documentElement.style.scrollBehavior = 'auto';
        var y = parseInt(saved, 10);
        requestAnimationFrame(function() {
          window.scrollTo(0, y);
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              document.documentElement.style.scrollBehavior = '';
            });
          });
        });
      }
    }
  };

  /* Auto-init curseur */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }

})();

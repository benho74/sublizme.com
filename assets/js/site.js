/**
 * Sublizme — site.js
 * Module partagé : nav, contact+footer, curseur, mode dark/light, restauration scroll
 */
(function () {
  'use strict';

  /* ── Thème persistant (localStorage) ───────────────────────── */
  var _saved = localStorage.getItem('sublizme_theme');
  if (_saved === 'light') document.body.classList.add('light');

  /* ── CSS commun injecté dynamiquement ──────────────────────── */
  var sharedCSS = [
    /* Site nav */
    '.site-nav{position:fixed;top:0;left:0;right:0;z-index:80;',
    'display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;',
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
    '.sn-back{display:flex;align-items:center;gap:9px;cursor:none;color:var(--ink-dim);transition:opacity .2s,color .2s}',
    '.sn-back:hover{opacity:.75;color:var(--ink)}',
    '.sn-arr{display:inline-block;transition:transform .25s}',
    '.sn-back:hover .sn-arr{transform:translateX(-5px)}',
    '.sn-brand{color:var(--ink-dim)}',
    '.sn-socials{display:flex;justify-content:center;gap:6px;color:var(--ink-dim)}',
    '.sn-socials .sn-sep{color:var(--ink-mute)}',
    '.sn-socials a,.sn-links a{cursor:none;transition:opacity .2s}',
    '.sn-socials a:hover,.sn-links a:hover{opacity:.55}',
    '.sn-links{display:flex;justify-content:flex-end;align-items:center;gap:28px}',
    /* Mode btn */
    '.mode-btn{background:none;border:1px solid var(--ink-mute);border-radius:999px;',
    'color:var(--ink);font-family:var(--sans);font-size:11px;font-weight:500;',
    'letter-spacing:.04em;padding:4px 11px;cursor:none;',
    'transition:border-color .25s,color .25s;line-height:1.4}',
    '.mode-btn:hover{border-color:var(--ink)}',
    'body.light .mode-btn{border-color:rgba(0,0,0,.2);color:#0a0a0a}',
    /* ── Contact section ── */
    '.contact{background:var(--bg);color:var(--ink);padding:140px var(--pad) 0;position:relative;overflow:hidden}',
    '.contact-head{padding-bottom:64px;border-bottom:1px solid var(--line);margin-bottom:72px}',
    '.contact-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}',
    '.contact-head .label{font-size:12px;letter-spacing:.1em;font-weight:500;text-transform:uppercase;color:var(--ink-dim)}',
    '.avail{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.06em;font-weight:500;text-transform:uppercase;color:var(--ink-dim);border:1px solid var(--line);border-radius:999px;padding:5px 13px}',
    '.avail-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0;box-shadow:0 0 7px rgba(34,197,94,.7);animation:sfPulse 2.2s ease-in-out infinite}',
    '@keyframes sfPulse{0%,100%{opacity:1}50%{opacity:.35}}',
    '.contact h1{font-family:var(--sans);font-weight:800;font-size:clamp(80px,12vw,210px);line-height:.88;letter-spacing:-.05em;color:var(--ink)}',
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
    '.contact-col p em{font-family:var(--display);font-style:italic}',
    '.contact-col .response-badge{display:inline-flex;align-items:center;gap:6px;margin-top:18px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-dim);border:1px solid var(--line);border-radius:999px;padding:4px 12px}',
    /* ── Footer intégré dans contact ── */
    '.contact-footer{position:relative;padding-top:72px}',
    '.contact-footer-bar{position:relative;z-index:2;',
    'display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;align-items:center;',
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
    '.footer-giant{position:relative;z-index:1;',
    'display:flex;align-items:baseline;justify-content:space-between;gap:4vw;',
    'padding:60px var(--pad) 16px;--foot-fs:clamp(96px,22vw,360px)}',
    '.footer-giant .sans-name{font-family:var(--sans);font-weight:800;font-size:var(--foot-fs);line-height:.86;letter-spacing:-.05em;white-space:nowrap}',
    '.footer-giant .serif-name{font-family:var(--display);font-style:italic;font-weight:400;font-size:var(--foot-fs);line-height:.86;letter-spacing:-.025em;white-space:nowrap}',
    '.footer-giant .punct{color:var(--accent);font-style:normal}',
    /* Responsive */
    '@media(max-width:960px){',
    '.site-nav{grid-template-columns:1fr auto}',
    '.sn-socials{display:none}',
    '.contact-cols,.contact-footer-bar{grid-template-columns:1fr}',
    '.contact-cols{gap:40px}',
    '.contact-email-cta a{font-size:22px}',
    '.contact h1{font-size:clamp(60px,14vw,140px)}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = sharedCSS;
  document.head.appendChild(styleEl);

  /* ── Met à jour l'icône des boutons mode selon le thème actuel ── */
  function _syncModeIcons() {
    var isLight = document.body.classList.contains('light');
    document.querySelectorAll('.mode-btn').forEach(function(b){ b.textContent = isLight ? '◐' : '◑'; });
  }
  _syncModeIcons();

  /* ── Curseur ────────────────────────────────────────────────── */
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
    var btn = e.target.closest ? e.target.closest('.mode-btn') : null;
    if (!btn) return;
    document.body.classList.toggle('light');
    var isLight = document.body.classList.contains('light');
    localStorage.setItem('sublizme_theme', isLight ? 'light' : 'dark');
    _syncModeIcons();
  });

  /* ── Helpers ────────────────────────────────────────────────── */
  function fitGiant(el) {
    if (!el) return;
    var p = el.parentElement;
    if (!p) return;
    var vn = '--foot-fs';
    el.style.setProperty(vn, 'clamp(96px,22vw,360px)');
    var tg = p.clientWidth - 48;
    var t = 0;
    while (el.scrollWidth > tg && t < 30) {
      var cur2 = parseFloat(getComputedStyle(el).getPropertyValue(vn)) || 360;
      var nx = Math.max(48, cur2 * .93);
      el.style.setProperty(vn, nx + 'px');
      if (nx <= 48) break;
      t++;
    }
  }

  /* ── API publique ───────────────────────────────────────────── */
  window.SublizmeSite = {

    /* Injecte la nav commune */
    injectNav: function(opts) {
      if (document.querySelector('.site-nav')) return;
      opts = opts || {};
      var isLight = document.body.classList.contains('light');
      var leftHTML = opts.back
        ? '<a href="' + opts.back + '" class="sn-back"><span class="sn-arr">←</span>' + (opts.label || 'Projets') + '</a>'
        : '<span class="sn-brand">→ Graphisme · Branding · Web</span>';

      var nav = document.createElement('nav');
      nav.className = 'site-nav';
      nav.id = 'site-nav';
      nav.innerHTML =
        '<div class="sn-left">' + leftHTML + '</div>' +
        '<div class="sn-socials">' +
          '<a href="#">Instagram</a><span class="sn-sep">/</span>' +
          '<a href="#">Behance</a><span class="sn-sep">/</span>' +
          '<a href="#">LinkedIn</a>' +
        '</div>' +
        '<div class="sn-links">' +
          '<a href="index.html#projects">Projets</a>' +
          '<a href="index.html#about">Studio</a>' +
          '<a href="index.html#contact">Contact</a>' +
          '<button class="mode-btn" id="mode-btn">' + (isLight ? '◐' : '◑') + '</button>' +
        '</div>';

      document.body.prepend(nav);
      nav.querySelectorAll('a,button').forEach(_addHover);
    },

    /* Injecte le contact + footer commun */
    injectFooter: function() {
      if (document.getElementById('footer-giant')) return;

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
            '<div class="f-socials">' +
              '<a href="#">Instagram</a>' +
              '<a href="#">Behance</a>' +
              '<a href="#">LinkedIn</a>' +
            '</div>' +
            '<div class="f-nav">' +
              '<a href="index.html#projects">Projets</a>' +
              '<a href="index.html#about">Studio</a>' +
              '<a href="index.html#contact">Contact</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-name-zone">' +
            '<div class="halftone" aria-hidden="true"></div>' +
            '<div class="footer-giant" id="footer-giant">' +
              '<div class="sans-name">Sublizme</div>' +
              '<div class="serif-name"><span>Studio</span><span class="punct">.</span></div>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(section);
      section.querySelectorAll('a').forEach(_addHover);

      var g = document.getElementById('footer-giant');
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function(){ fitGiant(g); });
      }
      setTimeout(function(){ fitGiant(g); }, 60);
      setTimeout(function(){ fitGiant(g); }, 500);
      window.addEventListener('resize', function(){ fitGiant(g); });
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

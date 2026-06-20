/**
 * Sublizme — site.js
 * Logique commune à toutes les pages :
 *   · curseur custom (point + anneau)
 *   · injection de la nav, du menu et du footer
 *   · ouverture/fermeture du menu
 *   · restauration du scroll sur retour vers une liste
 *   · hero des pages projet (image du cover → fond du .ph)
 *   · apparition au scroll des blocs projet
 */
(function () {
  'use strict';

  /* ── Wordmark SVG (utilise currentColor) ─────────────────── */
  var WORDMARK =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1382.81 239.48" fill="currentColor" aria-label="Sublizme" role="img">' +
      '<path d="M114.4,103.4l-28.28-5.66c-14.46-3.14-17.6-11-17.6-16.66,0-8.49,5.97-18.54,25.77-18.54,14.77,0,30.17,5.03,28.91,23.89h61.91c0-50.28-36.46-72.91-89.26-72.91S5.97,34.88,5.97,81.08c0,43.69,33.63,57.83,66.31,64.11l31.74,6.29c16.97,3.46,23.26,8.49,23.26,18.23,0,13.83-12.57,20.74-30.8,20.74-25.14,0-33.63-14.14-34.57-30.8H0c0,53.74,38.34,79.83,96.17,79.83,49.97,0,94.28-18.86,94.28-70.09,0-32.06-17.28-54.37-76.06-66Z"/>' +
      '<path d="M315.85,163.74c0,21.06-12.57,27.97-26.08,27.97s-22.94-6.91-22.94-27.97v-90.83h-58.14v105.29c0,39.29,23.57,61.28,55,61.28s46.51-20.74,49.66-38.34h2.51v35.2h58.14V72.91h-58.14v90.83Z"/>' +
      '<path d="M497.5,69.77c-21.69,0-37.71,10.06-42.43,18.86V16.34h-58.14v220h58.14v-15.72c4.72,8.8,20.74,18.86,42.43,18.86,33.63,0,70.08-23.89,70.08-84.86s-36.46-84.86-70.08-84.86ZM482.42,191.39c-14.14,0-29.86-11.31-29.86-36.77s15.71-36.77,29.86-36.77,30.48,11.31,30.48,36.77-16.03,36.77-30.48,36.77Z"/>' +
      '<rect x="582.67" y="16.34" width="58.14" height="220"/>' +
      '<rect x="663.75" y="72.91" width="58.14" height="163.43"/>' +
      '<path d="M692.66,0c-16.03,0-30.48,13.2-30.48,30.8s14.46,30.49,30.48,30.49,30.8-12.88,30.8-30.49-14.46-30.8-30.8-30.8Z"/>' +
      '<path d="M1149.3,69.77c-27.34,0-46.83,20.11-49.34,37.4h-.32c-7.23-24.2-26.08-37.4-48.08-37.4-25.46,0-43.06,20.75-45.57,38.34h-2.51v-35.2h-58.14v163.43h58.14v-90.83c0-21.06,10.69-27.97,21.37-27.97s19.8,6.91,19.8,27.97v90.83h58.14v-90.83c0-21.06,10.69-27.97,21.37-27.97s19.8,6.91,19.8,27.97v90.83h58.14v-105.28c0-39.29-21.69-61.29-52.8-61.29Z"/>' +
      '<path d="M1382.81,155.57c0-66-38.34-85.8-80.46-85.8s-85.17,22.31-85.17,83.91c0,65.05,45.57,85.8,84.86,85.8,42.43,0,71.97-22.95,78.57-60.66h-50.6c-1.89,7.54-5.66,16.97-27.03,16.97-16.97,0-27.66-6.91-30.48-27.03h109.37c.63-3.77.94-6.91.94-13.2ZM1272.81,136.08c2.83-14.77,11.32-22.63,27.97-22.63,21.69,0,26.4,13.51,27.34,22.63h-55.31Z"/>' +
      '<path d="M833.61,214.08c-.08-16.27-5.33-30.99-13.8-41.72-7.46-9.45-20.74-11.79-31.1-5.65-23.82,14.12-39.65,39.43-39.65,69.63h173.32v-81.71h-41.36c-26.12.19-47.27,26.7-47.42,59.45Z"/>' +
      '<path d="M833.61,95.17c.08,16.27,5.33,30.99,13.8,41.72,7.46,9.45,20.74,11.79,31.1,5.65,23.82-14.12,39.65-39.43,39.65-69.63h-173.32v81.71h41.37c26.12-.19,47.26-26.7,47.41-59.45Z"/>' +
    '</svg>';

  /* Symbole (marque 4 pétales) — utilisé dans la transition de page. */
  var SYMBOL =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177.56 163.43" fill="currentColor" aria-hidden="true">' +
      '<path d="M136.19,81.71h0c-26.12.19-47.27,26.7-47.42,59.45-.08-16.27-5.33-30.99-13.8-41.72-7.46-9.45-20.74-11.79-31.1-5.65-23.82,14.12-39.65,39.43-39.65,69.63h173.32v-81.71h-41.37Z"/>' +
      '<path d="M88.78,22.26c.08,16.27,5.33,30.99,13.8,41.72,7.46,9.45,20.74,11.79,31.1,5.65,23.82-14.12,39.65-39.43,39.65-69.63H0v81.71h41.37c26.12-.19,47.26-26.7,47.41-59.45Z"/>' +
    '</svg>';

  /* ── Curseur ──────────────────────────────────────────────────
     Curseur personnalisé retiré : on garde le curseur système par
     défaut sur tout le site. `initCursor`, `addHover` et
     `addCursorHover` restent des no-op pour ne pas casser les
     appels existants (nav, footer, menu, index.js). */
  function initCursor () {}
  function addHover () {}
  function addCursorHover () {}

  /* ── GSAP (CDN, chargé une seule fois pour le menu) ──────── */
  var _gsapLoading = false;
  function loadGSAP () {
    if (window.gsap || _gsapLoading) return;
    _gsapLoading = true;
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s.async = true;
    document.head.appendChild(s);
  }

  /* ── Liquid glass (réfraction SVG) ────────────────────────────
     D'après archisvaze/liquid-glass : une carte de déplacement
     générée en canvas encode dans R/G la réfraction au niveau du
     biseau (loi de Snell via l'IOR), appliquée au backdrop par
     feDisplacementMap. Couche spéculaire en plus. Sans ce moteur,
     le panneau menu n'aurait qu'un simple flou — pas de courbure. */
  var SURFACE_FNS = {
    convex_squircle: function (x) { return Math.pow(1 - Math.pow(1 - x, 4), 0.25); },
    convex_circle:   function (x) { return Math.sqrt(1 - (1 - x) * (1 - x)); },
    concave:         function (x) { return 1 - Math.sqrt(1 - (1 - x) * (1 - x)); }
  };

  function _refractionProfile (glassThickness, bezelWidth, heightFn, ior, samples) {
    samples = samples || 128;
    var eta = 1 / ior;
    function refract (nx, ny) {
      var dot = ny;
      var k = 1 - eta * eta * (1 - dot * dot);
      if (k < 0) return null;
      var sq = Math.sqrt(k);
      return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
    }
    var profile = new Float64Array(samples);
    for (var i = 0; i < samples; i++) {
      var x = i / samples;
      var y = heightFn(x);
      var dx = x < 1 ? 0.0001 : -0.0001;
      var y2 = heightFn(x + dx);
      var deriv = (y2 - y) / dx;
      var mag = Math.sqrt(deriv * deriv + 1);
      var ref = refract(-deriv / mag, -1 / mag);
      if (!ref) { profile[i] = 0; continue; }
      profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
    }
    return profile;
  }

  function _dispMap (w, h, radius, bezelWidth, profile, maxDisp) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var ctx = c.getContext('2d'); var img = ctx.createImageData(w, h); var d = img.data;
    for (var i = 0; i < d.length; i += 4) { d[i] = 128; d[i + 1] = 128; d[i + 2] = 0; d[i + 3] = 255; }
    var r = radius, rSq = r * r, r1Sq = (r + 1) * (r + 1);
    var rBSq = Math.pow(Math.max(r - bezelWidth, 0), 2);
    var wB = w - r * 2, hB = h - r * 2, S = profile.length;
    for (var y1 = 0; y1 < h; y1++) {
      for (var x1 = 0; x1 < w; x1++) {
        var x = x1 < r ? x1 - r : (x1 >= w - r ? x1 - r - wB : 0);
        var y = y1 < r ? y1 - r : (y1 >= h - r ? y1 - r - hB : 0);
        var dSq = x * x + y * y;
        if (dSq > r1Sq || dSq < rBSq) continue;
        var dist = Math.sqrt(dSq);
        var fromSide = r - dist;
        var op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
        if (op <= 0 || dist === 0) continue;
        var cos = x / dist, sin = y / dist;
        var bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
        var disp = profile[bi] || 0;
        var dX = (-cos * disp) / maxDisp, dY = (-sin * disp) / maxDisp;
        var idx = (y1 * w + x1) * 4;
        d[idx]     = (128 + dX * 127 * op + 0.5) | 0;
        d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
      }
    }
    ctx.putImageData(img, 0, 0); return c.toDataURL();
  }

  function _specMap (w, h, radius, bezelWidth, angle) {
    angle = angle != null ? angle : Math.PI / 3;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var ctx = c.getContext('2d'); var img = ctx.createImageData(w, h); var d = img.data; d.fill(0);
    var r = radius, rSq = r * r, r1Sq = (r + 1) * (r + 1);
    var rBSq = Math.pow(Math.max(r - bezelWidth, 0), 2);
    var wB = w - r * 2, hB = h - r * 2;
    var sv = [Math.cos(angle), Math.sin(angle)];
    for (var y1 = 0; y1 < h; y1++) {
      for (var x1 = 0; x1 < w; x1++) {
        var x = x1 < r ? x1 - r : (x1 >= w - r ? x1 - r - wB : 0);
        var y = y1 < r ? y1 - r : (y1 >= h - r ? y1 - r - hB : 0);
        var dSq = x * x + y * y;
        if (dSq > r1Sq || dSq < rBSq) continue;
        var dist = Math.sqrt(dSq);
        var fromSide = r - dist;
        var op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
        if (op <= 0 || dist === 0) continue;
        var cos = x / dist, sin = -y / dist;
        var dot = Math.abs(cos * sv[0] + sin * sv[1]);
        var edge = Math.sqrt(Math.max(0, 1 - Math.pow(1 - fromSide, 2)));
        var coeff = dot * edge;
        var col = (255 * coeff) | 0;
        var alpha = (col * coeff * op) | 0;
        var idx = (y1 * w + x1) * 4;
        d[idx] = col; d[idx + 1] = col; d[idx + 2] = col; d[idx + 3] = alpha;
      }
    }
    ctx.putImageData(img, 0, 0); return c.toDataURL();
  }

  var _glassCache = {};
  function buildLiquidGlass (el, filterId, opts) {
    opts = opts || {};
    var w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (w < 2 || h < 2) return false;
    var prev = _glassCache[filterId];
    if (prev && prev.w === w && prev.h === h) { _applyGlass(el, filterId); return true; }

    var radius      = opts.radius      != null ? opts.radius      : (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24);
    /* Plafonne le rayon à la moitié de la plus petite dimension :
       un border-radius:999px (pill) reste plafonné à h/2 visuellement
       → la bande bezel doit suivre, sinon la carte de déplacement
       est totalement neutre et l'effet ne se voit pas. */
    radius = Math.min(radius, Math.min(w, h) / 2);
    var bezelW      = opts.bezelWidth  != null ? opts.bezelWidth  : 26;
    var glassThick  = opts.thickness   != null ? opts.thickness   : 12;
    var ior         = opts.ior         != null ? opts.ior         : 1.45;
    var scaleRatio  = opts.scaleRatio  != null ? opts.scaleRatio  : 1;
    var blurAmt     = opts.blur        != null ? opts.blur        : 4;
    var specOpacity = opts.specOpacity != null ? opts.specOpacity : 0.6;
    var specSat     = opts.specSat     != null ? opts.specSat     : 1.3;
    var heightFn = SURFACE_FNS[opts.surface || 'convex_squircle'];
    var clampedBezel = Math.min(bezelW, radius - 1, Math.min(w, h) / 2 - 1);
    if (clampedBezel < 1) return false;

    var profile = _refractionProfile(glassThick, clampedBezel, heightFn, ior, 128);
    var maxDisp = Math.max.apply(null, Array.prototype.map.call(profile, Math.abs)) || 1;
    var dispUrl = _dispMap(w, h, radius, clampedBezel, profile, maxDisp);
    var specUrl = _specMap(w, h, radius, clampedBezel * 2.5);
    var scale = maxDisp * scaleRatio;

    var defs = document.getElementById('liquid-glass-defs');
    if (!defs) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
      svg.setAttribute('color-interpolation-filters', 'sRGB');
      /* PAS de overflow:hidden ni width/height:0 en CSS : sur le
         chemin GPU de Chrome ça clippe la rasterisation des feImage
         (cartes de déplacement) à zéro → la réfraction disparaît,
         seul le flou subsiste. Conteneur identique au test qui marche. */
      svg.style.cssText = 'position:absolute';
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.id = 'liquid-glass-defs';
      svg.appendChild(defs); document.body.appendChild(svg);
    }
    var holder = document.getElementById('lg-holder-' + filterId);
    if (!holder) {
      holder = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      holder.id = 'lg-holder-' + filterId;
      defs.appendChild(holder);
    }
    holder.innerHTML =
      /* Région étendue : avec 0/100, les pixels déplacés par
         feDisplacementMap au-delà des bords étaient clippés et
         la réfraction n'était quasi pas visible. */
      '<filter id="' + filterId + '" x="-25%" y="-25%" width="150%" height="150%">' +
        '<feGaussianBlur in="SourceGraphic" stdDeviation="' + blurAmt + '" result="b"/>' +
        '<feImage href="' + dispUrl + '" x="0" y="0" width="' + w + '" height="' + h + '" result="dm"/>' +
        '<feDisplacementMap in="b" in2="dm" scale="' + scale + '" xChannelSelector="R" yChannelSelector="G" result="disp"/>' +
        '<feColorMatrix in="disp" type="saturate" values="' + specSat + '" result="dispSat"/>' +
        '<feImage href="' + specUrl + '" x="0" y="0" width="' + w + '" height="' + h + '" result="sl"/>' +
        '<feComposite in="dispSat" in2="sl" operator="in" result="sm"/>' +
        '<feComponentTransfer in="sl" result="sf"><feFuncA type="linear" slope="' + specOpacity + '"/></feComponentTransfer>' +
        '<feBlend in="sm" in2="disp" mode="normal" result="ws"/>' +
        '<feBlend in="sf" in2="ws" mode="normal"/>' +
      '</filter>';

    _glassCache[filterId] = { w: w, h: h };
    _applyGlass(el, filterId);
    return true;
  }

  function _applyGlass (el, filterId) {
    el.style.webkitBackdropFilter = 'url(#' + filterId + ')';
    el.style.backdropFilter        = 'url(#' + filterId + ')';
  }

  /* ── Glass appliqué à tous les .menu-btn de la page ──────────
     Tu peux régler ici les paramètres de réfraction du bouton. */
  var BTN_GLASS_OPTS = {
    bezelWidth:  14,
    thickness:   80,
    ior:         1.6,
    scaleRatio:  2.0,
    blur:        0.3,
    specOpacity: 0.25,
    specSat:     2
  };
  function applyMenuBtnGlasses () {
    document.querySelectorAll(
      '.menu-btn, .sn-logo, .sn-back, ' +              /* nav */
      '.ph-tag, ' +                                    /* tags hero projet */
      '.contact-card, .contact-portrait, ' +           /* footer cards */
      '.response-badge, .portrait-tag'                 /* footer petits pills */
    ).forEach(function (el, i) {
      buildLiquidGlass(el, 'nav-glass-' + i, BTN_GLASS_OPTS);
    });
  }
  var _btnGlassT;
  window.addEventListener('resize', function () {
    clearTimeout(_btnGlassT);
    _btnGlassT = setTimeout(applyMenuBtnGlasses, 200);
  });

  /* ── API publique ─────────────────────────────────────────── */
  window.SublizmeSite = {

    /* Nav globale en haut de page */
    injectNav: function (opts) {
      if (document.querySelector('.site-nav')) return;
      opts = opts || {};

      var left = opts.back
        ? '<a href="' + opts.back + '" class="sn-back"><span class="sn-arr">←</span>' + (opts.label || 'Projets') + '</a>'
        : '<a href="index.html" class="sn-logo">' + WORDMARK + '</a>';

      var nav = document.createElement('nav');
      nav.className = 'site-nav';
      nav.innerHTML =
        '<div class="sn-left">' + left + '</div>' +
        '<div class="sn-links">' +
          '<button class="menu-btn" aria-label="Ouvrir le menu">menu</button>' +
        '</div>';

      document.body.prepend(nav);
      nav.querySelectorAll('a, button').forEach(addHover);
      this.injectMenu();
      /* Le bouton menu de cette nav vient d'être ajouté → on lui
         applique le liquid glass tout de suite. */
      applyMenuBtnGlasses();
    },

    /* Bloc contact + footer en bas de page.
       Le mail est désormais intégré à la carte « Coordonnées »
       (plus de gros CTA email isolé). */
    injectFooter: function () {
      if (document.getElementById('contact')) return;

      var section = document.createElement('section');
      section.className = 'contact';
      section.id = 'contact';
      section.innerHTML =
        '<div class="contact-head">' +
          '<div class="contact-head-top">' +
            '<span class="label-caps">Parlons-en</span>' +
            '<span class="pill"><span class="avail-dot"></span>Disponible</span>' +
          '</div>' +
        '</div>' +

        '<div class="contact-grid">' +
          '<div class="contact-cards">' +
            '<div class="contact-card card-project">' +
              '<div class="col-label">Un projet ?</div>' +
              '<p>Un brief, une idée,<br>une ambition à construire.<br>On vous répond sous 48h.</p>' +
              '<span class="response-badge"><span class="avail-dot"></span>Réponse sous 48h</span>' +
            '</div>' +
            '<div class="contact-card">' +
              '<div class="col-label">Réseaux</div>' +
              '<a href="#" class="link-row hover-star">Instagram<span class="arr">↗</span></a>' +
              '<a href="#" class="link-row hover-star">Behance<span class="arr">↗</span></a>' +
              '<a href="#" class="link-row hover-star">LinkedIn<span class="arr">↗</span></a>' +
            '</div>' +
            '<div class="contact-card">' +
              '<div class="col-label">Coordonnées</div>' +
              '<p class="coord"><span class="coord-k">Email</span><a href="mailto:hello@sublizme.fr">hello@sublizme.fr</a></p>' +
              '<p class="coord"><span class="coord-k">Téléphone</span><a href="tel:+33600000000">+33 6 00 00 00 00</a></p>' +
              '<p class="coord"><span class="coord-k">Adresse</span>Paris, France</p>' +
            '</div>' +
          '</div>' +
          '<div class="contact-portrait">' +
            '<img src="assets/img/Profil 01.jpg" alt="Portrait" loading="lazy">' +
            '<div class="portrait-tag"><span class="avail-dot"></span>Sublizme · Studio</div>' +
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
      section.querySelectorAll('a, button').forEach(addHover);
    },

    /* Menu plein-écran (drawer à droite) */
    injectMenu: function () {
      if (document.getElementById('menu-overlay')) return;

      var ov = document.createElement('div');
      ov.className = 'menu-overlay';
      ov.id = 'menu-overlay';
      ov.setAttribute('aria-hidden', 'true');
      ov.innerHTML =
        '<div class="menu-scrim" data-menu-close></div>' +
        '<div class="menu-panel" role="dialog" aria-modal="true" aria-label="Menu">' +
          '<div class="menu-top">' +
            '<button class="menu-close" data-menu-close aria-label="Fermer le menu">' +
              '<span class="mc-txt">close</span><span class="mc-x">✕</span>' +
            '</button>' +
          '</div>' +
          '<nav class="menu-links">' +
            '<a href="index.html#about"    data-target="about"    class="hover-star"><span>Studio</span></a>' +
            '<a href="index.html#projects" data-target="projects" class="hover-star"><span>Projet</span></a>' +
            '<a href="index.html#services" data-target="services" class="hover-star"><span>Services</span></a>' +
            '<a href="index.html#contact"  data-target="contact"  class="hover-star"><span>Contact</span></a>' +
          '</nav>' +
        '</div>';

      document.body.appendChild(ov);

      var panel = ov.querySelector('.menu-panel');
      var scrim = ov.querySelector('.menu-scrim');
      var links = ov.querySelectorAll('.menu-links a');

      /* Liquid glass — réfraction SVG appliquée au backdrop.
         Params utilisateur : Glass Thickness 80, Bezel 60, IOR 3,
         Scale 1, Blur 0.3, Specular Opacity 0.5, Saturation 4. */
      var GLASS_OPTS = {
        bezelWidth:  60,
        thickness:   80,
        ior:         3.0,
        scaleRatio:  1.0,
        blur:        0.3,
        specOpacity: 0.5,
        specSat:     4
      };
      function buildGlass () { buildLiquidGlass(panel, 'menu-glass-filter', GLASS_OPTS); }
      requestAnimationFrame(buildGlass);
      panel.style.willChange = 'transform';
      var _glassResizeT;
      window.addEventListener('resize', function () {
        clearTimeout(_glassResizeT);
        _glassResizeT = setTimeout(buildGlass, 200);
      });

      loadGSAP();

      function menuBtns () { return document.querySelectorAll('.menu-btn'); }

      var openTl = null, closeTl = null;

      function resetAll (g) {
        if (openTl)  { openTl.kill();  openTl  = null; }
        if (closeTl) { closeTl.kill(); closeTl = null; }
        g.killTweensOf([panel, scrim]);
        g.killTweensOf(links);
        g.killTweensOf(menuBtns());
        g.set(panel, { x: '105%', opacity: 1, clearProps: 'transition' });
        g.set(scrim, { opacity: 0, clearProps: 'transition' });
        links.forEach(function (a) { a.style.transition = 'none'; });
        g.set(links, { x: 24, opacity: 0 });
      }

      function openMenu () {
        ov.classList.add('open');
        ov.setAttribute('aria-hidden', 'false');
        /* Le panneau a maintenant une vraie taille (n'est plus
           visibility:hidden) → on construit le filtre de réfraction. */
        buildGlass();
        var g = window.gsap;
        var btns = menuBtns();
        if (!g) {
          btns.forEach(function (b) { b.style.opacity = '0'; b.style.pointerEvents = 'none'; });
          return;
        }
        resetAll(g);
        btns.forEach(function (b) { b.style.transition = 'none'; b.style.pointerEvents = 'none'; });

        openTl = g.timeline();
        openTl
          .to(btns,  { opacity: 0, duration: .2,  ease: 'power2.out' }, 0)
          .to(scrim, { opacity: 1, duration: .45, ease: 'power2.out' }, 0)
          .to(panel, { x: '0%',    duration: .55, ease: 'power3.out' }, 0)
          .to(links, { x: 0, opacity: 1, stagger: .04, duration: .5, ease: 'power3.out' }, 0);
      }

      function closeMenu () {
        var g = window.gsap;
        var btns = menuBtns();
        if (!g) {
          ov.classList.remove('open');
          ov.setAttribute('aria-hidden', 'true');
          btns.forEach(function (b) { b.style.opacity = ''; b.style.pointerEvents = ''; });
          return;
        }
        if (openTl) { openTl.kill(); openTl = null; }
        g.killTweensOf([panel, scrim]);
        g.killTweensOf(links);
        g.killTweensOf(btns);
        ov.style.pointerEvents = 'none';

        closeTl = g.timeline({
          onComplete: function () {
            ov.classList.remove('open');
            ov.setAttribute('aria-hidden', 'true');
            ov.style.pointerEvents = '';
            btns.forEach(function (b) { b.style.transition = ''; b.style.pointerEvents = ''; });
          }
        });
        closeTl
          .to(panel, { x: '105%',  duration: .5, ease: 'power3.in' }, 0)
          .to(scrim, { opacity: 0, duration: .5, ease: 'power2.in' }, 0)
          .to(links, { opacity: 0, duration: .3, ease: 'power2.in', stagger: { each: .03, from: 'end' } }, 0)
          .to(btns,  { opacity: 1, duration: .3, ease: 'power2.out' }, .3);
      }

      document.addEventListener('click', function (e) {
        if (e.target.closest('.menu-btn'))      { e.preventDefault(); openMenu(); }
        else if (e.target.closest('[data-menu-close]')) { closeMenu(); }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && ov.classList.contains('open')) closeMenu();
      });

      /* Liens menu : scroll fluide si la section existe sur la page courante */
      links.forEach(function (a) {
        a.addEventListener('click', function (e) {
          var el = document.getElementById(a.getAttribute('data-target'));
          if (el) {
            e.preventDefault();
            closeMenu();
            setTimeout(function () { el.scrollIntoView({ behavior: 'smooth' }); }, 140);
          }
        });
      });

      ov.querySelectorAll('a, button').forEach(addHover);
    },

    addCursorHover: addCursorHover,

    /* Sauvegarde + restauration du scroll sur retour depuis une page projet */
    initScrollRestore: function () {
      document.querySelectorAll('a.project-row').forEach(function (a) {
        a.addEventListener('click', function () {
          sessionStorage.setItem('sublizme_scrollY', String(Math.round(window.scrollY)));
        });
      });

      var saved = sessionStorage.getItem('sublizme_scrollY');
      if (saved === null) return;
      sessionStorage.removeItem('sublizme_scrollY');
      document.documentElement.style.scrollBehavior = 'auto';
      var y = parseInt(saved, 10);
      requestAnimationFrame(function () {
        window.scrollTo(0, y);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            document.documentElement.style.scrollBehavior = '';
          });
        });
      });
    }
  };

  /* ── Pages projet : hero (image du cover → fond du .ph) ─── */
  function initProjectHero () {
    var ph = document.querySelector('.ph');
    var cover = document.querySelector('.pc-cover');
    if (!ph || !cover) return;
    var img = cover.querySelector('img');
    var src = img ? img.getAttribute('src') : null;
    if (src) {
      var bg = document.createElement('div');
      bg.className = 'ph-bg';
      bg.style.backgroundImage = "url('" + src + "')";
      var ovr = document.createElement('div');
      ovr.className = 'ph-overlay';
      ph.insertBefore(ovr, ph.firstChild);
      ph.insertBefore(bg,  ph.firstChild);
    }
    cover.parentNode.removeChild(cover);
  }

  /* ── Pages projet : apparition au scroll ─────────────────── */
  function initProjectReveal () {
    var els = document.querySelectorAll('.pi-desc, .pi-meta, .pn');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      });
    }, { threshold: .12 });
    els.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .8s ease, transform .8s ease';
      io.observe(el);
    });
  }

  /* ── Scroll lissé (molette) ───────────────────────────────────
     Rend le défilement molette/trackpad un peu plus doux et « lent ».
     · On n'intercepte QUE la molette → le tactile, le clavier et les
       ancres restent natifs (et la zone défilante du menu aussi).
     · scrollTo en `instant` pour ne pas cumuler avec scroll-behavior.
     · clamp [0, max] → aucun dépassement/rebond en haut et en bas.
     Respecte prefers-reduced-motion et est désactivé sur le tactile. */
  function initSmoothScroll () {
    var mm = window.matchMedia;
    if (mm && (mm('(prefers-reduced-motion: reduce)').matches || mm('(pointer: coarse)').matches)) return;

    var EASE = 0.12;   // plus bas = plus doux / plus « lent »
    var SPEED = 0.85;  // < 1 = un peu plus lent que la normale
    var target = window.scrollY, current = target, running = false;

    function maxScroll () {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
    function clamp (v) { return Math.max(0, Math.min(v, maxScroll())); }

    function loop () {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) { current = target; running = false; }
      window.scrollTo({ top: Math.round(current), left: 0, behavior: 'instant' });
      if (running) requestAnimationFrame(loop);
    }

    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;                                   // pinch-zoom : on laisse
      if (e.target.closest && e.target.closest('.menu-panel, [data-native-scroll]')) return;
      e.preventDefault();
      var dy = e.deltaY * (e.deltaMode === 1 ? 16 : (e.deltaMode === 2 ? window.innerHeight : 1));
      target = clamp(target + dy * SPEED);
      if (!running) { running = true; current = window.scrollY; requestAnimationFrame(loop); }
    }, { passive: false });

    /* Si le scroll bouge autrement (clavier, ancre, barre), on resynchronise. */
    window.addEventListener('scroll', function () {
      if (!running) { target = current = window.scrollY; }
    }, { passive: true });
    window.addEventListener('resize', function () { target = clamp(target); });
  }

  /* ── Transition de page (balayage vertical) ───────────────────
     L'overlay #pt couvre dès le 1er paint. À l'arrivée il se retire en
     glissant vers le haut ; au départ (lien vers un projet ou retour
     accueil) il revient depuis le bas pour couvrir, puis on navigue.
     Même animation enchaînée après le loader → expérience unifiée. */
  function initPageTransition () {
    var pt = document.getElementById('pt');
    if (!pt) return;
    pt.style.animation = 'none';                  // JS prend la main (annule le filet CSS)

    /* Bande de verre qui balaie en tête (créée ici, cachée au-dessus). */
    var line = document.createElement('div');
    line.className = 'pt-line';
    line.setAttribute('aria-hidden', 'true');
    document.body.appendChild(line);

    var EASE = 'cubic-bezier(.76,0,.24,1)';
    var navigating = false;

    /* Arrivée : le cache noir se rétracte vers le bas (scaleY 1→0, ancré
       en bas) et la bande de verre descend en tête → la page se dévoile
       du haut vers le bas, révélée par la ligne de liquid glass. */
    function reveal () {
      pt.style.transformOrigin = 'bottom';
      pt.style.transition = 'transform .75s ' + EASE;
      pt.style.transform = 'scaleY(0)';
      line.style.transition = 'top .75s ' + EASE;
      line.style.top = '100vh';
    }
    /* Départ : le cache se déroule depuis le haut (scaleY 0→1) et la bande
       descend → on couvre, puis on navigue. */
    function cover (href) {
      if (navigating) return; navigating = true;
      pt.style.transition = 'none';
      pt.style.transformOrigin = 'top';
      pt.style.transform = 'scaleY(0)';
      line.style.transition = 'none';
      line.style.top = '-78px';
      pt.offsetHeight;                            // reflow forcé
      pt.style.transition = 'transform .55s ' + EASE;
      pt.style.transform = 'scaleY(1)';
      line.style.transition = 'top .55s ' + EASE;
      line.style.top = '100vh';
      setTimeout(function () { window.location.href = href; }, 560);
    }
    window.__revealPage = reveal;

    /* Intercepte uniquement les liens internes vers un projet ou l'accueil. */
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(mailto:|tel:|#)/.test(href)) return;
      if (!/(?:^|\/)(?:projet-[\w-]+|index)\.html(?:[?#]|$)/.test(href)) return;
      /* Lien vers la PAGE COURANTE (ancre #section sur l'accueil) → pas de
         transition, on laisse le comportement natif. On normalise « /index.html »
         et « / » pour qu'ils soient équivalents. */
      var dest = new URL(href, location.href);
      var norm = function (p) { return p.replace(/\/index\.html$/, '/'); };
      if (norm(dest.pathname) === norm(location.pathname)) return;
      e.preventDefault();
      cover(href);
    });

    /* Retour navigateur (bfcache) : l'overlay peut être resté en position
       « couvre » → on le retire. */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { navigating = false; reveal(); }
    });

    /* Reveal à l'arrivée : si le loader va s'afficher (1ʳᵉ visite accueil),
       c'est lui qui enchaînera (via __revealPage) ; sinon on révèle direct. */
    var loaderWillShow = document.getElementById('loader') && !sessionStorage.getItem('sublizme_loaded');
    if (!loaderWillShow) requestAnimationFrame(function () { requestAnimationFrame(reveal); });
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  initProjectHero();
  initProjectReveal();

  function boot () {
    initPageTransition();
    initCursor();
    initSmoothScroll();
    /* Applique le liquid glass sur tous les éléments visés (nav + tags +
       cards). On rebuilde une seconde fois après chargement des fonts
       custom : sinon la taille mesurée à DOMContentLoaded peut être
       fausse (fallback font) et la carte de déplacement se calcule pour
       de mauvaises dimensions → glass invisible (cas des pages projet). */
    requestAnimationFrame(applyMenuBtnGlasses);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(applyMenuBtnGlasses);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

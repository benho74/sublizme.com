/**
 * Sublizme — index.js
 * Logique propre à la page d'accueil :
 *   · about reveal (lettre par lettre)
 *   · hero foot piloté par scroll
 *   · indicateur % de scroll
 *   · pile d'images qui suit le curseur sur la liste des projets
 *   · accordéon services
 */
(function () {
  'use strict';

  /* ── Sélecteurs ───────────────────────────────────────────── */
  var heroEl     = document.getElementById('hero');
  var heroFoot   = document.getElementById('hero-foot');
  var pctEl      = document.getElementById('pct');
  var stackEl    = document.getElementById('cursor-stack');
  var projectsEl = document.getElementById('projects');
  var rows       = document.querySelectorAll('.project-row');

  SublizmeSite.injectFooter();
  SublizmeSite.injectMenu();
  var contactEl  = document.getElementById('contact');

  /* ── Hero : grille animée en fond (canvas) ────────────────────
     Port vanilla du composant « FlowingRibbons » : une grille déformée
     par des ondes (+ réaction au survol et au clic). Couleurs inversées :
     lignes blanches sur fond noir. Le logo noir est posé par-dessus (CSS).
     L'animation se met en pause quand le hero n'est plus visible. */
  (function initHeroGrid () {
    var canvas = document.getElementById('hero-grid');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* Exactement le noir du site : on lit la variable CSS --bg (au lieu
       d'écrire la couleur en dur) → toujours identique au fond du site,
       au logo et au dégradé (qui utilisent tous var(--bg)). */
    var BG = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0a0a0a';
    var LINE = 'rgba(255,255,255,0.4)';
    var SPEED = 0.3;
    var DENSITY = (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) ? 46 : 64;

    var t = 0, raf = null, visible = true;
    var mouse = { x: -9999, y: -9999 };
    var waves = [];

    function resize () {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.parentElement.getBoundingClientRect();
      var w = rect.width || window.innerWidth, h = rect.height || window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function mouseInfluence (x, y) {
      var dx = x - mouse.x, dy = y - mouse.y;
      return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 200);
    }
    function waveDisturbance (x, y, now) {
      var total = 0;
      for (var k = 0; k < waves.length; k++) {
        var d = waves[k], age = now - d.time;
        if (age < 3000) {
          var dx = x - d.x, dy = y - d.y, dist = Math.sqrt(dx * dx + dy * dy);
          var wr = (age / 3000) * 400;
          if (Math.abs(dist - wr) < 80) {
            total += (1 - age / 3000) * d.intensity * (1 - Math.abs(dist - wr) / 80) * Math.sin((dist - wr) * 0.1);
          }
        }
      }
      return total;
    }
    function deform (x, y, tt, p) {
      var mi = mouseInfluence(x, y), dist = waveDisturbance(x, y, Date.now());
      var mw = mi * Math.sin(tt * 0.02 + p * Math.PI * 2) * 20;
      var dw = dist * Math.sin(tt * 0.015 + p * Math.PI * 3) * 25;
      return {
        ox: Math.sin(p * Math.PI * 4 + tt * 0.01) * 30 + Math.sin(x * 0.02 + y * 0.015 + tt * 0.005) * 10 + mw + dw,
        oy: Math.sin(p * Math.PI * 7 - tt * 0.008) * 15 + mw * 0.5 + dw * 0.7
      };
    }

    function frame () {
      if (!visible) { raf = null; return; }
      t += SPEED;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      /* rw > largeur viewport → la grille déborde des deux côtés : pas
         d'espace vide à gauche/droite même avec la déformation. */
      var rw = w * 1.2, off = (w - rw) / 2, i, j, p, x, y, d;
      ctx.fillStyle = BG; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = LINE; ctx.lineWidth = 1.6;
      for (i = 0; i < DENSITY; i++) {
        x = off + (i / DENSITY) * rw;
        ctx.beginPath();
        for (j = 0; j <= DENSITY; j++) {
          p = (j / DENSITY) * 1.2 - 0.1; y = p * h;
          d = deform(x, y, t, p);
          if (j === 0) ctx.moveTo(x + d.ox, y + d.oy); else ctx.lineTo(x + d.ox, y + d.oy);
        }
        ctx.stroke();
      }
      for (j = 0; j < DENSITY; j++) {
        p = (j / DENSITY) * 1.2 - 0.1; y = p * h;
        ctx.beginPath();
        for (i = 0; i <= DENSITY; i++) {
          x = off + (i / DENSITY) * rw;
          d = deform(x, y, t, p);
          if (i === 0) ctx.moveTo(x + d.ox, y + d.oy); else ctx.lineTo(x + d.ox, y + d.oy);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    function start () { if (raf === null) raf = requestAnimationFrame(frame); }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mousedown', function (e) {
      var r = canvas.getBoundingClientRect(), now = Date.now();
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, time: now, intensity: 2 });
      waves = waves.filter(function (d) { return now - d.time < 3000; });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible) start();
      }, { threshold: 0 }).observe(canvas);
    }
    start();
  })();

  /* ── Hero : média qui s'agrandit au scroll + accroche qui s'écarte ──
     Scène épinglée (.hero / .hero-stage). On pilote la TAILLE du média et
     l'écartement des mots du titre selon la progression du scroll dans la
     scène — scroll naturel, aucun détournement de molette.
     Desktop = vidéo (autoplay/loop) ; mobile = image figée (économie data). */
  (function initHeroExpand () {
    var stage = document.querySelector('.hero-stage');
    var expand = document.getElementById('hero-expand');
    var title = document.getElementById('hero-title');
    if (!stage || !expand) return;

    var isMobile = window.matchMedia && window.matchMedia('(max-width: 960px)').matches;

    var media;
    if (isMobile) {
      media = document.createElement('img');
      media.src = 'assets/img/hero-poster.jpg';
      media.alt = '';
    } else {
      media = document.createElement('video');
      media.id = 'hero-video';                 // pour que le loader l'attende
      media.src = 'assets/img/hero-geneve.mp4?v=54';
      media.muted = true; media.loop = true; media.autoplay = true;
      media.setAttribute('muted', ''); media.setAttribute('playsinline', '');
      media.setAttribute('preload', 'auto'); media.setAttribute('disablepictureinpicture', '');
      if (media.play) { var pr = media.play(); if (pr && pr.catch) pr.catch(function () {}); }
    }
    media.className = 'hero-exp-media';
    media.setAttribute('aria-hidden', 'true');
    expand.appendChild(media);

    var w1 = title && title.querySelector('.ht-1');
    var w2 = title && title.querySelector('.ht-2');

    function track () { return Math.max(1, heroEl.offsetHeight - stage.offsetHeight); }

    function update () {
      var p = Math.max(0, Math.min(1, window.scrollY / track()));
      var mw = 300 + p * (isMobile ? 560 : 1300);
      var mh = 380 + p * (isMobile ? 360 : 520);
      expand.style.width = 'min(' + Math.round(mw) + 'px, 96vw)';
      expand.style.height = 'min(' + Math.round(mh) + 'px, 86vh)';
      /* Désaturation pilotée par le scroll :
         · 0 %  → grayscale(1) = N&B
         · 80 % → grayscale(0) = couleur complète
         (clampé à 0 entre 80 % et 100 %). */
      var gs = Math.max(0, 1 - p / 0.8);
      media.style.filter = 'grayscale(' + gs.toFixed(3) + ')';
      if (w1 && w2) {
        var tx = p * (isMobile ? 55 : 42);
        w1.style.transform = 'translateX(-' + tx + 'vw)';
        w2.style.transform = 'translateX(' + tx + 'vw)';
        title.style.opacity = String(Math.max(0, 1 - p * 1.5));
      }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', function () {
      isMobile = window.matchMedia && window.matchMedia('(max-width: 960px)').matches;
      update();
    });
  })();

  /* ── Données des projets ──────────────────────────────────── */
  var PROJECTS = [
    { img: 'assets/img/projects/lacourdesgrands-cover.png' },
    { img: 'assets/img/projects/stylingcoiffure-cover.png' },
    { img: 'assets/img/projects/congresannecy-cover.png'   },
    { img: 'assets/img/projects/vulpo-cover.jpg'           },
    { img: 'assets/img/projects/lakepub-id-cover.jpg'      },
    { img: 'assets/img/projects/fablab-cover.png'          },
    { img: 'assets/img/projects/lempire-cover.png'         },
    { img: 'assets/img/projects/lakepub-web-cover.png'     }
  ];

  /* ── Écran de chargement : % basé sur le chargement RÉEL ──────
     On précharge pour de vrai la vidéo du hero + les images projet +
     les polices ; le % affiché suit cette progression réelle. Une
     sécurité (12 s) évite tout blocage si un asset traîne. */
  (function initLoader () {
    var loader = document.getElementById('loader');
    if (!loader) return;

    /* Le loader ne s'affiche qu'à la 1ʳᵉ arrivée de la session. Sur un
       retour depuis un projet (ou toute navigation interne), on le retire
       tout de suite → la position/ancre est conservée, pas de
       rechargement visuel ni de remontée en haut. */
    if (sessionStorage.getItem('sublizme_loaded')) {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      return;
    }
    try { sessionStorage.setItem('sublizme_loaded', '1'); } catch (e) {}

    var numEl = document.getElementById('loader-num');
    var barEl = document.getElementById('loader-bar');
    var video = document.getElementById('hero-video');

    /* Mobile : la vidéo est cachée (son chargement est déjà coupé par le
       scrub) → le loader ne l'attend pas. */
    var isMobile = window.matchMedia && window.matchMedia('(max-width: 960px)').matches;

    /* Images à précharger réellement (covers projet + portrait footer) */
    var imgs = PROJECTS.map(function (p) { return p.img; });
    imgs.push('assets/img/Profil 01.jpg');
    var imgTotal = imgs.length, imgLoaded = 0;
    imgs.forEach(function (src) {
      var im = new Image();
      im.onload = im.onerror = function () { imgLoaded++; };
      im.src = src;
    });

    var fontsReady = !(document.fonts && document.fonts.ready);
    if (!fontsReady) document.fonts.ready.then(function () { fontsReady = true; });

    function videoProgress () {
      if (isMobile || !video) return 1;
      if (video.readyState >= 4) return 1;            // HAVE_ENOUGH_DATA
      try {
        if (video.buffered.length && video.duration) {
          return Math.min(1, video.buffered.end(video.buffered.length - 1) / video.duration);
        }
      } catch (e) {}
      return 0;
    }
    /* % affiché : suit le chargement réel (vidéo + images + polices). */
    function displayProgress () {
      var imgP = imgTotal ? imgLoaded / imgTotal : 1;
      return videoProgress() * 0.7 + imgP * 0.2 + (fontsReady ? 0.1 : 0);
    }
    /* On peut révéler dès que le hero est prêt (vidéo bufferisée +
       polices). Les images projet finissent de charger en arrière-plan. */
    function heroReady () { return videoProgress() >= 1 && fontsReady; }

    var shown = 0, completing = false, faded = false, start = Date.now();
    var MIN_MS = 700, MAX_MS = 10000;

    function render () {
      var v = Math.round(shown);
      if (numEl) numEl.textContent = v;
      if (barEl) barEl.style.width = v + '%';
    }
    function fadeOut () {
      faded = true;
      loader.classList.add('is-done');
      if (!location.hash) window.scrollTo(0, 0);   // respecte une ancre éventuelle
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
        /* Enchaîne sur la transition de page (balayage) → loader et arrivée
           unifiés. Le panneau #pt (noir, sous le loader) se retire en slidant. */
        if (window.__revealPage) window.__revealPage();
      }, 500);
    }

    /* setInterval plutôt que rAF : avance même si l'onglet passe en
       arrière-plan (rAF s'y fige) → le loader ne reste jamais coincé. */
    var iv = setInterval(function tick () {
      var elapsed = Date.now() - start;
      if (!completing && ((heroReady() && elapsed >= MIN_MS) || elapsed >= MAX_MS)) completing = true;
      var realP = (completing ? 1 : displayProgress()) * 100;
      shown += (realP - shown) * 0.12;
      if (realP - shown < 0.5) shown = realP;
      render();
      if (completing && shown >= 99.5 && !faded) { clearInterval(iv); fadeOut(); }
    }, 33);
  })();

  /* Vignette + wrap texte sur chaque ligne (visible en mobile) */
  rows.forEach(function (row, i) {
    var thumb = document.createElement('span');
    thumb.className = 'thumb';
    thumb.style.backgroundImage = "url('" + PROJECTS[i].img + "')";
    var wrap = document.createElement('span');
    wrap.className = 'row-text';
    while (row.firstChild) wrap.appendChild(row.firstChild);
    row.appendChild(thumb);
    row.appendChild(wrap);
  });

  /* ── About reveal — découpe en lettres ────────────────────── */
  function splitLetters (root) {
    var letters = [];
    function emitWords (text, container) {
      text.split(/(\s+)/).forEach(function (tok) {
        if (tok === '') return;
        if (/^\s+$/.test(tok)) { container.appendChild(document.createTextNode(tok)); return; }
        var word = document.createElement('span'); word.className = 'word';
        for (var i = 0; i < tok.length; i++) {
          var s = document.createElement('span');
          s.className = 'ltr';
          s.textContent = tok[i];
          word.appendChild(s);
          letters.push(s);
        }
        container.appendChild(word);
      });
    }
    var nodes = Array.prototype.slice.call(root.childNodes);
    root.textContent = '';
    nodes.forEach(function (node) {
      if (node.nodeType === 3) { emitWords(node.textContent, root); return; }
      if (node.nodeType === 1) {
        var el = document.createElement(node.tagName.toLowerCase());
        emitWords(node.textContent, el);
        root.appendChild(el);
      }
    });
    return letters;
  }
  var aboutCopyEl = document.getElementById('about-copy');
  var revealLetters = splitLetters(aboutCopyEl);

  function updateAboutReveal () {
    var rect = aboutCopyEl.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * .92;
    var end   = vh * .42;
    var p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    var n = Math.round(p * revealLetters.length);
    revealLetters.forEach(function (l, i) { l.classList.toggle('revealed', i < n); });
  }

  /* ── Pile d'images qui suit le curseur ───────────────────── */
  var mouseY = null;
  var projectListEl = document.querySelector('.project-list');
  var cards = [];
  var currentIdx = 0;
  var stackX = 0, stackY = 0, stackTX = 0, stackTY = 0, stackScale = 0;

  function lerp (a, b, t) { return a + (b - a) * t; }

  function pushCard (idx) {
    var card = document.createElement('div');
    card.className = 'cursor-card';
    card.style.backgroundImage = "url('" + PROJECTS[idx].img + "')";
    stackEl.appendChild(card);
    cards.push(card);
    while (cards.length > 5) cards.shift().remove();
  }

  function setActive (idx) {
    rows.forEach(function (row, i) { row.classList.toggle('muted', i !== idx); });
    if (idx === currentIdx) return;
    currentIdx = idx;
    if (mouseY !== null) pushCard(idx);
  }

  function highlightByY (y) {
    /* On prend la ligne réellement SOUS le curseur (rect qui contient y),
       pour rester en raccord avec le :hover CSS (étoile + slide). Le repli
       « plus proche du centre » ne sert qu'en dehors des lignes. */
    var idx = -1, closest = 0, min = Infinity;
    rows.forEach(function (row, i) {
      var r = row.getBoundingClientRect();
      if (y >= r.top && y < r.bottom) idx = i;
      var d = Math.abs(r.top + r.height / 2 - y);
      if (d < min) { min = d; closest = i; }
    });
    setActive(idx === -1 ? closest : idx);
  }

  projectListEl.addEventListener('mousemove', function (e) {
    var firstEntry = mouseY === null;
    mouseY = e.clientY;
    stackTX = e.clientX; stackTY = e.clientY;
    if (firstEntry) {
      stackX = stackTX; stackY = stackTY;
      if (!cards.length) pushCard(currentIdx);
    }
    highlightByY(mouseY);
  });
  projectListEl.addEventListener('mouseleave', function () { mouseY = null; });

  (function animStack () {
    stackX = lerp(stackX, stackTX, .14);
    stackY = lerp(stackY, stackTY, .14);
    stackScale = lerp(stackScale, mouseY !== null ? 1 : 0, .12);
    if (stackScale < .01 && mouseY === null && cards.length) {
      cards.forEach(function (c) { c.remove(); });
      cards = [];
    }
    stackEl.style.transform =
      'translate3d(' + stackX + 'px, ' + stackY + 'px, 0) translate(-50%, -58%) scale(' + stackScale + ')';
    requestAnimationFrame(animStack);
  })();

  function updateActiveProjectByScroll () {
    var r = projectsEl.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    /* Si le curseur est sur la liste, on suit sa position pendant le scroll
       (le contenu défile sous un curseur fixe → la ligne active change) afin
       que la surbrillance reste en raccord avec l'étoile/le slide du :hover.
       Sinon (souris hors liste), on se base sur le centre du viewport. */
    highlightByY(mouseY !== null ? mouseY : window.innerHeight * .5);
  }

  /* ── Hero foot piloté par scroll ──────────────────────────
     Si le navigateur supporte `animation-timeline:scroll()`,
     c'est le compositeur qui anime → ce fallback JS n'a rien
     à faire (sinon il écraserait l'animation CSS). */
  var nativeSticky = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline:scroll()'));
  function updateHeroFoot () {
    if (nativeSticky) return;
    var vh = window.innerHeight;
    var h = heroFoot.offsetHeight;
    var rest = vh - h - 32;
    /* Le foot reste en bas pendant toute la vidéo (scrub = .hero moins
       un écran), puis monte sur la transition vers la page 1. */
    var scrubEnd = heroEl.offsetHeight - vh;
    var rise = Math.max(0, Math.min(1, (window.scrollY - scrubEnd) / vh));
    heroFoot.style.transform = 'translate3d(0,' + (rest * (1 - rise)) + 'px,0)';
  }

  /* ── Scroll principal ─────────────────────────────────────────
     Le hero-foot est mis à jour SYNCHRONEMENT (un seul `transform`,
     ultra léger, sur la couche compositeur) → reste parfaitement
     fluide même à scroll rapide. Tout le reste (reveal des 89
     lettres About, highlight projet, %) passe par un RAF throttle
     pour ne saturer aucune frame. ────────────────────────────── */
  function onScrollHeavy () {
    var scrollY = window.scrollY;
    var pastHero = scrollY >= heroEl.offsetHeight * .85;

    var earlyEnd = contactEl
      ? contactEl.offsetTop - window.innerHeight * .2
      : document.documentElement.scrollHeight - window.innerHeight;
    var p = Math.max(0, Math.min(100, Math.round(scrollY / earlyEnd * 100)));
    pctEl.textContent = String(p).padStart(2, '0') + '%';

    var contactRatio = contactEl ? contactEl.getBoundingClientRect().top / window.innerHeight : 1;
    pctEl.classList.toggle('visible', pastHero && contactRatio > .22);

    updateAboutReveal();
    updateActiveProjectByScroll();
  }

  var ticking = false;
  function onScroll () {
    updateHeroFoot();             // synchrone, frame-perfect
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onScrollHeavy(); ticking = false; });
  }
  updateHeroFoot();
  onScrollHeavy();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ── Accordéon services ──────────────────────────────────── */
  document.querySelectorAll('.service-row').forEach(function (row) {
    row.addEventListener('click', function () {
      var wasOpen = row.classList.contains('open');
      document.querySelectorAll('.service-row.open').forEach(function (r) { r.classList.remove('open'); });
      if (!wasOpen) row.classList.add('open');
    });
  });
  var firstRow = document.querySelector('.service-row');
  if (firstRow) firstRow.classList.add('open');

  /* ── effet01 — apparition par le bas sur sections 2 et 3.
     One-shot : on `unobserve` après le premier passage pour
     éviter toute interaction avec la cascade au cours du temps. */
  if ('IntersectionObserver' in window) {
    /* .svc-item est exclu : il a déjà sa propre animation au
       moment de l'ouverture de l'accordéon. */
    /* .project-row exclu : a son propre effet « wavy » (translateX
       piloté par scroll). L'animation fx01 utilise `transform` aussi
       → elle écraserait le translateX en fin d'anim (fill-mode both). */
    var fxEls = document.querySelectorAll(
      '.services-left .label, ' +
      '.services-left h2, ' +
      '.services-left .cta, ' +
      '.service-row'
    );
    fxEls.forEach(function (el) { el.classList.add('fx01'); });
    var fxIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('revealed');
        fxIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    fxEls.forEach(function (el) { fxIO.observe(el); });
  }

  /* ── Modules communs ─────────────────────────────────────── */
  SublizmeSite.initScrollRestore();
  SublizmeSite.addCursorHover('.project-row, .service-row');

  /* ── « WavyBlock » sur la liste des projets ───────────────────
     Chaque rangée est translatée horizontalement selon une sinusoïde
     pilotée par le scroll : la même phase passe à travers les lignes
     avec un déphasage par index → onde qui ondule serpente quand on
     scrolle. Aucun conflit avec le système hover (la translation est
     posée en inline, le hover modifie color/padding-left).
     Pour ajuster : AMP (amplitude px), FREQ (vitesse de l'onde par
     pixel scrollé), PHASE (déphasage entre 2 lignes adjacentes). */
  (function initProjectsWavy () {
    var rows = document.querySelectorAll('.project-row');
    if (!rows.length) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var AMP   = 10;      // amplitude horizontale en px (dramatique)
    var FREQ  = 0.003;    // vitesse de l'onde (rad / px de scroll)
    var PHASE = 0.5;     // déphasage par ligne (rad)
    var raf = null;

    function update () {
      raf = null;
      var sy = window.scrollY || window.pageYOffset || 0;
      for (var i = 0; i < rows.length; i++) {
        var theta = sy * FREQ + i * PHASE;
        var dx = Math.sin(theta) * AMP;
        rows[i].style.transform = 'translateX(' + dx.toFixed(2) + 'px)';
      }
    }
    function schedule () { if (raf === null) raf = requestAnimationFrame(update); }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  })();

  /* ── Animation X : câblage des cibles de la home ──────────────
     · Titres de la liste projets → synchro avec le changement de
       couleur (déclenché par .project-row:not(.muted), géré en CSS).
     · Noms des services (Graphisme, Branding, Web design) → déclenché
       par .fx-x-trigger:hover sur la ligne.
     · Texte du CTA « Démarrer un projet » → idem (l'étoile reste à
       côté, hors du wrapping). */
  document.querySelectorAll('.project-row .title').forEach(SublizmeSite.applyFxX);
  document.querySelectorAll('.service-row .name').forEach(SublizmeSite.applyFxX);
  document.querySelectorAll('.services-left .cta-txt').forEach(SublizmeSite.applyFxX);

})();

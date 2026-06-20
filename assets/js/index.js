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

  /* ── Hero : vidéo « scrubbée » au scroll ──────────────────────
     Vidéo plein écran épinglée (sticky, voir .hero / .hero-stage).
     Aucune lecture auto, aucun contrôle. En haut = 1ʳᵉ frame ; plus
     on scrolle, plus la vidéo avance (sa position ne bouge pas) ; en
     remontant elle revient en arrière. Une fois la vidéo finie, la
     scène se libère et la page continue normalement. */
  (function initHeroScrub () {
    var v = document.getElementById('hero-video');
    if (!v) return;
    var track = 1, target = 0, shown = -1, ready = false, raf = false;
    v.pause();

    /* Durée d'épinglage = hauteur de .hero moins la hauteur de la scène
       épinglée. On se base sur .hero-stage (et NON window.innerHeight) :
       sur mobile, innerHeight change quand la barre du navigateur
       apparaît/disparaît pendant le scroll → ça recalculait la « track »
       en plein milieu et faisait sauter/buguer la vidéo. .hero-stage
       (en svh) reste stable → scrub fluide. */
    var stageEl = document.querySelector('.hero-stage');
    function measure () {
      var stageH = stageEl ? stageEl.offsetHeight : window.innerHeight;
      track = Math.max(1, heroEl.offsetHeight - stageH);
    }
    function setTarget () {
      var p = Math.max(0, Math.min(1, window.scrollY / track));
      target = p * (v.duration || 8);
    }
    function seek () {
      raf = false;
      if (!ready) return;
      if (Math.abs(target - shown) > 0.001) {
        shown = target;
        try { v.currentTime = target; } catch (e) {}
      }
    }
    function requestSeek () { if (!raf) { raf = true; requestAnimationFrame(seek); } }

    function onReady () { ready = true; measure(); setTarget(); requestSeek(); }
    if (v.readyState >= 1) onReady();
    else v.addEventListener('loadedmetadata', onReady);

    window.addEventListener('scroll', function () { setTarget(); requestSeek(); }, { passive: true });
    window.addEventListener('resize', function () { measure(); setTarget(); requestSeek(); });
    setTarget();
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
      if (!video) return 1;
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
    var fxEls = document.querySelectorAll(
      '.project-row, ' +
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

})();

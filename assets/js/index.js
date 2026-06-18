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
    var closest = 0, min = Infinity;
    rows.forEach(function (row, i) {
      var r = row.getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - y);
      if (d < min) { min = d; closest = i; }
    });
    setActive(closest);
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
    if (mouseY !== null) return;
    var r = projectsEl.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    highlightByY(window.innerHeight * .5);
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
    var y = Math.max(0, rest - window.scrollY);
    heroFoot.style.transform = 'translate3d(0,' + y + 'px,0)';
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

/* =========================================================
   SEPTIEMBRE EN FLOR — script.js
   JavaScript vanilla ES6+, sin dependencias externas.
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. MENÚ MÓVIL
   --------------------------------------------------------- */
const initMobileMenu = () => {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navMenu');
  if (!toggle || !nav) return;

  const closeMenu = () => {
    toggle.classList.remove('is-open');
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  };

  toggle.addEventListener('click', toggleMenu);

  // Cierra el menú al elegir un enlace (útil en móvil)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Cierra el menú si se agranda la ventana a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
};

/* ---------------------------------------------------------
   2. APARICIÓN AL HACER SCROLL (Intersection Observer)
   --------------------------------------------------------- */
const initScrollReveal = () => {
  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
};

/* ---------------------------------------------------------
   3. MODO OSCURO
   --------------------------------------------------------- */
const initThemeToggle = () => {
  const button = document.getElementById('themeToggle');
  if (!button) return;

  const icon = button.querySelector('.theme-toggle-icon');
  const label = button.querySelector('.theme-toggle-text');
  const stored = localStorage.getItem('septiembre-tema');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      icon.textContent = '☀️';
      label.textContent = 'Modo claro';
      button.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      icon.textContent = '🌙';
      label.textContent = 'Modo oscuro';
      button.setAttribute('aria-pressed', 'false');
    }
  };

  if (stored) applyTheme(stored);

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('septiembre-tema', next);
  });
};

/* ---------------------------------------------------------
   4. JARDÍN INTERACTIVO — 10 efectos distintos
   --------------------------------------------------------- */

// Contenido de cada una de las diez flores.
const EFFECTS = {
  petalos: {
    mensaje: 'Un poco de septiembre cae sobre ti.',
  },
  aroma: {
    mensaje: 'Huele a girasoles recién abiertos y a mañana fresca.',
  },
  rayo: {
    mensaje: 'Un rayo de sol atraviesa las hojas y llega justo hasta aquí.',
  },
  viento: {
    mensaje: 'El viento mueve el campo entero, despacio, sin prisa.',
  },
  deseo: {
    mensaje: 'Deseo dorado: que todo lo bueno te encuentre primero.',
  },
  brote: {
    mensaje: 'Hay cosas que crecen sin hacer ruido. Esta es una de ellas.',
  },
  recuerdo: {
    mensaje: 'Guardado entre pétalos: un recuerdo cálido, solo para ti.',
  },
  tarde: {
    mensaje: 'La tarde se pinta de miel. Es la hora favorita del jardín.',
  },
  secreto: {
    mensaje: 'Psst... este jardín se plantó pensando en una sola persona.',
  },
  final: {
    mensaje: 'Para ti, Darcy. Toma esta flor en señal de crecimiento, las cosas siempre pasan por algo, se que lograras el exito.',
  },
};

// Genera pétalos cayendo dentro del escenario de revelación.
const spawnPetals = (stage, count = 14) => {
  const symbols = ['🌼', '🌻', '🌸'];
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 96}%`;
    petal.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
    petal.style.animationDelay = `${Math.random() * 0.6}s`;
    petal.style.fontSize = `${1 + Math.random() * 0.8}rem`;
    stage.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove());
  }
};

// Genera pequeñas chispas doradas alrededor del centro del escenario.
const spawnSparks = (stage, count = 16) => {
  const rect = stage.getBoundingClientRect();
  const originX = rect.width / 2;
  const originY = rect.height / 2;

  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'spark';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 60 + Math.random() * 70;
    spark.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    spark.style.left = `${originX}px`;
    spark.style.top = `${originY}px`;
    stage.appendChild(spark);
    spark.addEventListener('animationend', () => spark.remove());
  }
};

const initGarden = () => {
  const stage = document.getElementById('revealStage');
  const buttons = document.querySelectorAll('.flower-btn');
  if (!stage || !buttons.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clearStageEffectClasses = () => {
    stage.classList.remove('efecto-rayo', 'efecto-viento', 'efecto-final');
  };

  const renderEffect = (key, button) => {
    const data = EFFECTS[key];
    if (!data) return;

    clearStageEffectClasses();
    stage.innerHTML = '';

    // Mensaje central
    const message = document.createElement('p');
    message.className = 'reveal-message';
    message.textContent = data.mensaje;
    stage.appendChild(message);

    // Marca la flor como visitada
    button.classList.add('is-visited');

    if (prefersReducedMotion) return;

    // Efectos visuales específicos por botón
    switch (key) {
      case 'petalos':
      case 'recuerdo':
        spawnPetals(stage, 12);
        break;
      case 'rayo':
      case 'tarde':
        stage.classList.add('efecto-rayo');
        break;
      case 'viento':
        stage.classList.add('efecto-viento');
        break;
      case 'deseo':
      case 'secreto':
        spawnSparks(stage, 18);
        break;
      case 'brote':
        spawnPetals(stage, 6);
        break;
      case 'final':
        stage.classList.add('efecto-final');
        spawnPetals(stage, 22);
        spawnSparks(stage, 20);
        break;
      default:
        break;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const effectKey = button.dataset.effect;
      renderEffect(effectKey, button);

      // El botón final lleva, además, hasta la dedicatoria.
      if (effectKey === 'final') {
        window.setTimeout(() => {
          document.getElementById('dedicatoria')?.scrollIntoView({ behavior: 'smooth' });
        }, 900);
      }
    });
  });
};

/* ---------------------------------------------------------
   5. FLORES DECORATIVAS DEL HERO (generadas por JS)
   --------------------------------------------------------- */
const initHeroFlowers = () => {
  const group = document.querySelector('.hero-flowers');
  if (!group) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const total = 9;

  for (let i = 0; i < total; i += 1) {
    const cx = 60 + (1080 / total) * i + (Math.random() * 40 - 20);
    const cy = 430 + Math.random() * 40;
    const scale = 0.7 + Math.random() * 0.6;

    const flower = document.createElementNS(svgNS, 'g');
    flower.setAttribute('transform', `translate(${cx} ${cy}) scale(${scale})`);
    flower.setAttribute('opacity', '0.9');

    // Tallo
    const stem = document.createElementNS(svgNS, 'line');
    stem.setAttribute('x1', '0');
    stem.setAttribute('y1', '0');
    stem.setAttribute('x2', '0');
    stem.setAttribute('y2', '60');
    stem.setAttribute('stroke', 'var(--color-verde)');
    stem.setAttribute('stroke-width', '3');
    flower.appendChild(stem);

    // Pétalos (6 elipses alrededor del centro)
    for (let p = 0; p < 6; p += 1) {
      const angle = (360 / 6) * p;
      const petal = document.createElementNS(svgNS, 'ellipse');
      petal.setAttribute('cx', '0');
      petal.setAttribute('cy', '-14');
      petal.setAttribute('rx', '6');
      petal.setAttribute('ry', '13');
      petal.setAttribute('fill', 'var(--color-sol)');
      petal.setAttribute('transform', `rotate(${angle})`);
      flower.appendChild(petal);
    }

    // Centro
    const center = document.createElementNS(svgNS, 'circle');
    center.setAttribute('cx', '0');
    center.setAttribute('cy', '0');
    center.setAttribute('r', '6');
    center.setAttribute('fill', 'var(--color-ocre)');
    flower.appendChild(center);

    group.appendChild(flower);
  }
};

/* ---------------------------------------------------------
   INICIALIZACIÓN
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initThemeToggle();
  initGarden();
  initHeroFlowers();
});

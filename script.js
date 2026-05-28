// ============ Le Bistrot des Halles — script.js ============
// Animations : compteurs, reveal mot par mot, magnetic CTA, parallax hero
// Tout vanilla, zéro dépendance (sauf AOS via CDN figé)

if (typeof AOS !== 'undefined') {
  AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic', offset: 50 });
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ Nav scroll : transparent → solid ============
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============ Burger mobile ============
const burger = document.querySelector('.nav-burger');
const navMobile = document.getElementById('nav-mobile');
if (burger && navMobile) {
  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    navMobile.hidden = isOpen;
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      navMobile.hidden = true;
      document.body.style.overflow = '';
    });
  });
}

// ============ Galerie : filtres catégorisés + pagination "Voir plus" ============
const galerieGrid = document.getElementById('galerie-grid');
const filtreButtons = document.querySelectorAll('.galerie-filtres button');
const galerieItems = document.querySelectorAll('#galerie-grid > [data-cat]');
const seeMoreTrigger = document.querySelector('.see-more-trigger');

// État initial : filtre "Tout"
if (galerieGrid) galerieGrid.dataset.filter = 'all';

filtreButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filtre = btn.dataset.filtre;
    filtreButtons.forEach(b => b.classList.remove('actif'));
    btn.classList.add('actif');

    // Mémoriser le filtre actif sur le grid (le CSS s'en sert pour conditionner "Voir moins")
    galerieGrid.dataset.filter = filtre;

    // Mode "Tout" → respecter l'état actuel (collapsed ou expanded selon clic user)
    // Tous les autres filtres → déplier systématiquement (peu d'items par catégorie)
    if (filtre !== 'all') {
      galerieGrid.classList.add('expanded');
    }

    galerieItems.forEach(item => {
      const show = filtre === 'all' || item.dataset.cat === filtre;
      item.style.display = show ? '' : 'none';
    });
  });
});

// Caption depuis le alt de l'img pour le hover overlay
document.querySelectorAll('.galerie picture').forEach(pic => {
  const img = pic.querySelector('img');
  if (img && img.alt) pic.setAttribute('data-caption', img.alt);
});

// "Voir plus" : un seul clic sur la tuile floue déplie les extras
if (seeMoreTrigger) {
  seeMoreTrigger.addEventListener('click', (e) => {
    if (!galerieGrid.classList.contains('expanded')) {
      e.preventDefault();
      e.stopPropagation();
      galerieGrid.classList.add('expanded');
      // Optionnel : focus la première extra pour l'accessibilité clavier
      const firstExtra = galerieGrid.querySelector('.galerie-extra');
      if (firstExtra) firstExtra.querySelector('img')?.focus({ preventScroll: true });
    }
  }, true);
  // Accessibilité clavier
  seeMoreTrigger.setAttribute('role', 'button');
  seeMoreTrigger.setAttribute('tabindex', '0');
  seeMoreTrigger.setAttribute('aria-label', 'Voir toutes les photos de la galerie');
  seeMoreTrigger.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !galerieGrid.classList.contains('expanded')) {
      e.preventDefault();
      galerieGrid.classList.add('expanded');
    }
  });
}

// "Voir moins" : re-collapse la galerie + scroll doux vers le haut de la section
const seeLessBtn = document.querySelector('.galerie-less');
if (seeLessBtn) {
  seeLessBtn.addEventListener('click', () => {
    galerieGrid.classList.remove('expanded');
    // Re-scroll vers le haut de la section galerie pour ne pas laisser le user "perdu"
    const galerieSection = document.getElementById('galerie');
    if (galerieSection) {
      galerieSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

// ============ Année dans le footer ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Smooth scroll pour ancres ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ ANIMATION 1 : Compteurs animés ============
// Easing out cubic pour un démarrage rapide puis ralentissement élégant
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const duration = parseInt(el.dataset.duration) || 1800;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const start = performance.now();
  const isInteger = Number.isInteger(target);

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = target * eased;
    el.textContent = prefix + (isInteger ? Math.round(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      if (!counter.dataset.animated) {
        counter.dataset.animated = 'true';
        if (reduced) {
          counter.textContent = (counter.dataset.prefix || '') + counter.dataset.target + (counter.dataset.suffix || '');
        } else {
          animateCounter(counter);
        }
      }
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter[data-target]').forEach(c => {
  // État initial vide pour éviter le flash de la valeur finale
  if (!reduced) c.textContent = (c.dataset.prefix || '') + '0' + (c.dataset.suffix || '');
  counterObserver.observe(c);
});

// ============ ANIMATION 2 : Reveal titres mot par mot ============
document.querySelectorAll('.reveal-words').forEach(el => {
  const text = el.textContent.trim();
  const words = text.split(/(\s+)/);
  el.innerHTML = words.map((w, i) => {
    if (/^\s+$/.test(w)) return w;
    return `<span class="word" style="--i: ${i}">${w}</span>`;
  }).join('');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal-words').forEach(el => revealObserver.observe(el));

// ============ ANIMATION 3 : Magnetic CTA ============
function makeMagnetic(el, strength = 0.35, radius = 80) {
  if (reduced) return;
  const parent = el.parentElement;
  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius + Math.max(rect.width, rect.height) / 2) {
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    } else {
      el.style.transform = '';
    }
  };
  const onLeave = () => { el.style.transform = ''; };
  window.addEventListener('mousemove', onMove, { passive: true });
  el.addEventListener('mouseleave', onLeave);
}

// NOTE : magnetic désactivé par défaut sur les CTA de réservation (mood Bistro = trop tech).
// Réservé aux moods Street food / Premium uniquement — ajouter la classe .magnetic au cas par cas.
document.querySelectorAll('.magnetic').forEach(el => makeMagnetic(el));

// ============ ANIMATION 4 : Parallax hero ============
const heroImage = document.querySelector('.hero-image');
const heroSection = document.querySelector('.hero-full');
if (heroImage && heroSection && !reduced) {
  let ticking = false;
  const updateParallax = () => {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    if (scrollY < heroHeight) {
      // L'image scroll 30% plus lentement que la page
      heroImage.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0003})`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

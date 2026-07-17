'use strict';

const header = document.querySelector('.header');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');
const closeToast = document.getElementById('closeToast');
const loader = document.getElementById('loader');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');

const lightbox = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* =========================
   CURRENT YEAR
========================= */

const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================
   WEBSITE LOADER
========================= */

function hideLoader() {
  if (!loader) return;

  loader.classList.add('hidden');

  window.setTimeout(() => {
    loader.style.display = 'none';
  }, 700);
}

window.addEventListener('load', () => {
  const loaderDelay = prefersReducedMotion ? 150 : 1200;

  window.setTimeout(hideLoader, loaderDelay);
});

/* Loader fail-safe */
window.setTimeout(hideLoader, 3500);

/* =========================
   HEADER + SCROLL PROGRESS
========================= */

function updateScrollEffects() {
  const scrollTop =
    window.scrollY ||
    document.documentElement.scrollTop;

  if (header) {
    header.classList.toggle('scrolled', scrollTop > 15);
  }

  if (scrollProgress) {
    const pageHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      pageHeight > 0
        ? (scrollTop / pageHeight) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;
  }
}

updateScrollEffects();

window.addEventListener(
  'scroll',
  updateScrollEffects,
  { passive: true }
);

/* =========================
   MOBILE NAVIGATION
========================= */

function openMenu() {
  if (!navLinks || !menuBtn) return;

  navLinks.classList.add('open');
  menuBtn.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  if (!navLinks || !menuBtn) return;

  navLinks.classList.remove('open');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  if (!navLinks) return;

  if (navLinks.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuBtn) {
  menuBtn.addEventListener('click', event => {
    event.stopPropagation();
    toggleMenu();
  });
}

if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

document.addEventListener('click', event => {
  if (
    navLinks &&
    menuBtn &&
    navLinks.classList.contains('open') &&
    !navLinks.contains(event.target) &&
    !menuBtn.contains(event.target)
  ) {
    closeMenu();
  }
});

/* =========================
   DOWNLOAD TOAST
========================= */

let toastTimer;

function showToast() {
  if (!toast) return;

  toast.classList.add('show');

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

function hideToast() {
  if (!toast) return;

  toast.classList.remove('show');
  window.clearTimeout(toastTimer);
}

document
  .querySelectorAll('.download-link')
  .forEach(link => {
    link.addEventListener('click', showToast);
  });

if (closeToast) {
  closeToast.addEventListener('click', hideToast);
}

/* =========================
   REVEAL ON SCROLL
========================= */

const revealElements =
  document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealElements.forEach(element => {
    element.classList.add('visible');
  });
} else {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/* =========================
   ACTIVE NAVIGATION LINK
========================= */

const pageSections =
  document.querySelectorAll(
    'main section[id], header[id]'
  );

const navigationLinks =
  document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

function setActiveNavigation() {
  let activeSection = 'home';
  const currentPosition = window.scrollY + 160;

  pageSections.forEach(section => {
    if (currentPosition >= section.offsetTop) {
      activeSection = section.id;
    }
  });

  navigationLinks.forEach(link => {
    const target =
      link.getAttribute('href')?.replace('#', '');

    link.classList.toggle(
      'active',
      target === activeSection
    );
  });
}

setActiveNavigation();

window.addEventListener(
  'scroll',
  setActiveNavigation,
  { passive: true }
);

/* =========================
   ANIMATED COUNTERS
========================= */

const counters =
  document.querySelectorAll('.counter');

function animateCounter(counter) {
  const target =
    Number(counter.dataset.target) || 0;

  if (prefersReducedMotion) {
    counter.textContent = target;
    return;
  }

  const duration = 1400;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;

    const progress = Math.min(
      elapsed / duration,
      1
    );

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    counter.textContent = Math.floor(
      target * easedProgress
    );

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5
    }
  );

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/* =========================
   SCREENSHOT LIGHTBOX
========================= */

function openLightbox(imageSource, imageTitle) {
  if (
    !lightbox ||
    !lightboxImage ||
    !lightboxTitle
  ) {
    return;
  }

  lightboxImage.src = imageSource;
  lightboxImage.alt =
    `${imageTitle} screenshot`;

  lightboxTitle.textContent = imageTitle;

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');

  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('lightbox-open');

  window.setTimeout(() => {
    if (lightboxImage) {
      lightboxImage.src = '';
    }
  }, 300);
}

document
  .querySelectorAll('.screen-card')
  .forEach(card => {
    const viewButton =
      card.querySelector('.view-image');

    if (!viewButton) return;

    viewButton.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      const imageSource =
        card.dataset.image;

      const imageTitle =
        card.dataset.title ||
        'PharmaStock Pro';

      if (imageSource) {
        openLightbox(
          imageSource,
          imageTitle
        );
      }
    });
  });

if (lightboxClose) {
  lightboxClose.addEventListener(
    'click',
    closeLightbox
  );
}

if (lightbox) {
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  closeMenu();
  closeLightbox();
  hideToast();
});

/* =========================
   CURSOR GLOW
========================= */

if (
  cursorGlow &&
  !prefersReducedMotion &&
  window.matchMedia('(pointer: fine)').matches
) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener(
    'mousemove',
    event => {
      targetX = event.clientX;
      targetY = event.clientY;

      cursorGlow.classList.add('visible');
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('visible');
  });

  function animateCursorGlow() {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    cursorGlow.style.transform =
      `translate3d(${currentX}px, ${currentY}px, 0)`;

    requestAnimationFrame(
      animateCursorGlow
    );
  }

  animateCursorGlow();
}

/* =========================
   IMAGE ERROR FALLBACK
========================= */

const dashboardImage =
  document.querySelector(
    '.app-window .window-image img'
  );

if (dashboardImage) {
  dashboardImage.addEventListener(
    'error',
    () => {
      const imageContainer =
        dashboardImage.closest('.window-image');

      const placeholder =
        document.querySelector(
          '.app-window .placeholder'
        );

      if (imageContainer) {
        imageContainer.style.display = 'none';
      }

      if (placeholder) {
        placeholder.style.display = 'grid';
      }
    }
  );
}

/* Screenshot image fallback */
document
  .querySelectorAll('.screen-card img')
  .forEach(image => {
    image.addEventListener('error', () => {
      const container =
        image.closest('.screen-image');

      if (!container) return;

      image.style.display = 'none';
      container.classList.add(
        'image-missing'
      );

      if (
        !container.querySelector(
          '.missing-image-message'
        )
      ) {
        const message =
          document.createElement('div');

        message.className =
          'missing-image-message';

        message.innerHTML = `
          <b>Screenshot unavailable</b>
          <span>Check the image name in the assets folder.</span>
        `;

        container.appendChild(message);
      }
    });
  });

/* =========================
   RESIZE HANDLING
========================= */

window.addEventListener('resize', () => {
  if (window.innerWidth > 950) {
    closeMenu();
  }
});

/* =========================
   PREVENT EMPTY LINKS
========================= */

document
  .querySelectorAll('a[href="#"]')
  .forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
    });
  });

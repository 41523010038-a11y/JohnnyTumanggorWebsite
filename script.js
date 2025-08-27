// Mobile menu toggle
const menuToggleButton = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggleButton && mobileMenu) {
  menuToggleButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Smooth scroll enhancement for older browsers
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
      }
    }
  });
});

// Theme toggle with persistence
const themeToggleButton = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const setThemeClass = (isDark) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  // Optional: swap icon (sun/moon) by rotating path or replacing, kept simple
};

// Initialize theme from storage or system
(() => {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') setThemeClass(true);
  else if (stored === 'light') setThemeClass(false);
  else setThemeClass(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
})();

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ---------- Sorotan Reel (Facebook) ----------
// Opsi A: Kartu sorotan berbasis gambar + tautan (disarankan, paling sederhana)
// Isi dengan daftar objek { image: 'path/ke/gambar.jpg', link: 'https://facebook.com/share/...', title?: 'opsional' }
const reelHighlights = [
   { image: 'images/reel-1.png', link: 'https://www.facebook.com/share/r/1Bu41KhPUc/', title: 'Reel 1' },
   { image: 'images/reel-2.png', link: 'https://www.facebook.com/share/r/1Eejxt6EF7/', title: 'Reel 2' },
   { image: 'images/reel-3.png', link: 'https://www.facebook.com/share/r/1E21cmL96q/', title: 'Reel 3' },

];

// Opsi B: Embed resmi Facebook (XFBML) dengan fb-post/fb-video (opsional)
// Pakai URL kanonik (facebook.com/reel/... atau facebook.com/watch/?v=...), bukan short share (share/r/...).
const facebookReelUrls = [
      'https://www.facebook.com/share/r/1E21cmL96q/',
      'https://www.facebook.com/share/r/1Eejxt6EF7/',
      "https://www.facebook.com/20531316728/posts/10154009990506729/",
];

const reelsGrid = document.getElementById('reelsGrid');
if (reelsGrid) {
  // Jika reelHighlights diisi, gunakan gambar+link dan lewati embed
  if (reelHighlights.length > 0) {
    reelHighlights.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900';

      const media = document.createElement('div');
      media.className = 'h-48 bg-gray-200 dark:bg-gray-800';
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title || 'Sorotan Reel';
        img.loading = 'lazy';
        img.className = 'w-full h-full object-cover';
        media.appendChild(img);
      }

      const body = document.createElement('div');
      body.className = 'p-4 flex flex-col items-center gap-2';
      const caption = document.createElement('span');
      caption.className = 'text-sm font-medium text-center';
      caption.textContent = item.title || 'Sorotan Reel';
      const link = document.createElement('a');
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener';
      link.className = 'text-primary hover:underline';
      link.textContent = 'Lihat Reel →';

      body.appendChild(caption);
      body.appendChild(link);

      card.appendChild(media);
      card.appendChild(body);
      reelsGrid.appendChild(card);
    });
  } else if (facebookReelUrls.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'col-span-full text-center text-sm text-gray-500 dark:text-gray-400';
    placeholder.textContent = 'Tambahkan item ke reelHighlights (gambar+link) atau masukkan URL kanonik Facebook di facebookReelUrls.';
    reelsGrid.appendChild(placeholder);
  } else {
    const cleanUrl = (u) => {
      try {
        const parsed = new URL(String(u).trim());
        // Hanya ijinkan host facebook.com
        if (!/facebook\.com$/i.test(parsed.hostname)) return null;
        parsed.search = '';
        parsed.hash = '';
        return parsed.toString();
      } catch (_) {
        return null;
      }
    };

    facebookReelUrls.forEach((rawUrl) => {
      const url = cleanUrl(rawUrl);
      const card = document.createElement('div');
      card.className = 'rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-0';

      if (!url) {
        const note = document.createElement('div');
        note.className = 'p-4 text-sm text-gray-500 dark:text-gray-400';
        note.textContent = 'URL tidak valid atau bukan domain facebook.com. Gunakan link kanonik dari tombol Bagikan → Salin tautan.';
        card.appendChild(note);
        reelsGrid.appendChild(card);
        return;
      }

      if (/\/share\//i.test(url)) {
        const note = document.createElement('div');
        note.className = 'p-4 text-sm text-amber-600 dark:text-amber-400';
        note.textContent = 'Link share/r tidak dapat di-embed. Buka postingan aslinya, salin URL kanonik (tanpa parameter).';
        card.appendChild(note);
        reelsGrid.appendChild(card);
        return;
      }

      const isVideo = /\/watch\/?\?v=|\/videos\//i.test(url);
      const container = document.createElement('div');
      container.className = isVideo ? 'fb-video' : 'fb-post';
      container.setAttribute('data-href', url);
      container.setAttribute('data-width', '500');
      container.setAttribute('data-show-text', 'false');

      card.appendChild(container);
      reelsGrid.appendChild(card);
    });

    // Parse XFBML
    const parseNow = () => {
      if (window.FB && window.FB.XFBML && typeof window.FB.XFBML.parse === 'function') {
        window.FB.XFBML.parse(reelsGrid);
      }
    };
    if (document.readyState === 'complete') parseNow();
    else window.addEventListener('load', parseNow);
  }
}

// Init hook untuk SDK Facebook
window.fbAsyncInit = function() {
  if (window.FB) {
    window.FB.init({ xfbml: true, version: 'v19.0' });
  }
};


// ---------- Scroll reveal for sections ----------
(function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // Honor reduced motion

  const sections = document.querySelectorAll('section');
  const targets = [];

  sections.forEach((section) => {
    // Pick meaningful children to reveal instead of the whole section to avoid layout jumps
    const revealables = section.querySelectorAll(':scope > *');
    revealables.forEach((el, index) => {
      el.classList.add('reveal');
      // Slight stagger via transition-delay
      el.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
      targets.push(el);
    });
  });

  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          // Once visible, unobserve to keep DOM clean
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1,
    }
  );

  targets.forEach((el) => observer.observe(el));
})();


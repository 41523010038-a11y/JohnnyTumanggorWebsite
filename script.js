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

// ---------- Favorite Songs Cards ----------
const favoriteSongs = [
  {
    title: 'Cinta Luar Biasa - Andmesh',
    artist: 'Andmesh Kamaleng',
    link: 'https://open.spotify.com/search/cinta%20luar%20biasa%20andmesh',
    image: 'images/proyek-4.png',
  },
  {
    title: 'Hanya Rindu - Andmesh',
    artist: 'Andmesh Kamaleng',
    link: 'https://open.spotify.com/search/hanya%20rindu%20andmesh',
    image: 'images/proyek-5.png',
  },
  {
    title: 'Perfect - Ed Sheeran',
    artist: 'Ed Sheeran',
    link: 'https://open.spotify.com/search/perfect%20ed%20sheeran',
  },
  {
    title: 'Zombie - The Cranberries',
    artist: 'The Cranberries',
    link: 'https://open.spotify.com/search/zombie',
  }
];

const songsGrid = document.getElementById('songsGrid');
if (songsGrid) {
  if (favoriteSongs.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'col-span-full text-center text-sm text-gray-500 dark:text-gray-400';
    empty.textContent = 'Belum ada lagu favorit. Nanti akan ditambahkan.';
    songsGrid.appendChild(empty);
  } else {
    favoriteSongs.forEach((song) => {
      const card = document.createElement('article');
      card.className = 'group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col';

      if (song.image) {
        const media = document.createElement('div');
        media.className = 'h-40 bg-gray-200 dark:bg-gray-800';
        const img = document.createElement('img');
        img.src = song.image;
        img.alt = song.title || 'Cover lagu';
        img.loading = 'lazy';
        img.className = 'w-full h-full object-cover';
        media.appendChild(img);
        card.appendChild(media);
      }

      const body = document.createElement('div');
      body.className = 'p-4 flex flex-col gap-2';

      const title = document.createElement('h3');
      title.className = 'font-semibold group-hover:text-primary transition-colors';
      title.textContent = song.title;

      const meta = document.createElement('p');
      meta.className = 'text-sm text-gray-600 dark:text-gray-300';
      meta.textContent = song.artist;

      const action = document.createElement('a');
      action.href = song.link;
      action.target = '_blank';
      action.rel = 'noopener';
      action.className = 'mt-1 inline-flex items-center text-primary hover:underline text-sm';
      action.textContent = 'Dengarkan →';

      body.appendChild(title);
      body.appendChild(meta);
      body.appendChild(action);

      card.appendChild(body);
      songsGrid.appendChild(card);
    });
  }
}

// ---------- Bird Hobby Slider ----------
(function initBirdSlider() {
  const images = [
    'images/burungSatu.jpg',
    'images/burungDua.jpg',
    'images/burungTiga.jpg',
    'images/proyek-4.jpeg',
    'images/proyek-5.jpeg',
  ];

  const imgEl = document.getElementById('birdSlideImage');
  const prevBtn = document.getElementById('birdPrev');
  const nextBtn = document.getElementById('birdNext');
  const indicators = document.getElementById('birdIndicators');
  if (!imgEl || !prevBtn || !nextBtn || !indicators || images.length === 0) return;

  let current = 0;

  const render = () => {
    imgEl.src = images[current];
    Array.from(indicators.children).forEach((dot, i) => {
      if (i === current) {
        dot.className = 'h-2 w-2 rounded-full bg-primary';
      } else {
        dot.className = 'h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600';
      }
    });
  };

  // Build indicators
  indicators.innerHTML = '';
  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.className = 'h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600';
    dot.addEventListener('click', () => {
      current = i;
      render();
    });
    indicators.appendChild(dot);
  });

  const goPrev = () => {
    current = (current - 1 + images.length) % images.length;
    render();
  };
  const goNext = () => {
    current = (current + 1) % images.length;
    render();
  };

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  // Basic keyboard support when focused within the section
  const hobbySection = document.getElementById('hobby');
  if (hobbySection) {
    hobbySection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    });
    hobbySection.tabIndex = 0; // make focusable
  }

  // Basic swipe support (touch)
  let startX = null;
  imgEl.addEventListener('touchstart', (e) => {
    startX = e.touches && e.touches.length ? e.touches[0].clientX : null;
  });
  imgEl.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const endX = e.changedTouches && e.changedTouches.length ? e.changedTouches[0].clientX : startX;
    const dx = endX - startX;
    if (Math.abs(dx) > 40) {
      if (dx > 0) goPrev(); else goNext();
    }
    startX = null;
  });

  render();
})();


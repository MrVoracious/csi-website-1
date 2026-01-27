function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// tracker
const trailer = document.getElementById('trailer');
const currentActivity = document.getElementById('currentActivity');
const animateTrailer = (e) => {
  trailer.style.display = 'grid';
  const x = e.clientX - trailer.offsetWidth / 2,
    y = e.clientY - trailer.offsetHeight / 2;

  const scale = 1;

  const keyframes = {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
  };

  trailer.animate(keyframes, {
    duration: 200,
    fill: 'forwards',
  });
};
window.onmousemove = (e) => {
  animateTrailer(e);
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// --- CONFIGURATION ---
const GRID_SPACING = 40; // Distance between pluses
const PLUS_SIZE = 6; // Half-arm length of the plus (as before)
const HOVER_RADIUS = 250; // Effect radius
const MIN_SCALE = 0.7; // Inactive scale (60% of full)
const MIN_LINE = 1.25; // Inactive line width
const MAX_LINE = 1.6; // Active line width

// Colors as objects (you can change these)
const COLOR_ACTIVE = { r: 75, g: 75, b: 75 }; // bright color when active
const COLOR_INACTIVE = { r: 255, g: 255, b: 255 }; // darker when inactive

const INACTIVE_ALPHA = 0.15; // opacity for far pluses
// ---------------------

let width, height;
let particles = [];

// Mouse state
let mouse = { x: -10000, y: -10000 };

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.hypot(dx, dy);

    const isActive = distance < HOVER_RADIUS;

    // Defaults (inactive)
    let alpha = INACTIVE_ALPHA;
    let scale = MIN_SCALE;
    let lineW = MIN_LINE;
    let color = COLOR_INACTIVE;
    let angle = 0;

    if (isActive) {
      const pct = 1 - distance / HOVER_RADIUS; // 0..1 (1 at center)

      // Interpolate visual properties
      alpha = INACTIVE_ALPHA + (1 - INACTIVE_ALPHA) * pct;
      scale = MIN_SCALE + (1 - MIN_SCALE) * pct;
      lineW = MIN_LINE + (MAX_LINE - MIN_LINE) * pct;
      angle = Math.atan2(dy, dx);

      // Lerp color between inactive and active
      color = {
        r: Math.round(COLOR_INACTIVE.r + (COLOR_ACTIVE.r - COLOR_INACTIVE.r) * pct),
        g: Math.round(COLOR_INACTIVE.g + (COLOR_ACTIVE.g - COLOR_INACTIVE.g) * pct),
        b: Math.round(COLOR_INACTIVE.b + (COLOR_ACTIVE.b - COLOR_INACTIVE.b) * pct),
      };
    }

    this.angle = angle;
    this.draw(alpha, scale, lineW, color, isActive);
  }

  draw(alpha, scale, lineW, color, rotate) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Rotate only when active (rotate === true)
    if (rotate) ctx.rotate(this.angle);

    ctx.scale(scale, scale);

    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.lineWidth = lineW;

    ctx.beginPath();
    // horizontal
    ctx.moveTo(-PLUS_SIZE, 0);
    ctx.lineTo(PLUS_SIZE, 0);
    // vertical
    ctx.moveTo(0, -PLUS_SIZE);
    ctx.lineTo(0, PLUS_SIZE);
    ctx.stroke();

    ctx.restore();
  }
}

function init() {
  particles = [];

  // size canvas
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  // small padding in px (roughly 1vw)
  const padding = width * 0.01;

  const safeWidth = width - padding * 2;
  const safeHeight = height - padding * 3;

  // how many points (columns/rows) fit — include the last edge point
  const cols = Math.floor(safeWidth / GRID_SPACING) + 1;
  const rows = Math.floor(safeHeight / GRID_SPACING) + 1;

  // actual pixel span of the grid (points are spaced by GRID_SPACING and there are cols-1 intervals)
  const gridRealWidth = (cols - 1) * GRID_SPACING;
  const gridRealHeight = (rows - 1) * GRID_SPACING;

  const startX = padding + (safeWidth - gridRealWidth) / 2;
  const startY = padding + (safeHeight - gridRealHeight) / 2;

  // Use < rather than <= to avoid an extra partial column/row
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = startX + i * GRID_SPACING;
      const y = startY + j * GRID_SPACING;
      // keep within padding bounds
      if (x >= padding && x <= width - padding && y >= padding && y <= height - padding) {
        particles.push(new Particle(x, y));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (let p of particles) p.update();

  requestAnimationFrame(animate);
}

// Events
window.addEventListener('resize', () => {
  init();
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// When the mouse leaves, move it far away so everything becomes inactive
window.addEventListener('mouseout', () => {
  mouse.x = -10000;
  mouse.y = -10000;
});

// init + animate
init();
animate();

const container = document.getElementById('aboutContent');
const aboutSection = document.getElementById('aboutSection');

// source text
const originalText =
  'CSI at Maharaja Agrasen Institute of Technology (est. 2009) is a student society exploring technology’s role in society. Join us for discussions, projects, and solutions that build a better future.';
const tokens = originalText.split(/(\s+)/);

// render words
container.innerHTML = tokens
  .map((tok) => {
    const esc = tok.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<span class="word">${esc}</span>`;
  })
  .join('');

const words = container.querySelectorAll('.word');

// tuning
let SCROLL_PER_WORD;
let STAGGER;
let MIN_TOTAL_SCROLL = 300;
let READING_CUSHION = 300;
if (!isMobile()) {
  SCROLL_PER_WORD = 75;
  STAGGER = 15;
  MIN_TOTAL_SCROLL = 300;
  READING_CUSHION = 300;
} else {
  SCROLL_PER_WORD = 0;
  STAGGER = 0;
  MIN_TOTAL_SCROLL = 0;
  READING_CUSHION = 0;
}

// these will be calculated and updated on resize
let TOTAL_SCROLL = 0;
let HALF = 0;

let ticking = false;
let hiddenCallbackCalled = false; // ensure callback runs once per disappearance

function clamp(v, a = 0, b = 1) {
  return Math.min(Math.max(v, a), b);
}

function computeTotalsAndSectionHeight() {
  // how much scroll the words need (forward+reverse)
  const needed = ((words.length - 1) * STAGGER + SCROLL_PER_WORD) * 2;
  TOTAL_SCROLL = Math.max(MIN_TOTAL_SCROLL, needed) + READING_CUSHION;

  HALF = TOTAL_SCROLL / 2;

  // ensure the aboutSection is tall enough: TOTAL_SCROLL plus viewport so user can scroll through
  const requiredHeightPx = TOTAL_SCROLL + window.innerHeight;
  // use minHeight so CSS can still control other layout aspects if needed
  aboutSection.style.minHeight = requiredHeightPx + 200 + 'px';

  if (isMobile()) {
    aboutSection.style.minHeight = window.innerHeight + 0 + 'px';
    TOTAL_SCROLL = window.innerHeight;
  }
}

function setHiddenStyles() {
  words.forEach((w) => {
    w.style.transform = `translateY(10%)`;
    w.style.filter = `blur(10px)`;
    w.style.opacity = `0`;
  });
}

function onAllWordsHidden() {
  const elements = document.querySelectorAll('.statValue, .statText');
  const widthZero = document.querySelectorAll('.numberTopHr, .numberBottomHr');
  const numbersHeading = document.getElementById('numbersHeading');
  elements.forEach((element) => {
    element.classList.add('fadeAway');
  });
  widthZero.forEach((element) => {
    element.classList.add('widthZero');
  });

  numbersHeading.classList.add('fadeLeft');
}

function onAllWordsShown() {
  const elements = document.querySelectorAll('.statValue, .statText');
  const widthZero = document.querySelectorAll('.numberTopHr, .numberBottomHr');
  const numbersHeading = document.getElementById('numbersHeading');
  elements.forEach((element) => {
    element.classList.remove('fadeAway');
  });
  widthZero.forEach((element) => {
    element.classList.remove('widthZero');
  });

  numbersHeading.classList.remove('fadeLeft');
}

function update() {
  if (!aboutSection) return;

  // progress: how far we've moved into the trigger zone (positive when element passes top)
  const rect = aboutSection.getBoundingClientRect();
  const progress = -rect.top;

  if (isMobile() && progress <= TOTAL_SCROLL && progress >= -(window.innerHeight * 0.9)) {
    words.forEach((word) => {
      word.style.transition = 'all 500ms cubic-bezier(.4, 0, .6, 1)';
      word.style.transform = `translateY(0%)`;
      word.style.filter = `blur(0px)`;
      word.style.opacity = `1`;
    });
    onAllWordsShown();
    return
  }

  // fully outside window (before start or after end) => hidden
  if (progress <= 0 || progress >= TOTAL_SCROLL) {
    if (progress >= TOTAL_SCROLL && !isMobile()) {
      setHiddenStyles();
    } else if (progress <= 0) {
      setHiddenStyles();
    }
    document.getElementById('nav').classList.remove('invert');
    currentActivity.classList.remove('invert');
    onAllWordsHidden();
    return;
  }

  if (progress <= TOTAL_SCROLL && progress >= 0) {
    onAllWordsShown();
    currentActivity.classList.add('invert');
    document.getElementById('nav').classList.add('invert');
  }

  // if we are inside the active window, reset the hidden callback flag so it can trigger again later
  if (hiddenCallbackCalled) hiddenCallbackCalled = false;

  // Determine whether we are in the forward or reverse half
  const forward = progress <= HALF;

  if (!isMobile()) {
    words.forEach((word, i) => {
      const wordStart = i * STAGGER;

      // local progress (px) relative to this word's start
      const localPx = forward ? progress - wordStart : TOTAL_SCROLL - progress - wordStart;

      // map to [0,1] using SCROLL_PER_WORD
      const raw = localPx / SCROLL_PER_WORD;
      const wordProgress = clamp(raw, 0, 1);

      // slight easing
      const eased = Math.pow(wordProgress, 0.9);

      // visuals
      const translateY = 10 * (1 - eased); // 10% -> 0%
      const blur = 10 * (1 - eased); // 10px -> 0px
      const opacity = eased; // 0 -> 1

      word.style.transform = `translateY(${translateY}%)`;
      word.style.filter = `blur(${blur}px)`;
      word.style.opacity = `${opacity}`;
    });
  }
}

// rAF-throttled scroll handler
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
    ticking = true;
  }
}

// init
computeTotalsAndSectionHeight();
setHiddenStyles();
update();

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
  computeTotalsAndSectionHeight();
  requestAnimationFrame(update);
});

document.getElementById('cards').onmousemove = (e) => {
  for (const card of document.getElementsByClassName('card')) {
    const rect = card.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
};

const menu = document.getElementById('menu');

menu.onclick = () => {
  menu.classList.toggle('clicked');
  if (isMobile()) {
    currentActivity.classList.toggle('unhide');
  }
};

// hide current activity:

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('footer');
  if (!footer || !currentActivity) return; // safety

  // Prefer IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentActivity.classList.add('hide');
          } else {
            currentActivity.classList.remove('hide');
          }
        });
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(footer);
  }
});

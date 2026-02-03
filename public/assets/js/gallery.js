function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const content = document.getElementById('content');
  const showcase = document.getElementById('showcase');

  // --- CONFIGURATION ---
  const imageList = [
    'https://res.cloudinary.com/dpp2rltxx/image/upload/v1761589839/events/sh85qfnmywppsvkhi4gg.jpg',
    'https://res.cloudinary.com/dpp2rltxx/image/upload/v1761589848/events/qv4gmizwis7oi0dkhupd.jpg',
    'https://res.cloudinary.com/dpp2rltxx/image/upload/v1759994124/events/bw4zdp6rafalmy9x0fbc.jpg',
    'https://res.cloudinary.com/dpp2rltxx/image/upload/v1761589847/events/fwr92jkqznqpgcmp8jsc.jpg',
    'https://res.cloudinary.com/dpp2rltxx/image/upload/v1759956433/events/fpv8ipqvmdrwtrs7vs90.jpg',
  ];

  let CELL_W;
  let CELL_H;
  let GAP;


  if (!isMobile()) {
    CELL_W = window.innerWidth * 0.1666666667;
    CELL_H = window.innerWidth * 0.25;
    GAP = window.innerWidth * 0.0380952381;
  } else{
    CELL_W = window.innerWidth*0.2871794872;
    CELL_H = window.innerWidth * 0.4307692308;
    GAP = window.innerWidth * 0.06153846154;
  }

  const STEP_X = CELL_W + GAP;
  const STEP_Y = CELL_H + GAP;
  const BUFFER = 1;

  // --- STATE ---
  let targetX = 0,
    targetY = 0;
  let x = 0,
    y = 0;
  const renderedCells = new Map();

  // --- SHOWCASE LOGIC ---
  function openShowcase(src) {
    showcase.innerHTML = '';
    const showImg = document.createElement('img');
    showImg.src = src;
    showImg.style.maxHeight = '90%';
    showImg.style.maxWidth = '90%';
    showImg.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
    showImg.style.animation = 'fadeInScale 500ms ease-out forwards';

    showcase.appendChild(showImg);
    showcase.style.opacity = '1';
    showcase.style.pointerEvents = 'all';
  }

  showcase.addEventListener('click', () => {
    showcase.style.opacity = '0';
    showcase.style.pointerEvents = 'none';
  });

  // --- INPUT HANDLING ---

  // Wheel
  viewport.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      targetX += e.deltaX;
      targetY += e.deltaY;
    },
    { passive: false }
  );

  // Pointer (Mouse/Touch)
  let isDown = false;
  let lastPos = { x: 0, y: 0 };
  let startPos = { x: 0, y: 0 };
  let isDragging = false;

  viewport.addEventListener('pointerdown', (e) => {
    isDown = true;
    isDragging = false;

    lastPos = { x: e.clientX, y: e.clientY };
    startPos = { x: e.clientX, y: e.clientY };

    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDown) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    lastPos = { x: e.clientX, y: e.clientY };

    const totalDist = Math.hypot(e.clientX - startPos.x, e.clientY - startPos.y);
    if (totalDist > 5) {
      isDragging = true;
    }

    targetX -= dx*1.15;
    targetY -= dy*1.15;
  });

  viewport.addEventListener('pointerup', (e) => {
    isDown = false;
    viewport.releasePointerCapture(e.pointerId);

    if (!isDragging) {
      const target = document.elementFromPoint(e.clientX, e.clientY);

      if (target && target.tagName === 'IMG' && target.closest('#content')) {
        openShowcase(target.src);
      }
    }
  });

  viewport.addEventListener('pointercancel', () => (isDown = false));

  window.addEventListener('keydown', (e) => {
    const step = 300;
    if (e.key === 'ArrowLeft') targetX -= step;
    if (e.key === 'ArrowRight') targetX += step;
    if (e.key === 'ArrowUp') targetY -= step;
    if (e.key === 'ArrowDown') targetY += step;
  });

  // --- VIRTUAL GRID LOGIC ---
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function getCellContent(col, row) {
    const index = mod(col + row * 57, imageList.length);
    const src = imageList[index];
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';

    const seed = col * 12.9898 + row * 78.233;
    const randomValue = Math.abs(Math.sin(seed));

    if (randomValue < 0.9) {
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.cursor = 'pointer';
    } else {
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.cursor = 'pointer';
    }
    return img;
  }

  function updateGrid() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const startCol = Math.floor((x - STEP_X * BUFFER) / STEP_X);
    const endCol = Math.floor((x + vw + STEP_X * BUFFER) / STEP_X);
    const startRow = Math.floor((y - STEP_Y * BUFFER) / STEP_Y);
    const endRow = Math.floor((y + vh + STEP_Y * BUFFER) / STEP_Y);

    const visibleKeys = new Set();

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const key = `${c},${r}`;
        visibleKeys.add(key);
        if (!renderedCells.has(key)) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.style.width = CELL_W + 'px';
          cell.style.height = CELL_H + 'px';
          cell.style.left = c * STEP_X + 'px';
          cell.style.top = r * STEP_Y + 'px';
          cell.appendChild(getCellContent(c, r));
          content.appendChild(cell);
          renderedCells.set(key, cell);
        }
      }
    }

    for (const [key, cell] of renderedCells) {
      if (!visibleKeys.has(key)) {
        cell.remove();
        renderedCells.delete(key);
      }
    }
  }

  // --- ANIMATION LOOP ---
  const ease = 0.1;
  function raf() {
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    content.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
    updateGrid();
    requestAnimationFrame(raf);
  }
  raf();
});

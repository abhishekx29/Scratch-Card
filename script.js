const canvas = document.getElementById('scratch-card1');
const context = canvas.getContext('2d');

const drawOverlay = () => {
  const { width, height } = canvas;

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#c0c0c8');
  gradient.addColorStop(0.3, '#e8e8f0');
  gradient.addColorStop(0.5, '#a8a8b8');
  gradient.addColorStop(0.7, '#d8d8e4');
  gradient.addColorStop(1, '#9090a0');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 2 + 0.5;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = 'rgba(60, 60, 80, 0.5)';
  context.font = 'bold 15px Outfit, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('SCRATCH HERE', width / 2, height / 2);
};

const init = () => {
  const img = new Image();
  img.src = 'image/img.png';
  img.onload = () => {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.onerror = drawOverlay;
};

let isDragging = false;

const scratch = (x, y) => {
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, 18, 0, Math.PI * 2, false);
  context.fill();
};

const getCanvasPos = (clientX, clientY) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
};

if (window.PointerEvent) {
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDragging = true;
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    const pos = getCanvasPos(e.clientX, e.clientY);
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const pos = getCanvasPos(e.clientX, e.clientY);
    scratch(pos.x, pos.y);
  });

  const endPointer = (e) => {
    isDragging = false;
    try { canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('pointerleave', endPointer);
} else {
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDragging = true;
    const t = e.touches[0];
    if (!t) return;
    const pos = getCanvasPos(t.clientX, t.clientY);
    scratch(pos.x, pos.y);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    const pos = getCanvasPos(t.clientX, t.clientY);
    scratch(pos.x, pos.y);
  }, { passive: false });

  const endTouch = () => { isDragging = false; };
  canvas.addEventListener('touchend', endTouch);
  canvas.addEventListener('touchcancel', endTouch);

  canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    const pos = getCanvasPos(event.clientX, event.clientY);
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const pos = getCanvasPos(event.clientX, event.clientY);
      scratch(pos.x, pos.y);
    }
  });

  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; });
}

init();

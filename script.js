let canvas = document.getElementById('scratch-card1');
let context = canvas.getContext('2d');

const init = () => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, canvas.width, canvas.height);
};

let isDragging = false;

const scratch = (x, y) => {
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(x, y, 14, 0, Math.PI * 2, false);
    context.fill();
};

// Convert client coordinates to canvas pixel coordinates (handles CSS scaling / DPR)
const getCanvasPos = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
    };
};

// Pointer events (unified for mouse, touch, pen) when available
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
    // Fallback to touch events + mouse events for older browsers
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

    const endTouch = (e) => { isDragging = false; };
    canvas.addEventListener('touchend', endTouch);
    canvas.addEventListener('touchcancel', endTouch);

    // Mouse events as a final fallback
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

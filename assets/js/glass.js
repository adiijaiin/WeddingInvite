/**
 * Liquid Glass · cursor-following highlight.
 * Sets --mx / --my on interactive glass elements as the pointer moves over them; the CSS paints a
 * soft radial highlight at that point. One delegated listener, pointer events only (no touch cost).
 */
(() => {
    if (!document.documentElement.classList.contains('glass-theme')) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const SELECTOR = '.glass--interactive, .btn-mauve, .btn-powder-blue, .btn-pastel-outline, .quick-pill-btn, .btn-cal-mini, .logistics-card-pastel, .countdown-box-pastel';
    let pending = null;

    document.addEventListener('pointermove', (e) => {
        const el = e.target.closest(SELECTOR);
        if (!el) return;
        if (pending) cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
            el.style.setProperty('--my', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
            pending = null;
        });
    }, { passive: true });
})();

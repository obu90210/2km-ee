import { scene } from './journey-geometry.js';

const panel = document.querySelector('.data-journey');
const canvas = document.getElementById('journey-canvas');
const ctx = canvas?.getContext('2d');
if (panel && ctx) {
  const labels = ['01 / Scattered data', '02 / Knowledge takes shape', '03 / Connected systems', '04 / A working platform', '05 / One clear signal'];
  const label = document.getElementById('journey-label');
  const progressBar = document.getElementById('journey-progress');
  const toggle = document.getElementById('motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const anchors = ['about', 'selected-work', 'projects', 'contact'].map(id => document.getElementById(id));
  let paused = false, frame = 0, lastProgress = 0;
  function progress() {
    const panelHeight = panel.offsetHeight;
    const positions = anchors.map(el => el.getBoundingClientRect().top + scrollY - panelHeight - 32);
    const stops = [Math.max(0, positions[0] - innerHeight * .65), ...positions];
    stops[4] = Math.min(stops[4], document.documentElement.scrollHeight - innerHeight);
    const y = scrollY;
    for (let i = 0; i < 4; i++) if (y < stops[i + 1]) return Math.max(0, i + (y - stops[i]) / Math.max(1, stops[i + 1] - stops[i]));
    return 4;
  }
  function draw() {
    frame = 0;
    const p = reduced.matches ? 3 : paused ? lastProgress : progress();
    lastProgress = p;
    const w = panel.clientWidth, h = panel.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#16171c'; ctx.fillRect(0, 0, w, h);
    const dots = scene(p).map(a => ({x: a.x * w, y: a.y * h}));
    const connection = Math.min(1, p);
    ctx.lineWidth = .8;
    // Six streams become a lattice, then collapse into a coherent signal.
    dots.forEach((a, i) => {
      if (i % 16 !== 15) {
        const b = dots[i + 1];
        ctx.strokeStyle = `rgba(116,190,237,${connection * .45})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      if (i < 80 && i % 3 === 0) {
        const b = dots[i + 16];
        ctx.strokeStyle = `rgba(116,190,237,${Math.max(0, Math.min(1, p - 2)) * .25})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.fillStyle = i % 7 === 0 ? '#c6eaff' : '#71b9e7';
      const size = i % 7 === 0 ? 3.5 : 2;
      ctx.fillRect(a.x - size / 2, a.y - size / 2, size, size);
      if (i % 12 === 0 && p < 3.5) {
        ctx.font = '10px monospace'; ctx.fillStyle = '#769db6';
        ctx.fillText(i % 24 === 0 ? '01' : '10', a.x + 7, a.y - 7);
      }
    });
    label.textContent = reduced.matches ? 'Connected knowledge. Working systems.' : labels[Math.min(4, Math.round(p))];
    progressBar.style.transform = `scaleX(${p / 4})`;
    panel.dataset.stage = String(Math.round(p));
    panel.dataset.progress = p.toFixed(3);
  }
  function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); }
  window.addEventListener('scroll', () => { if (!paused && !reduced.matches) schedule(); }, {passive: true});
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('toggle', schedule, true);
  document.getElementById('filters')?.addEventListener('click', schedule);
  new ResizeObserver(schedule).observe(document.querySelector('main'));
  reduced.addEventListener('change', schedule);
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
      toggle.setAttribute('aria-pressed', String(paused));
      schedule();
    });
  }
  draw();
}

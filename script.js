// Progressive enhancement. The page renders complete without JS:
// entries visible, native <details> expansion, theme from prefers-color-scheme.

// Theme toggle (initial theme already applied by theme.js)
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  const current = () =>
    document.documentElement.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const setLabel = () => { themeBtn.textContent = current() === 'dark' ? '◐ LIGHT' : '◑ DARK'; };
  themeBtn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    setLabel();
  });
  setLabel();
  themeBtn.hidden = false;
}

// Category filters
const filters = document.getElementById('filters');
if (filters) {
  filters.addEventListener('click', e => {
    const btn = e.target.closest('button[data-f]');
    if (!btn) return;
    filters.querySelectorAll('button[data-f]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const want = btn.dataset.f;
    document.querySelectorAll('.entry').forEach(entry => {
      entry.hidden = want !== 'all' && entry.dataset.cat !== want;
    });
    const count = document.querySelectorAll('.entry:not([hidden])').length;
    const feedback = document.getElementById('filter-status');
    if (feedback) feedback.textContent = `Showing ${count} of ${document.querySelectorAll('.entry').length} projects.`;
  });
  filters.hidden = false;
  const feedback = document.getElementById('filter-status');
  if (feedback) feedback.hidden = false;
}

// Direct project links also open the native details, including after filtering.
function revealProject() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const entry = document.getElementById(id);
  if (!entry || !entry.classList.contains('entry')) return;
  if (entry.hidden) filters?.querySelector('[data-f="all"]')?.click();
  entry.open = true;
  entry.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', revealProject);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && link.getAttribute('href') === location.hash) revealProject();
});
revealProject();

// Decorative motion is opt-in through JS, paused offscreen and in background tabs.
const banners = [...document.querySelectorAll('.data-banner')];
const motionToggle = document.getElementById('motion-toggle');
if (banners.length && 'IntersectionObserver' in window) {
  const inView = new Set();
  const syncMotion = () => banners.forEach(banner => {
    banner.classList.toggle('is-visible', inView.has(banner) && !document.hidden);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? inView.add(entry.target) : inView.delete(entry.target));
    syncMotion();
  });
  banners.forEach(banner => observer.observe(banner));
  document.addEventListener('visibilitychange', syncMotion);
  if (motionToggle) {
    motionToggle.hidden = false;
    motionToggle.addEventListener('click', () => {
      const paused = document.documentElement.dataset.motion !== 'paused';
      document.documentElement.dataset.motion = paused ? 'paused' : 'running';
      motionToggle.setAttribute('aria-pressed', String(paused));
      motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    });
  }
}

// Assemble the contact email at runtime so it never appears whole in the HTML source.
document.querySelectorAll('.email-slot').forEach(el => {
  const rev = s => s.split('').reverse().join('');
  const addr = rev(el.dataset.u) + '@' + rev(el.dataset.d);
  const link = document.createElement('a');
  link.className = 'email-link';
  link.href = 'mailto:' + addr;
  link.textContent = addr;
  el.replaceWith(link);
});

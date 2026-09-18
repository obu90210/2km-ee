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

// Share portfolio entries, not private applications. Keep anchors usable without JS.
document.querySelectorAll('a.permalink').forEach(link => {
  const entry = link.closest('.entry');
  if (!entry?.id) return;
  const name = entry.querySelector('summary .name')?.textContent.trim() || entry.id;
  const url = new URL('https://2km.ee/');
  url.hash = entry.id;
  const group = document.createElement('div');
  group.className = 'share-entry';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'permalink';
  button.textContent = 'Copy link';
  button.setAttribute('aria-label', `Copy portfolio link for ${name}`);
  const status = document.createElement('span');
  status.className = 'share-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const fallback = document.createElement('label');
  fallback.className = 'share-fallback';
  fallback.hidden = true;
  fallback.textContent = 'Portfolio link — select and copy:';
  const input = document.createElement('input');
  input.type = 'text';
  input.readOnly = true;
  input.value = url.href;
  fallback.append(input);
  group.append(button, status, fallback);
  link.replaceWith(group);
  let resetLabel;
  button.addEventListener('click', async () => {
    clearTimeout(resetLabel);
    button.disabled = true;
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(url.href);
      button.textContent = 'Copied!';
      status.textContent = 'Portfolio link copied.';
      fallback.hidden = true;
      resetLabel = setTimeout(() => { button.textContent = 'Copy link'; }, 3000);
    } catch {
      button.textContent = 'Copy link';
      status.textContent = 'Automatic copying is unavailable. Copy the link below.';
      fallback.hidden = false;
      input.focus();
      input.select();
    } finally {
      button.disabled = false;
    }
  });
});

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

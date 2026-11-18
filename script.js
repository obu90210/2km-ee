// Progressive enhancement. The page renders complete without JS:
// entries visible, native <details> expansion, light theme by default.

// Theme toggle (initial theme already applied by theme.js)
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  const current = () =>
    document.documentElement.dataset.theme ||
    'light';
  const usesPressedState = themeBtn.hasAttribute('aria-pressed');
  const updateControl = () => {
    const dark = current() === 'dark';
    if (usesPressedState) themeBtn.setAttribute('aria-pressed', String(dark));
    else themeBtn.textContent = dark ? '◐ LIGHT' : '◑ DARK';
  };
  themeBtn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    updateControl();
  });
  updateControl();
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

// Direct links open their details, including projects hidden by a category filter.
function revealPortfolioDetails() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  const entry = target.classList.contains('entry') ? target : target.closest('details.metric-disclosure');
  if (!entry) return;
  if (entry.hidden) filters?.querySelector('[data-f="all"]')?.click();
  entry.open = true;
  target.scrollIntoView({ block: 'start' });
}
window.addEventListener('hashchange', revealPortfolioDetails);
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && link.getAttribute('href') === location.hash) revealPortfolioDetails();
});
revealPortfolioDetails();

// Copy the published evidence and its canonical link from the same HTML visitors read.
document.querySelectorAll('[data-citation]').forEach(citation => {
  const button = citation.querySelector('[data-copy-citation]');
  const status = citation.querySelector('[data-copy-status]');
  const fallback = citation.querySelector('[data-copy-fallback]');
  const field = fallback.querySelector('textarea');
  const paragraphs = [...citation.querySelectorAll('[data-citation-text]')]
    .map(paragraph => paragraph.textContent.trim().replace(/\s+/g, ' '));
  const source = citation.querySelector('[data-citation-source]').href;
  field.value = [...paragraphs, source].join('\n');
  button.hidden = false;

  button.addEventListener('click', async () => {
    if (button.getAttribute('aria-busy') === 'true') return;
    button.setAttribute('aria-busy', 'true');
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(field.value);
      fallback.hidden = true;
      status.textContent = 'Citation copied.';
    } catch {
      status.textContent = 'Automatic copying is unavailable.';
      fallback.hidden = false;
      field.focus();
      field.select();
    } finally {
      button.removeAttribute('aria-busy');
    }
  });
});

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

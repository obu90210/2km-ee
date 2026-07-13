# The Index Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 2km.ee's violet glassmorphism bubble grid with "The Index" — a Swiss-print-catalog page (paper light theme + neutral dark theme, toggleable), per the approved spec `docs/superpowers/specs/2026-07-13-portfolio-redesign-design.md`.

**Architecture:** Single static page. `index.html` gets a new `<style>` block and a new body (masthead → filter line → 31 native `<details>` rows → footer). A tiny blocking `theme.js` in `<head>` applies the saved theme before paint; `script.js` shrinks to theme toggle + filters + email assembly. The 31 entries are **generated from the existing JSON-LD block** (it already holds every project's name, headline, description, genre, keywords, status — and stays byte-identical itself).

**Tech Stack:** Hand-written HTML/CSS/JS, no build. Google Fonts (Archivo, IBM Plex Mono). Python 3 (stdlib only) for one-off generate/verify scripts. Headless Chrome + Puppeteer MCP for visual verification.

## Global Constraints

- Work on branch `redesign-the-index`; merge to `master` only in the final task (push to master auto-deploys via Cloudflare).
- NO inline `<script>` blocks in index.html (strict CSP `script-src 'self'`); the JSON-LD data block is the allowed exception. Inline `style=""` and the `<style>` block are fine.
- Fonts only from `fonts.googleapis.com` / `fonts.gstatic.com`. No new external origins anywhere.
- Page must render fully without JS: all 31 entries visible, `<details>` expandable, correct theme via `prefers-color-scheme`. JS-only controls (theme button, filter nav) carry the `hidden` attribute in markup and are un-hidden by `script.js`.
- Star Wars codenames only. NEVER write a real company/product name into any committed file — including this plan and commit messages. The real↔codename legend lives ONLY in the git-ignored local `CLAUDE.md`.
- Counts that must stay in sync everywhere: **31 projects, 26 LIVE**; per-category: infra 7, web 9, test 2, integ 5, auto 4, other 4. JSON-LD `numberOfItems` stays 31.
- All colors via CSS custom properties — no hardcoded accent values outside `:root` blocks.
- `_headers`, `robots.txt`, `.well-known/security.txt`, `llms.txt`: DO NOT MODIFY.
- Scratch files (generated entries, screenshots) go to the session scratchpad, never into the repo.

---

### Task 1: Branch + baseline

**Files:** none modified.

**Interfaces:**
- Produces: branch `redesign-the-index` checked out; baseline screenshot for before/after comparison.

- [ ] **Step 1: Confirm clean tree and create the branch**

```bash
git -C /c/klientideandmed/2km.ee status --porcelain
git -C /c/klientideandmed/2km.ee switch -c redesign-the-index
```

Expected: status shows no unstaged changes to tracked site files (untracked docs/scan files are fine); branch created.

- [ ] **Step 2: Baseline screenshot of the current live site**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --window-size=1280,1600 --virtual-time-budget=10000 --screenshot="<SCRATCHPAD>/baseline-old-design.png" "https://2km.ee/"
```

Expected: PNG written. Keep for the final before/after check.

- [ ] **Step 3: Record the rollback plan**

Rollback after the final merge+push is: `git revert -m 1 <merge-commit> && git push`. Before merge, rollback is simply deleting the branch. No commit in this task.

---

### Task 2: JS layer — `theme.js` (new) + `script.js` (rewrite)

**Files:**
- Create: `theme.js`
- Modify: `script.js` (full replacement)

**Interfaces:**
- Consumes: DOM ids/classes created in Task 3: `#theme-toggle` (button, `hidden`), `#filters` (nav, `hidden`) containing `button[data-f]`, `.entry` elements with `data-cat`, `.email-slot` spans with `data-u`/`data-d`.
- Produces: `document.documentElement.dataset.theme` ∈ {`dark`,`light`} persisted in `localStorage.theme`; `.email-slot` replaced by `a.email-link`.

- [ ] **Step 1: Create `theme.js`**

```js
// Applies the saved theme before first paint. Loaded blocking in <head> (same-origin, CSP-safe).
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
  } catch (e) { /* storage unavailable — media query default applies */ }
})();
```

- [ ] **Step 2: Replace `script.js` entirely with:**

```js
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
    filters.querySelectorAll('button[data-f]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const want = btn.dataset.f;
    document.querySelectorAll('.entry').forEach(entry => {
      entry.hidden = want !== 'all' && entry.dataset.cat !== want;
    });
  });
  filters.hidden = false;
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
```

- [ ] **Step 3: Syntax-check both files**

```bash
node --check /c/klientideandmed/2km.ee/theme.js && node --check /c/klientideandmed/2km.ee/script.js && echo OK
```

Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add theme.js script.js
git commit -m "The Index: new JS layer — pre-paint theme, filters, email assembly"
```

---

### Task 3: `index.html` — new head styles + body shell with 3 sample entries

**Files:**
- Modify: `index.html` — fonts link, favicon, theme metas, `theme.js` tag, full `<style>` replacement (lines ~31–267), full body replacement (lines ~270–797). JSON-LD block: byte-identical, untouched.

**Interfaces:**
- Consumes: `theme.js` / `script.js` from Task 2.
- Produces: final page shell — `#theme-toggle`, `#filters` (7 `button[data-f]` with counts ALL 31 / AI INFRASTRUCTURE 7 / WEB APPS 9 / TESTING & QA 2 / INTEGRATIONS 5 / AUTOMATION 4 / OTHER 4), `.colhead`, `main#index` holding `<details class="entry">` rows (3 samples now, 31 in Task 4), footer with `.email-slot`. The exact entry template Task 4's generator must reproduce.

- [ ] **Step 1: Head edits (keep title/description/OG/canonical/robots/JSON-LD unchanged)**

Replace the favicon line's emoji `&#x1F52E;` with `&#x1F4C7;` (card index). Replace the Syne/DM Sans fonts link with:

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<meta name="theme-color" content="#f4f0e6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16171c" media="(prefers-color-scheme: dark)">
<script src="/theme.js"></script>
```

- [ ] **Step 2: Replace the entire `<style>…</style>` block with:**

```css
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  color-scheme: light;
  --paper: #f4f0e6;
  --paper-raise: #ece5d4;
  --ink: #191510;
  --muted: #57503e;
  --faint: #6d6656;
  --hair: #d9d2bf;
  --accent: #bd3a0e;
  --live: #1a6b3c;
  --warn: #8a5f00;
  --blocked: #8f1d1d;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --paper: #16171c;
    --paper-raise: #1f2027;
    --ink: #ece7db;
    --muted: #a49d8c;
    --faint: #8a8577;
    --hair: #2e3038;
    --accent: #f2683c;
    --live: #4ac97e;
    --warn: #d8a53a;
    --blocked: #e25a5a;
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --paper: #16171c;
  --paper-raise: #1f2027;
  --ink: #ece7db;
  --muted: #a49d8c;
  --faint: #8a8577;
  --hair: #2e3038;
  --accent: #f2683c;
  --live: #4ac97e;
  --warn: #d8a53a;
  --blocked: #e25a5a;
}

[hidden] { display: none !important; }

html { scrollbar-color: var(--hair) var(--paper); }
body {
  font-family: 'Archivo', Helvetica, Arial, sans-serif;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  transition: background 0.25s, color 0.25s;
}
::selection { background: var(--accent); color: var(--paper); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.wrap { max-width: 1060px; margin: 0 auto; padding: 28px 32px 64px; }

/* ── Topline ── */
.topline {
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'IBM Plex Mono', Consolas, monospace;
  font-size: 11px; letter-spacing: 0.22em; color: var(--faint);
}
.theme-btn {
  font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 11px; letter-spacing: 0.15em;
  background: none; border: 1px solid var(--hair); color: var(--muted);
  padding: 6px 12px; cursor: pointer; transition: border-color 0.2s, color 0.2s;
}
.theme-btn:hover { border-color: var(--accent); color: var(--accent); }

/* ── Masthead ── */
.masthead { margin-top: 34px; }
.masthead h1 {
  font-size: clamp(56px, 9vw, 104px); font-weight: 900;
  letter-spacing: -0.035em; line-height: 0.92; text-transform: uppercase;
}
.masthead-row {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 40px; margin-top: 22px;
}
.masthead-intro { font-size: 16px; line-height: 1.55; color: var(--muted); max-width: 540px; }
.masthead-intro em { font-style: normal; color: var(--ink); font-weight: 600; }
.masthead-facts {
  font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 11px; line-height: 2;
  letter-spacing: 0.12em; color: var(--faint); text-align: right; white-space: nowrap;
}
.masthead-facts b { color: var(--accent); font-weight: 600; }
.rule-heavy { border: 0; border-top: 3px solid var(--ink); margin-top: 26px; }

/* ── Filters ── */
.filters {
  display: flex; flex-wrap: wrap; gap: 4px 26px; padding: 14px 0;
  border-bottom: 1px solid var(--hair);
}
.fbtn {
  font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 11px; letter-spacing: 0.14em;
  background: none; border: 0; padding: 0 0 2px; cursor: pointer; color: var(--faint);
}
.fbtn:hover { color: var(--ink); }
.fbtn.active { color: var(--accent); border-bottom: 1px solid var(--accent); }
.fbtn .count { opacity: 0.6; }

/* ── Index ── */
.colhead {
  display: grid; grid-template-columns: 52px 240px 1fr 150px 86px;
  padding: 10px 0; font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 10px;
  letter-spacing: 0.18em; color: var(--faint); border-bottom: 1px solid var(--hair);
}
.colhead .right { text-align: right; }

.entry { border-bottom: 1px solid var(--hair); }
.row {
  display: grid; grid-template-columns: 52px 240px 1fr 150px 86px;
  padding: 14px 0; align-items: baseline; cursor: pointer;
  list-style: none; transition: background 0.15s;
}
.row::-webkit-details-marker { display: none; }
.row:hover, .entry[open] .row { background: var(--paper-raise); }
.no { font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 12px; color: var(--accent); }
.name { font-weight: 700; font-size: 15px; letter-spacing: -0.01em; padding-right: 12px; }
.star { color: var(--accent); font-size: 11px; vertical-align: 2px; }
.desc { color: var(--muted); font-size: 14px; padding-right: 24px; }
.cat, .status { font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 10px; letter-spacing: 0.12em; color: var(--faint); }
.status { text-align: right; }
.st-live { color: var(--live); }
.st-design { color: var(--warn); }
.st-paused { color: var(--faint); }
.st-blocked { color: var(--blocked); }
.st-done { color: var(--muted); }

.detail { padding: 6px 0 22px 52px; max-width: 780px; }
.detail p { font-size: 14.5px; line-height: 1.6; color: var(--muted); }
.detail .tech {
  font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 10.5px; letter-spacing: 0.14em;
  color: var(--faint); margin-top: 14px;
}
.detail .tech b { color: var(--ink); font-weight: 500; }

/* ── Footer ── */
.footer {
  margin-top: 34px; border-top: 3px solid var(--ink); padding-top: 16px;
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  font-family: 'IBM Plex Mono', Consolas, monospace; font-size: 10.5px;
  letter-spacing: 0.15em; color: var(--faint);
}
.email-slot { color: var(--muted); }
a.email-link { color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--hair); }
a.email-link:hover { color: var(--accent); border-color: var(--accent); }

/* ── Mobile ── */
@media (max-width: 720px) {
  .wrap { padding: 20px 18px 40px; }
  .masthead-row { flex-direction: column; align-items: flex-start; }
  .masthead-facts { text-align: left; }
  .colhead { display: none; }
  .row { grid-template-columns: 40px 1fr; row-gap: 4px; }
  .name, .desc, .cat, .status { grid-column: 2; }
  .desc { padding-right: 0; }
  .status { text-align: left; }
  .detail { padding-left: 40px; }
}
```

- [ ] **Step 3: Replace the entire body (everything between `<body>` and the final script tag) with:**

Keep the codename-joke HTML comment at the very top of the file. New body:

```html
<div class="wrap">

  <div class="topline">
    <span>2KM.EE — AI &amp; AUTOMATION PORTFOLIO</span>
    <button class="theme-btn" id="theme-toggle" hidden aria-label="Toggle color theme">◑ DARK</button>
  </div>

  <header class="masthead">
    <h1>Kaupo<br>Karuse</h1>
    <div class="masthead-row">
      <p class="masthead-intro">Thirty-one AI &amp; automation projects built with <em>Claude</em>, <em>MCP servers</em>, and a healthy obsession with ERP. All names are Star Wars codenames. <em>The work is real.</em></p>
      <div class="masthead-facts">
        TALLINN, ESTONIA<br>
        <b>31</b> PROJECTS · <b>26</b> LIVE<br>
        <span class="email-slot" data-u="opuak" data-d="ee.mk2">KAUPO [AT] 2KM [DOT] EE</span>
      </div>
    </div>
    <hr class="rule-heavy">
  </header>

  <nav class="filters" id="filters" hidden aria-label="Filter projects by category">
    <button class="fbtn active" data-f="all">ALL <span class="count">31</span></button>
    <button class="fbtn" data-f="infra">AI INFRASTRUCTURE <span class="count">7</span></button>
    <button class="fbtn" data-f="web">WEB APPS <span class="count">9</span></button>
    <button class="fbtn" data-f="test">TESTING &amp; QA <span class="count">2</span></button>
    <button class="fbtn" data-f="integ">INTEGRATIONS <span class="count">5</span></button>
    <button class="fbtn" data-f="auto">AUTOMATION <span class="count">4</span></button>
    <button class="fbtn" data-f="other">OTHER <span class="count">4</span></button>
  </nav>

  <div class="colhead" aria-hidden="true">
    <span>№</span><span>PROJECT</span><span>WHAT IT IS</span><span>CATEGORY</span><span class="right">STATUS</span>
  </div>

  <main id="index">
    <!-- ENTRIES: generated from the JSON-LD block — see Task 4 -->
  </main>

  <footer class="footer">
    <span>KAUPO KARUSE · TALLINN · 2026</span>
    <span>NAMES ARE STAR WARS CODENAMES · THE WORK IS REAL</span>
    <span class="email-slot" data-u="opuak" data-d="ee.mk2">KAUPO [AT] 2KM [DOT] EE</span>
  </footer>

</div>
<script src="/script.js"></script>
```

Inside `main#index`, add these 3 sample entries (they validate the template; Task 4 regenerates all 31 and MUST reproduce this exact shape):

```html
  <details class="entry" data-cat="infra" id="star-forge">
    <summary class="row">
      <span class="no">01</span>
      <span class="name">Star Forge <span class="star" title="Featured">★</span></span>
      <span class="desc">The internal tools server platform</span>
      <span class="cat">AI INFRASTRUCTURE</span>
      <span class="status st-live">LIVE</span>
    </summary>
    <div class="detail">
      <p>The planet everything orbits. One Linux server quietly running ~18 containers — every MCP server, dashboard, chatbot, and test tool on this page lives here. Apache out front terminates TLS and routes each service by hostname or path; Docker Compose runs the fleet; PostgreSQL and the cron jobs sit on the host. Documented top to bottom so the team can deploy without guessing.</p>
      <p class="tech">STACK — <b>ROCKY LINUX · DOCKER COMPOSE · APACHE · POSTGRESQL · CSF/LFD</b></p>
    </div>
  </details>
```

Plus equivalent entries for positions 02 (Holocron, featured, infra) and 03 (Jedi Archives, featured, infra), taking headline/description/keywords verbatim from the JSON-LD block, keywords uppercased and joined with ` · `.

- [ ] **Step 4: Verify rendering — light, dark, and toggle**

```bash
cd /c/klientideandmed/2km.ee && python -m http.server 8123 &
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --window-size=1280,1400 --virtual-time-budget=10000 --screenshot="<SCRATCHPAD>/shell-light.png" "http://localhost:8123/"
```

Then via Puppeteer MCP: navigate to `http://localhost:8123/`, `puppeteer_evaluate`: `document.getElementById('theme-toggle').click(); document.documentElement.dataset.theme` → expected `"dark"`; screenshot → dark palette visible. Also evaluate `document.querySelectorAll('.entry').length` → `3`.

Eyeball both screenshots: masthead huge and tight, rows ruled, no violet anywhere, no text overflowing columns.

- [ ] **Step 5: Verify no-JS rendering**

```bash
curl -s http://localhost:8123/ | grep -c "<details class=\"entry\""
```

Expected: `3`. Entries are plain HTML — no JS needed to see them. `hidden` on `#filters`/`#theme-toggle` means no dead controls without JS.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "The Index: new head, stylesheet and body shell with first 3 entries"
```

---

### Task 4: Generate all 31 entries from the JSON-LD

**Files:**
- Modify: `index.html` (replace the 3 sample entries inside `main#index` with all 31 generated ones)

**Interfaces:**
- Consumes: the JSON-LD `ItemList` in `index.html` `<head>`; the entry template from Task 3.
- Produces: 31 `<details class="entry">` elements, positions 01–31 in ItemList order.

- [ ] **Step 1: Write the generator to `<SCRATCHPAD>/generate_entries.py`**

```python
import json, re, html, pathlib

SRC = pathlib.Path(r'c:\klientideandmed\2km.ee\index.html')
OUT = pathlib.Path(__file__).with_name('entries-generated.html')

CAT = {
    'AI Infrastructure': ('infra', 'AI INFRASTRUCTURE'),
    'Web App':           ('web',   'WEB APPS'),
    'Testing & QA':      ('test',  'TESTING &amp; QA'),
    'Integration':       ('integ', 'INTEGRATIONS'),
    'Automation':        ('auto',  'AUTOMATION'),
    'Other':             ('other', 'OTHER'),
}
STATUS = {
    'Active':   ('st-live',    'LIVE'),
    'Design':   ('st-design',  'DESIGN'),
    'Paused':   ('st-paused',  'PAUSED'),
    'Blocked':  ('st-blocked', 'BLOCKED'),
    'Complete': ('st-done',    'DONE'),
}
FEATURED = {'Star Forge', 'Holocron', 'Jedi Archives'}

m = re.search(r'<script type="application/ld\+json">(.*?)</script>',
              SRC.read_text(encoding='utf-8'), re.S)
graph = json.loads(m.group(1))
items = next(n for n in graph['@graph'] if n['@type'] == 'CollectionPage')['mainEntity']['itemListElement']
assert len(items) == 31, f'expected 31 items, got {len(items)}'

def esc(s): return html.escape(s, quote=False)
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

blocks = []
for li in items:
    it, pos = li['item'], li['position']
    cat_key, cat_label = CAT[it['genre']]
    st_class, st_label = STATUS[it['creativeWorkStatus']]
    star = ' <span class="star" title="Featured">★</span>' if it['name'] in FEATURED else ''
    stack = ' · '.join(t.strip().upper() for t in it['keywords'].split(','))
    blocks.append(f'''  <details class="entry" data-cat="{cat_key}" id="{slug(it['name'])}">
    <summary class="row">
      <span class="no">{pos:02d}</span>
      <span class="name">{esc(it['name'])}{star}</span>
      <span class="desc">{esc(it['headline'])}</span>
      <span class="cat">{cat_label}</span>
      <span class="status {st_class}">{st_label}</span>
    </summary>
    <div class="detail">
      <p>{esc(it['description'])}</p>
      <p class="tech">STACK — <b>{esc(stack)}</b></p>
    </div>
  </details>''')

OUT.write_text('\n\n'.join(blocks) + '\n', encoding='utf-8')
print(f'wrote {len(blocks)} entries -> {OUT}')
```

- [ ] **Step 2: Run it**

```bash
python "<SCRATCHPAD>/generate_entries.py"
```

Expected: `wrote 31 entries -> …/entries-generated.html`

- [ ] **Step 3: Splice into `index.html`**

Replace everything between `<main id="index">` and `</main>` with the generated file's content. Diff-check the first entry against Task 3's hand-written Star Forge sample — they must match exactly (this validates the generator).

- [ ] **Step 4: Verify counts and structure**

```bash
cd /c/klientideandmed/2km.ee
grep -c "<details class=\"entry\"" index.html            # expected: 31
grep -c "st-live\">LIVE" index.html                       # expected: 26
grep -c "st-design\">DESIGN" index.html                   # expected: 3
grep -c "st-blocked\">BLOCKED" index.html                 # expected: 1
grep -c "st-done\">DONE" index.html                       # expected: 1
grep -c "data-cat=\"infra\"" index.html                   # expected: 7
grep -c "data-cat=\"web\"" index.html                     # expected: 9
grep -c "data-cat=\"test\"" index.html                    # expected: 2
grep -c "data-cat=\"integ\"" index.html                   # expected: 5
grep -c "data-cat=\"auto\"" index.html                    # expected: 4
grep -c "data-cat=\"other\"" index.html                   # expected: 4
grep -c "class=\"star\"" index.html                       # expected: 3
```

- [ ] **Step 5: Visual check with the full list**

Serve locally (as Task 3 Step 4) and screenshot light + dark. Check: long names ("Office365 Email Integration", "Sector Command Dashboard") don't overflow their column; each filter button hides/shows the right rows (Puppeteer: click `button[data-f="integ"]`, evaluate `document.querySelectorAll('.entry:not([hidden])').length` → `5`).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "The Index: all 31 entries generated from JSON-LD"
```

---

### Task 5: Metadata sync — parity check, sitemap lastmod

**Files:**
- Modify: `sitemap.xml` (lastmod only)
- Verify (no changes): JSON-LD in `index.html`, `llms.txt`

**Interfaces:**
- Consumes: Task 4's 31 entries.
- Produces: verified consistency; updated `<lastmod>2026-07-13</lastmod>`.

- [ ] **Step 1: Write parity checker to `<SCRATCHPAD>/verify_parity.py`**

```python
import json, re, html, pathlib

src = pathlib.Path(r'c:\klientideandmed\2km.ee\index.html').read_text(encoding='utf-8')
m = re.search(r'<script type="application/ld\+json">(.*?)</script>', src, re.S)
graph = json.loads(m.group(1))
coll = next(n for n in graph['@graph'] if n['@type'] == 'CollectionPage')['mainEntity']
assert coll['numberOfItems'] == 31, coll['numberOfItems']
names_ld = [li['item']['name'] for li in coll['itemListElement']]

entries = re.findall(r'<details class="entry".*?</details>', src, re.S)
assert len(entries) == 31, len(entries)
names_dom = [html.unescape(re.search(r'<span class="name">(.*?)(?: <span class="star"|</span>)', e).group(1))
             for e in entries]
assert names_dom == names_ld, [a for a, b in zip(names_dom, names_ld) if a != b]

statuses = [re.search(r'class="status (st-\w+)"', e).group(1) for e in entries]
assert statuses.count('st-live') == 26 and statuses.count('st-design') == 3 \
   and statuses.count('st-blocked') == 1 and statuses.count('st-done') == 1
print('PARITY OK: 31 entries, DOM order == JSON-LD order, statuses 26/3/1/1')
```

- [ ] **Step 2: Run it**

```bash
python "<SCRATCHPAD>/verify_parity.py"
```

Expected: `PARITY OK: …`

- [ ] **Step 3: Confirm `llms.txt` needs no change**

```bash
git diff master -- llms.txt
```

Expected: empty (content-only file, layout redesign doesn't touch it).

- [ ] **Step 4: Update sitemap lastmod**

In `sitemap.xml`, change `<lastmod>2026-07-06</lastmod>` → `<lastmod>2026-07-13</lastmod>`.

- [ ] **Step 5: Commit**

```bash
git add sitemap.xml
git commit -m "The Index: bump sitemap lastmod"
```

---

### Task 6: og-image re-render

**Files:**
- Create: `docs/og-card.html` (committed so the card is reproducible)
- Modify: `og-image.png` (re-rendered, committed)

**Interfaces:**
- Consumes: final palette/typography from Task 3.
- Produces: 1200×630 `og-image.png` in Index style; `og:image` URL in head unchanged.

- [ ] **Step 1: Create `docs/og-card.html`**

```html
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;900&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  body { margin:0; width:1200px; height:630px; background:#f4f0e6; color:#191510;
         font-family:'Archivo',Helvetica,sans-serif; display:flex; flex-direction:column;
         justify-content:space-between; padding:56px 64px; box-sizing:border-box; }
  .top { font-family:'IBM Plex Mono',monospace; font-size:18px; letter-spacing:.22em; color:#6d6656; }
  h1 { font-size:118px; font-weight:900; letter-spacing:-.03em; line-height:.92; text-transform:uppercase; margin:0; }
  .sub { font-size:26px; line-height:1.4; color:#57503e; max-width:820px; }
  .sub em { font-style:normal; font-weight:700; color:#191510; }
  .rule { height:6px; background:#191510; margin-top:28px; }
  .facts { display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace;
           font-size:19px; letter-spacing:.14em; color:#6d6656; }
  .facts b { color:#bd3a0e; }
</style></head>
<body>
  <div class="top">2KM.EE — AI &amp; AUTOMATION PORTFOLIO</div>
  <h1>Kaupo Karuse</h1>
  <div>
    <div class="sub">Thirty-one AI &amp; automation projects built with <em>Claude</em>, <em>MCP servers</em>, and a healthy obsession with ERP.</div>
    <div class="rule"></div>
  </div>
  <div class="facts"><span><b>31</b> PROJECTS · <b>26</b> LIVE</span><span>NAMES ARE CODENAMES · THE WORK IS REAL</span></div>
</body></html>
```

- [ ] **Step 2: Render**

```bash
cd /c/klientideandmed/2km.ee
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --window-size=1200,630 --virtual-time-budget=10000 --screenshot=og-image.png "file:///c:/klientideandmed/2km.ee/docs/og-card.html"
```

- [ ] **Step 3: Verify dimensions and eyeball**

```bash
python -c "import struct;d=open(r'c:\klientideandmed\2km.ee\og-image.png','rb').read();print(struct.unpack('>II', d[16:24]))"
```

Expected: `(1200, 630)`. Read the PNG visually: paper background, fonts loaded (not fallback Helvetica-only), nothing clipped.

- [ ] **Step 4: Commit**

```bash
git add docs/og-card.html og-image.png
git commit -m "The Index: re-render og-image in new style, add reproducible card"
```

---

### Task 7: Final verification, merge, deploy, live checks

**Files:**
- Modify: local `CLAUDE.md` (git-ignored — no commit)
- Merge branch to `master`, push.

- [ ] **Step 1: Real-name grep**

Read the codename legend table in the local git-ignored `CLAUDE.md`. For EVERY real name in its right-hand column (and the real customer names if any are known), run case-insensitive grep over `index.html`, `llms.txt`, `sitemap.xml`, `docs/og-card.html`, and the spec/plan files. Expected: zero hits for every real name.

- [ ] **Step 2: Contrast re-check (guards against palette drift during implementation)**

Re-run the contrast script from planning (all token/background pairs from the spec table) — every pair ≥ 4.5. Expected: all PASS.

- [ ] **Step 3: Update local `CLAUDE.md`**

Rewrite the stale sections: theme is now "The Index" (link the spec), `:root` tokens + dark via `data-theme`/media query, no hardcoded accent colors anymore, bubble data model section → entry model (`<details class="entry">`, generated from JSON-LD, JSON-LD is now the source of truth for entry regeneration), og-image card now at `docs/og-card.html`, favicon 📇. Keep under 200 lines. No commit (git-ignored).

- [ ] **Step 4: Merge and deploy**

```bash
cd /c/klientideandmed/2km.ee
git switch master
git merge --no-ff redesign-the-index -m "Redesign: The Index — Swiss print catalog replaces violet bubble grid"
git push
```

- [ ] **Step 5: Live verification (wait ~30s for edge cache)**

```bash
curl -sI "https://2km.ee/?v=$(date +%s)" | grep -iE "^(HTTP|content-security-policy|strict-transport-security)" 
curl -s "https://2km.ee/?v=$(date +%s)" | grep -c "<details class=\"entry\""
curl -s https://2km.ee/theme.js | head -1
curl -sI -A "GPTBot" "https://2km.ee/" | head -1
```

Expected: `HTTP/2 200` + CSP + HSTS headers present; `31`; the theme.js comment line; `HTTP/2 200` (AI crawlers still allowed).

Then Puppeteer MCP against `https://2km.ee/`:
- `document.querySelectorAll('.entry').length` → `31`
- `!document.getElementById('filters').hidden` → `true` (proves script.js executed under CSP)
- click `#theme-toggle`, evaluate `document.documentElement.dataset.theme` → `"dark"`
- screenshot both themes; compare against `baseline-old-design.png` — completely different page.

- [ ] **Step 6: Manual checks for Kaupo (report, don't block)**

Hard-refresh (Ctrl+Shift+R) on desktop + phone; glance at DevTools console for CSP violations (expected: none); optionally re-run Mozilla Observatory (expected: unchanged A+).

Rollback if anything is wrong: `git revert -m 1 <merge-commit> && git push`.

---

## Self-review notes

- Spec coverage: layout/typography/palette (T3), toggle+no-FOUC (T2/T3), native details no-JS (T3), 31 entries + statuses + ★ (T4), JSON-LD/llms/sitemap (T5), og-image (T6), CSP/headers/codename grep/live checks (T7). Success criteria 1–6 all land in T7 steps.
- The JSON-LD block is intentionally byte-identical throughout — it is both the data source for generation and already correct.
- No `data-url` links exist in the current site (verified), so the entry template has no link element.

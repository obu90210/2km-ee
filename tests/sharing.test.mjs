import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../script.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const ids = [...html.matchAll(/<details class="entry"[^>]* id="([^"]+)"/g)].map(m => m[1]);
assert.equal(ids.length, 31);
assert.equal((html.match(/>Permanent link<\/a>/g) || []).length, 31);
assert.ok(!html.includes('Link to this project'));
assert.match(readFileSync(new URL('../_headers', import.meta.url), 'utf8'), /clipboard-write=\(self\)/);

class Element {
  children = []; attributes = {}; events = {}; textContent = ''; hidden = false;
  setAttribute(key, value) { this.attributes[key] = value; }
  append(...elements) { this.children.push(...elements); }
  addEventListener(name, handler) { this.events[name] = handler; }
  replaceWith(element) { this.replacement = element; }
  focus() { this.focused = true; }
  select() { this.selected = true; }
}

function setup(clipboard) {
  const links = ids.map(id => {
    const link = new Element();
    link.closest = () => ({ id, querySelector: () => ({ textContent: id }) });
    return link;
  });
  const timers = [];
  runInNewContext(source, {
    document: {
      getElementById: () => null,
      querySelectorAll: selector => selector === 'a.permalink' ? links : [],
      createElement: () => new Element(),
      addEventListener() {},
    },
    window: { addEventListener() {} }, location: { hash: '' },
    navigator: { clipboard }, URL,
    setTimeout: callback => { timers.push(callback); return timers.length; },
    clearTimeout() {},
  });
  return { groups: links.map(link => link.replacement.children), timers };
}

const copied = [];
const success = setup({ writeText: async value => { copied.push(value); } });
for (const [i, [button, status, fallback]] of success.groups.entries()) {
  assert.equal(button.textContent, 'Copy link');
  assert.equal(status.attributes.role, 'status');
  assert.ok(fallback.hidden);
  await button.events.click();
  assert.equal(copied[i], `https://2km.ee/#${ids[i]}`);
  assert.equal(button.textContent, 'Copied!');
  assert.equal(button.disabled, false);
  assert.equal(status.textContent, 'Portfolio link copied.');
  success.timers[i]();
  assert.equal(button.textContent, 'Copy link');
}
for (const clipboard of [undefined, { writeText: async () => { throw new Error('Denied'); } }]) {
  const [button, status, fallback] = setup(clipboard).groups[1];
  await button.events.click();
  assert.equal(button.textContent, 'Copy link');
  assert.equal(button.disabled, false);
  assert.match(status.textContent, /unavailable/);
  assert.equal(fallback.hidden, false);
  const input = fallback.children[0];
  assert.equal(input.value, 'https://2km.ee/#holocron');
  assert.equal(input.readOnly, true);
  assert.ok(input.focused && input.selected);
}
console.log('PASS: 31 canonical share URLs, confirmation and reset, denied/missing clipboard fallback, no-JS anchors and write policy');

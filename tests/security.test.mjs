import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { publicFiles, assetIgnore } from '../tools/public-files.mjs';
const read = name => readFileSync(new URL('../' + name, import.meta.url), 'utf8');
assert.equal(read('.assetsignore').replace(/\r\n/g, '\n'), assetIgnore(), 'Deployment must match the reviewed public asset list');
assert.equal(new Set(publicFiles).size, publicFiles.length);
for (const name of publicFiles) {
  assert.ok(existsSync(new URL('../' + name, import.meta.url)), name);
  assert.ok(!name.includes('..') && !name.startsWith('/'));
  if (name.endsWith('.woff2')) assert.equal(readFileSync(new URL('../' + name, import.meta.url)).subarray(0, 4).toString(), 'wOF2');
}
for (const name of publicFiles.filter(x => x.endsWith('.html'))) {
  const html = read(name);
  assert.ok(!/<style\b|\sstyle\s*=|\son[a-z]+\s*=/i.test(html), 'No inline styling/handlers: ' + name);
  assert.ok(!/<(?:script|link)\b[^>]*(?:src|href)="https?:[^\"]+"[^>]*(?:rel="stylesheet")/i.test(html));
  for (const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) assert.ok(script[1].includes('application/ld+json') || (/src="\//.test(script[1]) && !script[2].trim()));
}
for (const name of publicFiles.filter(x => x.endsWith('.css'))) assert.ok(!/https?:|@import/i.test(read(name)), 'Styles and fonts are first-party: ' + name);
const headers = read('_headers');
const csp = headers.match(/^\s+Content-Security-Policy:\s*(.+)$/m)[1];
for (const directive of ["default-src 'none'", "script-src 'self'", "script-src-attr 'none'", "style-src 'self'", "style-src-attr 'none'", "font-src 'self'", "connect-src 'none'", "base-uri 'none'", "frame-ancestors 'none'", "form-action 'none'", "require-trusted-types-for 'script'", "trusted-types 'none'"]) assert.ok(csp.includes(directive), directive);
assert.ok(!/unsafe-inline|unsafe-eval|https?:/.test(csp));
assert.match(headers, /Strict-Transport-Security: max-age=63072000; includeSubDomains; preload/);
assert.match(headers, /X-Content-Type-Options: nosniff/);
assert.match(headers, /clipboard-write=\(self\)/);
const security = read('.well-known/security.txt');
assert.match(security, /Contact: mailto:kaupo@2km\.ee/);
assert.match(security, /Canonical: https:\/\/2km\.ee\/\.well-known\/security\.txt/);
assert.ok(new Date(security.match(/^Expires:\s*(.+)$/m)[1]) > new Date(), 'Disclosure contact is current');
console.log('PASS: default-deny public packaging, local font files/licence, no inline styles/handlers, strict CSP/Trusted Types, disclosure metadata');

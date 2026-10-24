// Cross-check the independently consumed forms of the public portfolio.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetIgnore } from './public-files.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const html = read('index.html'), llms = read('llms.txt');
const text = value => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
const collection = graph.find(x => x['@type'] === 'CollectionPage');
const projects = collection.mainEntity.itemListElement;
const entries = [...html.matchAll(/<details class="entry" data-cat="([^"]+)" id="([^"]+)">([\s\S]*?)<\/details>/g)];
assert.equal(entries.length, projects.length);
assert.equal(projects.length, collection.mainEntity.numberOfItems);
for (const [i, entry] of entries.entries()) {
  const item = projects[i].item;
  assert.equal(projects[i].position, i + 1);
  assert.equal(item.url, 'https://2km.ee/#' + entry[2]);
  for (const [selector, value] of [['name', item.name], ['desc', item.headline]]) {
    assert.equal(text(entry[3].match(new RegExp(`<span class="${selector}">([\\s\\S]*?)</span>`))[1]), value, item.name);
  }
  assert.equal(text(entry[3].match(/<div class="detail"><p>([\s\S]*?)<\/p>/)[1]), item.description, item.name);
  assert.ok(llms.includes(item.headline + '. ' + item.description), 'Plain-text description: ' + item.name);
  const status = text(entry[3].match(/<span class="status [^"]+">([^<]+)<\/span>/)[1]).replace(/\*$/, '');
  assert.equal(status, item.creativeWorkStatus, item.name);
}
for (const filter of html.matchAll(/<button class="fbtn[^\"]*" data-f="([^"]+)"[^>]*>[^<]*<span>(\d+)<\/span>/g)) {
  assert.equal(Number(filter[2]), filter[1] === 'all' ? entries.length : entries.filter(e => e[1] === filter[1]).length, filter[1]);
}
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Unique HTML IDs');
for (const link of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(link[1]), 'Fragment: ' + link[1]);
for (const asset of html.matchAll(/(?:src|href)="\/([^"#?]+)"/g)) assert.ok(existsSync(resolve(root, asset[1])), 'Asset: ' + asset[1]);
const metrics = graph.filter(x => x['@type'] === 'Dataset').flatMap(x => x.variableMeasured);
assert.equal(metrics.length, 4, 'Four declared measurements across two dated snapshots');
for (const metric of metrics) {
  const match = html.match(new RegExp(`data-metric="${metric.propertyID}" data-value="([^"]+)">([\\s\\S]*?)</strong>`));
  assert.ok(match, 'Visible metric: ' + metric.propertyID);
  assert.equal(Number(match[1]), metric.value);
  assert.equal(Number(text(match[2]).replace(/[^\d.]/g, '')), metric.value);
  assert.ok(llms.includes(metric.value.toLocaleString('en-US')), 'Plain-text metric: ' + metric.propertyID);
}
const stories = [...html.matchAll(/<article class="case" data-work="(\d+)" data-illustration="([^"]+)" data-caption="([^"]+)"/g)];
assert.equal(stories.length, 4);
assert.deepEqual(stories.map(s => s[2]), ['chatbot', 'knowledge', 'development', 'testing']);
assert.deepEqual(stories.map(s => Number(s[1])), [0, 1, 2, 3]);
const reviewed = collection.dateModified;
assert.ok(read('sitemap.xml').includes(`<lastmod>${reviewed}</lastmod>`));
assert.ok(llms.includes('Content reviewed: ' + reviewed));
for (const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
  assert.ok(script[1].includes('application/ld+json') || (/src="\/[^\"]+"/.test(script[1]) && !script[2].trim()), 'CSP-compatible script');
}
const ignored = read('.assetsignore');
assert.equal(ignored.replace(/\r\n/g, '\n'), assetIgnore(), 'Deployment is limited to the reviewed public asset manifest');
assert.ok(!/excellent\.(ee|lv|lt|fi|no|se)|halocron\.excellent|testman\.|\/opt\//i.test(html + llms + read('docs/og-card.html')), 'Public copy has no private entity or host references');
for (const path of ['index.html', 'llms.txt', 'experience.js', 'docs/og-card.html', 'docs/evidence.md']) {
  assert.ok(!/source[\s-]*code|ERP\s+(?:source|code)|source\s+retrieval|source[\s-]+review/i.test(read(path)), 'Restricted implementation reference in ' + path);
}
console.log(`PASS: ${entries.length} project records, category counts, descriptions/statuses, fragments/assets, four dated measurements, story mappings, metadata dates, CSP and packaging`);

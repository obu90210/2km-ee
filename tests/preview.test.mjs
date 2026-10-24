import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { get } from 'node:http';
import { createPreviewServer } from '../tools/preview.mjs';

test('preview serves the portfolio with production headers and blocks private paths', async () => {
  const server = createPreviewServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(origin);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-security-policy'), /script-src 'self'/);
    assert.equal(page.headers.get('x-robots-tag'), null, 'archive noindex must not apply to the homepage');
    assert.match(await page.text(), /Kaupo Karuse/);
    for (const path of ['/CLAUDE.md', '/AGENTS.md', '/next-session.md', '/README.md', '/docs/og-card.html', '/.git/config', '/.superpowers/', '/gate/worker.js', '/wrangler.toml', '/2002/', '/2002/index.html', '/lighthouse-2km.ee.json', '/assets/%2e%2e%2fCLAUDE.md']) {
      assert.equal((await fetch(origin + path)).status, 404, path);
    }
    const head = await fetch(origin + '/experience.js', { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    assert.match(head.headers.get('content-type'), /javascript/);
    assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
    assert.equal((await fetch(origin + '/assets/viru-bog.jpg')).status, 200);
    assert.equal((await fetch(origin + '/.well-known/security.txt')).status, 200);
    const rawStatus = headers => new Promise((resolve, reject) => get(origin, { headers }, res => { res.resume(); resolve(res.statusCode); }).on('error', reject));
    assert.equal(await rawStatus({ Host: 'outside.invalid', Origin: 'http://outside.invalid' }), 403, 'preview rejects foreign Host headers');
    assert.equal(await rawStatus({ Host: 'localhost:1' }), 403, 'preview rejects a mismatched port');
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});

// Local preview uses an explicit public-asset allowlist, never the repository root.
import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles } from './public-files.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const allowed = new Set(publicFiles);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.txt': 'text/plain', '.xml': 'application/xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const productionHeaders = Object.fromEntries(
  readFileSync(resolve(root, '_headers'), 'utf8').split(/\r?\n/)
    .slice(1).join('\n').split(/\n\S/)[0].split('\n').filter(line => /^\s+[^:]+:/.test(line))
    .map(line => { const i = line.indexOf(':'); return [line.slice(0, i).trim(), line.slice(i + 1).trim()]; }),
);

export function createPreviewServer() {
  return createServer(async (request, response) => {
    const sendError = (status, text) => { response.writeHead(status, { ...productionHeaders, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(request.method === 'HEAD' ? '' : text); };
    const host = request.headers.host;
    const port = request.socket.localPort;
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) return sendError(403, 'Forbidden');
    if (!['GET', 'HEAD'].includes(request.method)) return sendError(405, 'Method not allowed');
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const name = pathname === '/' ? 'index.html' : pathname.slice(1);
      if (!allowed.has(name)) return sendError(404, 'Not found');
      const path = await realpath(resolve(root, name));
      if (!path.startsWith(root + sep)) return sendError(404, 'Not found');
      const body = await readFile(path);
      const type = types[extname(path)];
      response.writeHead(200, { ...productionHeaders, 'Content-Type': type + (type.startsWith('text/') || type === 'application/xml' ? '; charset=utf-8' : ''), 'Content-Length': body.length, 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch { sendError(404, 'Not found'); }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] || 8123);
  createPreviewServer().listen(port, '127.0.0.1', () => console.log(`Portfolio preview: http://127.0.0.1:${port} (public assets only)`));
}

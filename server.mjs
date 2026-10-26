import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function commonHeaders(contentType) {
  return {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-cache'
  };
}

function safePath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  if (!pathname.startsWith('/') || pathname.includes('\0')) return null;
  if (pathname === '/') pathname = '/index.html';
  const target = resolve(ROOT, `.${pathname}`);
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return null;
  return target;
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, commonHeaders('text/plain; charset=utf-8'));
    response.end();
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { ...commonHeaders('text/plain; charset=utf-8'), Allow: 'GET, HEAD, OPTIONS' });
    response.end(request.method === 'HEAD' ? undefined : 'Method Not Allowed');
    return;
  }

  const filePath = safePath(request.url || '/');
  if (!filePath) {
    response.writeHead(400, commonHeaders('text/plain; charset=utf-8'));
    response.end(request.method === 'HEAD' ? undefined : 'Bad Request');
    return;
  }

  try {
    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) throw new Error('not a file');
    const body = await readFile(filePath);
    const headers = commonHeaders(MIME[extname(filePath).toLowerCase()] || 'application/octet-stream');
    headers['Content-Length'] = String(body.byteLength);
    response.writeHead(200, headers);
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, commonHeaders('text/plain; charset=utf-8'));
    response.end(request.method === 'HEAD' ? undefined : 'Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`WebContainer Desktop listening on http://0.0.0.0:${PORT}`);
});

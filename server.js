const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
    // Only allow GET and HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Method Not Allowed');
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // Normalize path to prevent directory traversal
        let safePath = path.normalize(path.join(PUBLIC_DIR, pathname));

        if (!safePath.startsWith(PUBLIC_DIR)) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Forbidden');
            return;
        }

        // If it's a directory, try serving index.html
        if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
            safePath = path.join(safePath, 'index.html');
        }

        fs.stat(safePath, (err, stats) => {
            if (err || !stats.isFile()) {
                // Fallback: if not found, serve index.html (SPA friendly)
                const indexPath = path.join(PUBLIC_DIR, 'index.html');
                fs.readFile(indexPath, (indexErr, indexData) => {
                    if (indexErr) {
                        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        if (req.method === 'HEAD') {
                            res.end();
                        } else {
                            res.end(indexData);
                        }
                    }
                });
                return;
            }

            const ext = path.extname(safePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Length': stats.size,
                'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
            });

            if (req.method === 'HEAD') {
                res.end();
                return;
            }

            const readStream = fs.createReadStream(safePath);
            readStream.pipe(res);
            readStream.on('error', (streamErr) => {
                console.error('Stream error:', streamErr);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Internal Server Error');
                }
            });
        });
    } catch (parseErr) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Bad Request');
    }
});

server.listen(PORT, HOST, () => {
    console.log(`[RED MIND 2.0] Server running at http://${HOST}:${PORT}/ (Serving ${PUBLIC_DIR})`);
});

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

const DATA_DIR = path.join(__dirname, 'data');
const ANSWERS_FILE = path.join(DATA_DIR, 'debate_answers.json');

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ANSWERS_FILE)) {
        fs.writeFileSync(ANSWERS_FILE, '[]', 'utf8');
    }
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);

        // API ROUTE: /api/debate-answers (Lưu trữ và truy xuất câu trả lời phản biện)
        if (pathname === '/api/debate-answers') {
            ensureDataFile();

            if (req.method === 'GET') {
                try {
                    const raw = fs.readFileSync(ANSWERS_FILE, 'utf8') || '[]';
                    const data = JSON.parse(raw);
                    sendJson(res, 200, { success: true, answers: data });
                } catch (e) {
                    sendJson(res, 500, { success: false, message: 'Lỗi đọc file dữ liệu', error: e.message });
                }
                return;
            }

            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', () => {
                    try {
                        const item = JSON.parse(body);
                        if (!item || !item.team || !item.answer) {
                            sendJson(res, 400, { success: false, message: 'Dữ liệu không hợp lệ. Cần có nhóm và câu trả lời.' });
                            return;
                        }

                        const raw = fs.readFileSync(ANSWERS_FILE, 'utf8') || '[]';
                        let list = JSON.parse(raw);

                        // Tìm xem nhóm này đã có câu trả lời chưa, nếu có thì cập nhật, nếu chưa thì thêm mới
                        const existingIdx = list.findIndex(a => a.team === item.team);
                        const record = {
                            id: item.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                            team: item.team,
                            question: item.question || '',
                            answer: item.answer,
                            wordCount: item.wordCount || item.answer.trim().split(/\s+/).filter(Boolean).length,
                            score: item.score || 85,
                            rubric: item.rubric || null,
                            keyFindings: item.keyFindings || [],
                            remark: item.remark || '',
                            submittedAt: item.submittedAt || new Date().toISOString(),
                            submittedTimeFormatted: item.submittedTimeFormatted || new Date().toLocaleString('vi-VN')
                        };

                        if (existingIdx >= 0) {
                            list[existingIdx] = record;
                        } else {
                            list.push(record);
                        }

                        fs.writeFileSync(ANSWERS_FILE, JSON.stringify(list, null, 2), 'utf8');
                        sendJson(res, 200, { success: true, record, all: list });
                    } catch (e) {
                        sendJson(res, 500, { success: false, message: 'Lỗi ghi dữ liệu', error: e.message });
                    }
                });
                return;
            }

            if (req.method === 'DELETE') {
                try {
                    fs.writeFileSync(ANSWERS_FILE, '[]', 'utf8');
                    sendJson(res, 200, { success: true, message: 'Đã xóa toàn bộ câu trả lời phản biện.', answers: [] });
                } catch (e) {
                    sendJson(res, 500, { success: false, message: 'Lỗi xóa dữ liệu', error: e.message });
                }
                return;
            }

            res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Method Not Allowed');
            return;
        }

        // Only allow GET and HEAD requests for static files
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Method Not Allowed');
            return;
        }

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
                'Cache-Control': 'no-cache, no-store, must-revalidate'
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

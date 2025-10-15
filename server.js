const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Handle API config endpoint
    if (req.url === '/api/config') {
        try {
            const envData = JSON.parse(fs.readFileSync('env.local.json', 'utf8'));
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                supabaseUrl: envData.SUPABASE_URL,
                supabaseAnonKey: envData.SUPABASE_ANON_KEY
            }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Configuration error' }));
        }
        return;
    }

    // Parse URL and determine file path
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 TVK Web Server is running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`\n🔗 Open in browser:`);
    console.log(`   Admin Login: http://localhost:${PORT}/admin-login.html`);
    console.log(`   Member Photos: http://localhost:${PORT}/member-photos.html`);
    console.log(`   Main Page: http://localhost:${PORT}/index.html`);
    console.log(`\n⏹️  Press Ctrl+C to stop the server\n`);
});

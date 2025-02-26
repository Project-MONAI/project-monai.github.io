const liveServer = require('live-server');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

// Load and process HTML components
function loadComponents() {
    const components = {};
    const componentsDir = path.join(__dirname, '..', 'components');
    
    fs.readdirSync(componentsDir).forEach(file => {
        if (file.endsWith('.html')) {
            const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
            components[file] = content;
        }
    });
    return components;
}

// Process HTML files with component includes
function processHtml(content, components) {
    return content.replace(/<!-- #include file="components\/(.*?)" -->/g, (match, filename) => {
        return components[filename] || '';
    });
}

// Middleware to handle component includes
function componentMiddleware(req, res, next) {
    if (!req.url.endsWith('.html') && req.url !== '/') {
        return next();
    }

    const components = loadComponents();
    const filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
    const fullPath = path.join(__dirname, '..', filePath);

    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const processedContent = processHtml(content, components);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(processedContent);
    } catch (err) {
        next(err);
    }
}

// Watch for changes in component files
const componentsWatcher = chokidar.watch(path.join(__dirname, '..', 'components', '*.html'), {
    ignored: /(^|[\/\\])\../,
    persistent: true
});

// Server configuration
const params = {
    port: 3000,
    host: "0.0.0.0",
    root: path.join(__dirname, '..'),
    open: false,
    wait: 1000,
    logLevel: 2,
    middleware: [componentMiddleware],
    mount: [
        ['/assets', path.join(__dirname, '..', 'dist', 'assets')],
        ['/assets', path.join(__dirname, '..', 'assets')],
    ],
    mimeTypes: {
        'css': 'text/css',
    }
};

// Start server
liveServer.start(params);

console.log(`Development server running at http://localhost:${params.port}`);

// Watch for component changes
componentsWatcher.on('change', (filepath) => {
    console.log(`Component changed: ${filepath}`);
}); 
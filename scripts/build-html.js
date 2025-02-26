const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const glob = require('glob');

const COMPONENTS_DIR = 'components';
const DIST_DIR = 'dist';

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyDirectory(src, dest) {
    ensureDirectoryExists(dest);
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function copyStaticAssets() {
    // Ensure dist directory exists
    ensureDirectoryExists(DIST_DIR);
    
    // List of directories to copy
    const assetDirs = [
        'assets',
        'images',
        'apps',
        'research'
    ];
    
    // Copy each directory if it exists
    assetDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            copyDirectory(dir, path.join(DIST_DIR, dir));
            console.log(`Copied ${dir} to dist`);
        }
    });
}

function replaceIncludes(content, components) {
    // Handle all formats of includes
    const patterns = [
        /<!-- #include file="\/components\/(.*?)" -->/g,
        /<!-- #include file="components\/(.*?)" -->/g,
        /<!-- Include (.*?) Component -->/g
    ];
    
    let processed = content;
    patterns.forEach(pattern => {
        processed = processed.replace(pattern, (match, filename) => {
            // For the new format, convert component name to filename
            if (pattern.toString().includes('Include')) {
                filename = filename.toLowerCase() + '.html';
            }
            return components[filename] || '';
        });
    });
    
    return processed;
}

function extractMetadata(content) {
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descriptionMatch = content.match(/<meta name="description" content="(.*?)">/);
    const canonicalMatch = content.match(/<link rel="canonical" href="(.*?)">/);

    return {
        title: titleMatch ? titleMatch[1].split('|')[0].trim() : 'MONAI',
        description: descriptionMatch ? descriptionMatch[1] : '',
        canonical_url: canonicalMatch ? canonicalMatch[1] : 'https://monai.io'
    };
}

function processTemplate(template, components) {
    // First pass: Replace includes
    let processed = replaceIncludes(template, components);
    
    // Extract metadata from the processed content
    const metadata = extractMetadata(processed);
    
    // Second pass: Replace template variables
    processed = processed.replace(/\${title}/g, metadata.title);
    processed = processed.replace(/\${description}/g, metadata.description);
    processed = processed.replace(/\${canonical_url}/g, metadata.canonical_url);
    
    return processed;
}

function loadComponents() {
    const components = {};
    fs.readdirSync(COMPONENTS_DIR).forEach(file => {
        const content = fs.readFileSync(path.join(COMPONENTS_DIR, file), 'utf8');
        components[file] = content;
    });
    return components;
}

function findAllHtmlFiles() {
    return glob.sync('**/*.html', {
        ignore: ['node_modules/**', 'dist/**', 'components/**'],
        nodir: true
    });
}

function buildPages() {
    const components = loadComponents();
    const htmlFiles = findAllHtmlFiles();
    
    // Ensure dist directory exists
    ensureDirectoryExists(DIST_DIR);
    
    htmlFiles.forEach(file => {
        try {
            const template = fs.readFileSync(file, 'utf8');
            const processed = processTemplate(template, components);
            
            // Create dist directory and any necessary subdirectories
            const distPath = path.join(DIST_DIR, path.dirname(file));
            ensureDirectoryExists(distPath);
            
            fs.writeFileSync(path.join(DIST_DIR, file), processed);
            console.log(`Built ${file}`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    });
    
    // Copy all static assets
    copyStaticAssets();
}

// Watch mode
if (process.argv.includes('--watch')) {
    console.log('Watching for changes...');
    
    // Initial build
    buildPages();
    
    // Watch all HTML files, components, and static assets
    const watcher = chokidar.watch([
        '**/*.html',
        'assets/**/*',
        'images/**/*',
        'apps/**/*',
        'research/**/*'
    ], {
        ignored: ['node_modules/**', 'dist/**'],
        persistent: true
    });
    
    watcher.on('change', (filepath) => {
        console.log(`File ${filepath} changed`);
        if (filepath.endsWith('.html')) {
            buildPages();
        } else {
            // For non-HTML files, just copy the changed file to dist
            const destPath = path.join(DIST_DIR, filepath);
            ensureDirectoryExists(path.dirname(destPath));
            fs.copyFileSync(filepath, destPath);
            console.log(`Copied changed file: ${filepath}`);
        }
    });
} else {
    // Single build
    buildPages();
} 
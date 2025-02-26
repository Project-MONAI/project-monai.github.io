const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const sharp = require('sharp');
const glob = require('glob');

async function optimizeJavaScript() {
    const jsFiles = glob.sync('assets/js/*.js');
    
    for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const minified = await minify(content, {
            compress: {
                dead_code: true,
                drop_console: true,
                drop_debugger: true,
                keep_fnames: false,
                keep_classnames: false
            }
        });
        
        const outputPath = path.join('dist', file);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, minified.code);
        console.log(`Optimized ${file}`);
    }
}

async function optimizeImages() {
    const imageFiles = glob.sync('assets/img/**/*.{jpg,jpeg,png,gif}');
    
    for (const file of imageFiles) {
        const image = sharp(file);
        const metadata = await image.metadata();
        
        // Create WebP version
        const webpOutput = path.join('dist', file.replace(/\.[^.]+$/, '.webp'));
        fs.mkdirSync(path.dirname(webpOutput), { recursive: true });
        await image
            .webp({ quality: 80 })
            .toFile(webpOutput);
            
        // Optimize original format
        const optimizedOutput = path.join('dist', file);
        fs.mkdirSync(path.dirname(optimizedOutput), { recursive: true });
        
        if (metadata.format === 'png') {
            await image
                .png({ quality: 80, compressionLevel: 9 })
                .toFile(optimizedOutput);
        } else if (['jpg', 'jpeg'].includes(metadata.format)) {
            await image
                .jpeg({ quality: 80 })
                .toFile(optimizedOutput);
        }
        
        console.log(`Optimized ${file}`);
    }
}

async function main() {
    try {
        await Promise.all([
            optimizeJavaScript(),
            optimizeImages()
        ]);
        console.log('Asset optimization complete');
    } catch (error) {
        console.error('Error during optimization:', error);
        process.exit(1);
    }
}

main(); 
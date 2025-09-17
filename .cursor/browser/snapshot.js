const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.APP_URL || 'http://localhost:8080';
const ROUTE = process.argv[2] || '/';
const OUTPUT_DIR = path.join(__dirname);

async function takeSnapshot() {
    console.log(`🔍 Tomando snapshot de ${APP_URL}${ROUTE}`);
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const consoleMessages = [];
    
    // Interceptar mensajes de consola
    page.on('console', msg => {
        consoleMessages.push({
            level: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
    });
    
    try {
        // Navegar a la página
        const response = await page.goto(`${APP_URL}${ROUTE}`, { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        console.log(`📊 Estado HTTP: ${response.status()}`);
        
        // Esperar un poco más para que se estabilice
        await page.waitForTimeout(2000);
        
        // Capturar HTML
        const html = await page.evaluate(() => document.documentElement.outerHTML);
        fs.writeFileSync(path.join(OUTPUT_DIR, 'page.html'), html, 'utf8');
        
        // Capturar consola
        const consoleData = consoleMessages.map(msg => JSON.stringify(msg)).join('\n');
        fs.writeFileSync(path.join(OUTPUT_DIR, 'console.ndjson'), consoleData, 'utf8');
        
        // Capturar screenshot
        await page.screenshot({ 
            path: path.join(OUTPUT_DIR, 'screenshot.png'),
            fullPage: true 
        });
        
        // Reportar resultados
        const errors = consoleMessages.filter(msg => msg.level === 'error');
        const warnings = consoleMessages.filter(msg => msg.level === 'warning');
        
        console.log(`✅ Snapshot completado:`);
        console.log(`   📄 HTML: ${path.join(OUTPUT_DIR, 'page.html')}`);
        console.log(`   📝 Consola: ${path.join(OUTPUT_DIR, 'console.ndjson')}`);
        console.log(`   📸 Screenshot: ${path.join(OUTPUT_DIR, 'screenshot.png')}`);
        console.log(`   ❌ Errores: ${errors.length}`);
        console.log(`   ⚠️ Advertencias: ${warnings.length}`);
        
        if (errors.length > 0) {
            console.log(`   🔍 Primeros errores:`);
            errors.slice(0, 3).forEach((error, i) => {
                console.log(`      ${i + 1}. ${error.text}`);
            });
        }
        
        if (warnings.length > 0) {
            console.log(`   🔍 Primeras advertencias:`);
            warnings.slice(0, 3).forEach((warning, i) => {
                console.log(`      ${i + 1}. ${warning.text}`);
            });
        }
        
    } catch (error) {
        console.error(`❌ Error tomando snapshot: ${error.message}`);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

takeSnapshot();

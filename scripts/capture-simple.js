const { chromium } = require('playwright');

async function captureSimple() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 800 });
    
    try {
        console.log('📸 Capturando pantallas básicas...');
        
        // 1. Página principal completa
        await page.goto('http://localhost:5001/web-publica.html');
        await page.waitForTimeout(5000);
        await page.screenshot({ 
            path: 'wwwroot/manual-alumnos/assets/web-publica-overview.png',
            fullPage: true 
        });
        console.log('✅ Página principal capturada');
        
        // 2. Sección de filtros
        const filtrosSection = page.locator('.filters-section');
        await page.screenshot({ 
            path: 'wwwroot/manual-alumnos/assets/seccion-filtros.png',
            clip: await filtrosSection.boundingBox()
        });
        console.log('✅ Sección de filtros capturada');
        
        // 3. Tarjeta de actividad
        const firstCard = page.locator('.activity-card').first();
        await page.screenshot({ 
            path: 'wwwroot/manual-alumnos/assets/tarjeta-actividad.png',
            clip: await firstCard.boundingBox()
        });
        console.log('✅ Tarjeta de actividad capturada');
        
        // 4. Página de detalle
        await page.goto('http://localhost:5001/detalle-publico.html?id=6');
        await page.waitForTimeout(5000);
        await page.screenshot({ 
            path: 'wwwroot/manual-alumnos/assets/detalle-publico-overview.png',
            fullPage: true 
        });
        console.log('✅ Página de detalle capturada');
        
        // 5. Cabecera de detalle
        const cabecera = page.locator('.card-section').first();
        await page.screenshot({ 
            path: 'wwwroot/manual-alumnos/assets/detalle-cabecera.png',
            clip: await cabecera.boundingBox()
        });
        console.log('✅ Cabecera de detalle capturada');
        
        // 6. Sección de precios
        const preciosSection = page.locator('#preciosSection');
        if (await preciosSection.isVisible()) {
            await page.screenshot({ 
                path: 'wwwroot/manual-alumnos/assets/detalle-precios.png',
                clip: await preciosSection.boundingBox()
            });
            console.log('✅ Sección de precios capturada');
        }
        
        console.log('🎉 Todas las capturas completadas exitosamente!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

captureSimple();




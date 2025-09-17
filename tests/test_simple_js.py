import asyncio
from playwright.async_api import async_playwright

async def test_simple_js():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST SIMPLE JS - VERIFICANDO CARGA DE JAVASCRIPT')
        print('=' * 60)
        
        # Capturar logs de consola
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))
        
        # Navegar a la página de test simple
        print('🌐 Navegando a test-simple.html...')
        await page.goto('http://localhost:8080/test-simple.html', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 5 segundos para carga completa...')
        await page.wait_for_timeout(5000)
        
        print('\n🔍 VERIFICANDO LOGS DE CONSOLA:')
        
        # Mostrar todos los logs
        for i, log in enumerate(console_logs, 1):
            print(f'  {i}. [{log["type"]}] {log["text"]}')
        
        print('\n🔍 VERIFICANDO FUNCIONES GLOBALES:')
        
        # Verificar si las funciones existen en el contexto de la página
        funciones_existentes = await page.evaluate('''
            () => {
                const funciones = [];
                if (typeof llenarParticipantes === 'function') funciones.push('llenarParticipantes');
                if (typeof llenarSubactividades === 'function') funciones.push('llenarSubactividades');
                if (typeof agregarParticipante === 'function') funciones.push('agregarParticipante');
                if (typeof agregarSubactividad === 'function') funciones.push('agregarSubactividad');
                if (typeof cargarActividadParaEdicionSinDominios === 'function') funciones.push('cargarActividadParaEdicionSinDominios');
                if (typeof cargarDatosAdicionalesSinDominios === 'function') funciones.push('cargarDatosAdicionalesSinDominios');
                return funciones;
            }
        ''')
        
        print(f'  📊 Funciones disponibles: {funciones_existentes}')
        
        # Verificar si el script se cargó correctamente
        script_loaded = await page.evaluate('''
            () => {
                const scripts = Array.from(document.querySelectorAll('script[src*="scripts.js"]'));
                return scripts.length > 0;
            }
        ''')
        
        print(f'  📊 Script scripts.js cargado: {script_loaded}')
        
        # Verificar el contenido del test
        test_content = await page.locator('#test-container').inner_text()
        print(f'\n🔍 CONTENIDO DEL TEST:')
        print(f'  {test_content}')
        
        await browser.close()
        
        return {
            'functions_available': len(funciones_existentes),
            'script_loaded': script_loaded,
            'console_logs': len(console_logs),
            'success': len(funciones_existentes) > 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_simple_js())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🔧 Funciones disponibles: {result["functions_available"]}')
    print(f'📜 Script cargado: {result["script_loaded"]}')
    print(f'📊 Logs de consola: {result["console_logs"]}')

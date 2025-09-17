import asyncio
from playwright.async_api import async_playwright

async def test_js_errors():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST JS ERRORS - VERIFICANDO ERRORES')
        print('=' * 50)
        
        # Capturar logs de consola
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))
        
        # Navegar a la página
        print('🌐 Navegando a editar-actividad.html?id=60...')
        await page.goto('http://localhost:8080/editar-actividad.html?id=60', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 10 segundos para carga completa...')
        await page.wait_for_timeout(10000)
        
        print('\n🔍 VERIFICANDO ERRORES DE JAVASCRIPT:')
        
        # Filtrar errores
        errors = [log for log in console_logs if log['type'] == 'error']
        warnings = [log for log in console_logs if log['type'] == 'warning']
        
        print(f'  📊 Errores encontrados: {len(errors)}')
        for i, error in enumerate(errors, 1):
            print(f'    {i}. {error["text"]}')
        
        print(f'  📊 Warnings encontrados: {len(warnings)}')
        for i, warning in enumerate(warnings, 1):
            print(f'    {i}. {warning["text"]}')
        
        print('\n🔍 VERIFICANDO LOGS DE CARGA:')
        
        # Filtrar logs de carga
        logs_carga = [log for log in console_logs if 'cargar' in log['text'].lower() or 'load' in log['text'].lower()]
        
        print(f'  📊 Logs de carga: {len(logs_carga)}')
        for i, log in enumerate(logs_carga[-10:], 1):  # Últimos 10
            print(f'    {i}. [{log["type"]}] {log["text"]}')
        
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
        
        await browser.close()
        
        return {
            'errors': len(errors),
            'warnings': len(warnings),
            'functions_available': len(funciones_existentes),
            'script_loaded': script_loaded,
            'success': len(errors) == 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_js_errors())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🚨 Errores: {result["errors"]}')
    print(f'⚠️ Warnings: {result["warnings"]}')
    print(f'🔧 Funciones disponibles: {result["functions_available"]}')
    print(f'📜 Script cargado: {result["script_loaded"]}')

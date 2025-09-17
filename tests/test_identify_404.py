import asyncio
from playwright.async_api import async_playwright

async def test_identify_404():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST IDENTIFY 404 - IDENTIFICANDO ARCHIVO PROBLEMÁTICO')
        print('=' * 60)
        
        # Capturar logs de consola y red
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))
        
        # Capturar errores de red
        network_errors = []
        page.on('requestfailed', lambda request: network_errors.append({
            'url': request.url,
            'failure': request.failure
        }))
        
        # Navegar a la página
        print('🌐 Navegando a editar-actividad.html?id=60...')
        await page.goto('http://localhost:8080/editar-actividad.html?id=60', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 10 segundos para carga completa...')
        await page.wait_for_timeout(10000)
        
        print('\n🔍 VERIFICANDO ERRORES DE RED:')
        
        if network_errors:
            print(f'  📊 Errores de red encontrados: {len(network_errors)}')
            for i, error in enumerate(network_errors, 1):
                print(f'    {i}. URL: {error["url"]}')
                print(f'       Error: {error["failure"]}')
        else:
            print('  ✅ No hay errores de red')
        
        print('\n🔍 VERIFICANDO LOGS DE CONSOLA:')
        
        # Filtrar errores 404 específicos
        errors_404 = [log for log in console_logs if '404' in log['text']]
        
        if errors_404:
            print(f'  📊 Errores 404 encontrados: {len(errors_404)}')
            for i, error in enumerate(errors_404, 1):
                print(f'    {i}. {error["text"]}')
        else:
            print('  ✅ No hay errores 404 en consola')
        
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
            'network_errors': len(network_errors),
            'console_errors_404': len(errors_404),
            'functions_available': len(funciones_existentes),
            'script_loaded': script_loaded,
            'success': len(network_errors) == 0 and len(errors_404) == 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_identify_404())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🌐 Errores de red: {result["network_errors"]}')
    print(f'🚨 Errores 404 en consola: {result["console_errors_404"]}')
    print(f'🔧 Funciones disponibles: {result["functions_available"]}')
    print(f'📜 Script cargado: {result["script_loaded"]}')

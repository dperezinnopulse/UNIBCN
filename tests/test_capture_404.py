import asyncio
from playwright.async_api import async_playwright

async def test_capture_404():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST CAPTURE 404 - CAPTURANDO ERROR 404 ESPECÍFICO')
        print('=' * 60)
        
        # Capturar logs de consola
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))
        
        # Capturar errores de red específicamente
        network_errors = []
        page.on('requestfailed', lambda request: network_errors.append({
            'url': request.url,
            'failure': request.failure,
            'method': request.method
        }))
        
        # Navegar a la página de test simple
        print('🌐 Navegando a test-simple.html...')
        await page.goto('http://localhost:8080/test-simple.html', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 5 segundos para carga completa...')
        await page.wait_for_timeout(5000)
        
        print('\n🔍 VERIFICANDO ERRORES DE RED:')
        
        if network_errors:
            print(f'  📊 Errores de red encontrados: {len(network_errors)}')
            for i, error in enumerate(network_errors, 1):
                print(f'    {i}. URL: {error["url"]}')
                print(f'       Método: {error["method"]}')
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
        
        print('\n🔍 VERIFICANDO TODOS LOS LOGS:')
        
        for i, log in enumerate(console_logs, 1):
            print(f'  {i}. [{log["type"]}] {log["text"]}')
        
        await browser.close()
        
        return {
            'network_errors': len(network_errors),
            'console_errors_404': len(errors_404),
            'total_logs': len(console_logs),
            'success': len(network_errors) == 0 and len(errors_404) == 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_capture_404())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🌐 Errores de red: {result["network_errors"]}')
    print(f'🚨 Errores 404 en consola: {result["console_errors_404"]}')
    print(f'📊 Total de logs: {result["total_logs"]}')

import asyncio
from playwright.async_api import async_playwright

async def test_debug_modal():
    print('🔍 TEST DEBUG MODAL - CAPTURANDO LOGS DE CONSOLA')
    print('=' * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(ignore_https_errors=True)
        
        # Capturar logs de consola
        console_logs = []
        page.on("console", lambda msg: console_logs.append(msg))
        
        try:
            # Navegar a la página
            print('🌐 Navegando a editar-actividad.html?id=60...')
            await page.goto('http://localhost:8080/editar-actividad.html?id=60')
            
            # Esperar a que cargue
            print('⏳ Esperando 10 segundos para carga completa...')
            await page.wait_for_timeout(10000)
            
            # Verificar que los datos se cargan
            print('\n🔍 VERIFICANDO CARGA DE DATOS:')
            
            # Verificar participantes
            participantes_count = await page.locator('#participantesContainer .card').count()
            print(f'  📊 Participantes cargados: {participantes_count}')
            
            # Verificar subactividades
            subactividades_count = await page.locator('#subactividadesContainer .card').count()
            print(f'  📊 Subactividades cargadas: {subactividades_count}')
            
            if participantes_count == 0 or subactividades_count == 0:
                print('❌ No hay datos para probar los modales')
                return
            
            print('\n🔍 TEST MODAL EDITAR PARTICIPANTE:')
            
            # Hacer clic en el primer botón "Editar" de participantes
            print('  🖱️ Haciendo clic en primer botón "Editar" de participantes...')
            await page.locator('#participantesContainer button:has-text("Editar")').first.click()
            
            # Esperar un poco y verificar logs
            await page.wait_for_timeout(2000)
            
            print('\n🔍 LOGS DE CONSOLA DESPUÉS DEL CLICK:')
            for log in console_logs[-10:]:  # Últimos 10 logs
                print(f'  📝 {log.type}: {log.text}')
            
            # Verificar si hay algún modal en el DOM
            modal_exists = await page.locator('#modalEditarParticipante').count()
            print(f'\n🔍 Modal en DOM: {modal_exists > 0}')
            
            if modal_exists > 0:
                print('  ✅ Modal existe en el DOM')
                # Verificar si está visible
                is_visible = await page.locator('#modalEditarParticipante').is_visible()
                print(f'  📊 Modal visible: {is_visible}')
                
                if is_visible:
                    print('  ✅ Modal está visible')
                else:
                    print('  ❌ Modal no está visible')
            else:
                print('  ❌ Modal no existe en el DOM')
            
            # Verificar si hay errores de JavaScript
            print('\n🔍 VERIFICANDO ERRORES DE JAVASCRIPT:')
            js_errors = [log for log in console_logs if log.type == 'error']
            if js_errors:
                for error in js_errors:
                    print(f'  ❌ Error: {error.text}')
            else:
                print('  ✅ No hay errores de JavaScript')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
            print('\n🎯 RESULTADO FINAL: ❌ FALLÓ')
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_debug_modal())

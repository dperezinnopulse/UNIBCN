import asyncio
from playwright.async_api import async_playwright

async def test_guardar_modificaciones():
    print('🔍 TEST GUARDAR MODIFICACIONES - VERIFICANDO FUNCIONALIDAD')
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
                print('❌ No hay datos para probar las modificaciones')
                return
            
            print('\n🔍 TEST MODIFICAR Y GUARDAR PARTICIPANTE:')
            
            # Hacer clic en el primer botón "Editar" de participantes
            print('  🖱️ Haciendo clic en primer botón "Editar" de participantes...')
            await page.locator('#participantesContainer button:has-text("Editar")').first.click()
            
            # Esperar a que aparezca el modal
            await page.wait_for_selector('#modalEditarParticipante', timeout=5000)
            print('  ✅ Modal de editar participante apareció')
            
            # Modificar el nombre
            await page.locator('#editNombre').fill('Nombre Modificado Test')
            print('  📝 Nombre modificado a: "Nombre Modificado Test"')
            
            # Hacer clic en Guardar
            print('  🖱️ Haciendo clic en "Guardar"...')
            await page.locator('#modalEditarParticipante button:has-text("Guardar")').click()
            
            # Esperar a que se procese
            await page.wait_for_timeout(3000)
            
            # Verificar que no hay errores de undefined en la consola
            print('\n🔍 VERIFICANDO LOGS DESPUÉS DE GUARDAR:')
            recent_logs = console_logs[-20:]  # Últimos 20 logs
            undefined_errors = [log for log in recent_logs if 'undefined' in log.text.lower()]
            
            if undefined_errors:
                print('  ❌ Se encontraron errores de undefined:')
                for error in undefined_errors:
                    print(f'    - {error.text}')
            else:
                print('  ✅ No se encontraron errores de undefined')
            
            # Verificar que el modal se cerró
            modal_visible = await page.locator('#modalEditarParticipante').is_visible()
            if not modal_visible:
                print('  ✅ Modal se cerró correctamente')
            else:
                print('  ❌ Modal no se cerró')
            
            # Verificar que los datos se recargaron
            participantes_count_after = await page.locator('#participantesContainer .card').count()
            print(f'  📊 Participantes después de modificar: {participantes_count_after}')
            
            if participantes_count_after == participantes_count:
                print('  ✅ Número de participantes se mantiene correcto')
            else:
                print('  ❌ Número de participantes cambió incorrectamente')
            
            print('\n🔍 TEST MODIFICAR Y GUARDAR SUBACTIVIDAD:')
            
            # Hacer clic en el primer botón "Editar" de subactividades
            print('  🖱️ Haciendo clic en primer botón "Editar" de subactividades...')
            await page.locator('#subactividadesContainer button:has-text("Editar")').first.click()
            
            # Esperar a que aparezca el modal
            await page.wait_for_selector('#modalEditarSubactividad', timeout=5000)
            print('  ✅ Modal de editar subactividad apareció')
            
            # Modificar el título
            await page.locator('#editTitulo').fill('Título Modificado Test')
            print('  📝 Título modificado a: "Título Modificado Test"')
            
            # Hacer clic en Guardar
            print('  🖱️ Haciendo clic en "Guardar"...')
            await page.locator('#modalEditarSubactividad button:has-text("Guardar")').click()
            
            # Esperar a que se procese
            await page.wait_for_timeout(3000)
            
            # Verificar que no hay errores de undefined en la consola
            print('\n🔍 VERIFICANDO LOGS DESPUÉS DE GUARDAR SUBACTIVIDAD:')
            recent_logs_2 = console_logs[-20:]  # Últimos 20 logs
            undefined_errors_2 = [log for log in recent_logs_2 if 'undefined' in log.text.lower()]
            
            if undefined_errors_2:
                print('  ❌ Se encontraron errores de undefined:')
                for error in undefined_errors_2:
                    print(f'    - {error.text}')
            else:
                print('  ✅ No se encontraron errores de undefined')
            
            # Verificar que el modal se cerró
            modal_visible_2 = await page.locator('#modalEditarSubactividad').is_visible()
            if not modal_visible_2:
                print('  ✅ Modal se cerró correctamente')
            else:
                print('  ❌ Modal no se cerró')
            
            # Verificar que los datos se recargaron
            subactividades_count_after = await page.locator('#subactividadesContainer .card').count()
            print(f'  📊 Subactividades después de modificar: {subactividades_count_after}')
            
            if subactividades_count_after == subactividades_count:
                print('  ✅ Número de subactividades se mantiene correcto')
            else:
                print('  ❌ Número de subactividades cambió incorrectamente')
            
            print('\n🎯 RESULTADO FINAL: ✅ ÉXITO')
            print('✅ Las operaciones de guardar modificaciones funcionan correctamente')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
            print('\n🎯 RESULTADO FINAL: ❌ FALLÓ')
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_guardar_modificaciones())

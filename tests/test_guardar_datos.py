import asyncio
from playwright.async_api import async_playwright

async def test_guardar_datos():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST GUARDAR DATOS - ACTIVIDAD 60')
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
        
        print('\n🔍 VERIFICANDO GUARDAR PARTICIPANTE:')
        
        try:
            # Buscar botones de editar específicamente en el contenedor de participantes
            participantes_container = page.locator('#participantesContainer')
            if await participantes_container.count() > 0:
                edit_buttons = participantes_container.locator('button:has-text("Editar")')
                count = await edit_buttons.count()
                print(f'  📊 Botones "Editar" en participantes encontrados: {count}')
                
                if count > 0:
                    # Hacer clic en el primer botón de editar
                    print('  🖱️ Haciendo clic en el primer botón "Editar" de participante...')
                    await edit_buttons.first.click()
                    
                    # Esperar a que aparezca el modal
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalEditarParticipante')
                    if await modal.count() > 0:
                        print('  ✅ Modal de editar participante apareció correctamente')
                        
                        # Modificar el nombre del participante
                        nombre_field = page.locator('#editNombre')
                        if await nombre_field.count() > 0:
                            # Obtener el valor actual
                            valor_actual = await nombre_field.input_value()
                            nuevo_valor = f"{valor_actual} (TEST)"
                            
                            # Limpiar y escribir nuevo valor
                            await nombre_field.clear()
                            await nombre_field.fill(nuevo_valor)
                            print(f'  📝 Modificando nombre de "{valor_actual}" a "{nuevo_valor}"')
                            
                            # Hacer clic en el botón Guardar
                            guardar_button = page.locator('#modalEditarParticipante button:has-text("Guardar")')
                            if await guardar_button.count() > 0:
                                print('  💾 Haciendo clic en "Guardar"...')
                                await guardar_button.click()
                                
                                # Esperar a que se procese la operación
                                await page.wait_for_timeout(3000)
                                
                                # Verificar si hay errores en la consola
                                errors = [log for log in console_logs if log['type'] == 'error' and '404' in log['text']]
                                if errors:
                                    print('  ❌ Error 404 encontrado en la consola')
                                    for error in errors:
                                        print(f'    - {error["text"]}')
                                else:
                                    print('  ✅ No se encontraron errores 404 en la consola')
                                    
                                # Verificar si el modal se cerró (indicando éxito)
                                modal_visible = await modal.is_visible()
                                if not modal_visible:
                                    print('  ✅ Modal se cerró correctamente (operación exitosa)')
                                else:
                                    print('  ⚠️ Modal sigue visible (posible error)')
                            else:
                                print('  ❌ Botón "Guardar" no encontrado')
                        else:
                            print('  ❌ Campo de nombre no encontrado')
                    else:
                        print('  ❌ Modal de editar participante no apareció')
                else:
                    print('  ❌ No se encontraron botones "Editar"')
            else:
                print('  ❌ Contenedor de participantes no encontrado')
                
        except Exception as e:
            print(f'  💥 Error verificando guardar participante: {e}')
        
        print('\n🔍 VERIFICANDO GUARDAR SUBACTIVIDAD:')
        
        try:
            # Buscar botones de editar en subactividades específicamente
            subactividades_container = page.locator('#subactividadesContainer')
            if await subactividades_container.count() > 0:
                edit_subactividad_buttons = subactividades_container.locator('button:has-text("Editar")')
                count = await edit_subactividad_buttons.count()
                print(f'  📊 Botones "Editar" en subactividades encontrados: {count}')
                
                if count > 0:
                    # Hacer clic en el primer botón de editar subactividad
                    print('  🖱️ Haciendo clic en el primer botón "Editar" de subactividad...')
                    await edit_subactividad_buttons.first.click()
                    
                    # Esperar a que aparezca el modal
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalEditarSubactividad')
                    if await modal.count() > 0:
                        print('  ✅ Modal de editar subactividad apareció correctamente')
                        
                        # Modificar el título de la subactividad
                        titulo_field = page.locator('#editTitulo')
                        if await titulo_field.count() > 0:
                            # Obtener el valor actual
                            valor_actual = await titulo_field.input_value()
                            nuevo_valor = f"{valor_actual} (TEST)"
                            
                            # Limpiar y escribir nuevo valor
                            await titulo_field.clear()
                            await titulo_field.fill(nuevo_valor)
                            print(f'  📝 Modificando título de "{valor_actual}" a "{nuevo_valor}"')
                            
                            # Hacer clic en el botón Guardar
                            guardar_button = page.locator('#modalEditarSubactividad button:has-text("Guardar")')
                            if await guardar_button.count() > 0:
                                print('  💾 Haciendo clic en "Guardar"...')
                                await guardar_button.click()
                                
                                # Esperar a que se procese la operación
                                await page.wait_for_timeout(3000)
                                
                                # Verificar si hay errores en la consola
                                errors = [log for log in console_logs if log['type'] == 'error' and '404' in log['text']]
                                if errors:
                                    print('  ❌ Error 404 encontrado en la consola')
                                    for error in errors:
                                        print(f'    - {error["text"]}')
                                else:
                                    print('  ✅ No se encontraron errores 404 en la consola')
                                    
                                # Verificar si el modal se cerró (indicando éxito)
                                modal_visible = await modal.is_visible()
                                if not modal_visible:
                                    print('  ✅ Modal se cerró correctamente (operación exitosa)')
                                else:
                                    print('  ⚠️ Modal sigue visible (posible error)')
                            else:
                                print('  ❌ Botón "Guardar" no encontrado')
                        else:
                            print('  ❌ Campo de título no encontrado')
                    else:
                        print('  ❌ Modal de editar subactividad no apareció')
                else:
                    print('  ❌ No se encontraron botones "Editar" en subactividades')
            else:
                print('  ⚠️ Contenedor de subactividades no encontrado')
                
        except Exception as e:
            print(f'  💥 Error verificando guardar subactividad: {e}')
        
        print('\n🚨 ERRORES DE CONSOLA:')
        errors = [log for log in console_logs if log['type'] in ['error', 'warning']]
        if errors:
            print(f'  📊 Total de errores encontrados: {len(errors)}')
            for i, error in enumerate(errors[-10:], 1):  # Últimos 10 errores
                print(f'  {i}. [{error["type"].upper()}] {error["text"]}')
        else:
            print('  ✅ No hay errores de consola')
        
        await browser.close()
        
        # Contar errores 404 específicos
        error_404_count = len([log for log in console_logs if log['type'] == 'error' and '404' in log['text']])
        
        return {
            'console_errors': len(errors),
            'error_404_count': error_404_count,
            'success': error_404_count == 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_guardar_datos())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🚨 Errores de consola: {result["console_errors"]}')
    print(f'🔴 Errores 404: {result["error_404_count"]}')

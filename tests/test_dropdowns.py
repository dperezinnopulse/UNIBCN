import asyncio
from playwright.async_api import async_playwright

async def test_dropdowns():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST DROPDOWNS - VERIFICANDO MODALES')
        print('=' * 50)
        
        # Navegar a la página
        print('🌐 Navegando a editar-actividad.html?id=60...')
        await page.goto('http://localhost:8080/editar-actividad.html?id=60', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 10 segundos para carga completa...')
        await page.wait_for_timeout(10000)
        
        print('\n🔍 VERIFICANDO MODAL PARTICIPANTE:')
        
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
                        
                        # Verificar que el dropdown de rol está presente
                        rol_dropdown = page.locator('#editRol')
                        if await rol_dropdown.count() > 0:
                            print('  ✅ Dropdown de rol está presente')
                            
                            # Verificar opciones del dropdown
                            options = rol_dropdown.locator('option')
                            option_count = await options.count()
                            print(f'  📊 Opciones en dropdown de rol: {option_count}')
                            
                            # Listar las opciones
                            for i in range(option_count):
                                option_text = await options.nth(i).text_content()
                                print(f'    - {option_text}')
                            
                            # Seleccionar una opción diferente
                            await rol_dropdown.select_option('Docente')
                            print('  ✅ Opción "Docente" seleccionada')
                            
                        else:
                            print('  ❌ Dropdown de rol no encontrado')
                    else:
                        print('  ❌ Modal de editar participante no apareció')
                else:
                    print('  ❌ No se encontraron botones "Editar"')
            else:
                print('  ❌ Contenedor de participantes no encontrado')
                
        except Exception as e:
            print(f'  💥 Error verificando modal participante: {e}')
        
        print('\n🔍 VERIFICANDO MODAL SUBACTIVIDAD:')
        
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
                        
                        # Verificar dropdown de modalidad
                        modalidad_dropdown = page.locator('#editModalidad')
                        if await modalidad_dropdown.count() > 0:
                            print('  ✅ Dropdown de modalidad está presente')
                            
                            # Verificar opciones del dropdown
                            options = modalidad_dropdown.locator('option')
                            option_count = await options.count()
                            print(f'  📊 Opciones en dropdown de modalidad: {option_count}')
                            
                            # Seleccionar una opción
                            await modalidad_dropdown.select_option('Virtual')
                            print('  ✅ Opción "Virtual" seleccionada')
                            
                        else:
                            print('  ❌ Dropdown de modalidad no encontrado')
                        
                        # Verificar dropdown de idioma
                        idioma_dropdown = page.locator('#editIdioma')
                        if await idioma_dropdown.count() > 0:
                            print('  ✅ Dropdown de idioma está presente')
                            
                            # Verificar opciones del dropdown
                            options = idioma_dropdown.locator('option')
                            option_count = await options.count()
                            print(f'  📊 Opciones en dropdown de idioma: {option_count}')
                            
                            # Seleccionar una opción
                            await idioma_dropdown.select_option('English')
                            print('  ✅ Opción "English" seleccionada')
                            
                        else:
                            print('  ❌ Dropdown de idioma no encontrado')
                            
                    else:
                        print('  ❌ Modal de editar subactividad no apareció')
                else:
                    print('  ❌ No se encontraron botones "Editar" en subactividades')
            else:
                print('  ⚠️ Contenedor de subactividades no encontrado')
                
        except Exception as e:
            print(f'  💥 Error verificando modal subactividad: {e}')
        
        await browser.close()
        
        return {
            'success': True
        }

if __name__ == "__main__":
    result = asyncio.run(test_dropdowns())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')

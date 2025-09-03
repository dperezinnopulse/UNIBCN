import asyncio
from playwright.async_api import async_playwright

async def test_botones_editar():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST BOTONES EDITAR - ACTIVIDAD 60')
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
        
        print('\n🔍 VERIFICANDO BOTONES DE PARTICIPANTES:')
        
        # Verificar que existen botones de editar participantes
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
                    
                    # Verificar campos del modal
                    nombre_field = page.locator('#editNombre')
                    email_field = page.locator('#editEmail')
                    rol_field = page.locator('#editRol')
                    
                    if await nombre_field.count() > 0 and await email_field.count() > 0 and await rol_field.count() > 0:
                        print('  ✅ Campos del modal están presentes')
                        
                        # Cerrar modal
                        close_button = page.locator('#modalEditarParticipante .btn-close')
                        if await close_button.count() > 0:
                            await close_button.click()
                            print('  ✅ Modal cerrado correctamente')
                        else:
                            print('  ⚠️ No se encontró botón de cerrar modal')
                    else:
                        print('  ❌ Campos del modal no están presentes')
                else:
                    print('  ❌ Modal de editar participante no apareció')
            else:
                print('  ❌ No se encontraron botones "Editar"')
                
        except Exception as e:
            print(f'  💥 Error verificando botones de participantes: {e}')
        
        print('\n🔍 VERIFICANDO BOTONES DE SUBACTIVIDADES:')
        
        # Verificar que existen botones de editar subactividades
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
                        
                        # Verificar algunos campos del modal
                        titulo_field = page.locator('#editTitulo')
                        descripcion_field = page.locator('#editDescripcion')
                        
                        if await titulo_field.count() > 0 and await descripcion_field.count() > 0:
                            print('  ✅ Campos del modal están presentes')
                            
                            # Cerrar modal
                            close_button = page.locator('#modalEditarSubactividad .btn-close')
                            if await close_button.count() > 0:
                                await close_button.click()
                                print('  ✅ Modal cerrado correctamente')
                            else:
                                print('  ⚠️ No se encontró botón de cerrar modal')
                        else:
                            print('  ❌ Campos del modal no están presentes')
                    else:
                        print('  ❌ Modal de editar subactividad no apareció')
                else:
                    print('  ❌ No se encontraron botones "Editar" en subactividades')
            else:
                print('  ⚠️ Contenedor de subactividades no encontrado')
                
        except Exception as e:
            print(f'  💥 Error verificando botones de subactividades: {e}')
        
        print('\n🔍 VERIFICANDO BOTONES DE AGREGAR:')
        
        # Verificar botón de agregar participante
        try:
            # Buscar el botón en la sección de participantes
            seccion_participantes = page.locator('#seccion-participantes')
            if await seccion_participantes.count() > 0:
                add_participante_button = seccion_participantes.locator('button:has-text("Agregar Participante")')
                if await add_participante_button.count() > 0:
                    print('  ✅ Botón "Agregar Participante" encontrado')
                    
                    # Hacer clic en el botón
                    print('  🖱️ Haciendo clic en "Agregar Participante"...')
                    await add_participante_button.click()
                    
                    # Esperar a que aparezca el modal
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalAgregarParticipante')
                    if await modal.count() > 0:
                        print('  ✅ Modal de agregar participante apareció correctamente')
                        
                        # Cerrar modal
                        close_button = page.locator('#modalAgregarParticipante .btn-close')
                        if await close_button.count() > 0:
                            await close_button.click()
                            print('  ✅ Modal cerrado correctamente')
                    else:
                        print('  ❌ Modal de agregar participante no apareció')
                else:
                    print('  ❌ Botón "Agregar Participante" no encontrado')
            else:
                print('  ❌ Sección de participantes no encontrada')
                
        except Exception as e:
            print(f'  💥 Error verificando botón agregar participante: {e}')
        
        # Verificar botón de agregar subactividad
        try:
            # Buscar el botón en la sección de subactividades
            seccion_subactividades = page.locator('#seccion-subactividades')
            if await seccion_subactividades.count() > 0:
                add_subactividad_button = seccion_subactividades.locator('button:has-text("Agregar Subactividad")')
                if await add_subactividad_button.count() > 0:
                    print('  ✅ Botón "Agregar Subactividad" encontrado')
                    
                    # Hacer clic en el botón
                    print('  🖱️ Haciendo clic en "Agregar Subactividad"...')
                    await add_subactividad_button.click()
                    
                    # Esperar a que aparezca el modal
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalAgregarSubactividad')
                    if await modal.count() > 0:
                        print('  ✅ Modal de agregar subactividad apareció correctamente')
                        
                        # Cerrar modal
                        close_button = page.locator('#modalAgregarSubactividad .btn-close')
                        if await close_button.count() > 0:
                            await close_button.click()
                            print('  ✅ Modal cerrado correctamente')
                    else:
                        print('  ❌ Modal de agregar subactividad no apareció')
                else:
                    print('  ❌ Botón "Agregar Subactividad" no encontrado')
            else:
                print('  ❌ Sección de subactividades no encontrada')
                
        except Exception as e:
            print(f'  💥 Error verificando botón agregar subactividad: {e}')
        
        print('\n🚨 ERRORES DE CONSOLA:')
        errors = [log for log in console_logs if log['type'] in ['error', 'warning']]
        if errors:
            print(f'  📊 Total de errores encontrados: {len(errors)}')
            for i, error in enumerate(errors[-10:], 1):  # Últimos 10 errores
                print(f'  {i}. [{error["type"].upper()}] {error["text"]}')
        else:
            print('  ✅ No hay errores de consola')
        
        await browser.close()
        
        return {
            'console_errors': len(errors),
            'success': len(errors) == 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_botones_editar())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🚨 Errores de consola: {result["console_errors"]}')

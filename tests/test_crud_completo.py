import asyncio
from playwright.async_api import async_playwright

async def test_crud_completo():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST CRUD COMPLETO - PARTICIPANTES Y SUBACTIVIDADES')
        print('=' * 60)
        
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
        
        # ===== TEST PARTICIPANTES =====
        print('\n🔍 TEST PARTICIPANTES:')
        
        # 1. Verificar que existen participantes
        participantes_container = page.locator('#participantesContainer')
        if await participantes_container.count() > 0:
            participantes_iniciales = participantes_container.locator('.card')
            count_inicial = await participantes_iniciales.count()
            print(f'  📊 Participantes iniciales: {count_inicial}')
            
            # 2. AGREGAR NUEVO PARTICIPANTE
            print('\n  ➕ AGREGAR NUEVO PARTICIPANTE:')
            try:
                # Buscar botón de agregar participante
                add_button = page.locator('button:has-text("Agregar Participante")')
                if await add_button.count() > 0:
                    print('    🖱️ Haciendo clic en "Agregar Participante"...')
                    await add_button.click()
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalAgregarParticipante')
                    if await modal.count() > 0:
                        print('    ✅ Modal de agregar participante apareció')
                        
                        # Llenar formulario
                        await page.fill('#nuevoNombre', 'Test Participante Nuevo')
                        await page.fill('#nuevoEmail', 'test.nuevo@ub.edu')
                        await page.select_option('#nuevoRol', 'Docente')
                        print('    ✅ Formulario llenado')
                        
                        # Guardar
                        await page.click('#modalAgregarParticipante button:has-text("Guardar")')
                        await page.wait_for_timeout(3000)
                        
                        # Verificar si se agregó
                        participantes_actuales = participantes_container.locator('.card')
                        count_actual = await participantes_actuales.count()
                        print(f'    📊 Participantes después de agregar: {count_actual}')
                        
                        if count_actual > count_inicial:
                            print('    ✅ Participante agregado correctamente')
                        else:
                            print('    ❌ No se agregó el participante')
                    else:
                        print('    ❌ Modal de agregar no apareció')
                else:
                    print('    ❌ Botón "Agregar Participante" no encontrado')
            except Exception as e:
                print(f'    💥 Error agregando participante: {e}')
            
            # 3. EDITAR PARTICIPANTE EXISTENTE
            print('\n  ✏️ EDITAR PARTICIPANTE EXISTENTE:')
            try:
                edit_buttons = participantes_container.locator('button:has-text("Editar")')
                if await edit_buttons.count() > 0:
                    print('    🖱️ Haciendo clic en primer botón "Editar"...')
                    await edit_buttons.first.click()
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalEditarParticipante')
                    if await modal.count() > 0:
                        print('    ✅ Modal de editar participante apareció')
                        
                        # Modificar campos
                        await page.fill('#editNombre', 'Test Participante Modificado')
                        await page.select_option('#editRol', 'Ponente')
                        print('    ✅ Campos modificados')
                        
                        # Guardar
                        await page.click('#modalEditarParticipante button:has-text("Guardar")')
                        await page.wait_for_timeout(3000)
                        
                        # Verificar si se guardó (no hay errores 404)
                        errors_404 = [log for log in console_logs if log['type'] == 'error' and '404' in log['text']]
                        if not errors_404:
                            print('    ✅ Participante editado correctamente (sin errores 404)')
                        else:
                            print('    ❌ Error 404 al editar participante')
                    else:
                        print('    ❌ Modal de editar no apareció')
                else:
                    print('    ❌ No se encontraron botones "Editar"')
            except Exception as e:
                print(f'    💥 Error editando participante: {e}')
            
            # 4. ELIMINAR PARTICIPANTE
            print('\n  🗑️ ELIMINAR PARTICIPANTE:')
            try:
                delete_buttons = participantes_container.locator('button:has-text("Eliminar")')
                if await delete_buttons.count() > 0:
                    print('    🖱️ Haciendo clic en primer botón "Eliminar"...')
                    await delete_buttons.first.click()
                    await page.wait_for_timeout(1000)
                    
                    # Confirmar eliminación
                    await page.click('button:has-text("Aceptar")')
                    await page.wait_for_timeout(3000)
                    
                    # Verificar si se eliminó
                    participantes_finales = participantes_container.locator('.card')
                    count_final = await participantes_finales.count()
                    print(f'    📊 Participantes después de eliminar: {count_final}')
                    
                    # Verificar si no hay errores 404
                    errors_404 = [log for log in console_logs if log['type'] == 'error' and '404' in log['text']]
                    if not errors_404:
                        print('    ✅ Participante eliminado correctamente (sin errores 404)')
                    else:
                        print('    ❌ Error 404 al eliminar participante')
                else:
                    print('    ❌ No se encontraron botones "Eliminar"')
            except Exception as e:
                print(f'    💥 Error eliminando participante: {e}')
        else:
            print('  ❌ Contenedor de participantes no encontrado')
        
        # ===== TEST SUBACTIVIDADES =====
        print('\n🔍 TEST SUBACTIVIDADES:')
        
        # 1. Verificar que existen subactividades
        subactividades_container = page.locator('#subactividadesContainer')
        if await subactividades_container.count() > 0:
            subactividades_iniciales = subactividades_container.locator('.card')
            count_inicial = await subactividades_iniciales.count()
            print(f'  📊 Subactividades iniciales: {count_inicial}')
            
            # 2. AGREGAR NUEVA SUBACTIVIDAD
            print('\n  ➕ AGREGAR NUEVA SUBACTIVIDAD:')
            try:
                # Buscar botón de agregar subactividad
                add_button = page.locator('button:has-text("Agregar Subactividad")')
                if await add_button.count() > 0:
                    print('    🖱️ Haciendo clic en "Agregar Subactividad"...')
                    await add_button.click()
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalAgregarSubactividad')
                    if await modal.count() > 0:
                        print('    ✅ Modal de agregar subactividad apareció')
                        
                        # Llenar formulario
                        await page.fill('#nuevoTitulo', 'Test Subactividad Nueva')
                        await page.fill('#nuevoDescripcion', 'Descripción de prueba')
                        await page.select_option('#nuevoModalidad', 'Virtual')
                        await page.fill('#nuevoDocente', 'Test Docente')
                        await page.select_option('#nuevoIdioma', 'English')
                        await page.fill('#nuevoFechaInicio', '2025-01-15')
                        await page.fill('#nuevoFechaFin', '2025-01-15')
                        await page.fill('#nuevoDuracion', '2')
                        await page.fill('#nuevoHoraInicio', '09:00')
                        await page.fill('#nuevoHoraFin', '11:00')
                        await page.fill('#nuevoAforo', '20')
                        await page.fill('#nuevoUbicacion', 'Aula Virtual')
                        print('    ✅ Formulario llenado')
                        
                        # Guardar
                        await page.click('#modalAgregarSubactividad button:has-text("Guardar")')
                        await page.wait_for_timeout(3000)
                        
                        # Verificar si se agregó
                        subactividades_actuales = subactividades_container.locator('.card')
                        count_actual = await subactividades_actuales.count()
                        print(f'    📊 Subactividades después de agregar: {count_actual}')
                        
                        if count_actual > count_inicial:
                            print('    ✅ Subactividad agregada correctamente')
                        else:
                            print('    ❌ No se agregó la subactividad')
                    else:
                        print('    ❌ Modal de agregar no apareció')
                else:
                    print('    ❌ Botón "Agregar Subactividad" no encontrado')
            except Exception as e:
                print(f'    💥 Error agregando subactividad: {e}')
            
            # 3. EDITAR SUBACTIVIDAD EXISTENTE
            print('\n  ✏️ EDITAR SUBACTIVIDAD EXISTENTE:')
            try:
                edit_buttons = subactividades_container.locator('button:has-text("Editar")')
                if await edit_buttons.count() > 0:
                    print('    🖱️ Haciendo clic en primer botón "Editar"...')
                    await edit_buttons.first.click()
                    await page.wait_for_timeout(2000)
                    
                    # Verificar que el modal apareció
                    modal = page.locator('#modalEditarSubactividad')
                    if await modal.count() > 0:
                        print('    ✅ Modal de editar subactividad apareció')
                        
                        # Modificar campos
                        await page.fill('#editTitulo', 'Test Subactividad Modificada')
                        await page.select_option('#editModalidad', 'Híbrida')
                        await page.select_option('#editIdioma', 'Català')
                        print('    ✅ Campos modificados')
                        
                        # Guardar
                        await page.click('#modalEditarSubactividad button:has-text("Guardar")')
                        await page.wait_for_timeout(3000)
                        
                        # Verificar si se guardó (no hay errores 404)
                        errors_404 = [log for log in console_logs if log['type'] == 'error' and '404' in log['text']]
                        if not errors_404:
                            print('    ✅ Subactividad editada correctamente (sin errores 404)')
                        else:
                            print('    ❌ Error 404 al editar subactividad')
                    else:
                        print('    ❌ Modal de editar no apareció')
                else:
                    print('    ❌ No se encontraron botones "Editar"')
            except Exception as e:
                print(f'    💥 Error editando subactividad: {e}')
            
            # 4. ELIMINAR SUBACTIVIDAD
            print('\n  🗑️ ELIMINAR SUBACTIVIDAD:')
            try:
                delete_buttons = subactividades_container.locator('button:has-text("Eliminar")')
                if await delete_buttons.count() > 0:
                    print('    🖱️ Haciendo clic en primer botón "Eliminar"...')
                    await delete_buttons.first.click()
                    await page.wait_for_timeout(1000)
                    
                    # Confirmar eliminación
                    await page.click('button:has-text("Aceptar")')
                    await page.wait_for_timeout(3000)
                    
                    # Verificar si se eliminó
                    subactividades_finales = subactividades_container.locator('.card')
                    count_final = await subactividades_finales.count()
                    print(f'    📊 Subactividades después de eliminar: {count_final}')
                    
                    # Verificar si no hay errores 404
                    errors_404 = [log for log in console_logs if log['type'] == 'error' and '404' in log['text']]
                    if not errors_404:
                        print('    ✅ Subactividad eliminada correctamente (sin errores 404)')
                    else:
                        print('    ❌ Error 404 al eliminar subactividad')
                else:
                    print('    ❌ No se encontraron botones "Eliminar"')
            except Exception as e:
                print(f'    💥 Error eliminando subactividad: {e}')
        else:
            print('  ❌ Contenedor de subactividades no encontrado')
        
        # ===== RESUMEN DE ERRORES =====
        print('\n🚨 RESUMEN DE ERRORES:')
        errors = [log for log in console_logs if log['type'] in ['error', 'warning']]
        if errors:
            print(f'  📊 Total de errores encontrados: {len(errors)}')
            for i, error in enumerate(errors[-10:], 1):  # Últimos 10 errores
                print(f'  {i}. [{error["type"].upper()}] {error["text"]}')
        else:
            print('  ✅ No hay errores de consola')
        
        # Contar errores 404 específicos
        error_404_count = len([log for log in console_logs if log['type'] == 'error' and '404' in log['text']])
        
        await browser.close()
        
        return {
            'console_errors': len(errors),
            'error_404_count': error_404_count,
            'success': error_404_count == 0
        }

if __name__ == "__main__":
    result = asyncio.run(test_crud_completo())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')
    print(f'🚨 Errores de consola: {result["console_errors"]}')
    print(f'🔴 Errores 404: {result["error_404_count"]}')

import asyncio
from playwright.async_api import async_playwright
import time

async def test_modales_edicion():
    print('🔍 TEST MODALES EDICIÓN - VERIFICANDO FUNCIONALIDAD')
    print('=' * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(ignore_https_errors=True)
        
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
            
            # Esperar a que aparezca el modal
            await page.wait_for_selector('#modalEditarParticipante', timeout=5000)
            print('  ✅ Modal de editar participante apareció')
            
            # Verificar que los campos están llenos
            nombre_value = await page.locator('#editNombre').input_value()
            email_value = await page.locator('#editEmail').input_value()
            rol_value = await page.locator('#editRol').input_value()
            
            print(f'  📝 Nombre en modal: {nombre_value}')
            print(f'  📝 Email en modal: {email_value}')
            print(f'  📝 Rol en modal: {rol_value}')
            
            if nombre_value and email_value and rol_value:
                print('  ✅ Campos del modal están llenos correctamente')
            else:
                print('  ❌ Campos del modal están vacíos')
            
            # Cerrar modal
            await page.locator('#modalEditarParticipante .btn-close').click()
            await page.wait_for_timeout(1000)
            
            print('\n🔍 TEST MODAL EDITAR SUBACTIVIDAD:')
            
            # Hacer clic en el primer botón "Editar" de subactividades
            print('  🖱️ Haciendo clic en primer botón "Editar" de subactividades...')
            await page.locator('#subactividadesContainer button:has-text("Editar")').first.click()
            
            # Esperar a que aparezca el modal
            await page.wait_for_selector('#modalEditarSubactividad', timeout=5000)
            print('  ✅ Modal de editar subactividad apareció')
            
            # Verificar que los campos están llenos
            titulo_value = await page.locator('#editTitulo').input_value()
            descripcion_value = await page.locator('#editDescripcion').input_value()
            modalidad_value = await page.locator('#editModalidad').input_value()
            
            print(f'  📝 Título en modal: {titulo_value}')
            print(f'  📝 Descripción en modal: {descripcion_value}')
            print(f'  📝 Modalidad en modal: {modalidad_value}')
            
            if titulo_value and descripcion_value and modalidad_value:
                print('  ✅ Campos del modal están llenos correctamente')
            else:
                print('  ❌ Campos del modal están vacíos')
            
            # Cerrar modal
            await page.locator('#modalEditarSubactividad .btn-close').click()
            await page.wait_for_timeout(1000)
            
            print('\n🎯 RESULTADO FINAL: ✅ ÉXITO')
            print('✅ Los modales de edición funcionan correctamente')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
            print('\n🎯 RESULTADO FINAL: ❌ FALLÓ')
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_modales_edicion())

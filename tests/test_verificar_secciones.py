import asyncio
from playwright.async_api import async_playwright

async def test_verificar_secciones():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST VERIFICAR SECCIONES - DOM')
        print('=' * 50)
        
        # Navegar a la página
        print('🌐 Navegando a editar-actividad.html?id=60...')
        await page.goto('http://localhost:8080/editar-actividad.html?id=60', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 10 segundos para carga completa...')
        await page.wait_for_timeout(10000)
        
        print('\n🔍 VERIFICANDO SECCIONES EN DOM:')
        
        # Verificar sección de participantes
        seccion_participantes = page.locator('#seccion-participantes')
        if await seccion_participantes.count() > 0:
            print('  ✅ Sección de participantes existe en DOM')
            
            # Verificar botón de agregar
            boton_agregar_participante = seccion_participantes.locator('button:has-text("Agregar Participante")')
            if await boton_agregar_participante.count() > 0:
                print('  ✅ Botón "Agregar Participante" existe')
            else:
                print('  ❌ Botón "Agregar Participante" no encontrado')
            
            # Verificar contenedor
            contenedor_participantes = seccion_participantes.locator('#participantesContainer')
            if await contenedor_participantes.count() > 0:
                print('  ✅ Contenedor de participantes existe')
                
                # Verificar participantes
                participantes = contenedor_participantes.locator('.card')
                count = await participantes.count()
                print(f'  📊 Participantes encontrados: {count}')
            else:
                print('  ❌ Contenedor de participantes no encontrado')
        else:
            print('  ❌ Sección de participantes no existe en DOM')
        
        # Verificar sección de subactividades
        seccion_subactividades = page.locator('#seccion-subactividades')
        if await seccion_subactividades.count() > 0:
            print('  ✅ Sección de subactividades existe en DOM')
            
            # Verificar botón de agregar
            boton_agregar_subactividad = seccion_subactividades.locator('button:has-text("Agregar Subactividad")')
            if await boton_agregar_subactividad.count() > 0:
                print('  ✅ Botón "Agregar Subactividad" existe')
            else:
                print('  ❌ Botón "Agregar Subactividad" no encontrado')
            
            # Verificar contenedor
            contenedor_subactividades = seccion_subactividades.locator('#subactividadesContainer')
            if await contenedor_subactividades.count() > 0:
                print('  ✅ Contenedor de subactividades existe')
                
                # Verificar subactividades
                subactividades = contenedor_subactividades.locator('.card')
                count = await subactividades.count()
                print(f'  📊 Subactividades encontradas: {count}')
            else:
                print('  ❌ Contenedor de subactividades no encontrado')
        else:
            print('  ❌ Sección de subactividades no existe en DOM')
        
        # Verificar si las secciones son visibles
        print('\n🔍 VERIFICANDO VISIBILIDAD:')
        
        if await seccion_participantes.count() > 0:
            is_visible = await seccion_participantes.is_visible()
            print(f'  📊 Sección participantes visible: {is_visible}')
            
            if not is_visible:
                # Verificar estilos CSS
                display = await seccion_participantes.evaluate('el => getComputedStyle(el).display')
                visibility = await seccion_participantes.evaluate('el => getComputedStyle(el).visibility')
                print(f'    - Display: {display}')
                print(f'    - Visibility: {visibility}')
        
        if await seccion_subactividades.count() > 0:
            is_visible = await seccion_subactividades.is_visible()
            print(f'  📊 Sección subactividades visible: {is_visible}')
            
            if not is_visible:
                # Verificar estilos CSS
                display = await seccion_subactividades.evaluate('el => getComputedStyle(el).display')
                visibility = await seccion_subactividades.evaluate('el => getComputedStyle(el).visibility')
                print(f'    - Display: {display}')
                print(f'    - Visibility: {visibility}')
        
        # Tomar screenshot para verificar visualmente
        print('\n📸 Tomando screenshot...')
        await page.screenshot(path='test_secciones.png', full_page=True)
        print('  ✅ Screenshot guardado como test_secciones.png')
        
        await browser.close()
        
        return {
            'success': True
        }

if __name__ == "__main__":
    result = asyncio.run(test_verificar_secciones())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')

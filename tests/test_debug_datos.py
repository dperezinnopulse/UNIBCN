import asyncio
from playwright.async_api import async_playwright

async def test_debug_datos():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 TEST DEBUG DATOS - VERIFICANDO CARGA')
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
        
        print('\n🔍 VERIFICANDO LOGS DE CONSOLA:')
        
        # Filtrar logs relacionados con participantes y subactividades
        logs_participantes = [log for log in console_logs if 'participante' in log['text'].lower()]
        logs_subactividades = [log for log in console_logs if 'subactividad' in log['text'].lower()]
        logs_cargar = [log for log in console_logs if 'cargar' in log['text'].lower()]
        
        print(f'  📊 Logs de participantes: {len(logs_participantes)}')
        for log in logs_participantes[-5:]:  # Últimos 5
            print(f'    - [{log["type"]}] {log["text"]}')
        
        print(f'  📊 Logs de subactividades: {len(logs_subactividades)}')
        for log in logs_subactividades[-5:]:  # Últimos 5
            print(f'    - [{log["type"]}] {log["text"]}')
        
        print(f'  📊 Logs de cargar: {len(logs_cargar)}')
        for log in logs_cargar[-5:]:  # Últimos 5
            print(f'    - [{log["type"]}] {log["text"]}')
        
        print('\n🔍 VERIFICANDO CONTENEDORES:')
        
        # Verificar contenedores directamente
        participantes_container = page.locator('#participantesContainer')
        subactividades_container = page.locator('#subactividadesContainer')
        
        if await participantes_container.count() > 0:
            print('  ✅ Contenedor de participantes existe')
            participantes = participantes_container.locator('.card')
            count = await participantes.count()
            print(f'    - Participantes encontrados: {count}')
        else:
            print('  ❌ Contenedor de participantes no existe')
        
        if await subactividades_container.count() > 0:
            print('  ✅ Contenedor de subactividades existe')
            subactividades = subactividades_container.locator('.card')
            count = await subactividades.count()
            print(f'    - Subactividades encontradas: {count}')
        else:
            print('  ❌ Contenedor de subactividades no existe')
        
        print('\n🔍 VERIFICANDO BOTONES:')
        
        # Verificar botones
        boton_agregar_participante = page.locator('button:has-text("Agregar Participante")')
        boton_agregar_subactividad = page.locator('button:has-text("Agregar Subactividad")')
        
        if await boton_agregar_participante.count() > 0:
            print('  ✅ Botón "Agregar Participante" existe')
        else:
            print('  ❌ Botón "Agregar Participante" no existe')
        
        if await boton_agregar_subactividad.count() > 0:
            print('  ✅ Botón "Agregar Subactividad" existe')
        else:
            print('  ❌ Botón "Agregar Subactividad" no existe')
        
        print('\n🔍 VERIFICANDO FUNCIONES GLOBALES:')
        
        # Verificar si las funciones existen en el contexto de la página
        funciones_existentes = await page.evaluate('''
            () => {
                const funciones = [];
                if (typeof llenarParticipantes === 'function') funciones.push('llenarParticipantes');
                if (typeof llenarSubactividades === 'function') funciones.push('llenarSubactividades');
                if (typeof agregarParticipante === 'function') funciones.push('agregarParticipante');
                if (typeof agregarSubactividad === 'function') funciones.push('agregarSubactividad');
                return funciones;
            }
        ''')
        
        print(f'  📊 Funciones disponibles: {funciones_existentes}')
        
        await browser.close()
        
        return {
            'success': True
        }

if __name__ == "__main__":
    result = asyncio.run(test_debug_datos())
    print(f'\n🎯 RESULTADO FINAL: {"✅ ÉXITO" if result["success"] else "❌ FALLÓ"}')

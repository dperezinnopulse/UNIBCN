import asyncio
from playwright.async_api import async_playwright

async def test_detallado_campos_60():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        print('🔍 TEST DETALLADO - CAMPOS ACTIVIDAD 60')
        print('=' * 50)
        
        # Navegar a la página
        print('🌐 Navegando a editar-actividad.html?id=60...')
        await page.goto('http://localhost:8080/editar-actividad.html?id=60', wait_until='domcontentloaded')
        
        # Esperar carga completa
        print('⏳ Esperando 15 segundos para carga completa...')
        await page.wait_for_timeout(15000)
        
        # Lista completa de campos a verificar
        campos_texto = [
            'actividadTitulo', 'actividadCodigo', 'actividadAnioAcademico', 'descripcion',
            'personaSolicitante', 'coordinador', 'jefeUnidadGestora', 'gestorActividad',
            'facultadDestinataria', 'departamentoDestinatario', 'otrosCentrosInstituciones',
            'plazasTotales', 'horasTotales', 'coordinadorCentreUnitat', 'centreTreballeAlumne',
            'creditosTotalesCRAI', 'creditosTotalesSAE', 'creditosMinimosSAE', 'creditosMaximosSAE',
            'insc_inicio', 'insc_fin', 'insc_plazas', 'insc_modalidad',
            'insc_requisitos_es', 'insc_requisitos_ca', 'insc_requisitos_en',
            'programa_descripcion_es', 'programa_descripcion_ca', 'programa_descripcion_en',
            'programa_contenidos_es', 'programa_contenidos_ca', 'programa_contenidos_en',
            'programa_objetivos_es', 'programa_objetivos_ca', 'programa_objetivos_en',
            'programa_duracion', 'programa_inicio', 'programa_fin', 'competenciesSAE'
        ]
        
        dropdowns = [
            'actividadUnidadGestion', 'tipoActividad', 'lineaEstrategica', 'objetivoEstrategico',
            'centroUnidadUBDestinataria', 'centroTrabajoRequerido', 'modalidadGestion',
            'tipusEstudiSAE', 'categoriaSAE'
        ]
        
        print('\n📝 VERIFICANDO CAMPOS DE TEXTO:')
        campos_vacios = []
        campos_llenos = []
        
        for campo in campos_texto:
            try:
                element = page.locator(f'#{campo}')
                if await element.count() > 0:
                    value = await element.input_value()
                    if value and value.strip():
                        campos_llenos.append(campo)
                        print(f'  ✅ {campo}: "{value}"')
                    else:
                        campos_vacios.append(campo)
                        print(f'  ❌ {campo}: VACÍO')
                else:
                    campos_vacios.append(campo)
                    print(f'  ⚠️ {campo}: ELEMENTO NO ENCONTRADO')
            except Exception as e:
                campos_vacios.append(campo)
                print(f'  💥 {campo}: ERROR - {e}')
        
        print('\n📋 VERIFICANDO DROPDOWNS:')
        dropdowns_vacios = []
        dropdowns_llenos = []
        
        for dropdown in dropdowns:
            try:
                element = page.locator(f'#{dropdown}')
                if await element.count() > 0:
                    selected_value = await element.input_value()
                    if selected_value and selected_value.strip():
                        dropdowns_llenos.append(dropdown)
                        print(f'  ✅ {dropdown}: "{selected_value}"')
                    else:
                        dropdowns_vacios.append(dropdown)
                        print(f'  ❌ {dropdown}: VACÍO')
                else:
                    dropdowns_vacios.append(dropdown)
                    print(f'  ⚠️ {dropdown}: ELEMENTO NO ENCONTRADO')
            except Exception as e:
                dropdowns_vacios.append(dropdown)
                print(f'  💥 {dropdown}: ERROR - {e}')
        
        print('\n📊 RESUMEN DETALLADO:')
        print(f'  📝 Campos de texto llenos: {len(campos_llenos)}/{len(campos_texto)}')
        print(f'  📝 Campos de texto vacíos: {len(campos_vacios)}/{len(campos_texto)}')
        print(f'  📋 Dropdowns llenos: {len(dropdowns_llenos)}/{len(dropdowns)}')
        print(f'  📋 Dropdowns vacíos: {len(dropdowns_vacios)}/{len(dropdowns)}')
        
        if campos_vacios:
            print(f'\n❌ CAMPOS VACÍOS ({len(campos_vacios)}):')
            for campo in campos_vacios:
                print(f'  - {campo}')
        
        if dropdowns_vacios:
            print(f'\n❌ DROPDOWNS VACÍOS ({len(dropdowns_vacios)}):')
            for dropdown in dropdowns_vacios:
                print(f'  - {dropdown}')
        
        # Capturar errores de consola
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text
        }))
        
        # Capturar errores de red
        network_errors = []
        page.on('response', lambda response: 
            network_errors.append({
                'url': response.url,
                'status': response.status
            }) if response.status >= 400 else None
        )
        
        await page.wait_for_timeout(5000)
        
        print('\n🚨 ERRORES DE CONSOLA:')
        errors = [log for log in console_logs if log['type'] in ['error', 'warning']]
        if errors:
            for i, error in enumerate(errors[-10:], 1):
                print(f'  {i}. [{error["type"].upper()}] {error["text"]}')
        else:
            print('  ✅ No hay errores de consola')
        
        print('\n🌐 ERRORES DE RED:')
        if network_errors:
            for i, error in enumerate(network_errors, 1):
                print(f'  {i}. {error["status"]} - {error["url"]}')
        else:
            print('  ✅ No hay errores de red')
        
        await browser.close()
        
        return {
            'campos_vacios': campos_vacios,
            'dropdowns_vacios': dropdowns_vacios,
            'total_campos': len(campos_texto) + len(dropdowns),
            'campos_llenos': len(campos_llenos) + len(dropdowns_llenos)
        }

if __name__ == "__main__":
    result = asyncio.run(test_detallado_campos_60())
    print(f'\n🎯 RESULTADO FINAL: {result["campos_llenos"]}/{result["total_campos"]} campos funcionando')

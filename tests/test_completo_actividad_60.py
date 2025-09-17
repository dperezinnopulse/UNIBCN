import asyncio
from playwright.async_api import async_playwright

async def test_completo_actividad_60():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        print('🔍 TEST COMPLETO - ACTIVIDAD 60')
        print('=' * 50)
        
        # Capturar TODOS los logs de consola desde el inicio
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text,
            'location': msg.location
        }))
        
        # Capturar errores de red desde el inicio
        network_errors = []
        page.on('response', lambda response: 
            network_errors.append({
                'url': response.url,
                'status': response.status,
                'statusText': response.status_text
            }) if response.status >= 400 else None
        )
        
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
        
        # Campos de importes y descuentos
        campos_importes = [
            'imp_base', 'imp_tipo', 'imp_descuento_pct', 'imp_codigo',
            'imp_condiciones_es', 'imp_condiciones_ca', 'imp_condiciones_en'
        ]
        
        # Campos de entidades organizadoras
        campos_entidades = [
            'org_principal', 'org_nif', 'org_web', 'org_contacto', 'org_email', 'org_tel'
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
        
        print('\n💰 VERIFICANDO CAMPOS DE IMPORTES:')
        importes_vacios = []
        importes_llenos = []
        
        for campo in campos_importes:
            try:
                element = page.locator(f'#{campo}')
                if await element.count() > 0:
                    value = await element.input_value()
                    if value and value.strip():
                        importes_llenos.append(campo)
                        print(f'  ✅ {campo}: "{value}"')
                    else:
                        importes_vacios.append(campo)
                        print(f'  ❌ {campo}: VACÍO')
                else:
                    importes_vacios.append(campo)
                    print(f'  ⚠️ {campo}: ELEMENTO NO ENCONTRADO')
            except Exception as e:
                importes_vacios.append(campo)
                print(f'  💥 {campo}: ERROR - {e}')
        
        print('\n🏢 VERIFICANDO CAMPOS DE ENTIDADES:')
        entidades_vacios = []
        entidades_llenos = []
        
        for campo in campos_entidades:
            try:
                element = page.locator(f'#{campo}')
                if await element.count() > 0:
                    value = await element.input_value()
                    if value and value.strip():
                        entidades_llenos.append(campo)
                        print(f'  ✅ {campo}: "{value}"')
                    else:
                        entidades_vacios.append(campo)
                        print(f'  ❌ {campo}: VACÍO')
                else:
                    entidades_vacios.append(campo)
                    print(f'  ⚠️ {campo}: ELEMENTO NO ENCONTRADO')
            except Exception as e:
                entidades_vacios.append(campo)
                print(f'  💥 {campo}: ERROR - {e}')
        
        print('\n👥 VERIFICANDO SECCIÓN DE PARTICIPANTES:')
        try:
            participantes_container = page.locator('#participantesContainer')
            if await participantes_container.count() > 0:
                participantes_count = await participantes_container.locator('.card').count()
                print(f'  📊 Participantes encontrados: {participantes_count}')
                if participantes_count > 0:
                    print('  ✅ Sección de participantes tiene datos')
                else:
                    print('  ❌ Sección de participantes vacía')
            else:
                print('  ⚠️ Contenedor de participantes no encontrado')
        except Exception as e:
            print(f'  💥 Error verificando participantes: {e}')
        
        print('\n📋 VERIFICANDO SECCIÓN DE SUBACTIVIDADES:')
        try:
            subactividades_container = page.locator('#subactividadesContainer')
            if await subactividades_container.count() > 0:
                subactividades_count = await subactividades_container.locator('.card').count()
                print(f'  📊 Subactividades encontradas: {subactividades_count}')
                if subactividades_count > 0:
                    print('  ✅ Sección de subactividades tiene datos')
                else:
                    print('  ❌ Sección de subactividades vacía')
            else:
                print('  ⚠️ Contenedor de subactividades no encontrado')
        except Exception as e:
            print(f'  💥 Error verificando subactividades: {e}')
        
        print('\n📊 RESUMEN DETALLADO:')
        print(f'  📝 Campos de texto llenos: {len(campos_llenos)}/{len(campos_texto)}')
        print(f'  📝 Campos de texto vacíos: {len(campos_vacios)}/{len(campos_texto)}')
        print(f'  📋 Dropdowns llenos: {len(dropdowns_llenos)}/{len(dropdowns)}')
        print(f'  📋 Dropdowns vacíos: {len(dropdowns_vacios)}/{len(dropdowns)}')
        print(f'  💰 Campos de importes llenos: {len(importes_llenos)}/{len(campos_importes)}')
        print(f'  💰 Campos de importes vacíos: {len(importes_vacios)}/{len(campos_importes)}')
        print(f'  🏢 Campos de entidades llenos: {len(entidades_llenos)}/{len(campos_entidades)}')
        print(f'  🏢 Campos de entidades vacíos: {len(entidades_vacios)}/{len(campos_entidades)}')
        
        if campos_vacios:
            print(f'\n❌ CAMPOS DE TEXTO VACÍOS ({len(campos_vacios)}):')
            for campo in campos_vacios:
                print(f'  - {campo}')
        
        if dropdowns_vacios:
            print(f'\n❌ DROPDOWNS VACÍOS ({len(dropdowns_vacios)}):')
            for dropdown in dropdowns_vacios:
                print(f'  - {dropdown}')
        
        if importes_vacios:
            print(f'\n❌ CAMPOS DE IMPORTES VACÍOS ({len(importes_vacios)}):')
            for campo in importes_vacios:
                print(f'  - {campo}')
        
        if entidades_vacios:
            print(f'\n❌ CAMPOS DE ENTIDADES VACÍOS ({len(entidades_vacios)}):')
            for campo in entidades_vacios:
                print(f'  - {campo}')
        
        print('\n🚨 ERRORES DE CONSOLA:')
        errors = [log for log in console_logs if log['type'] in ['error', 'warning']]
        if errors:
            print(f'  📊 Total de errores encontrados: {len(errors)}')
            for i, error in enumerate(errors[-20:], 1):  # Últimos 20 errores
                print(f'  {i}. [{error["type"].upper()}] {error["text"]}')
        else:
            print('  ✅ No hay errores de consola')
        
        print('\n🌐 ERRORES DE RED:')
        if network_errors:
            print(f'  📊 Total de errores de red encontrados: {len(network_errors)}')
            for i, error in enumerate(network_errors, 1):
                print(f'  {i}. {error["status"]} - {error["url"]}')
        else:
            print('  ✅ No hay errores de red')
        
        await browser.close()
        
        return {
            'campos_vacios': campos_vacios,
            'dropdowns_vacios': dropdowns_vacios,
            'importes_vacios': importes_vacios,
            'entidades_vacios': entidades_vacios,
            'total_campos': len(campos_texto) + len(dropdowns) + len(campos_importes) + len(campos_entidades),
            'campos_llenos': len(campos_llenos) + len(dropdowns_llenos) + len(importes_llenos) + len(entidades_llenos),
            'console_errors': len(errors),
            'network_errors': len(network_errors)
        }

if __name__ == "__main__":
    result = asyncio.run(test_completo_actividad_60())
    print(f'\n🎯 RESULTADO FINAL: {result["campos_llenos"]}/{result["total_campos"]} campos funcionando')
    print(f'🚨 Errores de consola: {result["console_errors"]}')
    print(f'🌐 Errores de red: {result["network_errors"]}')

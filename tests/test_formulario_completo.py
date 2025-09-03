import asyncio
from playwright.async_api import async_playwright
import time

async def test_formulario_completo():
    print('🔍 TEST FORMULARIO COMPLETO - VERIFICANDO TODOS LOS CAMPOS')
    print('=' * 70)
    
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
            
            print('\n🔍 VERIFICANDO CAMPOS DEL FORMULARIO PRINCIPAL:')
            
            # Lista de campos a probar con sus valores de prueba
            campos_prueba = {
                # Campos básicos
                'actividadTitulo': 'TÍTULO DE PRUEBA MODIFICADO',
                'actividadCodigo': 'CODIGO-PRUEBA-001',
                'actividadAnioAcademico': '2025-26',
                'actividadDescripcion': 'DESCRIPCIÓN DE PRUEBA MODIFICADA',
                'actividadLugar': 'LUGAR DE PRUEBA MODIFICADO',
                'condicionesEconomicas': 'CONDICIONES ECONÓMICAS DE PRUEBA',
                'codigoRelacionado': 'REL-PRUEBA-2025-001',
                'fechaActividad': '2025-06-15',
                'personaSolicitante': 'PERSONA SOLICITANTE DE PRUEBA',
                'coordinador': 'COORDINADOR DE PRUEBA',
                'jefeUnidadGestora': 'JEFE UNIDAD GESTORA DE PRUEBA',
                'gestorActividad': 'GESTOR ACTIVIDAD DE PRUEBA',
                'facultadDestinataria': 'FACULTAD DESTINATARIA DE PRUEBA',
                'departamentoDestinatario': 'DEPARTAMENTO DESTINATARIO DE PRUEBA',
                'otrosCentrosInstituciones': 'OTROS CENTROS DE PRUEBA',
                'plazasTotales': '100',
                'horasTotales': '16',
                'creditosTotalesCRAI': '4.5',
                'creditosTotalesSAE': '6.0',
                'creditosMinimosSAE': '2.0',
                'creditosMaximosSAE': '8.0',
                'coordinadorCentreUnitat': 'COORDINADOR CENTRE UNITAT DE PRUEBA',
                'centreTreballeAlumne': 'CENTRE TREBALLE ALUMNE DE PRUEBA',
                
                # Campos de inscripción
                'insc_inicio': '2025-05-01',
                'insc_fin': '2025-06-10',
                'insc_plazas': '100',
                'insc_requisitos_es': 'REQUISITOS EN ESPAÑOL DE PRUEBA',
                'insc_requisitos_ca': 'REQUISITS EN CATALÀ DE PROVA',
                'insc_requisitos_en': 'REQUIREMENTS IN ENGLISH FOR TESTING',
                
                # Campos de programa
                'programa_descripcion_es': 'DESCRIPCIÓN DEL PROGRAMA EN ESPAÑOL DE PRUEBA',
                'programa_descripcion_ca': 'DESCRIPCIÓ DEL PROGRAMA EN CATALÀ DE PROVA',
                'programa_descripcion_en': 'PROGRAM DESCRIPTION IN ENGLISH FOR TESTING',
                'programa_contenidos_es': 'CONTENIDOS DEL PROGRAMA EN ESPAÑOL DE PRUEBA',
                'programa_contenidos_ca': 'CONTINGUTS DEL PROGRAMA EN CATALÀ DE PROVA',
                'programa_contenidos_en': 'PROGRAM CONTENTS IN ENGLISH FOR TESTING',
                'programa_objetivos_es': 'OBJETIVOS DEL PROGRAMA EN ESPAÑOL DE PRUEBA',
                'programa_objetivos_ca': 'OBJECTIUS DEL PROGRAMA EN CATALÀ DE PROVA',
                'programa_objetivos_en': 'PROGRAM OBJECTIVES IN ENGLISH FOR TESTING',
                'programa_duracion': '16',
                'programa_inicio': '2025-06-15',
                'programa_fin': '2025-06-16',
                'competenciesSAE': 'COMPETENCIAS SAE DE PRUEBA',
                
                # Campos de entidades organizadoras
                'org_principal': 'ENTIDAD ORGANIZADORA PRINCIPAL DE PRUEBA',
                'org_nif': 'B12345678',
                'org_web': 'https://www.entidad-prueba.com',
                'org_contacto': 'PERSONA CONTACTO DE PRUEBA',
                'org_email': 'contacto@entidad-prueba.com',
                'org_tel': '934123456',
                
                # Campos de importes
                'imp_base': '150.50',
                'imp_descuento_pct': '15',
                'imp_codigo': 'DESCUENTO-PRUEBA-2025',
                'imp_condiciones_es': 'CONDICIONES DE IMPORTE EN ESPAÑOL DE PRUEBA',
                'imp_condiciones_ca': 'CONDICIONS D\'IMPORT EN CATALÀ DE PROVA',
                'imp_condiciones_en': 'IMPORT CONDITIONS IN ENGLISH FOR TESTING'
            }
            
            print('  📝 Llenando campos con valores de prueba...')
            
            # Llenar todos los campos
            for campo_id, valor in campos_prueba.items():
                try:
                    # Buscar el campo
                    campo = page.locator(f'#{campo_id}')
                    if await campo.count() > 0:
                        # Limpiar y llenar el campo
                        await campo.clear()
                        await campo.fill(valor)
                        print(f'    ✅ {campo_id}: "{valor}"')
                    else:
                        print(f'    ❌ {campo_id}: Campo no encontrado')
                except Exception as e:
                    print(f'    ❌ {campo_id}: Error - {e}')
            
            # Esperar a que se carguen todos los datos de entidades relacionadas
            print('⏳ Esperando a que se carguen los datos de entidades relacionadas...')
            await page.wait_for_function('''
                () => {
                    const orgPrincipal = document.getElementById('org_principal')?.value;
                    const impBase = document.getElementById('imp_base')?.value;
                    return orgPrincipal && impBase;
                }
            ''', timeout=30000);
            
            print('✅ Datos de entidades relacionadas cargados correctamente')
            
            # Verificar que los campos de entidades relacionadas tengan valores
            org_principal_value = await page.locator('#org_principal').input_value();
            imp_base_value = await page.locator('#imp_base').input_value();
            
            print(f'🔍 Campo org_principal tiene valor: "{org_principal_value}"')
            print(f'🔍 Campo imp_base tiene valor: "{imp_base_value}"')
            
            if not org_principal_value or not imp_base_value:
                print('⚠️ ADVERTENCIA: Los campos de entidades relacionadas no tienen valores')
                print('⏳ Esperando 5 segundos adicionales...')
                await page.wait_for_timeout(5000)
            
            # Esperar a que TODOS los campos se llenen completamente
            print('⏳ Esperando a que TODOS los campos se llenen completamente...')
            await page.wait_for_function('''
                () => {
                    // Verificar campos básicos
                    const titulo = document.getElementById('actividadTitulo')?.value;
                    const codigo = document.getElementById('actividadCodigo')?.value;
                    const descripcion = document.getElementById('actividadDescripcion')?.value;
                    const lugar = document.getElementById('actividadLugar')?.value;
                    
                    // Verificar campos de entidades relacionadas
                    const orgPrincipal = document.getElementById('org_principal')?.value;
                    const impBase = document.getElementById('imp_base')?.value;
                    
                    // Verificar campos de programa
                    const programaDescES = document.getElementById('programa_descripcion_es')?.value;
                    const programaDescCA = document.getElementById('programa_descripcion_ca')?.value;
                    
                    return titulo && codigo && descripcion && lugar && 
                           orgPrincipal && impBase && 
                           programaDescES && programaDescCA;
                }
            ''', timeout=60000);
            
            print('✅ TODOS los campos se han llenado completamente')
            
            # Verificar una vez más que los campos tengan valores
            print('🔍 Verificación final de campos críticos...')
            org_principal_final = await page.locator('#org_principal').input_value();
            imp_base_final = await page.locator('#imp_base').input_value();
            actividad_descripcion_final = await page.locator('#actividadDescripcion').input_value();
            actividad_lugar_final = await page.locator('#actividadLugar').input_value();
            
            print(f'🔍 Campo org_principal (final): "{org_principal_final}"')
            print(f'🔍 Campo imp_base (final): "{imp_base_final}"')
            print(f'🔍 Campo actividadDescripcion (final): "{actividad_descripcion_final}"')
            print(f'🔍 Campo actividadLugar (final): "{actividad_lugar_final}"')
            
            if not org_principal_final or not imp_base_final:
                print('🚨 ERROR CRÍTICO: Los campos de entidades relacionadas siguen vacíos')
                print('⏳ Esperando 10 segundos adicionales...')
                await page.wait_for_timeout(10000)
            
            # Configurar dropdowns específicos
            print('\n  📝 Configurando dropdowns...')
            
            # Modalidad de inscripción
            try:
                await page.locator('#insc_modalidad').select_option('Online')
                print('    ✅ insc_modalidad: "Online"')
            except:
                print('    ❌ insc_modalidad: Error al configurar')
            
            # Impuesto
            try:
                await page.locator('#imp_tipo').select_option('IVA 21%')
                print('    ✅ imp_tipo: "IVA 21%"')
            except:
                print('    ❌ imp_tipo: Error al configurar')
            
            # Configurar checkboxes
            print('\n  📝 Configurando checkboxes...')
            
            # Lista de espera
            try:
                await page.locator('#insc_lista_espera').check()
                print('    ✅ insc_lista_espera: Activado')
            except:
                print('    ❌ insc_lista_espera: Error al activar')
            
            # Actividad de pago
            try:
                await page.locator('#actividadPago').check()
                print('    ✅ actividadPago: Activado')
            except:
                print('    ❌ actividadPago: Error al activar')
            
            print('\n🔍 GUARDANDO FORMULARIO...')
            
            # Hacer clic en el botón de guardar
            try:
                # Hacer clic en el botón correcto con ID específico
                await page.locator('#btnGuardarActividad').click()
                print('  ✅ Botón Guardar clickeado (btnGuardarActividad)')
                
                # Esperar a que se procese
                await page.wait_for_timeout(3000)
                
                # Verificar si hay mensaje de éxito
                success_messages = await page.locator('text=correctamente').count()
                if success_messages > 0:
                    print('  ✅ Mensaje de éxito mostrado')
                else:
                    print('  ⚠️ No se mostró mensaje de éxito')
                
            except Exception as e:
                print(f'  ❌ Error al guardar: {e}')
            
            print('\n🔍 RECARGANDO PÁGINA PARA VERIFICAR...')
            
            # Recargar la página para verificar que los datos se guardaron
            await page.reload()
            await page.wait_for_timeout(5000)
            
            print('\n🔍 VERIFICANDO VALORES GUARDADOS:')
            
            # Verificar que los valores se mantuvieron
            campos_verificados = 0
            campos_correctos = 0
            
            for campo_id, valor_esperado in campos_prueba.items():
                try:
                    campo = page.locator(f'#{campo_id}')
                    if await campo.count() > 0:
                        valor_actual = await campo.input_value()
                        if valor_actual == valor_esperado:
                            print(f'    ✅ {campo_id}: "{valor_actual}" (CORRECTO)')
                            campos_correctos += 1
                        else:
                            print(f'    ❌ {campo_id}: Esperado "{valor_esperado}", Actual "{valor_actual}"')
                        campos_verificados += 1
                    else:
                        print(f'    ❌ {campo_id}: Campo no encontrado')
                except Exception as e:
                    print(f'    ❌ {campo_id}: Error al verificar - {e}')
            
            # Verificar checkboxes
            print('\n  📝 Verificando checkboxes...')
            
            try:
                insc_lista_espera_checked = await page.locator('#insc_lista_espera').is_checked()
                print(f'    ✅ insc_lista_espera: {"Activado" if insc_lista_espera_checked else "Desactivado"}')
                if insc_lista_espera_checked:
                    campos_correctos += 1
                campos_verificados += 1
            except:
                print('    ❌ insc_lista_espera: Error al verificar')
            
            try:
                actividad_pago_checked = await page.locator('#actividadPago').is_checked()
                print(f'    ✅ actividadPago: {"Activado" if actividad_pago_checked else "Desactivado"}')
                if actividad_pago_checked:
                    campos_correctos += 1
                campos_verificados += 1
            except:
                print('    ❌ actividadPago: Error al verificar')
            
            # Verificar dropdowns
            print('\n  📝 Verificando dropdowns...')
            
            try:
                insc_modalidad_value = await page.locator('#insc_modalidad').input_value()
                print(f'    ✅ insc_modalidad: "{insc_modalidad_value}"')
                if insc_modalidad_value == 'Online':
                    campos_correctos += 1
                campos_verificados += 1
            except:
                print('    ❌ insc_modalidad: Error al verificar')
            
            try:
                imp_tipo_value = await page.locator('#imp_tipo').input_value()
                print(f'    ✅ imp_tipo: "{imp_tipo_value}"')
                if imp_tipo_value == 'IVA 21%':
                    campos_correctos += 1
                campos_verificados += 1
            except:
                print('    ❌ imp_tipo: Error al verificar')
            
            # Resumen final
            print(f'\n📊 RESUMEN DE VERIFICACIÓN:')
            print(f'  📝 Campos verificados: {campos_verificados}')
            print(f'  ✅ Campos correctos: {campos_correctos}')
            print(f'  ❌ Campos incorrectos: {campos_verificados - campos_correctos}')
            print(f'  📊 Porcentaje de éxito: {(campos_correctos / campos_verificados * 100):.1f}%')
            
            if campos_correctos == campos_verificados:
                print('\n🎯 RESULTADO FINAL: ✅ ÉXITO COMPLETO')
                print('✅ Todos los campos del formulario se guardan y muestran correctamente')
            else:
                print('\n🎯 RESULTADO FINAL: ⚠️ ÉXITO PARCIAL')
                print(f'⚠️ {campos_verificados - campos_correctos} campos no se guardan correctamente')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
            print('\n🎯 RESULTADO FINAL: ❌ FALLÓ')
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_formulario_completo())

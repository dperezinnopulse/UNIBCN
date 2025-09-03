import asyncio
from playwright.async_api import async_playwright

async def test_guardado_completo():
    print('🧪 TEST COMPLETO DE GUARDADO - TODOS LOS CAMPOS')
    print('=' * 70)
    
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
            
            print('\n📝 LLENANDO TODOS LOS CAMPOS CON VALORES DE PRUEBA...')
            
            # Valores de prueba para todos los campos
            valores_prueba = {
                # === CAMPOS BÁSICOS ===
                'actividadCodigo': 'CODIGO-PRUEBA-001',
                'actividadTitulo': 'TÍTULO DE PRUEBA COMPLETO',
                'descripcion': 'Descripción completa de prueba para verificar guardado',
                'actividadAnioAcademico': '2024-2025',
                'actividadUnidadGestion': 'IDP',
                
                # === CAMPOS ADICIONALES ===
                'tipoActividad': 'Formación',
                'condicionesEconomicas': 'Condiciones económicas de prueba',
                'lineaEstrategica': 'Línea 1',
                'objetivoEstrategico': 'Objetivo 1',
                'codigoRelacionado': 'REL-001',
                'actividadReservada': 'PDI',
                'fechaActividad': '2024-12-15',
                'motivoCierre': 'Motivo de cierre de prueba',
                
                # === CAMPOS DE PERSONAS ===
                'personaSolicitante': 'Persona Solicitante de Prueba',
                'coordinador': 'Coordinador de Prueba',
                'jefeUnidadGestora': 'Jefe Unidad Gestora de Prueba',
                'gestorActividad': 'Gestor Actividad de Prueba',
                
                # === CAMPOS DE DESTINATARIOS ===
                'facultadDestinataria': 'Facultad de Prueba',
                'departamentoDestinatario': 'Departamento de Prueba',
                'centroUnidadUBDestinataria': 'Centro UB de Prueba',
                'otrosCentrosInstituciones': 'Otros centros de prueba',
                
                # === CAMPOS NUMÉRICOS ===
                'plazasTotales': '50',
                'horasTotales': '100',
                
                # === CAMPOS DE GESTIÓN ===
                'centroTrabajoRequerido': 'Centro de trabajo de prueba',
                'modalidadGestion': 'Modalidad de gestión de prueba',
                'fechaInicioImparticion': '2024-12-20',
                'fechaFinImparticion': '2024-12-25',
                'actividadPago': True,  # Checkbox
                
                # === CAMPOS ESPECÍFICOS POR UG ===
                'coordinadorCentreUnitat': 'Coordinador Centre Unitat de Prueba',
                'centreTreballeAlumne': 'Centre de treball de prueba',
                'creditosTotalesCRAI': '5.0',
                'creditosTotalesSAE': '10.0',
                'creditosMinimosSAE': '5.0',
                'creditosMaximosSAE': '15.0',
                'tipusEstudiSAE': 'Grau',
                'categoriaSAE': 'Bàsic',
                'competenciesSAE': 'Competències de prova',
                
                # === CAMPOS DE INSCRIPCIÓN ===
                'insc_inicio': '2024-11-01',
                'insc_fin': '2024-11-30',
                'insc_plazas': '45',
                'insc_lista_espera': True,  # Checkbox
                'insc_modalidad': 'Online',
                'insc_requisitos_es': 'Requisitos en español de prueba',
                'insc_requisitos_ca': 'Requisits en català de prova',
                'insc_requisitos_en': 'Requirements in English for testing',
                
                # === CAMPOS DE PROGRAMA ===
                'programa_descripcion_es': 'Descripción del programa en español de prueba',
                'programa_descripcion_ca': 'Descripció del programa en català de prova',
                'programa_descripcion_en': 'Program description in English for testing',
                'programa_contenidos_es': 'Contenidos del programa en español de prueba',
                'programa_contenidos_ca': 'Continguts del programa en català de prova',
                'programa_contenidos_en': 'Program contents in English for testing',
                'programa_objetivos_es': 'Objetivos del programa en español de prueba',
                'programa_objetivos_ca': 'Objectius del programa en català de prova',
                'programa_objetivos_en': 'Program objectives in English for testing',
                'programa_duracion': '80',
                'programa_inicio': '2024-12-20',
                'programa_fin': '2024-12-25',
                
                # === CAMPOS DE IMPORTES ===
                'imp_base': '150.00',
                'imp_tipo': 'IVA 21%',
                'imp_descuento_pct': '10',
                'imp_codigo': 'DESCUENTO10',
                'imp_condiciones_es': 'Condiciones en español de prueba',
                'imp_condiciones_ca': 'Condicions en català de prova',
                'imp_condiciones_en': 'Terms in English for testing',
                
                # === CAMPOS DE ENTIDADES ===
                'org_principal': 'Entidad Organizadora de Prueba',
                'org_nif': 'B12345678',
                'org_web': 'https://www.entidadprueba.com',
                'org_contacto': 'Contacto de Prueba',
                'org_email': 'prueba@entidad.com',
                'org_tel': '934123456'
            }
            
            # Llenar todos los campos
            campos_llenados = 0
            campos_error = 0
            
            for campo_id, valor in valores_prueba.items():
                try:
                    campo = page.locator(f'#{campo_id}')
                    if await campo.count() > 0:
                        if isinstance(valor, bool):  # Checkbox
                            if valor:
                                await campo.check()
                            else:
                                await campo.uncheck()
                        elif campo_id in ['actividadUnidadGestion', 'tipoActividad', 'lineaEstrategica', 
                                        'objetivoEstrategico', 'actividadReservada', 'centroUnidadUBDestinataria',
                                        'centroTrabajoRequerido', 'modalidadGestion', 'tipusEstudiSAE', 
                                        'categoriaSAE', 'insc_modalidad', 'imp_tipo']:
                            # Campos select
                            await campo.select_option(valor)
                        else:
                            # Campos de texto, número, fecha
                            await campo.clear()
                            await campo.fill(str(valor))
                        
                        campos_llenados += 1
                        print(f'  ✅ {campo_id:25} = {valor}')
                    else:
                        print(f'  ❌ {campo_id:25} NO ENCONTRADO')
                        campos_error += 1
                        
                except Exception as e:
                    print(f'  ❌ {campo_id:25} ERROR: {e}')
                    campos_error += 1
            
            print(f'\n📊 RESUMEN DE LLENADO:')
            print(f'  ✅ Campos llenados correctamente: {campos_llenados}')
            print(f'  ❌ Campos con error: {campos_error}')
            
            # Guardar la actividad
            print(f'\n💾 GUARDANDO ACTIVIDAD...')
            await page.locator('button:has-text("Actualizar Actividad")').click()
            
            # Esperar mensaje de éxito
            print('⏳ Esperando confirmación de guardado...')
            await page.wait_for_timeout(5000)
            
            # Verificar si se guardó correctamente
            print(f'\n🔄 RECARGANDO PÁGINA PARA VERIFICAR...')
            await page.reload()
            await page.wait_for_timeout(10000)
            
            # Verificar qué campos mantienen los valores
            print(f'\n🔍 VERIFICANDO QUÉ CAMPOS MANTIENEN LOS VALORES...')
            
            campos_mantenidos = 0
            campos_perdidos = 0
            
            for campo_id, valor_esperado in valores_prueba.items():
                try:
                    campo = page.locator(f'#{campo_id}')
                    if await campo.count() > 0:
                        if isinstance(valor_esperado, bool):  # Checkbox
                            valor_actual = await campo.is_checked()
                        elif campo_id in ['actividadUnidadGestion', 'tipoActividad', 'lineaEstrategica', 
                                        'objetivoEstrategico', 'actividadReservada', 'centroUnidadUBDestinataria',
                                        'centroTrabajoRequerido', 'modalidadGestion', 'tipusEstudiSAE', 
                                        'categoriaSAE', 'insc_modalidad', 'imp_tipo']:
                            # Campos select
                            valor_actual = await campo.input_value()
                        else:
                            # Campos de texto, número, fecha
                            valor_actual = await campo.input_value()
                        
                        if str(valor_actual) == str(valor_esperado):
                            campos_mantenidos += 1
                            estado = '✅ MANTENIDO'
                        else:
                            campos_perdidos += 1
                            estado = '❌ PERDIDO'
                        
                        print(f'  {estado} | {campo_id:25} | Esperado: {valor_esperado} | Actual: {valor_actual}')
                        
                except Exception as e:
                    print(f'  ❌ ERROR | {campo_id:25} | Error: {e}')
            
            # Resumen final
            print(f'\n📊 RESUMEN FINAL DEL TEST:')
            print(f'  📝 Total de campos: {len(valores_prueba)}')
            print(f'  ✅ Campos llenados: {campos_llenados}')
            print(f'  💾 Campos mantenidos: {campos_mantenidos}')
            print(f'  ❌ Campos perdidos: {campos_perdidos}')
            print(f'  📊 Porcentaje de éxito: {(campos_mantenidos / len(valores_prueba) * 100):.1f}%')
            
            if campos_perdidos == 0:
                print('\n🎯 RESULTADO: ✅ TODOS LOS CAMPOS SE GUARDARON CORRECTAMENTE')
            else:
                print(f'\n🎯 RESULTADO: ⚠️ {campos_perdidos} CAMPOS NO SE GUARDARON')
                print('   Revisar mapeo JavaScript → Backend')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_guardado_completo())

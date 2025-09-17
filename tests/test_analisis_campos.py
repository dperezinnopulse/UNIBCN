import asyncio
from playwright.async_api import async_playwright

async def test_analisis_campos():
    print('🔍 ANÁLISIS COMPLETO DE CAMPOS DEL FORMULARIO')
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
            
            print('\n🔍 ANÁLISIS SISTEMÁTICO DE CAMPOS:')
            
            # Lista completa de campos a verificar
            campos_analisis = {
                # === CAMPOS BÁSICOS ===
                'actividadCodigo': {'tipo': 'input', 'categoria': 'Básico', 'descripcion': 'Código de la actividad'},
                'actividadTitulo': {'tipo': 'input', 'categoria': 'Básico', 'descripcion': 'Título de la actividad'},
                'descripcion': {'tipo': 'textarea', 'categoria': 'Básico', 'descripcion': 'Descripción de la actividad'},
                'actividadAnioAcademico': {'tipo': 'input', 'categoria': 'Básico', 'descripcion': 'Año académico'},
                'actividadUnidadGestion': {'tipo': 'select', 'categoria': 'Básico', 'descripcion': 'Unidad gestora'},
                
                # === CAMPOS ADICIONALES ===
                'tipoActividad': {'tipo': 'select', 'categoria': 'Adicional', 'descripcion': 'Tipo de actividad'},
                'condicionesEconomicas': {'tipo': 'input', 'categoria': 'Adicional', 'descripcion': 'Condiciones económicas'},
                'lineaEstrategica': {'tipo': 'select', 'categoria': 'Adicional', 'descripcion': 'Línea estratégica'},
                'objetivoEstrategico': {'tipo': 'select', 'categoria': 'Adicional', 'descripcion': 'Objetivo estratégico'},
                'codigoRelacionado': {'tipo': 'input', 'categoria': 'Adicional', 'descripcion': 'Código relacionado'},
                'actividadReservada': {'tipo': 'select', 'categoria': 'Adicional', 'descripcion': 'Actividad reservada'},
                'fechaActividad': {'tipo': 'date', 'categoria': 'Adicional', 'descripcion': 'Fecha de actividad'},
                'motivoCierre': {'tipo': 'input', 'categoria': 'Adicional', 'descripcion': 'Motivo de cierre'},
                
                # === CAMPOS DE PERSONAS ===
                'personaSolicitante': {'tipo': 'input', 'categoria': 'Personas', 'descripcion': 'Persona solicitante'},
                'coordinador': {'tipo': 'input', 'categoria': 'Personas', 'descripcion': 'Coordinador/a'},
                'jefeUnidadGestora': {'tipo': 'input', 'categoria': 'Personas', 'descripcion': 'Jefe/a unidad gestora'},
                'gestorActividad': {'tipo': 'input', 'categoria': 'Personas', 'descripcion': 'Gestor/a de la actividad'},
                
                # === CAMPOS DE DESTINATARIOS ===
                'facultadDestinataria': {'tipo': 'input', 'categoria': 'Destinatarios', 'descripcion': 'Facultad destinataria'},
                'departamentoDestinatario': {'tipo': 'input', 'categoria': 'Destinatarios', 'descripcion': 'Departamento destinatario'},
                'centroUnidadUBDestinataria': {'tipo': 'select', 'categoria': 'Destinatarios', 'descripcion': 'Centro/unidad UB destinataria'},
                'otrosCentrosInstituciones': {'tipo': 'input', 'categoria': 'Destinatarios', 'descripcion': 'Otros centros/instituciones'},
                
                # === CAMPOS NUMÉRICOS ===
                'plazasTotales': {'tipo': 'number', 'categoria': 'Numérico', 'descripcion': 'Plazas totales'},
                'horasTotales': {'tipo': 'number', 'categoria': 'Numérico', 'descripcion': 'Horas totales'},
                
                # === CAMPOS DE GESTIÓN ===
                'centroTrabajoRequerido': {'tipo': 'select', 'categoria': 'Gestión', 'descripcion': 'Centro de trabajo requerido'},
                'modalidadGestion': {'tipo': 'select', 'categoria': 'Gestión', 'descripcion': 'Modalidad de gestión'},
                'fechaInicioImparticion': {'tipo': 'date', 'categoria': 'Gestión', 'descripcion': 'F. inicio de la imp.'},
                'fechaFinImparticion': {'tipo': 'date', 'categoria': 'Gestión', 'descripcion': 'F. final de la imp.'},
                'actividadPago': {'tipo': 'checkbox', 'categoria': 'Gestión', 'descripcion': 'Actividad de pago'},
                
                # === CAMPOS ESPECÍFICOS POR UG ===
                'coordinadorCentreUnitat': {'tipo': 'input', 'categoria': 'UG-IDP', 'descripcion': 'Coordinador/a de centre/unitat'},
                'centreTreballeAlumne': {'tipo': 'input', 'categoria': 'UG-IDP', 'descripcion': 'Centre de treball de l\'alumne'},
                'creditosTotalesCRAI': {'tipo': 'number', 'categoria': 'UG-CRAI', 'descripcion': 'Crèdits totals (CRAI)'},
                'creditosTotalesSAE': {'tipo': 'number', 'categoria': 'UG-SAE', 'descripcion': 'Crèdits totals (SAE)'},
                'creditosMinimosSAE': {'tipo': 'number', 'categoria': 'UG-SAE', 'descripcion': 'Crèdits mínims (SAE)'},
                'creditosMaximosSAE': {'tipo': 'number', 'categoria': 'UG-SAE', 'descripcion': 'Crèdits màxims (SAE)'},
                'tipusEstudiSAE': {'tipo': 'select', 'categoria': 'UG-SAE', 'descripcion': 'Tipus d\'estudi (SAE)'},
                'categoriaSAE': {'tipo': 'select', 'categoria': 'UG-SAE', 'descripcion': 'Categoria (SAE)'},
                'competenciesSAE': {'tipo': 'input', 'categoria': 'UG-SAE', 'descripcion': 'Competències (SAE)'},
                
                # === CAMPOS DE INSCRIPCIÓN ===
                'insc_inicio': {'tipo': 'date', 'categoria': 'Inscripción', 'descripcion': 'Inicio inscripción'},
                'insc_fin': {'tipo': 'date', 'categoria': 'Inscripción', 'descripcion': 'Fin inscripción'},
                'insc_plazas': {'tipo': 'number', 'categoria': 'Inscripción', 'descripcion': 'Nº de plazas'},
                'insc_lista_espera': {'tipo': 'checkbox', 'categoria': 'Inscripción', 'descripcion': 'Lista de espera'},
                'insc_modalidad': {'tipo': 'select', 'categoria': 'Inscripción', 'descripcion': 'Modalidad'},
                'insc_requisitos_es': {'tipo': 'textarea', 'categoria': 'Inscripción', 'descripcion': 'Requisitos (ES)'},
                'insc_requisitos_ca': {'tipo': 'textarea', 'categoria': 'Inscripción', 'descripcion': 'Requisitos (CA)'},
                'insc_requisitos_en': {'tipo': 'textarea', 'categoria': 'Inscripción', 'descripcion': 'Requisitos (EN)'},
                
                # === CAMPOS DE PROGRAMA ===
                'programa_descripcion_es': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Descripción (ES)'},
                'programa_descripcion_ca': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Descripción (CA)'},
                'programa_descripcion_en': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Descripción (EN)'},
                'programa_contenidos_es': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Contenidos (ES)'},
                'programa_contenidos_ca': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Contenidos (CA)'},
                'programa_contenidos_en': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Contenidos (EN)'},
                'programa_objetivos_es': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Objetivos (ES)'},
                'programa_objetivos_ca': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Objetivos (CA)'},
                'programa_objetivos_en': {'tipo': 'textarea', 'categoria': 'Programa', 'descripcion': 'Objetivos (EN)'},
                'programa_duracion': {'tipo': 'number', 'categoria': 'Programa', 'descripcion': 'Duración (horas)'},
                'programa_inicio': {'tipo': 'date', 'categoria': 'Programa', 'descripcion': 'Fecha de inicio'},
                'programa_fin': {'tipo': 'date', 'categoria': 'Programa', 'descripcion': 'Fecha de fin'},
                
                # === CAMPOS DE IMPORTES ===
                'imp_base': {'tipo': 'number', 'categoria': 'Importes', 'descripcion': 'Importe base (€)'},
                'imp_tipo': {'tipo': 'select', 'categoria': 'Importes', 'descripcion': 'Impuesto'},
                'imp_descuento_pct': {'tipo': 'number', 'categoria': 'Importes', 'descripcion': 'Descuento (%)'},
                'imp_codigo': {'tipo': 'input', 'categoria': 'Importes', 'descripcion': 'Código promocional'},
                'imp_condiciones_es': {'tipo': 'textarea', 'categoria': 'Importes', 'descripcion': 'Condiciones (ES)'},
                'imp_condiciones_ca': {'tipo': 'textarea', 'categoria': 'Importes', 'descripcion': 'Condiciones (CA)'},
                'imp_condiciones_en': {'tipo': 'textarea', 'categoria': 'Importes', 'descripcion': 'Condiciones (EN)'},
                
                # === CAMPOS DE ENTIDADES ===
                'org_principal': {'tipo': 'input', 'categoria': 'Entidades', 'descripcion': 'Organizadora principal'},
                'org_nif': {'tipo': 'input', 'categoria': 'Entidades', 'descripcion': 'NIF/CIF'},
                'org_web': {'tipo': 'input', 'categoria': 'Entidades', 'descripcion': 'Web'},
                'org_contacto': {'tipo': 'input', 'categoria': 'Entidades', 'descripcion': 'Persona de contacto'},
                'org_email': {'tipo': 'input', 'categoria': 'Entidades', 'descripcion': 'Email'},
                'org_tel': {'tipo': 'input', 'categoria': 'Entidades', 'descripcion': 'Teléfono'}
            }
            
            # Analizar cada campo
            campos_encontrados = 0
            campos_no_encontrados = 0
            campos_con_valor = 0
            campos_vacios = 0
            
            print('\n📊 ANÁLISIS DETALLADO POR CATEGORÍA:')
            
            for campo_id, info in campos_analisis.items():
                try:
                    # Buscar el campo
                    campo = page.locator(f'#{campo_id}')
                    if await campo.count() > 0:
                        campos_encontrados += 1
                        
                        # Verificar si tiene valor
                        if info['tipo'] == 'checkbox':
                            valor = await campo.is_checked()
                            tiene_valor = valor
                        elif info['tipo'] == 'select':
                            valor = await campo.input_value()
                            tiene_valor = valor and valor != '' and valor != 'Selecciona' and valor != 'Seleccionar'
                        else:
                            valor = await campo.input_value()
                            tiene_valor = valor and valor.trim() != ''
                        
                        if tiene_valor:
                            campos_con_valor += 1
                            estado = '✅ CON VALOR'
                        else:
                            campos_vacios += 1
                            estado = '⚠️ VACÍO'
                        
                        print(f'  {estado} | {info["categoria"]:12} | {campo_id:25} | {info["descripcion"]}')
                        
                    else:
                        campos_no_encontrados += 1
                        print(f'  ❌ NO ENCONTRADO | {info["categoria"]:12} | {campo_id:25} | {info["descripcion"]}')
                        
                except Exception as e:
                    print(f'  ❌ ERROR | {info["categoria"]:12} | {campo_id:25} | Error: {e}')
            
            # Resumen final
            print(f'\n📊 RESUMEN DEL ANÁLISIS:')
            print(f'  📝 Total de campos analizados: {len(campos_analisis)}')
            print(f'  ✅ Campos encontrados: {campos_encontrados}')
            print(f'  ❌ Campos no encontrados: {campos_no_encontrados}')
            print(f'  💾 Campos con valor: {campos_con_valor}')
            print(f'  ⚠️ Campos vacíos: {campos_vacios}')
            print(f'  📊 Porcentaje de campos encontrados: {(campos_encontrados / len(campos_analisis) * 100):.1f}%')
            print(f'  📊 Porcentaje de campos con valor: {(campos_con_valor / len(campos_analisis) * 100):.1f}%')
            
            if campos_no_encontrados == 0:
                print('\n🎯 RESULTADO: ✅ TODOS LOS CAMPOS ENCONTRADOS')
            else:
                print(f'\n🎯 RESULTADO: ⚠️ {campos_no_encontrados} CAMPOS NO ENCONTRADOS')
                print('   Revisar IDs en el HTML vs JavaScript')
            
        except Exception as e:
            print(f'❌ Error durante el análisis: {e}')
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_analisis_campos())

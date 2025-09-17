#!/usr/bin/env python3
"""
Debug específico para Actividad 60 - Verificar datos del backend y frontend
"""

import asyncio
import json
import requests
from playwright.async_api import async_playwright

async def debug_actividad_60():
    print("🔍 DEBUG ACTIVIDAD 60 - ANÁLISIS COMPLETO")
    print("=" * 60)
    
    # PASO 1: Verificar datos del backend
    print("\n📡 PASO 1: Verificando datos del backend...")
    try:
        response = requests.get("http://localhost:5001/api/actividades/60", timeout=10)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend responde correctamente")
            print(f"📊 Datos recibidos ({len(data)} campos):")
            
            # Mostrar campos principales
            campos_principales = [
                'id', 'codigo', 'titulo', 'descripcion', 'personaSolicitante', 
                'coordinador', 'facultadDestinataria', 'unidadGestionId',
                'lineaEstrategica', 'objetivoEstrategico', 'modalidadGestion'
            ]
            
            for campo in campos_principales:
                # Buscar tanto mayúsculas como minúsculas
                valor = data.get(campo) or data.get(campo.capitalize()) or data.get(campo.lower())
                if valor:
                    print(f"  ✅ {campo}: '{valor}'")
                else:
                    print(f"  ❌ {campo}: VACÍO/AUSENTE")
                    
        else:
            print(f"❌ Backend error: {response.status_code}")
            return
            
    except Exception as e:
        print(f"❌ Error consultando backend: {e}")
        return
    
    # PASO 2: Verificar frontend
    print("\n🌐 PASO 2: Verificando carga en frontend...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Capturar logs de consola
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
                'status': response.status,
                'statusText': response.status_text
            }) if response.status >= 400 else None
        )
        
        try:
            print("🔄 Navegando a página de edición...")
            await page.goto("http://localhost:8080/editar-actividad.html?id=60", wait_until='domcontentloaded')
            
            # Esperar carga completa
            print("⏳ Esperando carga completa (8 segundos)...")
            await page.wait_for_timeout(8000)
            
            # VERIFICAR CAMPOS DE TEXTO
            print("\n📝 Verificando campos de texto...")
            campos_texto = [
                'actividadTitulo', 'actividadCodigo', 'personaSolicitante',
                'coordinador', 'facultadDestinataria', 'departamentoDestinatario',
                'condicionesEconomicas', 'codigoRelacionado'
            ]
            
            for campo_id in campos_texto:
                try:
                    element = page.locator(f'#{campo_id}')
                    if await element.count() > 0:
                        value = await element.input_value()
                        if value and value.strip():
                            print(f"  ✅ {campo_id}: '{value}'")
                        else:
                            print(f"  ❌ {campo_id}: VACÍO")
                    else:
                        print(f"  ⚠️ {campo_id}: ELEMENTO NO ENCONTRADO")
                except Exception as e:
                    print(f"  💥 {campo_id}: ERROR - {e}")
            
            # VERIFICAR DROPDOWNS
            print("\n📋 Verificando dropdowns...")
            dropdowns = [
                'actividadUnidadGestion', 'tipoActividad', 'lineaEstrategica', 
                'objetivoEstrategico', 'modalidadGestion', 'centroUnidadUBDestinataria'
            ]
            
            for dropdown_id in dropdowns:
                try:
                    select = page.locator(f'#{dropdown_id}')
                    if await select.count() > 0:
                        options = await select.locator('option').all()
                        selected_value = await select.input_value()
                        selected_text = ""
                        
                        if selected_value:
                            selected_option = await select.locator(f'option[value="{selected_value}"]').first
                            if await selected_option.count() > 0:
                                selected_text = await selected_option.text_content()
                        
                        print(f"  📊 {dropdown_id}: {len(options)} opciones")
                        if selected_value:
                            print(f"    ✅ Seleccionado: '{selected_value}' ({selected_text})")
                        else:
                            print(f"    ❌ Sin selección")
                    else:
                        print(f"  ⚠️ {dropdown_id}: ELEMENTO NO ENCONTRADO")
                except Exception as e:
                    print(f"  💥 {dropdown_id}: ERROR - {e}")
            
            # VERIFICAR ERRORES DE RED
            if network_errors:
                print(f"\n🚨 ERRORES DE RED ({len(network_errors)}):")
                for error in network_errors:
                    print(f"  ❌ {error['status']} {error['statusText']}: {error['url']}")
            else:
                print(f"\n✅ Sin errores de red")
            
            # MOSTRAR LOGS CRÍTICOS
            error_logs = [log for log in console_logs if log['type'] in ['error', 'warning']]
            if error_logs:
                print(f"\n🐛 LOGS DE ERROR/WARNING ({len(error_logs)}):")
                for log in error_logs[-5:]:  # Últimos 5
                    print(f"  {log['type'].upper()}: {log['text']}")
            
            # BUSCAR LOGS DE DEBUG ESPECÍFICOS
            debug_logs = [log for log in console_logs if 'DEBUG: llenarFormularioConActividad' in log['text']]
            if debug_logs:
                print(f"\n🔧 LOGS DE LLENADO DE FORMULARIO:")
                for log in debug_logs[-10:]:  # Últimos 10
                    print(f"  {log['text']}")
            
        except Exception as e:
            print(f"❌ Error en frontend: {e}")
        
        finally:
            await browser.close()
    
    print("\n" + "=" * 60)
    print("🏁 DEBUG COMPLETADO")

if __name__ == "__main__":
    asyncio.run(debug_actividad_60())

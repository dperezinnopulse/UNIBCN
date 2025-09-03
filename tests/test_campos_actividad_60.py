#!/usr/bin/env python3
"""
Test específico para verificar que los campos de la actividad 60 se llenan correctamente
"""

import asyncio
from playwright.async_api import async_playwright

async def test_campos_actividad_60():
    print("🔍 TEST ESPECÍFICO - CAMPOS ACTIVIDAD 60")
    print("=" * 50)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            print("🌐 Navegando a editar-actividad.html?id=60...")
            await page.goto("http://localhost:8080/editar-actividad.html?id=60", wait_until='domcontentloaded')
            
            # Esperar carga completa
            print("⏳ Esperando carga completa...")
            await page.wait_for_timeout(8000)
            
            # Verificar campos principales
            campos_esperados = {
                'actividadTitulo': 'Jornada de Innovacion Tecnologica 2025',
                'actividadCodigo': 'Prueba1',
                'personaSolicitante': 'Dr. Carlos Lopez',
                'coordinador': 'Dr. Ana Garcia',
                'facultadDestinataria': 'Facultad de Informática',
                'departamentoDestinatario': 'Departamento de Ingenieria Informática',
                'condicionesEconomicas': 'Gratuita para miembros UB',
                'codigoRelacionado': 'REL-2025-001',
                'lugar': 'Aula Virtual',
                'descripcion': 'Esta actividad fue creada automaticamente para probar el frontend'
            }
            
            print("\n📝 Verificando campos de texto:")
            campos_ok = 0
            campos_fallidos = []
            
            for campo_id, valor_esperado in campos_esperados.items():
                try:
                    element = page.locator(f'#{campo_id}')
                    if await element.count() > 0:
                        value = await element.input_value()
                        if value and value.strip() == valor_esperado:
                            print(f"  ✅ {campo_id}: '{value}'")
                            campos_ok += 1
                        else:
                            print(f"  ❌ {campo_id}: '{value}' (esperado: '{valor_esperado}')")
                            campos_fallidos.append(campo_id)
                    else:
                        print(f"  ⚠️ {campo_id}: ELEMENTO NO ENCONTRADO")
                        campos_fallidos.append(campo_id)
                except Exception as e:
                    print(f"  💥 {campo_id}: ERROR - {e}")
                    campos_fallidos.append(campo_id)
            
            # Verificar dropdowns
            print("\n📋 Verificando dropdowns:")
            dropdowns_esperados = {
                'tipoActividad': 'Jornada',
                'lineaEstrategica': 'Linea 1',
                'objetivoEstrategico': 'Linea 1',
                'modalidadGestion': 'Acreditada UB'
            }
            
            dropdowns_ok = 0
            dropdowns_fallidos = []
            
            for dropdown_id, valor_esperado in dropdowns_esperados.items():
                try:
                    select = page.locator(f'#{dropdown_id}')
                    if await select.count() > 0:
                        selected_value = await select.input_value()
                        if selected_value and selected_value.strip() == valor_esperado:
                            print(f"  ✅ {dropdown_id}: '{selected_value}'")
                            dropdowns_ok += 1
                        else:
                            print(f"  ❌ {dropdown_id}: '{selected_value}' (esperado: '{valor_esperado}')")
                            dropdowns_fallidos.append(dropdown_id)
                    else:
                        print(f"  ⚠️ {dropdown_id}: ELEMENTO NO ENCONTRADO")
                        dropdowns_fallidos.append(dropdown_id)
                except Exception as e:
                    print(f"  💥 {dropdown_id}: ERROR - {e}")
                    dropdowns_fallidos.append(dropdown_id)
            
            # Resumen
            print(f"\n📊 RESUMEN:")
            print(f"  📝 Campos de texto: {campos_ok}/{len(campos_esperados)} OK")
            print(f"  📋 Dropdowns: {dropdowns_ok}/{len(dropdowns_esperados)} OK")
            
            if campos_fallidos:
                print(f"  ❌ Campos fallidos: {campos_fallidos}")
            if dropdowns_fallidos:
                print(f"  ❌ Dropdowns fallidos: {dropdowns_fallidos}")
            
            if not campos_fallidos and not dropdowns_fallidos:
                print(f"  🎉 ¡TODOS LOS CAMPOS FUNCIONAN CORRECTAMENTE!")
            else:
                print(f"  ⚠️ Hay campos que necesitan corrección")
                
        except Exception as e:
            print(f"❌ Error en test: {e}")
        
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_campos_actividad_60())

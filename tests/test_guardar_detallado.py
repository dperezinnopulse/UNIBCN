#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DE GUARDAR DETALLADO
Captura exactamente qué está pasando en la consola cuando se ejecuta guardarActividad
"""

from playwright.sync_api import sync_playwright
import time

def test_guardar_detallado():
    print('🧪 TEST DE GUARDAR DETALLADO')
    print('=' * 50)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # Capturar logs de consola
        logs = []
        page.on("console", lambda msg: logs.append(msg.text))
        
        # Capturar errores de página
        errors = []
        page.on("pageerror", lambda err: errors.append(err))
        
        try:
            # Navegar a la página
            print('🌐 Navegando a editar-actividad.html?id=60...')
            page.goto('http://localhost:8080/editar-actividad.html?id=60')
            
            # Esperar a que cargue
            time.sleep(5)
            
            # Esperar a que se carguen todos los datos de entidades relacionadas
            print('⏳ Esperando a que se carguen los datos de entidades relacionadas...')
            page.wait_for_function('''
                () => {
                    const orgPrincipal = document.getElementById('org_principal')?.value;
                    const impBase = document.getElementById('imp_base')?.value;
                    return orgPrincipal && impBase;
                }
            ''', timeout=30000)
            
            print('✅ Datos de entidades relacionadas cargados correctamente')
            
            # Verificar que los campos tengan valores
            print('🔍 Verificando valores de campos antes de guardar...')
            
            org_principal_value = page.locator('#org_principal').input_value()
            imp_base_value = page.locator('#imp_base').input_value()
            
            print(f'🔍 Campo org_principal: "{org_principal_value}"')
            print(f'🔍 Campo imp_base: "{imp_base_value}"')
            
            if not org_principal_value or not imp_base_value:
                print('⚠️ ADVERTENCIA: Los campos de entidades relacionadas están vacíos')
                print('⏳ Esperando 5 segundos adicionales...')
                time.sleep(5)
                
                # Verificar nuevamente
                org_principal_value = page.locator('#org_principal').input_value()
                imp_base_value = page.locator('#imp_base').input_value()
                
                print(f'🔍 Campo org_principal (segunda verificación): "{org_principal_value}"')
                print(f'🔍 Campo imp_base (segunda verificación): "{imp_base_value}"')
                
                if not org_principal_value or not imp_base_value:
                    print('🚨 ERROR CRÍTICO: Los campos siguen vacíos después de esperar')
                    return
            
            # Limpiar logs anteriores
            logs.clear()
            
            # Hacer clic en el botón de guardar
            print('🖱️ Haciendo clic en el botón Guardar...')
            page.click('#btnGuardarActividad')
            
            # Esperar un momento para que se ejecute el JavaScript
            time.sleep(10)
            
            print(f'📝 Logs capturados después del clic: {len(logs)}')
            for i, log in enumerate(logs):
                print(f'   {i+1}. {log}')
            
            # Verificar si hay mensajes de éxito
            print('🔍 Verificando mensajes...')
            page_content = page.content()
            if '¡Actividad actualizada correctamente!' in page_content:
                print('✅ Mensaje de éxito encontrado')
            else:
                print('❌ Mensaje de éxito NO encontrado')
            
            # Verificar errores
            if errors:
                print(f'❌ Errores encontrados: {len(errors)}')
                for error in errors:
                    print(f'   - {error}')
            else:
                print('✅ No se encontraron errores')
                
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
        finally:
            browser.close()
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    test_guardar_detallado()

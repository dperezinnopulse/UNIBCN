#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DE LOGS DE JAVASCRIPT
Captura los logs de la consola del navegador
"""

from playwright.sync_api import sync_playwright
import time

def test_javascript_logs():
    print('🧪 TEST DE LOGS DE JAVASCRIPT')
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
            
            print(f'📝 Logs capturados hasta ahora: {len(logs)}')
            for log in logs:
                print(f'   - {log}')
            
            # Hacer clic en el botón de guardar
            print('🖱️ Haciendo clic en el botón Guardar (btnGuardarActividad)...')
            page.click('#btnGuardarActividad')
            
            # Esperar un momento para que se ejecute el JavaScript
            time.sleep(5)
            
            print(f'📝 Logs capturados después del clic: {len(logs)}')
            for log in logs:
                print(f'   - {log}')
            
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
    test_javascript_logs()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST SIMPLE DE JAVASCRIPT
Verifica si el JavaScript está funcionando correctamente
"""

from playwright.sync_api import sync_playwright
import time

def test_javascript_simple():
    print('🧪 TEST SIMPLE DE JAVASCRIPT')
    print('=' * 50)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # Navegar a la página
            print('🌐 Navegando a editar-actividad.html?id=60...')
            page.goto('http://localhost:8080/editar-actividad.html?id=60')
            
            # Esperar a que cargue
            time.sleep(5)
            
            # Verificar si hay errores en la consola
            print('🔍 Verificando consola del navegador...')
            
            # Hacer clic en el botón de guardar
            print('🖱️ Haciendo clic en el botón Guardar...')
            page.click('button[onclick="guardarActividad()"]')
            
            # Esperar un momento
            time.sleep(3)
            
            # Verificar si hay mensajes de éxito
            print('🔍 Verificando mensajes...')
            
            # Buscar mensajes de éxito o error
            page_content = page.content()
            if '¡Actividad actualizada correctamente!' in page_content:
                print('✅ Mensaje de éxito encontrado')
            else:
                print('❌ Mensaje de éxito NO encontrado')
            
            # Verificar si hay errores en la consola
            console_logs = page.evaluate('() => window.console.logs || []')
            if console_logs:
                print(f'📝 Logs de consola encontrados: {len(console_logs)}')
                for log in console_logs[:5]:  # Mostrar solo los primeros 5
                    print(f'   - {log}')
            else:
                print('⚠️ No se encontraron logs de consola')
            
            # Verificar si hay errores
            page_errors = page.evaluate('() => window.pageErrors || []')
            if page_errors:
                print(f'❌ Errores encontrados: {len(page_errors)}')
                for error in page_errors:
                    print(f'   - {error}')
            else:
                print('✅ No se encontraron errores')
                
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
        finally:
            browser.close()
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    test_javascript_simple()

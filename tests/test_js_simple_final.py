#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DE JAVASCRIPT SIMPLE FINAL
Verifica si el JavaScript está funcionando y llenando los campos
"""

from playwright.sync_api import sync_playwright
import time

def test_javascript_simple_final():
    print('🧪 TEST DE JAVASCRIPT SIMPLE FINAL')
    print('=' * 50)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # Navegar a la página
            print('🌐 Navegando a editar-actividad.html?id=60...')
            page.goto('http://localhost:8080/editar-actividad.html?id=60')
            
            # Esperar a que cargue
            print('⏳ Esperando 10 segundos para carga completa...')
            time.sleep(10)
            
            # Verificar si los campos tienen valores
            print('🔍 Verificando valores de campos...')
            
            org_principal_value = page.locator('#org_principal').input_value()
            imp_base_value = page.locator('#imp_base').input_value()
            
            print(f'🔍 Campo org_principal: "{org_principal_value}"')
            print(f'🔍 Campo imp_base: "{imp_base_value}"')
            
            if org_principal_value and imp_base_value:
                print('✅ Los campos tienen valores - El JavaScript está funcionando')
            else:
                print('❌ Los campos están vacíos - El JavaScript NO está funcionando')
            
            # Verificar si hay algún mensaje de error en la consola
            print('🔍 Verificando consola del navegador...')
            page_content = page.content()
            
            if 'error' in page_content.lower():
                print('⚠️ Se encontraron errores en la página')
            else:
                print('✅ No se encontraron errores en la página')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
        finally:
            browser.close()
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    test_javascript_simple_final()

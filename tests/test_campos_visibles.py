#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DE CAMPOS VISIBLES
Verifica si los campos de entidades relacionadas están visibles y accesibles
"""

from playwright.sync_api import sync_playwright
import time

def test_campos_visibles():
    print('🧪 TEST DE CAMPOS VISIBLES')
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
            
            # Verificar si los campos están visibles
            print('🔍 Verificando visibilidad de campos...')
            
            # Campo org_principal
            try:
                org_principal = page.locator('#org_principal')
                if org_principal.is_visible():
                    print('✅ Campo org_principal: VISIBLE')
                    valor = org_principal.input_value()
                    print(f'   Valor: "{valor}"')
                else:
                    print('❌ Campo org_principal: NO VISIBLE')
            except Exception as e:
                print(f'❌ Campo org_principal: Error - {e}')
            
            # Campo imp_base
            try:
                imp_base = page.locator('#imp_base')
                if imp_base.is_visible():
                    print('✅ Campo imp_base: VISIBLE')
                    valor = imp_base.input_value()
                    print(f'   Valor: "{valor}"')
                else:
                    print('❌ Campo imp_base: NO VISIBLE')
            except Exception as e:
                print(f'❌ Campo imp_base: Error - {e}')
            
            # Verificar si los campos están en el DOM
            print('\n🔍 Verificando si los campos están en el DOM...')
            
            try:
                org_principal_count = page.locator('#org_principal').count()
                print(f'✅ Campo org_principal: {org_principal_count} elementos en DOM')
            except Exception as e:
                print(f'❌ Campo org_principal: Error - {e}')
            
            try:
                imp_base_count = page.locator('#imp_base').count()
                print(f'✅ Campo imp_base: {imp_base_count} elementos en DOM')
            except Exception as e:
                print(f'❌ Campo imp_base: Error - {e}')
            
            # Verificar si los campos están habilitados
            print('\n🔍 Verificando si los campos están habilitados...')
            
            try:
                org_principal_enabled = page.locator('#org_principal').is_enabled()
                print(f'✅ Campo org_principal: {"HABILITADO" if org_principal_enabled else "DESHABILITADO"}')
            except Exception as e:
                print(f'❌ Campo org_principal: Error - {e}')
            
            try:
                imp_base_enabled = page.locator('#imp_base').is_enabled()
                print(f'✅ Campo imp_base: {"HABILITADO" if imp_base_enabled else "DESHABILITADO"}')
            except Exception as e:
                print(f'❌ Campo imp_base: Error - {e}')
            
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
        finally:
            browser.close()
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    test_campos_visibles()

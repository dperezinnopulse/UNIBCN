#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DE LOGS FINAL
Captura los logs de la consola para ver si cargarDatosAdicionalesSinDominios se ejecuta
"""

from playwright.sync_api import sync_playwright
import time

def test_js_logs_final():
    print('🧪 TEST DE LOGS FINAL')
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
            print('⏳ Esperando 15 segundos para carga completa...')
            time.sleep(15)
            
            print(f'📝 Logs capturados: {len(logs)}')
            for i, log in enumerate(logs):
                print(f'   {i+1}. {log}')
            
            # Verificar si hay mensajes de debug de cargarDatosAdicionalesSinDominios
            debug_messages = [log for log in logs if 'cargarDatosAdicionalesSinDominios' in log]
            if debug_messages:
                print(f'\n✅ Se encontraron {len(debug_messages)} mensajes de debug de cargarDatosAdicionalesSinDominios')
                for msg in debug_messages:
                    print(f'   - {msg}')
            else:
                print('\n❌ NO se encontraron mensajes de debug de cargarDatosAdicionalesSinDominios')
            
            # Verificar si hay mensajes de entidades e importes
            entidades_messages = [log for log in logs if 'Entidades cargadas' in log]
            importes_messages = [log for log in logs if 'Importes cargados' in log]
            
            if entidades_messages:
                print(f'\n✅ Se encontraron {len(entidades_messages)} mensajes de entidades cargadas')
                for msg in entidades_messages:
                    print(f'   - {msg}')
            else:
                print('\n❌ NO se encontraron mensajes de entidades cargadas')
            
            if importes_messages:
                print(f'\n✅ Se encontraron {len(importes_messages)} mensajes de importes cargados')
                for msg in importes_messages:
                    print(f'   - {msg}')
            else:
                print('\n❌ NO se encontraron mensajes de importes cargados')
            
            # Verificar errores
            if errors:
                print(f'\n❌ Errores encontrados: {len(errors)}')
                for error in errors:
                    print(f'   - {error}')
            else:
                print('\n✅ No se encontraron errores')
                
        except Exception as e:
            print(f'❌ Error durante el test: {e}')
        finally:
            browser.close()
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    test_js_logs_final()

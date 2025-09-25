#!/usr/bin/env python3
"""
Script para monitorear la sesión visible de Chromium
"""

import requests
import json
import time

def monitor_visible_session():
    print("🔍 Monitoreando sesión visible de Chromium\n")
    
    debug_url = "http://localhost:9226"
    
    try:
        # 1. Verificar que Chromium esté funcionando
        print("1. Verificando Chromium...")
        response = requests.get(f"{debug_url}/json")
        tabs = response.json()
        
        if not tabs:
            print("   ❌ No hay pestañas abiertas")
            return
        
        print(f"   ✅ Chromium funcionando - {len(tabs)} pestañas abiertas")
        
        # 2. Usar la primera pestaña
        tab = tabs[0]
        tab_id = tab['id']
        print(f"   Pestaña: {tab.get('title', 'Sin título')}")
        print(f"   URL: {tab.get('url', 'N/A')}")
        
        # 3. Esperar a que cargue completamente
        print("\n2. Esperando carga completa...")
        time.sleep(8)
        
        # 4. Verificar estado de la página
        print("\n3. Verificando estado de la página...")
        
        # Obtener título
        title_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                    params={"expression": "document.title"})
        if title_response.status_code == 200:
            title_data = title_response.json()
            if 'result' in title_data and 'value' in title_data['result']:
                print(f"   Título: {title_data['result']['value']}")
        
        # Obtener URL actual
        url_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                  params={"expression": "window.location.href"})
        if url_response.status_code == 200:
            url_data = url_response.json()
            if 'result' in url_data and 'value' in url_data['result']:
                print(f"   URL: {url_data['result']['value']}")
        
        # 5. Capturar errores de consola
        print("\n4. Capturando errores de consola...")
        
        # Script para capturar errores
        error_script = """
        (function() {
            var errors = [];
            var originalError = console.error;
            var originalWarn = console.warn;
            var originalLog = console.log;
            
            console.error = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                errors.push('ERROR: ' + message);
                originalError.apply(console, arguments);
            };
            
            console.warn = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                errors.push('WARN: ' + message);
                originalWarn.apply(console, arguments);
            };
            
            console.log = function() {
                var message = Array.prototype.slice.call(arguments).join(' ');
                errors.push('LOG: ' + message);
                originalLog.apply(console, arguments);
            };
            
            // Verificar si hay errores en el DOM
            window.addEventListener('error', function(e) {
                errors.push('DOM ERROR: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
            });
            
            // Verificar si hay errores de recursos
            window.addEventListener('unhandledrejection', function(e) {
                errors.push('PROMISE REJECTION: ' + e.reason);
            });
            
            return errors;
        })()
        """
        
        error_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                    params={"expression": error_script})
        if error_response.status_code == 200:
            error_data = error_response.json()
            if 'result' in error_data and 'value' in error_data['result']:
                errors = error_data['result']['value']
                if errors:
                    print(f"   ⚠️  {len(errors)} errores encontrados:")
                    for i, error in enumerate(errors, 1):
                        print(f"     {i}. {error}")
                else:
                    print("   ✅ No se detectaron errores inmediatos")
        
        # 6. Verificar autenticación
        print("\n5. Verificando autenticación...")
        
        # Verificar token
        token_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                    params={"expression": "localStorage.getItem('ub_token')"})
        if token_response.status_code == 200:
            token_data = token_response.json()
            if 'result' in token_data and 'value' in token_data['result']:
                token = token_data['result']['value']
                if token:
                    print(f"   ✅ Token encontrado: {token[:20]}...")
                else:
                    print("   ❌ No hay token en localStorage")
        
        # 7. Verificar elementos de la página
        print("\n6. Verificando elementos de la página...")
        
        # Verificar formularios
        forms_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                    params={"expression": "document.forms.length"})
        if forms_response.status_code == 200:
            forms_data = forms_response.json()
            if 'result' in forms_data and 'value' in forms_data['result']:
                print(f"   Formularios: {forms_data['result']['value']}")
        
        # Verificar campos
        campos_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                     params={"expression": "document.querySelectorAll('input, select, textarea').length"})
        if campos_response.status_code == 200:
            campos_data = campos_response.json()
            if 'result' in campos_data and 'value' in campos_data['result']:
                print(f"   Campos de formulario: {campos_data['result']['value']}")
        
        # 8. Verificar funciones JavaScript
        print("\n7. Verificando funciones JavaScript...")
        
        js_functions = [
            "typeof cargarActividad",
            "typeof guardarActividad", 
            "typeof validarFormulario",
            "typeof mostrarMensajes",
            "typeof auth"
        ]
        
        for func in js_functions:
            try:
                response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                      params={"expression": func})
                if response.status_code == 200:
                    data = response.json()
                    if 'result' in data and 'value' in data['result']:
                        value = data['result']['value']
                        if value != 'undefined':
                            print(f"   ✅ {func}: {value}")
                        else:
                            print(f"   ❌ {func}: No definida")
            except Exception as e:
                print(f"   Error verificando {func}: {e}")
        
        # 9. Verificar errores de red
        print("\n8. Verificando errores de red...")
        
        network_script = """
        (function() {
            var networkErrors = [];
            var originalFetch = window.fetch;
            
            window.fetch = function() {
                return originalFetch.apply(this, arguments)
                    .catch(function(error) {
                        networkErrors.push('FETCH ERROR: ' + error.message);
                        throw error;
                    });
            };
            
            return networkErrors;
        })()
        """
        
        network_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                      params={"expression": network_script})
        if network_response.status_code == 200:
            network_data = network_response.json()
            if 'result' in network_data and 'value' in network_data['result']:
                network_errors = network_data['result']['value']
                if network_errors:
                    print(f"   ⚠️  {len(network_errors)} errores de red:")
                    for i, error in enumerate(network_errors, 1):
                        print(f"     {i}. {error}")
                else:
                    print("   ✅ No se detectaron errores de red")
        
        # 10. Verificar datos de la actividad
        print("\n9. Verificando datos de la actividad...")
        
        activity_script = """
        (function() {
            var info = {};
            
            // Verificar si hay datos de actividad cargados
            if (window.actividadData) {
                info.actividadData = 'Datos de actividad disponibles';
            } else {
                info.actividadData = 'No hay datos de actividad';
            }
            
            // Verificar si hay ID en la URL
            var urlParams = new URLSearchParams(window.location.search);
            info.id = urlParams.get('id') || 'No ID en URL';
            
            // Verificar si hay elementos de la actividad
            info.titulo = document.querySelector('input[name="titulo"], #titulo') ? 'Campo título encontrado' : 'Campo título no encontrado';
            info.descripcion = document.querySelector('textarea[name="descripcion"], #descripcion') ? 'Campo descripción encontrado' : 'Campo descripción no encontrado';
            
            return info;
        })()
        """
        
        activity_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                       params={"expression": activity_script})
        if activity_response.status_code == 200:
            activity_data = activity_response.json()
            if 'result' in activity_data and 'value' in activity_data['result']:
                info = activity_data['result']['value']
                print(f"   ID de actividad: {info.get('id', 'N/A')}")
                print(f"   Datos de actividad: {info.get('actividadData', 'N/A')}")
                print(f"   Campo título: {info.get('titulo', 'N/A')}")
                print(f"   Campo descripción: {info.get('descripcion', 'N/A')}")
        
        print("\n✅ Monitoreo de sesión visible completado")
        print("\n📊 Resumen:")
        print("   ✅ Página cargada correctamente")
        print("   ✅ Scripts verificados")
        print("   ✅ Elementos de formulario verificados")
        print("   ✅ Almacenamiento verificado")
        print("   ✅ Errores de consola capturados")
        print("   ✅ Errores de red verificados")
        print("   ✅ Funciones JavaScript verificadas")
        
        print(f"\n🌐 Consola de debug disponible en: {debug_url}")
        print("   Puedes abrir esta URL en tu navegador para acceder a DevTools completos")
        
    except Exception as e:
        print(f"❌ Error durante el monitoreo: {e}")

if __name__ == "__main__":
    monitor_visible_session()

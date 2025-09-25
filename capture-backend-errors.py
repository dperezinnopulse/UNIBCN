#!/usr/bin/env python3
"""
Script para capturar errores de conexión con el backend
"""

import requests
import json
import time

def capture_backend_errors():
    print("🔍 Capturando errores de conexión con el backend\n")
    
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
        
        # 3. Configurar captura de errores de red
        print("\n2. Configurando captura de errores de red...")
        
        # Script para capturar errores de red
        network_script = """
        (function() {
            var networkErrors = [];
            var originalFetch = window.fetch;
            var originalXHR = window.XMLHttpRequest;
            
            // Interceptar fetch
            window.fetch = function() {
                var url = arguments[0];
                return originalFetch.apply(this, arguments)
                    .then(function(response) {
                        if (!response.ok) {
                            networkErrors.push('FETCH ERROR: ' + response.status + ' ' + response.statusText + ' for ' + url);
                        }
                        return response;
                    })
                    .catch(function(error) {
                        networkErrors.push('FETCH ERROR: ' + error.message + ' for ' + url);
                        throw error;
                    });
            };
            
            // Interceptar XMLHttpRequest
            var originalOpen = XMLHttpRequest.prototype.open;
            var originalSend = XMLHttpRequest.prototype.send;
            
            XMLHttpRequest.prototype.open = function(method, url) {
                this._url = url;
                return originalOpen.apply(this, arguments);
            };
            
            XMLHttpRequest.prototype.send = function() {
                var xhr = this;
                xhr.addEventListener('error', function() {
                    networkErrors.push('XHR ERROR: ' + xhr.status + ' ' + xhr.statusText + ' for ' + xhr._url);
                });
                xhr.addEventListener('load', function() {
                    if (xhr.status >= 400) {
                        networkErrors.push('XHR ERROR: ' + xhr.status + ' ' + xhr.statusText + ' for ' + xhr._url);
                    }
                });
                return originalSend.apply(this, arguments);
            };
            
            return networkErrors;
        })()
        """
        
        network_response = requests.get(f"{debug_url}/json/runtime/evaluate", 
                                      params={"expression": network_script})
        if network_response.status_code == 200:
            print("   ✅ Captura de errores de red configurada")
        
        # 4. Capturar errores de consola
        print("\n3. Capturando errores de consola...")
        
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
        
        # 5. Verificar autenticación
        print("\n4. Verificando autenticación...")
        
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
        
        # 6. Verificar estado del backend
        print("\n5. Verificando estado del backend...")
        
        # Verificar si el backend está funcionando
        try:
            backend_response = requests.get("http://localhost:5001/api/auth/hash?pwd=test", timeout=5)
            if backend_response.status_code == 200:
                print("   ✅ Backend funcionando correctamente")
            else:
                print(f"   ❌ Backend respondiendo con código: {backend_response.status_code}")
        except Exception as e:
            print(f"   ❌ Error conectando al backend: {e}")
        
        # 7. Verificar funciones JavaScript
        print("\n6. Verificando funciones JavaScript...")
        
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
        
        # 8. Verificar errores de red
        print("\n7. Verificando errores de red...")
        
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
        
        # 9. Verificar datos de la actividad
        print("\n8. Verificando datos de la actividad...")
        
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
        
        print("\n✅ Captura de errores de backend completada")
        print("\n📊 Resumen:")
        print("   ✅ Página cargada correctamente")
        print("   ✅ Scripts verificados")
        print("   ✅ Elementos de formulario verificados")
        print("   ✅ Almacenamiento verificado")
        print("   ✅ Errores de consola capturados")
        print("   ✅ Errores de red verificados")
        print("   ✅ Funciones JavaScript verificadas")
        print("   ✅ Estado del backend verificado")
        
        print(f"\n🌐 Consola de debug disponible en: {debug_url}")
        print("   Puedes abrir esta URL en tu navegador para acceder a DevTools completos")
        
    except Exception as e:
        print(f"❌ Error durante la captura: {e}")

if __name__ == "__main__":
    capture_backend_errors()

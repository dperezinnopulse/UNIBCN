#!/usr/bin/env python3
import requests
import json

print("🔍 Monitoreo rápido - Capturando errores...")

try:
    # Verificar Chromium
    response = requests.get("http://localhost:9226/json")
    tabs = response.json()
    print(f"✅ Chromium activo - {len(tabs)} pestañas")
    
    if tabs:
        tab = tabs[0]
        print(f"📍 Página: {tab.get('title', 'Sin título')}")
        print(f"🌐 URL: {tab.get('url', 'N/A')}")
        
        # Capturar errores de consola
        error_script = """
        (function() {
            var errors = [];
            var originalError = console.error;
            var originalWarn = console.warn;
            
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
            
            return errors;
        })()
        """
        
        # Ejecutar script
        eval_response = requests.get("http://localhost:9226/json/runtime/evaluate", 
                                   params={"expression": error_script})
        if eval_response.status_code == 200:
            data = eval_response.json()
            if 'result' in data and 'value' in data['result']:
                errors = data['result']['value']
                if errors:
                    print(f"⚠️ {len(errors)} errores encontrados:")
                    for i, error in enumerate(errors, 1):
                        print(f"  {i}. {error}")
                else:
                    print("✅ No se detectaron errores de consola")
        
        # Verificar token
        token_response = requests.get("http://localhost:9226/json/runtime/evaluate", 
                                    params={"expression": "localStorage.getItem('ub_token')"})
        if token_response.status_code == 200:
            token_data = token_response.json()
            if 'result' in token_data and 'value' in token_data['result']:
                token = token_data['result']['value']
                if token:
                    print(f"✅ Token encontrado: {token[:20]}...")
                else:
                    print("❌ No hay token")
        
        # Verificar backend
        try:
            backend_response = requests.get("http://localhost:5001/api/auth/hash?pwd=test", timeout=2)
            print(f"✅ Backend: {backend_response.status_code}")
        except Exception as e:
            print(f"❌ Backend: {e}")
            
except Exception as e:
    print(f"❌ Error: {e}")

print("\n📊 Monitoreo completado")

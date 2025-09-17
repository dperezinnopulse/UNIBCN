#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST DE ENDPOINT DE ENTIDADES
Verifica si el endpoint /api/actividades/60/entidades está funcionando
"""

import urllib.request
import urllib.error
import ssl
import json

def test_endpoint_entidades():
    print('🧪 TEST DE ENDPOINT DE ENTIDADES')
    print('=' * 50)
    
    # Configurar SSL para desarrollo local
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    # URL del endpoint
    url = 'http://localhost:5001/api/actividades/60/entidades'
    
    try:
        print(f'🌐 Probando endpoint: {url}')
        
        # Crear request
        req = urllib.request.Request(url)
        req.add_header('Content-Type', 'application/json')
        
        # Hacer la petición
        with urllib.request.urlopen(req, context=ssl_context) as response:
            print(f'✅ Response status: {response.status}')
            print(f'✅ Response headers: {response.headers}')
            
            # Leer el contenido
            content = response.read()
            print(f'✅ Response content length: {len(content)} bytes')
            
            # Intentar parsear JSON
            try:
                data = json.loads(content)
                print(f'✅ JSON parseado correctamente: {json.dumps(data, indent=2, ensure_ascii=False)}')
            except json.JSONDecodeError as e:
                print(f'⚠️ Error parseando JSON: {e}')
                print(f'⚠️ Contenido raw: {content.decode("utf-8", errors="ignore")}')
                
    except urllib.error.HTTPError as e:
        print(f'❌ HTTP Error: {e.code} - {e.reason}')
        print(f'❌ Response headers: {e.headers}')
        try:
            content = e.read()
            print(f'❌ Error content: {content.decode("utf-8", errors="ignore")}')
        except:
            print('❌ No se pudo leer el contenido del error')
            
    except urllib.error.URLError as e:
        print(f'❌ URL Error: {e.reason}')
        
    except Exception as e:
        print(f'❌ Error inesperado: {e}')
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    test_endpoint_entidades()

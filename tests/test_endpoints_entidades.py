#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TEST ENDPOINTS DE ENTIDADES RELACIONADAS
Prueba los nuevos endpoints PUT para entidades organizadoras e importes
"""

import urllib.request
import urllib.error
import json

def test_endpoint_entidades():
    print('🧪 TEST ENDPOINT ENTIDADES ORGANIZADORAS')
    print('=' * 60)
    
    try:
        url = "http://localhost:5001/api/actividades/60/entidades"
        print(f'🌐 Probando PUT: {url}')
        
        # Datos de prueba para entidades organizadoras
        test_data = [{
            "nombre": "ENTIDAD DE PRUEBA",
            "nifCif": "B12345678",
            "web": "https://www.entidad-prueba.com",
            "personaContacto": "PERSONA CONTACTO DE PRUEBA",
            "email": "contacto@entidad-prueba.com",
            "telefono": "934123456",
            "esPrincipal": True
        }]
        
        print(f'📝 Datos a enviar: {json.dumps(test_data, indent=2)}')
        
        # Crear request PUT
        req = urllib.request.Request(url, data=json.dumps(test_data).encode('utf-8'))
        req.add_header('Content-Type', 'application/json')
        req.get_method = lambda: 'PUT'
        
        # Hacer la petición
        with urllib.request.urlopen(req) as response:
            data = response.read()
            status_code = response.getcode()
            
            print(f'📊 Status Code: {status_code}')
            
            if status_code == 200:
                try:
                    json_data = json.loads(data.decode('utf-8'))
                    print(f'✅ ÉXITO: Entidades organizadoras actualizadas')
                    print(f'📝 Mensaje: {json_data.get("message", "NO ENCONTRADO")}')
                except json.JSONDecodeError as e:
                    print(f'❌ Error decodificando JSON: {e}')
                    print(f'📝 Response raw: {data.decode("utf-8")}')
            else:
                print(f'❌ ERROR: {status_code}')
                print(f'📝 Response: {data.decode("utf-8")}')
                
    except urllib.error.HTTPError as e:
        print(f'❌ Error HTTP: {e.code}')
        print(f'📝 Response: {e.read().decode("utf-8")}')
    except urllib.error.URLError as e:
        print(f'❌ Error de URL: {e}')
    except Exception as e:
        print(f'❌ Error durante el test: {e}')

def test_endpoint_importes():
    print('\n🧪 TEST ENDPOINT IMPORTES Y DESCUENTOS')
    print('=' * 60)
    
    try:
        url = "http://localhost:5001/api/actividades/60/importes"
        print(f'🌐 Probando PUT: {url}')
        
        # Datos de prueba para importes
        test_data = [{
            "importeBase": 150.50,
            "tipoImpuesto": "IVA 21%",
            "porcentajeDescuento": 15.0,
            "codigoPromocional": "DESCUENTO-PRUEBA-2025",
            "condicionesES": "CONDICIONES DE IMPORTE EN ESPAÑOL DE PRUEBA",
            "condicionesCA": "CONDICIONS D'IMPORT EN CATALÀ DE PROVA",
            "condicionesEN": "IMPORT CONDITIONS IN ENGLISH FOR TESTING"
        }]
        
        print(f'📝 Datos a enviar: {json.dumps(test_data, indent=2)}')
        
        # Crear request PUT
        req = urllib.request.Request(url, data=json.dumps(test_data).encode('utf-8'))
        req.add_header('Content-Type', 'application/json')
        req.get_method = lambda: 'PUT'
        
        # Hacer la petición
        with urllib.request.urlopen(req) as response:
            data = response.read()
            status_code = response.getcode()
            
            print(f'📊 Status Code: {status_code}')
            
            if status_code == 200:
                try:
                    json_data = json.loads(data.decode('utf-8'))
                    print(f'✅ ÉXITO: Importes actualizados')
                    print(f'📝 Mensaje: {json_data.get("message", "NO ENCONTRADO")}')
                except json.JSONDecodeError as e:
                    print(f'❌ Error decodificando JSON: {e}')
                    print(f'📝 Response raw: {data.decode("utf-8")}')
            else:
                print(f'❌ ERROR: {status_code}')
                print(f'📝 Response: {data.decode("utf-8")}')
                
    except urllib.error.HTTPError as e:
        print(f'❌ Error HTTP: {e.code}')
        print(f'📝 Response: {e.read().decode("utf-8")}')
    except urllib.error.URLError as e:
        print(f'❌ Error de URL: {e}')
    except Exception as e:
        print(f'❌ Error durante el test: {e}')

def main():
    print('🧪 TEST ENDPOINTS DE ENTIDADES RELACIONADAS')
    print('=' * 80)
    
    test_endpoint_entidades()
    test_endpoint_importes()
    
    print('\n🎯 TEST COMPLETADO')

if __name__ == "__main__":
    main()

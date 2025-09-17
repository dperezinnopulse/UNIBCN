import urllib.request
import urllib.error
import json

def test_endpoint_put_simple():
    print('🧪 TEST ENDPOINT PUT SIMPLE - Solo campos básicos')
    print('=' * 60)
    
    try:
        url = "http://localhost:5001/api/actividades/60"
        print(f'🌐 Probando PUT: {url}')
        
        # Solo campos básicos que SÍ existen en el modelo Actividad
        test_data = {
            "Titulo": "TÍTULO DE PRUEBA PUT SIMPLE",
            "Codigo": "CODIGO-PUT-SIMPLE-001",
            "Coordinador": "Coordinador PUT Simple de Prueba"
        }
        
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
                    print(f'✅ ÉXITO: Actividad actualizada')
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

if __name__ == "__main__":
    test_endpoint_put_simple()

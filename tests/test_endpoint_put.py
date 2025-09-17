import urllib.request
import urllib.error
import json

def test_endpoint_put():
    print('🧪 TEST ENDPOINT PUT - Verificar que actualiza actividad')
    print('=' * 70)
    
    try:
        # Test del endpoint PUT - PUERTO CORREGIDO: 5001 (HTTP)
        url = "http://localhost:5001/api/actividades/60"
        print(f'🌐 Probando PUT: {url}')
        
        # Datos de prueba
        test_data = {
            "Titulo": "TÍTULO DE PRUEBA PUT",
            "Codigo": "CODIGO-PUT-001",
            "Coordinador": "Coordinador PUT de Prueba",
            "JefeUnidadGestora": "Jefe PUT de Prueba",
            "GestorActividad": "Gestor PUT de Prueba"
        }
        
        # Crear request PUT (HTTP, no HTTPS)
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
                    print(f'📝 Timestamp: {json_data.get("timestamp", "NO ENCONTRADO")}')
                    
                    # Verificar que se actualizó
                    if json_data.get("actividad"):
                        actividad = json_data["actividad"]
                        print(f'📝 Título actualizado: {actividad.get("titulo", "NO ENCONTRADO")}')
                        print(f'📝 Código actualizado: {actividad.get("codigo", "NO ENCONTRADO")}')
                        print(f'📝 Coordinador actualizado: {actividad.get("coordinador", "NO ENCONTRADO")}')
                    
                except json.JSONDecodeError as e:
                    print(f'❌ Error decodificando JSON: {e}')
                    print(f'📝 Response raw: {data.decode("utf-8")}')
            else:
                print(f'❌ ERROR: {status_code}')
                print(f'📝 Response: {data.decode("utf-8")}')
                
    except urllib.error.URLError as e:
        print(f'❌ Error de URL: {e}')
    except Exception as e:
        print(f'❌ Error durante el test: {e}')

if __name__ == "__main__":
    test_endpoint_put()

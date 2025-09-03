import urllib.request
import urllib.error
import json

def test_endpoint_get():
    print('🧪 TEST ENDPOINT GET - Verificar que carga datos de actividad')
    print('=' * 70)
    
    try:
        # Test del endpoint GET - PUERTO CORREGIDO: 5001 (HTTP)
        url = "http://localhost:5001/api/actividades/60"
        print(f'🌐 Probando GET: {url}')
        
        # Crear request
        req = urllib.request.Request(url)
        
        # Hacer la petición
        with urllib.request.urlopen(req) as response:
            data = response.read()
            status_code = response.getcode()
            
            print(f'📊 Status Code: {status_code}')
            print(f'📊 Headers: {dict(response.headers)}')
            
            if status_code == 200:
                try:
                    json_data = json.loads(data.decode('utf-8'))
                    print(f'✅ ÉXITO: Datos recibidos')
                    print(f'📝 Título: {json_data.get("titulo", "NO ENCONTRADO")}')
                    print(f'📝 Código: {json_data.get("codigo", "NO ENCONTRADO")}')
                    print(f'📝 Descripción: {json_data.get("descripcion", "NO ENCONTRADO")}')
                    print(f'📝 Coordinador: {json_data.get("coordinador", "NO ENCONTRADO")}')
                    print(f'📝 Jefe Unidad Gestora: {json_data.get("jefeUnidadGestora", "NO ENCONTRADO")}')
                    print(f'📝 Gestor Actividad: {json_data.get("gestorActividad", "NO ENCONTRADO")}')
                    print(f'📝 Centro UB Destinataria: {json_data.get("centroUnidadUBDestinataria", "NO ENCONTRADO")}')
                    print(f'📝 Modalidad Gestión: {json_data.get("modalidadGestion", "NO ENCONTRADO")}')
                    print(f'📝 Centro Trabajo Requerido: {json_data.get("centroTrabajoRequerido", "NO ENCONTRADO")}')
                    
                    # Contar campos con valor
                    campos_con_valor = sum(1 for v in json_data.values() if v is not None and v != "")
                    total_campos = len(json_data)
                    
                    print(f'\n📊 RESUMEN:')
                    print(f'  📝 Total de campos: {total_campos}')
                    print(f'  💾 Campos con valor: {campos_con_valor}')
                    print(f'  📊 Porcentaje de campos con valor: {(campos_con_valor / total_campos * 100):.1f}%')
                    
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
    test_endpoint_get()

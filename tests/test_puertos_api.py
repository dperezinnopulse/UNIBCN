import urllib.request
import urllib.error
import json
import ssl

def test_puertos_api():
    print('🧪 TEST PUERTOS API - Verificar en qué puertos responde')
    print('=' * 60)
    
    # Puertos a probar
    puertos_https = [7001, 7004, 7005, 7006, 7007, 7008, 7009, 7010]
    puertos_http = [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008]
    
    # Crear contexto SSL que ignore certificados
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    print('🔍 Probando puertos HTTPS...')
    for puerto in puertos_https:
        try:
            url = f"https://localhost:{puerto}/api/actividades"
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Test-Client/1.0')
            
            with urllib.request.urlopen(req, context=context, timeout=5) as response:
                if response.getcode() == 200:
                    print(f'✅ PUERTO HTTPS {puerto}: RESPONDE')
                    return puerto
                else:
                    print(f'⚠️  PUERTO HTTPS {puerto}: Status {response.getcode()}')
                    
        except urllib.error.URLError as e:
            if "10061" in str(e):  # Connection refused
                print(f'❌ PUERTO HTTPS {puerto}: No responde')
            else:
                print(f'⚠️  PUERTO HTTPS {puerto}: Error {e}')
        except Exception as e:
            print(f'⚠️  PUERTO HTTPS {puerto}: Error inesperado {e}')
    
    print('\n🔍 Probando puertos HTTP...')
    for puerto in puertos_http:
        try:
            url = f"http://localhost:{puerto}/api/actividades"
            req = urllib.request.Request(url)
            req.add_header('User-Agent', 'Test-Client/1.0')
            
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.getcode() == 200:
                    print(f'✅ PUERTO HTTP {puerto}: RESPONDE')
                    return puerto
                else:
                    print(f'⚠️  PUERTO HTTP {puerto}: Status {response.getcode()}')
                    
        except urllib.error.URLError as e:
            if "10061" in str(e):  # Connection refused
                print(f'❌ PUERTO HTTP {puerto}: No responde')
            else:
                print(f'⚠️  PUERTO HTTP {puerto}: Error {e}')
        except Exception as e:
            print(f'⚠️  PUERTO HTTP {puerto}: Error inesperado {e}')
    
    print('\n❌ No se encontró ningún puerto respondiendo')
    return None

if __name__ == "__main__":
    puerto_activo = test_puertos_api()
    if puerto_activo:
        print(f'\n🎯 PUERTO ACTIVO ENCONTRADO: {puerto_activo}')
    else:
        print('\n💡 La API no está ejecutándose en ningún puerto conocido')

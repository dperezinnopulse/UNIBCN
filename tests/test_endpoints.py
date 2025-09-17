import asyncio
import aiohttp
import json

async def test_endpoints():
    print('🔍 TEST ENDPOINTS - VERIFICANDO DISPONIBILIDAD')
    print('=' * 50)
    
    # URLs de prueba
    base_url = "https://localhost:7001"
    
    # Crear contexto SSL que ignore certificados
    connector = aiohttp.TCPConnector(ssl=False)
    
    async with aiohttp.ClientSession(connector=connector) as session:
        
        # Test 1: Verificar que el backend responde
        print('\n🔍 TEST 1: Verificar backend responde')
        try:
            async with session.get(f"{base_url}/api/test") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f'  ✅ Backend responde: {data}')
                else:
                    print(f'  ❌ Backend no responde: {response.status}')
        except Exception as e:
            print(f'  💥 Error conectando al backend: {e}')
            return
        
        # Test 2: Verificar endpoint GET de participantes
        print('\n🔍 TEST 2: Verificar GET participantes')
        try:
            async with session.get(f"{base_url}/api/actividades/60/participantes") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f'  ✅ GET participantes funciona: {len(data)} participantes')
                else:
                    print(f'  ❌ GET participantes falla: {response.status}')
        except Exception as e:
            print(f'  💥 Error en GET participantes: {e}')
        
        # Test 3: Verificar endpoint PUT de participantes (método OPTIONS)
        print('\n🔍 TEST 3: Verificar PUT participantes (OPTIONS)')
        try:
            async with session.options(f"{base_url}/api/participantes/29") as response:
                print(f'  📊 OPTIONS participantes: {response.status}')
                if response.status == 200:
                    print('  ✅ PUT participantes disponible')
                else:
                    print('  ❌ PUT participantes no disponible')
        except Exception as e:
            print(f'  💥 Error en OPTIONS participantes: {e}')
        
        # Test 4: Verificar endpoint PUT de subactividades (método OPTIONS)
        print('\n🔍 TEST 4: Verificar PUT subactividades (OPTIONS)')
        try:
            async with session.options(f"{base_url}/api/subactividades/25") as response:
                print(f'  📊 OPTIONS subactividades: {response.status}')
                if response.status == 200:
                    print('  ✅ PUT subactividades disponible')
                else:
                    print('  ❌ PUT subactividades no disponible')
        except Exception as e:
            print(f'  💥 Error en OPTIONS subactividades: {e}')
        
        # Test 5: Intentar PUT real de participantes
        print('\n🔍 TEST 5: Intentar PUT real de participantes')
        try:
            test_data = {
                "nombre": "Test Participante",
                "email": "test@test.com",
                "rol": "Test"
            }
            async with session.put(f"{base_url}/api/participantes/29", json=test_data) as response:
                print(f'  📊 PUT participantes real: {response.status}')
                if response.status == 200:
                    print('  ✅ PUT participantes funciona')
                elif response.status == 404:
                    print('  ❌ PUT participantes: 404 Not Found')
                else:
                    print(f'  ⚠️ PUT participantes: {response.status}')
                    try:
                        error_text = await response.text()
                        print(f'    Error: {error_text}')
                    except:
                        pass
        except Exception as e:
            print(f'  💥 Error en PUT participantes: {e}')
        
        # Test 6: Intentar PUT real de subactividades
        print('\n🔍 TEST 6: Intentar PUT real de subactividades')
        try:
            test_data = {
                "titulo": "Test Subactividad",
                "descripcion": "Test descripción",
                "modalidad": "Presencial",
                "docente": "Test Docente",
                "idioma": "Español",
                "fechaInicio": "2025-01-01",
                "fechaFin": "2025-01-01",
                "duracion": 2,
                "horaInicio": "09:00",
                "horaFin": "11:00",
                "aforo": 20,
                "ubicacion": "Test Ubicación"
            }
            async with session.put(f"{base_url}/api/subactividades/25", json=test_data) as response:
                print(f'  📊 PUT subactividades real: {response.status}')
                if response.status == 200:
                    print('  ✅ PUT subactividades funciona')
                elif response.status == 404:
                    print('  ❌ PUT subactividades: 404 Not Found')
                else:
                    print(f'  ⚠️ PUT subactividades: {response.status}')
                    try:
                        error_text = await response.text()
                        print(f'    Error: {error_text}')
                    except:
                        pass
        except Exception as e:
            print(f'  💥 Error en PUT subactividades: {e}')

if __name__ == "__main__":
    asyncio.run(test_endpoints())

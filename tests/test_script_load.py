import asyncio
import aiohttp

async def test_script_load():
    print('🔍 TEST SCRIPT LOAD - VERIFICANDO CARGA DEL ARCHIVO')
    print('=' * 60)
    
    async with aiohttp.ClientSession() as session:
        try:
            # Verificar si el archivo scripts.js se puede cargar
            print('🌐 Verificando scripts.js...')
            async with session.get('http://localhost:8080/scripts.js') as response:
                if response.status == 200:
                    print('✅ scripts.js se carga correctamente')
                    content = await response.text()
                    print(f'📊 Tamaño del archivo: {len(content)} caracteres')
                    
                    # Verificar si las funciones están definidas en el contenido
                    funciones = [
                        'function llenarParticipantes',
                        'function llenarSubactividades',
                        'function agregarParticipante',
                        'function agregarSubactividad',
                        'function cargarActividadParaEdicionSinDominios',
                        'function cargarDatosAdicionalesSinDominios'
                    ]
                    
                    print('\n🔍 VERIFICANDO FUNCIONES EN EL ARCHIVO:')
                    for funcion in funciones:
                        if funcion in content:
                            print(f'  ✅ {funcion} encontrada')
                        else:
                            print(f'  ❌ {funcion} NO encontrada')
                    
                    # Verificar exportaciones
                    print('\n🔍 VERIFICANDO EXPORTACIONES:')
                    exportaciones = [
                        'window.llenarParticipantes = llenarParticipantes',
                        'window.llenarSubactividades = llenarSubactividades',
                        'window.agregarParticipante = agregarParticipante',
                        'window.agregarSubactividad = agregarSubactividad'
                    ]
                    
                    for exportacion in exportaciones:
                        if exportacion in content:
                            print(f'  ✅ {exportacion} encontrada')
                        else:
                            print(f'  ❌ {exportacion} NO encontrada')
                    
                else:
                    print(f'❌ Error al cargar scripts.js: {response.status}')
                    
        except Exception as e:
            print(f'❌ Error de conexión: {e}')
    
    return {'success': True}

if __name__ == "__main__":
    asyncio.run(test_script_load())

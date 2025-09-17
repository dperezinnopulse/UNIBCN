import asyncio
import aiohttp

async def test_script_content():
    print('🔍 TEST SCRIPT CONTENT - VERIFICANDO CONTENIDO EXACTO')
    print('=' * 60)
    
    async with aiohttp.ClientSession() as session:
        try:
            # Obtener el contenido del archivo
            print('🌐 Obteniendo contenido de scripts.js...')
            async with session.get('http://localhost:8080/scripts.js') as response:
                if response.status == 200:
                    content = await response.text()
                    print(f'✅ Archivo obtenido correctamente')
                    print(f'📊 Tamaño: {len(content)} caracteres')
                    
                    # Buscar las exportaciones específicas
                    print('\n🔍 BUSCANDO EXPORTACIONES ESPECÍFICAS:')
                    
                    exportaciones = [
                        'window.llenarParticipantes = llenarParticipantes',
                        'window.llenarSubactividades = llenarSubactividades',
                        'window.agregarParticipante = agregarParticipante',
                        'window.agregarSubactividad = agregarSubactividad'
                    ]
                    
                    for exportacion in exportaciones:
                        if exportacion in content:
                            print(f'  ✅ "{exportacion}" encontrada')
                        else:
                            print(f'  ❌ "{exportacion}" NO encontrada')
                    
                    # Buscar las últimas líneas del archivo
                    print('\n🔍 ÚLTIMAS LÍNEAS DEL ARCHIVO:')
                    lines = content.split('\n')
                    last_lines = lines[-20:]  # Últimas 20 líneas
                    
                    for i, line in enumerate(last_lines, len(lines) - 19):
                        print(f'  {i}: {line}')
                    
                    # Buscar si hay algún error de sintaxis
                    print('\n🔍 BUSCANDO POSIBLES ERRORES:')
                    
                    # Buscar llaves no cerradas
                    open_braces = content.count('{')
                    close_braces = content.count('}')
                    print(f'  📊 Llaves abiertas: {open_braces}, cerradas: {close_braces}')
                    
                    if open_braces != close_braces:
                        print(f'  ⚠️ Posible error: Llaves no balanceadas')
                    else:
                        print(f'  ✅ Llaves balanceadas correctamente')
                    
                    # Buscar paréntesis no cerrados
                    open_parens = content.count('(')
                    close_parens = content.count(')')
                    print(f'  📊 Paréntesis abiertos: {open_parens}, cerrados: {close_parens}')
                    
                    if open_parens != close_parens:
                        print(f'  ⚠️ Posible error: Paréntesis no balanceados')
                    else:
                        print(f'  ✅ Paréntesis balanceados correctamente')
                    
                else:
                    print(f'❌ Error al obtener archivo: {response.status}')
                    
        except Exception as e:
            print(f'❌ Error de conexión: {e}')
    
    return {'success': True}

if __name__ == "__main__":
    asyncio.run(test_script_content())

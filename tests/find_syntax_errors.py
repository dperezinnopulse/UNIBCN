import asyncio
import aiohttp

async def find_syntax_errors():
    print('🔍 FIND SYNTAX ERRORS - BUSCANDO ERRORES DE SINTAXIS')
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
                    
                    # Buscar paréntesis y llaves no balanceados
                    lines = content.split('\n')
                    
                    # Contadores por línea
                    brace_stack = []
                    paren_stack = []
                    
                    print('\n🔍 ANALIZANDO SINTAXIS LÍNEA POR LÍNEA:')
                    
                    for i, line in enumerate(lines, 1):
                        for j, char in enumerate(line):
                            if char == '{':
                                brace_stack.append((i, j, '{'))
                            elif char == '}':
                                if brace_stack and brace_stack[-1][2] == '{':
                                    brace_stack.pop()
                                else:
                                    print(f'  ❌ Línea {i}, columna {j}: Llave de cierre sin apertura')
                            
                            elif char == '(':
                                paren_stack.append((i, j, '('))
                            elif char == ')':
                                if paren_stack and paren_stack[-1][2] == '(':
                                    paren_stack.pop()
                                else:
                                    print(f'  ❌ Línea {i}, columna {j}: Paréntesis de cierre sin apertura')
                    
                    # Mostrar elementos no cerrados
                    if brace_stack:
                        print(f'\n⚠️ LLAVES NO CERRADAS ({len(brace_stack)}):')
                        for line_num, col_num, char in brace_stack:
                            print(f'  - Línea {line_num}, columna {col_num}: {char}')
                    
                    if paren_stack:
                        print(f'\n⚠️ PARÉNTESIS NO CERRADOS ({len(paren_stack)}):')
                        for line_num, col_num, char in paren_stack:
                            print(f'  - Línea {line_num}, columna {col_num}: {char}')
                    
                    if not brace_stack and not paren_stack:
                        print('\n✅ No se encontraron errores de sintaxis evidentes')
                    
                    # Mostrar las últimas líneas para verificar
                    print(f'\n🔍 ÚLTIMAS 10 LÍNEAS:')
                    for i in range(max(1, len(lines) - 9), len(lines) + 1):
                        if i <= len(lines):
                            print(f'  {i}: {lines[i-1]}')
                    
                else:
                    print(f'❌ Error al obtener archivo: {response.status}')
                    
        except Exception as e:
            print(f'❌ Error de conexión: {e}')

if __name__ == "__main__":
    asyncio.run(find_syntax_errors())

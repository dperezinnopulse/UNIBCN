import asyncio
from playwright.async_api import async_playwright

async def verificar_endpoints_actividad_60():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(ignore_https_errors=True)
        page = await context.new_page()
        
        print('🔍 VERIFICANDO ENDPOINTS DE LA ACTIVIDAD 60')
        print('=' * 60)
        
        # Lista de endpoints a verificar
        endpoints = [
            '/api/actividades/60',
            '/api/actividades/60/subactividades',
            '/api/actividades/60/participantes',
            '/api/actividades/60/entidades-organizadoras',
            '/api/actividades/60/importes-descuentos'
        ]
        
        resultados = {}
        
        for endpoint in endpoints:
            print(f'\n🌐 Verificando: {endpoint}')
            try:
                # Hacer la llamada a la API
                response = await page.request.get(f'https://localhost:7001{endpoint}')
                
                print(f'  📊 Status: {response.status}')
                
                if response.status == 200:
                    data = await response.json()
                    resultados[endpoint] = {
                        'status': response.status,
                        'data': data,
                        'count': len(data) if isinstance(data, list) else 'N/A'
                    }
                    
                    if isinstance(data, list):
                        print(f'  ✅ Datos encontrados: {len(data)} elementos')
                        if len(data) > 0:
                            print(f'  📋 Primer elemento: {data[0]}')
                    else:
                        print(f'  ✅ Datos encontrados: {type(data).__name__}')
                        print(f'  📋 Datos: {data}')
                else:
                    resultados[endpoint] = {
                        'status': response.status,
                        'error': f'HTTP {response.status}'
                    }
                    print(f'  ❌ Error: HTTP {response.status}')
                    
            except Exception as e:
                resultados[endpoint] = {
                    'status': 'ERROR',
                    'error': str(e)
                }
                print(f'  💥 Excepción: {e}')
        
        print('\n📊 RESUMEN DE ENDPOINTS:')
        print('=' * 60)
        
        for endpoint, resultado in resultados.items():
            status = resultado['status']
            if status == 200:
                count = resultado['count']
                print(f'✅ {endpoint}: {count} elementos')
            else:
                error = resultado.get('error', 'Error desconocido')
                print(f'❌ {endpoint}: {error}')
        
        # Verificar datos específicos
        print('\n🔍 DATOS ESPECÍFICOS:')
        print('=' * 60)
        
        if '/api/actividades/60' in resultados and resultados['/api/actividades/60']['status'] == 200:
            actividad = resultados['/api/actividades/60']['data']
            print(f'📋 Actividad 60:')
            print(f'  - Título: {actividad.get("titulo", "N/A")}')
            print(f'  - Código: {actividad.get("codigo", "N/A")}')
            print(f'  - Unidad Gestión ID: {actividad.get("unidadGestionId", "N/A")}')
            print(f'  - Tipo Actividad: {actividad.get("tipoActividad", "N/A")}')
            print(f'  - Tipus Estudi SAE: {actividad.get("tipusEstudiSAE", "N/A")}')
            print(f'  - Categoria SAE: {actividad.get("categoriaSAE", "N/A")}')
        
        if '/api/actividades/60/subactividades' in resultados and resultados['/api/actividades/60/subactividades']['status'] == 200:
            subactividades = resultados['/api/actividades/60/subactividades']['data']
            print(f'\n📋 Subactividades ({len(subactividades)}):')
            for i, sub in enumerate(subactividades, 1):
                print(f'  {i}. {sub.get("titulo", "Sin título")} - {sub.get("descripcion", "Sin descripción")}')
        
        if '/api/actividades/60/participantes' in resultados and resultados['/api/actividades/60/participantes']['status'] == 200:
            participantes = resultados['/api/actividades/60/participantes']['data']
            print(f'\n👥 Participantes ({len(participantes)}):')
            for i, part in enumerate(participantes, 1):
                print(f'  {i}. {part.get("nombre", "Sin nombre")} - {part.get("email", "Sin email")}')
        
        if '/api/actividades/60/entidades-organizadoras' in resultados and resultados['/api/actividades/60/entidades-organizadoras']['status'] == 200:
            entidades = resultados['/api/actividades/60/entidades-organizadoras']['data']
            print(f'\n🏢 Entidades Organizadoras ({len(entidades)}):')
            for i, ent in enumerate(entidades, 1):
                print(f'  {i}. {ent.get("nombre", "Sin nombre")} - {ent.get("nif", "Sin NIF")}')
        
        if '/api/actividades/60/importes-descuentos' in resultados and resultados['/api/actividades/60/importes-descuentos']['status'] == 200:
            importes = resultados['/api/actividades/60/importes-descuentos']['data']
            print(f'\n💰 Importes y Descuentos ({len(importes)}):')
            for i, imp in enumerate(importes, 1):
                print(f'  {i}. Base: {imp.get("base", "N/A")} - Tipo: {imp.get("tipo", "N/A")} - Descuento: {imp.get("descuentoPorcentaje", "N/A")}%')
        
        await browser.close()
        
        return resultados

if __name__ == "__main__":
    result = asyncio.run(verificar_endpoints_actividad_60())
    print(f'\n🎯 VERIFICACIÓN COMPLETADA')

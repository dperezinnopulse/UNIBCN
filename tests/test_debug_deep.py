import asyncio
from playwright.async_api import async_playwright
import json
import time

async def test_debug_deep():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Capturar todos los logs de consola con timestamps
        console_logs = []
        def handle_console_msg(msg):
            timestamp = time.time()
            log_entry = {
                'timestamp': timestamp,
                'type': msg.type,
                'text': msg.text,
                'formatted_time': time.strftime('%H:%M:%S.%f', time.localtime(timestamp))[:-3]
            }
            console_logs.append(log_entry)
            print(f"[{log_entry['formatted_time']}] [{msg.type.upper()}] {msg.text}")
        
        page.on("console", handle_console_msg)
        
        # Capturar errores de red
        page.on("response", lambda response: print(f"🌐 {response.status} {response.url}") if not response.ok else None)
        
        print("🔍 Navegando a editar-actividad.html...")
        start_time = time.time()
        await page.goto("http://localhost:8080/editar-actividad.html?id=60")
        
        print("⏳ Esperando carga de página...")
        await page.wait_for_load_state("domcontentloaded")
        await asyncio.sleep(5)  # Esperar 5 segundos para ver todos los logs
        
        print(f"\n📊 ESTADO FINAL DESPUÉS DE {time.time() - start_time:.1f} SEGUNDOS:")
        
        # Verificar dropdowns específicos
        dropdowns_to_check = [
            'tipoActividad', 'lineaEstrategica', 'objetivoEstrategico', 
            'actividadReservada', 'modalidadGestion', 'centroUnidadUBDestinataria'
        ]
        
        for dropdown_id in dropdowns_to_check:
            try:
                dropdown = page.locator(f"#{dropdown_id}")
                if await dropdown.count() > 0:
                    options_count = await dropdown.locator("option").count()
                    if options_count > 0:
                        first_option = await dropdown.locator("option").first.text_content()
                        if options_count > 1:
                            second_option = await dropdown.locator("option").nth(1).text_content()
                            print(f"📊 {dropdown_id}: {options_count} opciones - '{first_option}', '{second_option}'")
                        else:
                            print(f"📊 {dropdown_id}: {options_count} opciones - '{first_option}'")
                    else:
                        print(f"❌ {dropdown_id}: Sin opciones")
                else:
                    print(f"❌ {dropdown_id}: Elemento no encontrado")
                    
            except Exception as e:
                print(f"❌ Error verificando {dropdown_id}: {e}")
        
        # Verificar si la API está disponible
        try:
            api_available = await page.evaluate("typeof api !== 'undefined'")
            print(f"\n🔍 API disponible: {api_available}")
            
            if api_available:
                api_has_function = await page.evaluate("typeof api.getValoresDominio === 'function'")
                print(f"🔍 api.getValoresDominio disponible: {api_has_function}")
                
        except Exception as e:
            print(f"❌ Error verificando API: {e}")
        
        # Guardar logs detallados
        with open("debug_deep_logs.json", "w", encoding="utf-8") as f:
            json.dump(console_logs, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 {len(console_logs)} logs guardados en debug_deep_logs.json")
        
        # Mostrar resumen de logs por tipo
        log_types = {}
        for log in console_logs:
            log_types[log['type']] = log_types.get(log['type'], 0) + 1
        
        print("📈 Resumen de logs:")
        for log_type, count in log_types.items():
            print(f"  {log_type}: {count}")
        
        # Buscar logs específicos de dominios
        dominio_logs = [log for log in console_logs if 'dominio' in log['text'].lower() or 'getvaloresdominio' in log['text'].lower()]
        print(f"\n🔍 Logs relacionados con dominios: {len(dominio_logs)}")
        for log in dominio_logs[-5:]:  # Mostrar últimos 5
            print(f"  [{log['formatted_time']}] {log['text']}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_debug_deep())

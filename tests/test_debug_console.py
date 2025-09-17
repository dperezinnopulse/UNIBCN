import asyncio
from playwright.async_api import async_playwright
import json
import time

async def debug_console_logs():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        
        # Capturar logs de consola
        console_logs = []
        def handle_console_msg(msg):
            console_logs.append({
                'type': msg.type,
                'text': msg.text,
                'timestamp': time.time()
            })
            print(f"[{msg.type.upper()}] {msg.text}")
        
        page.on("console", handle_console_msg)
        
        print("🔍 Navegando a editar-actividad.html...")
        await page.goto("http://localhost:8080/editar-actividad.html?id=60")
        
        # Esperar a que la página se cargue completamente
        print("⏳ Esperando carga completa...")
        await asyncio.sleep(10)  # Esperar 10 segundos para ver todos los logs
        
        print("\n🔍 Verificando estado final de dropdowns...")
        
        # Verificar dropdowns específicos
        dropdowns = [
            'tipoActividad', 'lineaEstrategica', 'objetivoEstrategico', 
            'actividadReservada', 'modalidadGestion', 'centroUnidadUBDestinataria',
            'actividadUnidadGestion'
        ]
        
        for dropdown_id in dropdowns:
            try:
                dropdown = await page.locator(f"#{dropdown_id}").first
                options_count = await dropdown.locator("option").count()
                print(f"📊 {dropdown_id}: {options_count} opciones")
                
                if options_count > 0:
                    # Obtener todas las opciones
                    options = await dropdown.locator("option").all()
                    option_texts = []
                    for option in options:
                        text = await option.text_content()
                        value = await option.get_attribute("value")
                        option_texts.append(f"{value}:{text}")
                    print(f"   Opciones: {option_texts[:3]}...")  # Mostrar solo las primeras 3
                
                # Verificar valor seleccionado
                selected_value = await dropdown.input_value()
                print(f"   Valor seleccionado: '{selected_value}'")
                
            except Exception as e:
                print(f"❌ Error verificando {dropdown_id}: {e}")
        
        # Guardar logs
        with open("debug_console_logs.json", "w", encoding="utf-8") as f:
            json.dump(console_logs, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 {len(console_logs)} logs de consola guardados en debug_console_logs.json")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_console_logs())

#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright
import json

async def test_test_simple():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print("🚀 Iniciando test para test-simple.html...")
        
        try:
            # Navegar a la página
            await page.goto("http://localhost:8080/test-simple.html")
            await page.wait_for_load_state("networkidle")
            
            # Esperar a que se carguen los scripts
            await asyncio.sleep(2)
            
            # Verificar si los dropdowns tienen opciones
            dropdowns = ['tipoActividad', 'lineaEstrategica']
            fallos = []
            
            for dropdown_id in dropdowns:
                try:
                    # Verificar si el elemento existe
                    dropdown = page.locator(f"#{dropdown_id}")
                    if await dropdown.count() == 0:
                        fallos.append(f"{dropdown_id} (no encontrado)")
                        continue
                    
                    # Verificar número de opciones
                    options_count = await dropdown.locator("option").count()
                    print(f"📊 {dropdown_id}: {options_count} opciones")
                    
                    if options_count <= 1:  # Solo la opción por defecto o ninguna
                        fallos.append(dropdown_id)
                    else:
                        print(f"✅ {dropdown_id}: {options_count} opciones cargadas correctamente")
                        
                except Exception as e:
                    print(f"❌ Error verificando {dropdown_id}: {e}")
                    fallos.append(dropdown_id)
            
            # Resultado del test
            if fallos:
                print(f"❌ test-simple.html: fallos: {fallos}")
            else:
                print("✅ test-simple.html: todos los dropdowns cargados correctamente")
                
        except Exception as e:
            print(f"❌ Error en test: {e}")
            fallos = ['error_general']
        
        await browser.close()
        return fallos

if __name__ == "__main__":
    asyncio.run(test_test_simple())

#!/usr/bin/env python3
"""
Test E2E con Screenshots Automáticos - Ciclo de Debugging Visual
Documenta visualmente el estado de dropdowns y campos antes/después de fixes
"""

import asyncio
import json
import os
from datetime import datetime
from playwright.async_api import async_playwright

class TestScreenshotsCiclo:
    def __init__(self):
        self.base_url = "http://localhost:8080"
        self.screenshots_dir = "tests/screenshots"
        self.report = {
            "timestamp": datetime.now().isoformat(),
            "test_run": "Ciclo de Screenshots",
            "pages": {}
        }
        
        # Crear directorio de screenshots
        os.makedirs(self.screenshots_dir, exist_ok=True)
        
    async def run_full_cycle(self):
        """Ejecuta un ciclo completo de screenshots documentando el estado"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
            
            print("🎬 Iniciando ciclo de screenshots documentado...")
            print("=" * 60)
            
            # Test todas las páginas principales
            pages_to_test = [
                {"name": "index", "url": f"{self.base_url}/index.html", "description": "Página principal"},
                {"name": "editar-actividad", "url": f"{self.base_url}/editar-actividad.html?id=60", "description": "Edición de actividad"},
                {"name": "test-simple", "url": f"{self.base_url}/test-simple.html", "description": "Página de prueba simple"},
                {"name": "test-formulario", "url": f"{self.base_url}/test-formulario.html", "description": "Formulario de prueba"}
            ]
            
            for page_info in pages_to_test:
                await self.test_page_with_screenshots(context, page_info)
                
            await browser.close()
            
            # Generar reporte final
            await self.generate_report()
            
    async def test_page_with_screenshots(self, context, page_info):
        """Testa una página específica con screenshots en cada etapa"""
        page_name = page_info["name"]
        page_url = page_info["url"]
        
        print(f"\n📸 Testing {page_name}: {page_info['description']}")
        print("-" * 50)
        
        page = await context.new_page()
        
        # Capturar logs de consola
        console_logs = []
        page.on('console', lambda msg: console_logs.append({
            'type': msg.type,
            'text': msg.text,
            'timestamp': datetime.now().isoformat()
        }))
        
        # Capturar errores de red
        network_errors = []
        page.on('response', lambda response: 
            network_errors.append({
                'url': response.url,
                'status': response.status,
                'timestamp': datetime.now().isoformat()
            }) if response.status >= 400 else None
        )
        
        try:
            # ETAPA 1: Carga inicial
            print("📌 Etapa 1: Carga inicial de página...")
            await page.goto(page_url, wait_until='domcontentloaded', timeout=10000)
            await page.screenshot(path=f"{self.screenshots_dir}/{page_name}_01_carga_inicial.png", full_page=True)
            
            # ETAPA 2: Esperar un momento para procesos asíncronos
            print("📌 Etapa 2: Esperando procesos asíncronos...")
            await page.wait_for_timeout(2000)
            await page.screenshot(path=f"{self.screenshots_dir}/{page_name}_02_despues_async.png", full_page=True)
            
            # ETAPA 3: Analizar estado de dropdowns
            print("📌 Etapa 3: Analizando dropdowns...")
            dropdown_states = await self.analyze_dropdowns(page)
            
            # Crear screenshot con anotaciones de dropdowns
            await self.screenshot_with_dropdown_info(page, page_name, dropdown_states)
            
            # ETAPA 4: Verificar campos específicos (si es editar-actividad)
            if page_name == "editar-actividad":
                print("📌 Etapa 4: Verificando campos específicos...")
                field_states = await self.analyze_form_fields(page)
                await self.screenshot_with_field_info(page, page_name, field_states)
            
            # ETAPA 5: Screenshot final
            print("📌 Etapa 5: Estado final...")
            await page.wait_for_timeout(1000)
            await page.screenshot(path=f"{self.screenshots_dir}/{page_name}_05_estado_final.png", full_page=True)
            
            # Guardar datos de la página
            self.report["pages"][page_name] = {
                "url": page_url,
                "description": page_info["description"],
                "dropdown_states": dropdown_states,
                "console_logs": console_logs[-10:],  # Últimos 10 logs
                "network_errors": network_errors,
                "screenshots": [
                    f"{page_name}_01_carga_inicial.png",
                    f"{page_name}_02_despues_async.png", 
                    f"{page_name}_03_dropdowns_analysis.png",
                    f"{page_name}_05_estado_final.png"
                ],
                "status": "✅ OK" if len(network_errors) == 0 and all(dd["options_count"] > 1 for dd in dropdown_states.values()) else "❌ ISSUES"
            }
            
            print(f"✅ {page_name}: {len(dropdown_states)} dropdowns analizados, {len(console_logs)} logs capturados")
            
        except Exception as e:
            print(f"❌ Error en {page_name}: {str(e)}")
            await page.screenshot(path=f"{self.screenshots_dir}/{page_name}_ERROR.png", full_page=True)
            self.report["pages"][page_name] = {
                "url": page_url,
                "error": str(e),
                "status": "❌ ERROR"
            }
        finally:
            await page.close()
    
    async def analyze_dropdowns(self, page):
        """Analiza el estado de todos los dropdowns en la página"""
        dropdown_ids = [
            'tipoActividad', 'lineaEstrategica', 'objetivoEstrategico',
            'actividadReservada', 'modalidadGestion', 'centroUnidadUBDestinataria',
            'actividadUnidadGestion'
        ]
        
        dropdown_states = {}
        
        for dropdown_id in dropdown_ids:
            try:
                select = page.locator(f'#{dropdown_id}')
                if await select.count() > 0:
                    options = await select.locator('option').all()
                    options_text = []
                    for option in options:
                        text = await option.text_content()
                        options_text.append(text.strip() if text else "")
                    
                    dropdown_states[dropdown_id] = {
                        "exists": True,
                        "options_count": len(options),
                        "options_preview": options_text[:3],  # Primeras 3 opciones
                        "status": "✅ OK" if len(options) > 1 else "❌ VACÍO"
                    }
                else:
                    dropdown_states[dropdown_id] = {
                        "exists": False,
                        "status": "❌ NO EXISTE"
                    }
            except Exception as e:
                dropdown_states[dropdown_id] = {
                    "exists": False,
                    "error": str(e),
                    "status": "❌ ERROR"
                }
        
        return dropdown_states
    
    async def analyze_form_fields(self, page):
        """Analiza campos específicos del formulario de edición"""
        field_ids = [
            'actividadTitulo', 'actividadCodigo', 'personaSolicitante',
            'coordinador', 'facultadDestinataria'
        ]
        
        field_states = {}
        
        for field_id in field_ids:
            try:
                element = page.locator(f'#{field_id}')
                if await element.count() > 0:
                    value = await element.input_value() if await element.get_attribute('type') != None else await element.text_content()
                    field_states[field_id] = {
                        "exists": True,
                        "has_value": bool(value and value.strip()),
                        "value_preview": (value[:30] + "...") if value and len(value) > 30 else value,
                        "status": "✅ OK" if value and value.strip() else "❌ VACÍO"
                    }
                else:
                    field_states[field_id] = {
                        "exists": False,
                        "status": "❌ NO EXISTE"
                    }
            except Exception as e:
                field_states[field_id] = {
                    "error": str(e),
                    "status": "❌ ERROR"
                }
        
        return field_states
    
    async def screenshot_with_dropdown_info(self, page, page_name, dropdown_states):
        """Crea screenshot con información de dropdowns"""
        # Inyectar información visual en la página
        info_html = self.generate_dropdown_info_html(dropdown_states)
        
        await page.evaluate(f"""
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `{info_html}`;
            infoDiv.style.position = 'fixed';
            infoDiv.style.top = '10px';
            infoDiv.style.right = '10px';
            infoDiv.style.background = 'rgba(0,0,0,0.8)';
            infoDiv.style.color = 'white';
            infoDiv.style.padding = '15px';
            infoDiv.style.borderRadius = '8px';
            infoDiv.style.zIndex = '9999';
            infoDiv.style.fontSize = '12px';
            infoDiv.style.maxWidth = '300px';
            document.body.appendChild(infoDiv);
        """)
        
        await page.screenshot(path=f"{self.screenshots_dir}/{page_name}_03_dropdowns_analysis.png", full_page=True)
    
    async def screenshot_with_field_info(self, page, page_name, field_states):
        """Crea screenshot con información de campos"""
        info_html = self.generate_field_info_html(field_states)
        
        await page.evaluate(f"""
            const infoDiv = document.createElement('div');
            infoDiv.innerHTML = `{info_html}`;
            infoDiv.style.position = 'fixed';
            infoDiv.style.top = '10px';
            infoDiv.style.left = '10px';
            infoDiv.style.background = 'rgba(0,100,0,0.8)';
            infoDiv.style.color = 'white';
            infoDiv.style.padding = '15px';
            infoDiv.style.borderRadius = '8px';
            infoDiv.style.zIndex = '9999';
            infoDiv.style.fontSize = '12px';
            infoDiv.style.maxWidth = '300px';
            document.body.appendChild(infoDiv);
        """)
        
        await page.screenshot(path=f"{self.screenshots_dir}/{page_name}_04_fields_analysis.png", full_page=True)
        
        # Agregar este screenshot al reporte
        if "screenshots" in self.report["pages"].get(page_name, {}):
            self.report["pages"][page_name]["screenshots"].append(f"{page_name}_04_fields_analysis.png")
    
    def generate_dropdown_info_html(self, dropdown_states):
        """Genera HTML con información de dropdowns"""
        html = "<div><h4>📊 Estado Dropdowns</h4>"
        for dropdown_id, state in dropdown_states.items():
            status_icon = "✅" if state.get("status", "").startswith("✅") else "❌"
            options_count = state.get("options_count", 0)
            html += f"<div>{status_icon} {dropdown_id}: {options_count} opciones</div>"
        html += "</div>"
        return html
    
    def generate_field_info_html(self, field_states):
        """Genera HTML con información de campos"""
        html = "<div><h4>📝 Estado Campos</h4>"
        for field_id, state in field_states.items():
            status_icon = "✅" if state.get("status", "").startswith("✅") else "❌"
            has_value = "SÍ" if state.get("has_value", False) else "NO"
            html += f"<div>{status_icon} {field_id}: {has_value}</div>"
        html += "</div>"
        return html
    
    async def generate_report(self):
        """Genera reporte final con información de screenshots"""
        report_path = f"{self.screenshots_dir}/screenshot_report.json"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.report, f, indent=2, ensure_ascii=False)
        
        # Generar reporte HTML
        html_report = self.generate_html_report()
        html_path = f"{self.screenshots_dir}/screenshot_report.html"
        
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_report)
        
        print("\n" + "=" * 60)
        print("🎯 REPORTE FINAL DE SCREENSHOTS")
        print("=" * 60)
        
        for page_name, page_data in self.report["pages"].items():
            status = page_data.get("status", "❌ ERROR")
            print(f"{status} {page_name}: {page_data.get('description', 'N/A')}")
            
            if "dropdown_states" in page_data:
                dropdowns_ok = sum(1 for dd in page_data["dropdown_states"].values() if dd.get("status", "").startswith("✅"))
                total_dropdowns = len(page_data["dropdown_states"])
                print(f"   📊 Dropdowns: {dropdowns_ok}/{total_dropdowns} OK")
            
            if "screenshots" in page_data:
                print(f"   📸 Screenshots: {len(page_data['screenshots'])} generados")
        
        print(f"\n📁 Screenshots guardados en: {self.screenshots_dir}/")
        print(f"📄 Reporte HTML: {html_path}")
        print(f"📋 Reporte JSON: {report_path}")
    
    def generate_html_report(self):
        """Genera reporte HTML con screenshots embebidos"""
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Screenshots - {self.report['timestamp']}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .page-section {{ margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; }}
        .screenshot {{ margin: 10px 0; }}
        .screenshot img {{ max-width: 100%; border: 1px solid #ccc; }}
        .status-ok {{ color: green; }}
        .status-error {{ color: red; }}
        .dropdown-info, .field-info {{ margin: 10px 0; font-size: 14px; }}
    </style>
</head>
<body>
    <h1>🎬 Reporte de Screenshots - Ciclo de Testing</h1>
    <p><strong>Timestamp:</strong> {self.report['timestamp']}</p>
    
"""
        
        for page_name, page_data in self.report["pages"].items():
            status_class = "status-ok" if page_data.get("status", "").startswith("✅") else "status-error"
            
            html += f"""
    <div class="page-section">
        <h2 class="{status_class}">{page_data.get('status', '❌')} {page_name}</h2>
        <p><strong>URL:</strong> {page_data.get('url', 'N/A')}</p>
        <p><strong>Descripción:</strong> {page_data.get('description', 'N/A')}</p>
        
        <h3>📸 Screenshots</h3>
"""
            
            if "screenshots" in page_data:
                for screenshot in page_data["screenshots"]:
                    html += f"""
        <div class="screenshot">
            <h4>{screenshot}</h4>
            <img src="{screenshot}" alt="{screenshot}">
        </div>
"""
            
            if "dropdown_states" in page_data:
                html += "<h3>📊 Estado de Dropdowns</h3><div class='dropdown-info'>"
                for dropdown_id, state in page_data["dropdown_states"].items():
                    status_class = "status-ok" if state.get("status", "").startswith("✅") else "status-error"
                    html += f"<div class='{status_class}'>{state.get('status', '❌')} {dropdown_id}: {state.get('options_count', 0)} opciones</div>"
                html += "</div>"
            
            html += "</div>"
        
        html += """
</body>
</html>
"""
        return html

async def main():
    tester = TestScreenshotsCiclo()
    await tester.run_full_cycle()

if __name__ == "__main__":
    asyncio.run(main())

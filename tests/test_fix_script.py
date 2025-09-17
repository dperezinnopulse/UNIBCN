#!/usr/bin/env python3
"""
Tests rápidos para validar errores comunes en la edición de actividad
"""

import asyncio
import json
import time
from playwright.async_api import async_playwright
import os

class TestRapido:
    def __init__(self):
        self.base_url = "http://localhost:8080"
        self.actividad_id = "60"
        self.results = {
            "tests": [],
            "summary": {
                "total": 0,
                "passed": 0,
                "failed": 0,
                "errors": []
            }
        }
    
    def log_test(self, test_name, status, details=""):
        test_result = {
            "name": test_name,
            "status": status,
            "details": details,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.results["tests"].append(test_result)
        self.results["summary"]["total"] += 1
        if status == "PASSED":
            self.results["summary"]["passed"] += 1
            print(f"✅ {test_name}: {details}")
        else:
            self.results["summary"]["failed"] += 1
            self.results["summary"]["errors"].append(f"{test_name}: {details}")
            print(f"❌ {test_name}: {details}")
    
    async def test_urls_api(self, page):
        try:
            bad_urls = []
            def handle_request(request):
                if "api" in request.url and "undefined" in request.url:
                    bad_urls.append(request.url)
            page.on("request", handle_request)
            await page.goto(f"{self.base_url}/editar-actividad.html?id={self.actividad_id}")
            await page.wait_for_load_state("networkidle", timeout=15000)
            if bad_urls:
                self.log_test("URLs con undefined", "FAILED", str(bad_urls))
            else:
                self.log_test("URLs con undefined", "PASSED", "Ninguna")
        except Exception as e:
            self.log_test("URLs con undefined", "FAILED", str(e))
    
    async def test_dropdowns_clave(self, page):
        try:
            await page.wait_for_timeout(2000)
            dropdowns = ["actividadUnidadGestion", "modalidadGestion", "tipoActividad"]
            vacios = []
            for dd in dropdowns:
                el = await page.query_selector(f"#{dd}")
                if not el:
                    vacios.append(f"{dd} (no encontrado)")
                    continue
                # comprobar opciones
                opts = await el.query_selector_all('option')
                if len(opts) <= 1:
                    vacios.append(dd)
            if vacios:
                self.log_test("Dropdowns clave", "FAILED", f"Vacíos: {vacios}")
            else:
                self.log_test("Dropdowns clave", "PASSED", "Todos con opciones")
        except Exception as e:
            self.log_test("Dropdowns clave", "FAILED", str(e))
    
    async def run_all(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            try:
                await self.test_urls_api(page)
                await self.test_dropdowns_clave(page)
            finally:
                await browser.close()
        os.makedirs('tests', exist_ok=True)
        with open('tests/test_quick_report.json','w',encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)

async def main():
    t = TestRapido()
    await t.run_all()

if __name__ == "__main__":
    asyncio.run(main())

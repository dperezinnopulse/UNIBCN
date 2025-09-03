#!/usr/bin/env python3
"""
Tests E2E para validar la edición de actividades
Valida que todos los campos se carguen correctamente y no haya errores
"""

import asyncio
import json
import time
from playwright.async_api import async_playwright, expect
import os
import sys

class TestEdicionActividad:
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
        """Registra el resultado de un test"""
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
    
    async def test_carga_pagina(self, page):
        """Test 1: Verificar que la página carga correctamente"""
        try:
            await page.goto(f"{self.base_url}/editar-actividad.html?id={self.actividad_id}")
            await page.wait_for_load_state("networkidle", timeout=15000)
            
            self.log_test("Carga de página", "PASSED", "Página cargada sin errores críticos")
            return True
            
        except Exception as e:
            self.log_test("Carga de página", "FAILED", f"Error: {str(e)}")
            return False
    
    async def test_dropdowns_cargados(self, page):
        """Test 2: Verificar que los dropdowns se cargan con datos"""
        try:
            dropdowns_to_check = [
                "tipoActividad",
                "lineaEstrategica", 
                "objetivoEstrategico",
                "actividadReservada",
                "modalidadGestion",
                "centroUnidadUBDestinataria",
                "actividadUnidadGestion"
            ]
            
            empty_dropdowns = []
            for dropdown_id in dropdowns_to_check:
                element = await page.query_selector(f"#{dropdown_id}")
                if element:
                    options = await element.query_selector_all("option")
                    if len(options) <= 1:
                        empty_dropdowns.append(dropdown_id)
                else:
                    empty_dropdowns.append(f"{dropdown_id} (no encontrado)")
            
            if empty_dropdowns:
                self.log_test("Dropdowns cargados", "FAILED", f"Dropdowns vacíos: {empty_dropdowns}")
                return False
            
            self.log_test("Dropdowns cargados", "PASSED", f"Todos los dropdowns tienen opciones")
            return True
            
        except Exception as e:
            self.log_test("Dropdowns cargados", "FAILED", f"Error: {str(e)}")
            return False
    
    async def test_urls_api(self, page):
        """Test 3: Verificar que las URLs de API no contienen 'undefined'"""
        try:
            api_requests_with_undefined = []
            
            def handle_request(request):
                if "api" in request.url and "undefined" in request.url:
                    api_requests_with_undefined.append(request.url)
            
            page.on("request", handle_request)
            
            await page.reload()
            await page.wait_for_load_state("networkidle", timeout=15000)
            
            if api_requests_with_undefined:
                self.log_test("URLs API", "FAILED", f"URLs con 'undefined': {api_requests_with_undefined}")
                return False
            
            self.log_test("URLs API", "PASSED", "No se encontraron URLs con 'undefined'")
            return True
            
        except Exception as e:
            self.log_test("URLs API", "FAILED", f"Error: {str(e)}")
            return False
    
    async def test_campos_problematicos(self, page):
        """Test 4: Verificar que los campos problemáticos no están vacíos"""
        try:
            await page.wait_for_timeout(3000)
            
            problematic_fields = [
                "actividadUnidadGestion",
                "modalidadGestion", 
                "tipoActividad"
            ]
            
            empty_fields = []
            for field_id in problematic_fields:
                element = await page.query_selector(f"#{field_id}")
                if element:
                    selected_option = await element.query_selector("option[selected]") if (await element.get_attribute("tagName")) == "SELECT" else None
                    if selected_option is None:
                        value = await element.input_value()
                        if not value:
                            empty_fields.append(field_id)
                else:
                    empty_fields.append(f"{field_id} (no encontrado)")
            
            if empty_fields:
                self.log_test("Campos problemáticos", "FAILED", f"Campos vacíos: {empty_fields}")
                return False
            
            self.log_test("Campos problemáticos", "PASSED", "Todos los campos problemáticos tienen valores")
            return True
            
        except Exception as e:
            self.log_test("Campos problemáticos", "FAILED", f"Error: {str(e)}")
            return False
    
    async def run_all_tests(self):
        print("🚀 Iniciando tests E2E para edición de actividades...")
        print(f"📋 URL base: {self.base_url}")
        print(f"📌 ID de actividad: {self.actividad_id}")
        print("=" * 60)
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                tests = [
                    self.test_carga_pagina,
                    self.test_dropdowns_cargados,
                    self.test_urls_api,
                    self.test_campos_problematicos
                ]
                
                for test in tests:
                    await test(page)
                    await page.wait_for_timeout(500)
                
            finally:
                await browser.close()
        
        self.generate_report()
    
    def generate_report(self):
        print("\n" + "=" * 60)
        print("📊 REPORTE TESTS E2E (Edición Actividad)")
        print("=" * 60)
        
        summary = self.results["summary"]
        print(f"📈 Total: {summary['total']}")
        print(f"✅ Pasados: {summary['passed']}")
        print(f"❌ Fallidos: {summary['failed']}")
        
        report_file = "tests/test_report.json"
        os.makedirs(os.path.dirname(report_file), exist_ok=True)
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        print(f"📄 Reporte guardado en: {report_file}")

async def main():
    tester = TestEdicionActividad()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())

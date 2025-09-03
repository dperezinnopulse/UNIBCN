#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    base_url = "http://localhost:8080"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(f"{base_url}/test-formulario.html")
            await page.wait_for_load_state("domcontentloaded", timeout=15000)
            await page.wait_for_timeout(2500)
            sel_ids = [
                "tipoActividad",
                "lineaEstrategica",
                "actividadReservada",
                "modalidadGestion",
                "centroUnidadUBDestinataria",
                "imp_tipo"
            ]
            checks = []
            for sel_id in sel_ids:
                el = await page.query_selector(f"#{sel_id}")
                ok = False
                if el:
                    opts = await el.query_selector_all("option")
                    ok = len(opts) > 1
                checks.append((sel_id, ok))
            passed = all(ok for _, ok in checks)
            if not passed:
                print("❌ test-formulario.html: fallos:", [sid for sid, ok in checks if not ok])
            else:
                print("✅ test-formulario.html: dominios cargados")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

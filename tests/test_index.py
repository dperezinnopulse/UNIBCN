#!/usr/bin/env python3
import asyncio
from playwright.async_api import async_playwright

async def main():
    base_url = "http://localhost:8080"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(f"{base_url}/index.html")
            await page.wait_for_load_state("domcontentloaded", timeout=15000)
            # Forzar initializePage si no se autoejecuta
            await page.wait_for_timeout(500)
            await page.evaluate("window.initializePage && window.initializePage()")
            await page.wait_for_load_state("networkidle", timeout=15000)
            await page.wait_for_timeout(1500)

            checks = []
            for sel_id in ["actividadEstado", "actividadUnidadGestion"]:
                el = await page.query_selector(f"#{sel_id}")
                ok = False
                if el:
                    opts = await el.query_selector_all("option")
                    ok = len(opts) > 1
                checks.append((sel_id, ok))
            passed = all(ok for _, ok in checks)
            if not passed:
                print("❌ index.html: fallos:", [sid for sid, ok in checks if not ok])
            else:
                print("✅ index.html: dropdowns cargados")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

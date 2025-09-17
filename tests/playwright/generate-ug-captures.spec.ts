import { test, expect } from '@playwright/test';
import fs from 'fs';

const HOST = process.env.HOST || 'http://localhost:8080';

async function ensureDirs() {
  fs.mkdirSync('test-artifacts/manual/context', { recursive: true });
}

test('Generar capturas UG (context) del DOM real', async ({ page }) => {
  await ensureDirs();

  // Evitar redirección a login
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ub_token', 'E2E');
      localStorage.setItem('ub_user', JSON.stringify({ id: 1, username: 'Admin', rol: 'Admin' }));
    } catch {}
  });

  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });

  // Selector de UG del formulario
  const ugSelect = page.locator('#actividadUnidadGestion');
  await expect(ugSelect).toBeVisible({ timeout: 5000 });

  async function captureLocator(outPath: string, locator) {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) return;
    await page.evaluate(({ x, y, width, height }) => {
      const ov = document.createElement('div');
      ov.id = '__highlight_overlay__';
      ov.style.position = 'fixed';
      ov.style.border = '3px solid #ff3b30';
      ov.style.borderRadius = '6px';
      ov.style.pointerEvents = 'none';
      ov.style.zIndex = '999999';
      const top = Math.max(0, y - window.scrollY);
      const left = Math.max(0, x - window.scrollX);
      ov.style.top = top + 'px';
      ov.style.left = left + 'px';
      ov.style.width = width + 'px';
      ov.style.height = height + 'px';
      document.body.appendChild(ov);
    }, box);
    try { await page.setViewportSize({ width: 1366, height: 900 }); } catch {}
    await page.evaluate((y) => { window.scrollBy({ top: y, left: 0 }); }, Math.max(0, box.y - 120));
    await page.waitForTimeout(150);
    await page.screenshot({ path: outPath });
    await page.evaluate(() => { const ov = document.getElementById('__highlight_overlay__'); if (ov) ov.remove(); });
  }

  // Capturar IDP
  await ugSelect.selectOption({ label: 'IDP' });
  const idp = page.locator('main [data-ug="IDP"]').first();
  await expect(idp).toBeVisible({ timeout: 5000 });
  await captureLocator('test-artifacts/manual/context/ug-idp-seccion-context.png', idp);

  // Capturar CRAI
  await ugSelect.selectOption({ label: 'CRAI' });
  const crai = page.locator('main [data-ug="CRAI"]').first();
  await expect(crai).toBeVisible({ timeout: 5000 });
  await captureLocator('test-artifacts/manual/context/ug-crai-seccion-context.png', crai);

  // Capturar SAE
  await ugSelect.selectOption({ label: 'SAE' });
  const sae = page.locator('main [data-ug="SAE"]').first();
  await expect(sae).toBeVisible({ timeout: 5000 });
  await captureLocator('test-artifacts/manual/context/ug-sae-seccion-context.png', sae);
});

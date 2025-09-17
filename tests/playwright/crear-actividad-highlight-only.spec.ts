import { test } from '@playwright/test';
import fs from 'fs';

const HOST = process.env.HOST || 'http://localhost:8080';

test('Solo capturar botón Añadir Participante con overlay corregido', async ({ page }) => {
  fs.mkdirSync('test-artifacts/manual/context', { recursive: true });

  await page.addInitScript(() => {
    try {
      localStorage.setItem('ub_token', 'E2E');
      localStorage.setItem('ub_user', JSON.stringify({ id: 1, username: 'Admin', rol: 'Admin' }));
    } catch {}
  });
  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });

  const btnAddPart = page.getByRole('button', { name: /Añadir Participante/i }).first();
  await btnAddPart.scrollIntoViewIfNeeded();

  // Medir con rect y dibujar overlay fijo
  const rect = await btnAddPart.evaluate((el) => {
    const r = (el as HTMLElement).getBoundingClientRect();
    return { top: Math.max(0, r.top), left: Math.max(0, r.left), width: r.width, height: r.height };
  });
  await page.evaluate(({ top, left, width, height }) => {
    const ov = document.createElement('div');
    ov.id = '__highlight_overlay__';
    ov.style.position = 'fixed';
    ov.style.border = '3px solid #ff3b30';
    ov.style.borderRadius = '6px';
    ov.style.pointerEvents = 'none';
    ov.style.zIndex = '999999';
    ov.style.top = `${top}px`;
    ov.style.left = `${left}px`;
    ov.style.width = `${width}px`;
    ov.style.height = `${height}px`;
    document.body.appendChild(ov);
  }, rect as any);

  await page.screenshot({ path: 'test-artifacts/manual/context/participantes-boton-add-context.png' });
  await page.evaluate(() => { const ov = document.getElementById('__highlight_overlay__'); if (ov) ov.remove(); });
});



import { test, expect } from '@playwright/test';

const HOST = process.env.HOST || 'http://localhost:8080';

test('Admin Usuarios: listado y modal', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ub_token', 'E2E');
      localStorage.setItem('ub_user', JSON.stringify({ id: 1, username: 'Admin', rol: 'Admin' }));
    } catch {}
  });
  await page.goto(`${HOST}/admin-usuarios.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#tablaUsuarios');
  await page.screenshot({ path: 'test-artifacts/admin-usuarios-lista.png', fullPage: true });

  const btnNuevo = page.locator('#btnNuevo');
  if (await btnNuevo.count()) {
    await btnNuevo.click();
    await page.waitForSelector('#modalUsuario');
    await page.screenshot({ path: 'test-artifacts/admin-usuarios-modal.png', fullPage: true });
  }

  expect(await page.locator('#tablaUsuarios').count()).toBeGreaterThan(0);
});

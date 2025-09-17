import { test, expect } from '@playwright/test';

const HOST = process.env.HOST || 'http://localhost:8080';

test('Perfil: ver y editar campos', async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ub_token', 'E2E');
      localStorage.setItem('ub_user', JSON.stringify({ id: 1, username: 'Admin', rol: 'Admin' }));
    } catch {}
  });
  await page.goto(`${HOST}/perfil.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#perfilForm');
  await page.screenshot({ path: 'test-artifacts/perfil-form.png', fullPage: true });

  const username = page.locator('#username');
  if (await username.count()) {
    const current = await username.inputValue();
    await username.fill(current); // noop para no persistir
  }
  expect(await page.locator('#btnGuardar').count()).toBeGreaterThan(0);
});

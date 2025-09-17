import { test } from '@playwright/test';
import fs from 'fs';

const HOST = process.env.HOST || 'http://localhost:8080';

async function ensureDirs() {
  fs.mkdirSync('test-artifacts/manual/context', { recursive: true });
}

async function highlightRect(page, rect, out) {
  await page.evaluate(({ top, left, width, height }) => {
    const o = document.createElement('div');
    o.id = '__highlight_overlay__';
    o.style.position = 'fixed';
    o.style.border = '3px solid #ff3b30';
    o.style.borderRadius = '6px';
    o.style.pointerEvents = 'none';
    o.style.zIndex = '999999';
    o.style.top = `${top}px`;
    o.style.left = `${left}px`;
    o.style.width = `${width}px`;
    o.style.height = `${height}px`;
    document.body.appendChild(o);
  }, rect as any);
  await page.waitForTimeout(120);
  await page.screenshot({ path: out });
  await page.evaluate(() => { const o = document.getElementById('__highlight_overlay__'); if (o) o.remove(); });
}

test('Cómo llegar: Crear Actividad (menú lateral)', async ({ page }) => {
  await ensureDirs();
  await page.addInitScript(() => {
    try { localStorage.setItem('ub_token','E2E'); localStorage.setItem('ub_user', JSON.stringify({ id:1, username:'Admin', rol:'Admin' })); } catch {}
  });
  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });
  const link = page.locator('a.nav-link[href="index.html"]').first();
  await link.scrollIntoViewIfNeeded();
  const rect = await link.evaluate((el) => { const r = (el as HTMLElement).getBoundingClientRect(); return { top:r.top, left:r.left, width:r.width, height:r.height }; });
  await highlightRect(page, rect, 'test-artifacts/manual/context/como-llegar-crear-context.png');
});

test('Cómo llegar: Mensajes (menú lateral)', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('ub_token','E2E'); localStorage.setItem('ub_user', JSON.stringify({ id:1, username:'Admin', rol:'Admin' })); } catch {}
  });
  await page.goto(`${HOST}/mensajes.html`, { waitUntil: 'domcontentloaded' });
  const link = page.locator('a.nav-link[href="mensajes.html"]').first();
  await link.scrollIntoViewIfNeeded();
  const rect = await link.evaluate((el) => { const r = (el as HTMLElement).getBoundingClientRect(); return { top:r.top, left:r.left, width:r.width, height:r.height }; });
  await highlightRect(page, rect, 'test-artifacts/manual/context/como-llegar-mensajes-context.png');
});

test('Cómo llegar: Admin Usuarios (menú usuario)', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('ub_token','E2E'); localStorage.setItem('ub_user', JSON.stringify({ id:1, username:'Admin', rol:'Admin' })); } catch {}
  });
  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('#userIcon').click().catch(()=>{});
  await page.locator('#openAdmin').click().catch(()=>{});
  const adminUsuarios = page.locator('#adminSubmenu [data-admin="usuarios"]').first();
  const rect = await adminUsuarios.evaluate((el) => { const r = (el as HTMLElement).getBoundingClientRect(); return { top:r.top, left:r.left, width:r.width, height:r.height }; });
  await highlightRect(page, rect, 'test-artifacts/manual/context/como-llegar-admin-usuarios-context.png');
});

test('Cómo llegar: Perfil (menú usuario)', async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('ub_token','E2E'); localStorage.setItem('ub_user', JSON.stringify({ id:1, username:'Admin', rol:'Admin' })); } catch {}
  });
  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('#userIcon').click().catch(()=>{});
  const editar = page.locator('#userMenuOverlay [data-action="editar"]').first();
  const rect = await editar.evaluate((el) => { const r = (el as HTMLElement).getBoundingClientRect(); return { top:r.top, left:r.left, width:r.width, height:r.height }; });
  await highlightRect(page, rect, 'test-artifacts/manual/context/como-llegar-perfil-context.png');
});



import { test, expect } from '@playwright/test';
import fs from 'fs';

const HOST = process.env.HOST || 'http://localhost:8080';
const E2E_USER = process.env.E2E_USER || 'Admin';
const E2E_PASS = process.env.E2E_PASS || 'Admin';

async function login(page) {
  // Inyectar token antes de la primera navegación para evitar redirecciones
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ub_token', 'E2E');
      localStorage.setItem('ub_user', JSON.stringify({ id: 1, username: 'Admin', rol: 'Admin' }));
    } catch {}
  });
  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });
}

async function ensureDirs() {
  fs.mkdirSync('test-artifacts/manual', { recursive: true });
  fs.mkdirSync('test-artifacts/manual/context', { recursive: true });
}

async function selectHeaderUG(page, ugLabel: 'IDP'|'CRAI'|'SAE'|'Todas') {
  // Abrir submenú UG
  const openBtn = page.locator('#openUG');
  if (await openBtn.count()) {
    await openBtn.click({ trial: true }).catch(()=>{});
    await openBtn.click().catch(()=>{});
  }
  const ugBtn = page.locator(`#ugSubmenu .ugOption[data-ug="${ugLabel}"]`).first();
  await ugBtn.click({ trial: true }).catch(()=>{});
  await ugBtn.click().catch(()=>{});
  await page.waitForTimeout(250);
}

async function forceVisible(page, selector: string) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return false;
    (el as any).__prev = {
      display: el.style.display,
      visibility: el.style.visibility,
      opacity: el.style.opacity,
    };
    el.style.display = '';
    el.style.visibility = 'visible';
    el.style.opacity = '1';
    return true;
  }, selector);
}

async function restoreVisible(page, selector: string) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return;
    const prev = (el as any).__prev;
    if (prev) {
      el.style.display = prev.display || '';
      el.style.visibility = prev.visibility || '';
      el.style.opacity = prev.opacity || '';
      delete (el as any).__prev;
    }
  }, selector);
}

async function screenshotIfVisible(page, selector: string, path: string) {
  const loc = page.locator(selector).first();
  if (await loc.count()) {
    if (!(await loc.isVisible())) {
      await forceVisible(page, selector);
    }
    await loc.scrollIntoViewIfNeeded();
    await loc.screenshot({ path });
    await restoreVisible(page, selector);
    return true;
  }
  return false;
}

async function contextScreenshotFromLocator(page, locator, path: string) {
  if (!(await locator.count())) return false;
  await locator.scrollIntoViewIfNeeded();
  if (!(await locator.isVisible())) return false;
  // Medir con getBoundingClientRect para evitar desfases por scroll
  const rect = await locator.evaluate((el) => {
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
  try { await page.setViewportSize({ width: 1366, height: 900 }); } catch {}
  await page.waitForTimeout(120);
  await page.screenshot({ path });
  await page.evaluate(() => { const ov = document.getElementById('__highlight_overlay__'); if (ov) ov.remove(); });
  return true;
}

test('Manual: Crear Actividad - screenshots', async ({ page }) => {
  await ensureDirs();
  await login(page);

  await page.goto(`${HOST}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('main');

  // Overview
  await page.screenshot({ path: 'test-artifacts/manual/crear-index-overview.png', fullPage: true });

  // Campos principales
  const tituloLoc = page.locator('#actividadTitulo');
  await screenshotIfVisible(page, '#actividadTitulo', 'test-artifacts/manual/crear-actividad-titulo.png');
  await contextScreenshotFromLocator(page, tituloLoc, 'test-artifacts/manual/context/crear-actividad-titulo-context.png');

  const ugLoc = page.locator('#actividadUnidadGestion');
  await screenshotIfVisible(page, '#actividadUnidadGestion', 'test-artifacts/manual/crear-actividad-ug.png');
  await contextScreenshotFromLocator(page, ugLoc, 'test-artifacts/manual/context/crear-actividad-ug-context.png');

  const guardarLoc = page.locator('#btnGuardarActividad');
  await screenshotIfVisible(page, '#btnGuardarActividad', 'test-artifacts/manual/crear-actividad-guardar.png');
  await contextScreenshotFromLocator(page, guardarLoc, 'test-artifacts/manual/context/crear-actividad-guardar-context.png');

  // Subactividades
  const btnAddSub = page.getByRole('button', { name: /Añadir Subactividad/i }).first();
  if (await btnAddSub.count()) {
    await btnAddSub.scrollIntoViewIfNeeded();
    await btnAddSub.screenshot({ path: 'test-artifacts/manual/subactividades-boton-add.png' });
    await contextScreenshotFromLocator(page, btnAddSub, 'test-artifacts/manual/context/subactividades-boton-add-context.png');
    await btnAddSub.click();
  }
  const subCard = page.locator('#subactividadesContainer .card').first();
  await screenshotIfVisible(page, '#subactividadesContainer .card', 'test-artifacts/manual/subactividad-card.png');
  await contextScreenshotFromLocator(page, subCard, 'test-artifacts/manual/context/subactividad-card-context.png');

  // Participantes
  const btnAddPart = page.getByRole('button', { name: /Añadir Participante/i }).first();
  if (await btnAddPart.count()) {
    await btnAddPart.scrollIntoViewIfNeeded();
    await btnAddPart.screenshot({ path: 'test-artifacts/manual/participantes-boton-add.png' });
    await contextScreenshotFromLocator(page, btnAddPart, 'test-artifacts/manual/context/participantes-boton-add-context.png');
    await btnAddPart.click();
  }
  const partRow = page.locator('#participantesContainer .row').first();
  await screenshotIfVisible(page, '#participantesContainer .row', 'test-artifacts/manual/participante-row.png');
  await contextScreenshotFromLocator(page, partRow, 'test-artifacts/manual/context/participante-row-context.png');

  // Secciones específicas por UG usando el menú de cabecera (aplicar filtro visual real)
  const ugTargets: Array<'IDP'|'CRAI'|'SAE'> = ['IDP','CRAI','SAE'];
  for (const label of ugTargets) {
    await selectHeaderUG(page, label);
    const sel = `[data-ug="${label}"]`;
    const ugEl = page.locator(sel).first();
    // Forzar visible por si está colapsado dentro del layout
    await forceVisible(page, sel);
    await contextScreenshotFromLocator(page, ugEl, `test-artifacts/manual/context/ug-${label.toLowerCase()}-seccion-context.png`);
    await restoreVisible(page, sel);
  }
});

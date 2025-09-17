import { test, expect } from '@playwright/test';
import fs from 'fs';

const HOST = process.env.HOST || 'http://localhost:8080';

async function ensureDirs() {
  fs.mkdirSync('test-artifacts/manual', { recursive: true });
  fs.mkdirSync('test-artifacts/manual/context', { recursive: true });
}

async function highlightContext(page, locator, outPath: string) {
  await locator.scrollIntoViewIfNeeded();
  if (!(await locator.isVisible())) return false;
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
  await page.waitForTimeout(120);
  await page.screenshot({ path: outPath });
  await page.evaluate(() => { const ov = document.getElementById('__highlight_overlay__'); if (ov) ov.remove(); });
  return true;
}

test('Adjuntos y Cambios de estado: capturas de interfaz', async ({ page }) => {
  await ensureDirs();
  await page.addInitScript(() => {
    try {
      localStorage.setItem('ub_token', 'E2E');
      localStorage.setItem('ub_user', JSON.stringify({ id: 1, username: 'Admin', rol: 'Admin' }));
    } catch {}
  });

  await page.goto(`${HOST}/editar-actividad.html?id=1`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toBeVisible({ timeout: 10000 });

  // Adjuntos - sección
  const adjSection = page.locator('#seccion-adjuntos');
  await expect(adjSection).toBeVisible({ timeout: 10000 });
  await highlightContext(page, adjSection, 'test-artifacts/manual/context/adjuntos-seccion-context.png');

  // Adjuntos - input de archivos
  const inputArchivos = page.locator('#archivosInput');
  await highlightContext(page, inputArchivos, 'test-artifacts/manual/context/adjuntos-input-context.png');

  // Adjuntos - botón subir
  const btnSubir = page.locator('#btnSubirAdjuntos');
  await highlightContext(page, btnSubir, 'test-artifacts/manual/context/adjuntos-subir-context.png');

  // Adjuntos - contenedor lista
  const listaAdj = page.locator('#adjuntosContainer');
  // Si está vacío, inyectar un ejemplo para la captura del manual
  const itemsCount = await listaAdj.locator('.adjunto-item, .card, .list-group-item').count();
  if (itemsCount === 0) {
    await page.evaluate(() => {
      const c = document.getElementById('adjuntosContainer');
      if (!c) return;
      const demo = document.createElement('div');
      demo.className = 'card adjunto-item mb-2';
      demo.innerHTML = `
        <div class="card-body d-flex align-items-center gap-3">
          <i class="bi bi-file-earmark-text" aria-hidden="true"></i>
          <div class="flex-grow-1">
            <div><strong>documento-ejemplo.pdf</strong> <span class="text-muted small">(128 KB)</span></div>
            <div class="small text-muted">Descripción: Ejemplo para el manual</div>
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm">Editar descripción</button>
            <button type="button" class="btn btn-outline-danger btn-sm">Eliminar</button>
          </div>
        </div>`;
      c.appendChild(demo);
    });
  }
  await highlightContext(page, listaAdj, 'test-artifacts/manual/context/adjuntos-lista-context.png');

  // Cambios de estado - badge y botones
  const estadoBadge = page.locator('#estadoBadge');
  await highlightContext(page, estadoBadge, 'test-artifacts/manual/context/cambios-badge-context.png');

  // Abrir modal de cambio de estado
  const btnCambio = page.locator('button[onclick="mostrarModalCambioEstado()"]');
  if (await btnCambio.count()) {
    await btnCambio.click().catch(()=>{});
    const modalCambio = page.locator('#modalCambioEstado .modal-content');
    if (await modalCambio.count()) {
      await highlightContext(page, modalCambio, 'test-artifacts/manual/context/cambios-modal-context.png');
      // Cerrar modal
      const closeBtn = page.locator('#modalCambioEstado .btn-close');
      if (await closeBtn.count()) await closeBtn.click().catch(()=>{});
    }
  }

  // Abrir historial (si existe)
  const btnHist = page.locator('button[onclick="mostrarHistorialEstados()"]');
  if (await btnHist.count()) {
    await btnHist.click().catch(()=>{});
    // Intentar localizar un modal genérico abierto
    const anyModal = page.locator('.modal.show .modal-content').first();
    if (await anyModal.count()) {
      await highlightContext(page, anyModal, 'test-artifacts/manual/context/cambios-historial-context.png');
      const close = page.locator('.modal.show .btn-close').first();
      if (await close.count()) await close.click().catch(()=>{});
    } else {
      // Fallback: inyectar un modal de historial simulado para la captura del manual
      await page.evaluate(() => {
        const html = `
          <div class="modal fade show" id="modalHistorialEstados" style="display:block;" aria-modal="true" role="dialog">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Historial de Cambios de Estado</h5>
                  <button type="button" class="btn-close"></button>
                </div>
                <div class="modal-body">
                  <div class="card mb-3"><div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div><span class="badge bg-secondary me-2">BOR</span> <i class="bi bi-arrow-right"></i> <span class="badge bg-primary ms-2">ENV</span></div>
                      <small class="text-muted">04/09/2025 12:34</small>
                    </div>
                    <div class="mb-2"><strong>De:</strong> Borrador<br><strong>A:</strong> Enviada</div>
                    <div class="mb-2"><strong>Descripción:</strong><br><span class="text-muted">Envío para validación</span></div>
                    <div class="text-muted small"><i class="bi bi-person me-1"></i>Cambiado por Admin (Admin)</div>
                  </div></div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary">Cerrar</button>
                </div>
              </div>
            </div>
          </div>`;
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        document.body.appendChild(wrap);
      });
      const fakeModal = page.locator('#modalHistorialEstados .modal-content');
      await highlightContext(page, fakeModal, 'test-artifacts/manual/context/cambios-historial-context.png');
      // limpiar
      await page.evaluate(() => { const m = document.getElementById('modalHistorialEstados'); if (m) m.remove(); });
    }
  }
});



const { chromium, request } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const backend = 'http://localhost:5001';
  const frontend = 'http://localhost:8080';
  const outDir = path.resolve(__dirname, '..', 'docs', 'manual-usuario', 'assets-root');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const api = await request.newContext({ baseURL: backend });
  const login = await api.post('/api/auth/login', { data: { username: 'Admin', password: '1234' } });
  if (!login.ok()) throw new Error('Login falló: ' + login.status());
  const { token } = await login.json();

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });

  await context.addInitScript((t) => {
    try { localStorage.setItem('ub_token', t); } catch {}
  }, token);

  const page = await context.newPage();

  // Intentar abrir una actividad conocida; si falla, abrir histórico como fallback
  try {
    await page.goto(`${frontend}/editar-actividad.html?id=1`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch {
    await page.goto(`${frontend}/historico.html`, { waitUntil: 'domcontentloaded', timeout: 20000 });
  }

  // Esperar 5s para que desaparezcan toasts/avisos
  await page.waitForTimeout(5000);

  // Resaltar icono de mensajes en la cabecera y capturar pantalla completa (sin pulsar)
  try {
    const box = await page.locator('#mensajesBtn').first().boundingBox();
    if (box) {
      await page.evaluate(({ x, y }) => {
        const d = document.createElement('div');
        d.id = 'hl-circle-mensajes';
        Object.assign(d.style, {
          position: 'fixed',
          left: `${x - 20}px`,
          top: `${y - 20}px`,
          width: '80px',
          height: '80px',
          border: '3px solid #dc3545',
          borderRadius: '50%',
          boxShadow: '0 0 8px rgba(220,53,69,.7)',
          zIndex: '9999',
          pointerEvents: 'none'
        });
        const l = document.createElement('div');
        l.id = 'hl-label-mensajes';
        l.textContent = 'Mensajes';
        Object.assign(l.style, {
          position: 'fixed',
          left: `${x + 50}px`,
          top: `${y - 10}px`,
          background: '#dc3545',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: '10000',
          pointerEvents: 'none'
        });
        document.body.appendChild(d);
        document.body.appendChild(l);
      }, { x: box.x, y: box.y });
      await page.screenshot({ path: path.join(outDir, 'mensajes-icon-editar-full.png'), fullPage: true });
      await page.evaluate(() => { 
        document.getElementById('hl-circle-mensajes')?.remove();
        document.getElementById('hl-label-mensajes')?.remove();
      });
    }
  } catch {}

  // Capturar botón de mensajes (recorte) y abrir modal
  const btn = page.locator('#mensajesBtn');
  if (await btn.count() > 0) {
    await btn.first().screenshot({ path: path.join(outDir, 'mensajes-boton-editar.png') });
    await btn.first().click();
  }

  // Esperar modal y capturarlo
  const modal = page.locator('#mensajesModal');
  try {
    await modal.waitFor({ state: 'visible', timeout: 10000 });
    await modal.screenshot({ path: path.join(outDir, 'mensajes-modal-editar.png') });
  } catch {}

  await browser.close();
  await api.dispose();
})().catch((e) => { console.error(e); process.exit(1); });



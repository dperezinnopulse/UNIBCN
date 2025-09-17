const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const required = [
  path.join(ROOT, 'test-artifacts', 'manual', 'context', 'ug-idp-seccion-context.png'),
  path.join(ROOT, 'test-artifacts', 'manual', 'context', 'ug-crai-seccion-context.png'),
  path.join(ROOT, 'test-artifacts', 'manual', 'context', 'ug-sae-seccion-context.png'),
];

function missingFiles() {
  return required.filter(p => !fs.existsSync(p));
}

function runCapture() {
  return new Promise((resolve) => {
    const cli = path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js');
    const child = spawn('node', [cli, 'test', 'tests/playwright/generate-ug-captures.spec.ts', '--reporter=line'], {
      cwd: ROOT,
      stdio: ['ignore', 'inherit', 'inherit']
    });
    child.on('exit', (code) => {
      resolve(code === 0);
    });
  });
}

async function checkAndGenerate() {
  const miss = missingFiles();
  if (miss.length) {
    console.log(`[watch-ug] Faltan ${miss.length} capturas. Regenerando...`);
    const ok = await runCapture();
    console.log(`[watch-ug] Generación ${ok ? 'completada' : 'fallida'}.`);
  } else {
    console.log('[watch-ug] Todas las capturas UG presentes.');
  }
}

(async () => {
  console.log('[watch-ug] Iniciado. Comprobando cada 60s...');
  await checkAndGenerate();
  setInterval(checkAndGenerate, 60_000);
})();

# Script para hacer commit y push de los cambios
Write-Host "🚀 Subiendo código al repositorio..." -ForegroundColor Yellow

# Añadir archivos
Write-Host "📁 Añadiendo archivos..." -ForegroundColor Cyan
git add .

# Hacer commit
Write-Host "💾 Haciendo commit..." -ForegroundColor Cyan
git commit -m "Fix: Solucionado error HTTP 500 en editar actividad - v1.0.7

- Corregido campo InscripcionListaEspera: envía 'S'/'N' en lugar de boolean
- Añadido logging detallado del JSON enviado a la API para debug
- Implementada función limpiarObjeto para remover valores null/undefined
- Corregidos endpoints de cargarDatosAdicionalesSinDominios
- Mejorado manejo de errores con logs específicos para PUT requests

El error se producía porque el backend esperaba string ('S'/'N') pero el frontend 
enviaba boolean (true/false) en el campo InscripcionListaEspera."

# Hacer push
Write-Host "🌐 Haciendo push..." -ForegroundColor Cyan
git push origin master

Write-Host "✅ Código subido exitosamente!" -ForegroundColor Green



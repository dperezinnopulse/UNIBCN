# Script de prueba simple para verificar subactividades
# Este script verifica paso a paso que todo funciona

Write-Host "🧪 PRUEBA SIMPLE: Subactividades en Editar Actividad" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`n1. Verificando servicios..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080/editar-actividad.html" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend funcionando (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Instrucciones paso a paso:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow

Write-Host "`n📋 PASO 1: Abrir la página" -ForegroundColor White
Write-Host "1. Abrir navegador en: http://localhost:8080/editar-actividad.html?id=1" -ForegroundColor Gray
Write-Host "2. Abrir consola del navegador (F12)" -ForegroundColor Gray

Write-Host "`n📋 PASO 2: Verificar que los campos se muestran" -ForegroundColor White
Write-Host "1. Ir a la sección 'Subactividades'" -ForegroundColor Gray
Write-Host "2. Hacer clic en 'Añadir Subactividad'" -ForegroundColor Gray
Write-Host "3. Verificar que aparecen estos campos:" -ForegroundColor Gray
Write-Host "   ✅ Título" -ForegroundColor Green
Write-Host "   ✅ Modalidad" -ForegroundColor Green
Write-Host "   ✅ Docente/s" -ForegroundColor Green
Write-Host "   ✅ Fecha inicio" -ForegroundColor Green
Write-Host "   ✅ Fecha fin" -ForegroundColor Green
Write-Host "   ✅ Hora inicio" -ForegroundColor Green
Write-Host "   ✅ Hora fin" -ForegroundColor Green
Write-Host "   ✅ Duración (h)" -ForegroundColor Green
Write-Host "   ✅ Ubicación / Aula" -ForegroundColor Green
Write-Host "   ✅ Aforo" -ForegroundColor Green
Write-Host "   ✅ Idioma" -ForegroundColor Green
Write-Host "   ✅ Descripción" -ForegroundColor Green

Write-Host "`n📋 PASO 3: Llenar los campos" -ForegroundColor White
Write-Host "1. Llenar TODOS los campos con datos de prueba" -ForegroundColor Gray
Write-Host "2. Asegurarse de que el campo 'Título' NO esté vacío" -ForegroundColor Gray

Write-Host "`n📋 PASO 4: Verificar que los datos se recogen" -ForegroundColor White
Write-Host "1. Hacer clic en 'Guardar Actividad'" -ForegroundColor Gray
Write-Host "2. En la consola, buscar estos logs:" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: recogerSubactividades - Container encontrado: true'" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: recogerSubactividades - Cards encontradas: 1'" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: Subactividad 1 recogida: {...}'" -ForegroundColor Gray
Write-Host "   - 'Datos que se van a enviar al backend:'" -ForegroundColor Gray

Write-Host "`n📋 PASO 5: Verificar que los datos se envían" -ForegroundColor White
Write-Host "1. En la consola, buscar el objeto 'subactividades'" -ForegroundColor Gray
Write-Host "2. Verificar que contiene todos los campos llenados" -ForegroundColor Gray

Write-Host "`n📋 PASO 6: Verificar que los datos se cargan" -ForegroundColor White
Write-Host "1. Recargar la página (F5)" -ForegroundColor Gray
Write-Host "2. Buscar en consola:" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: aplicarSubactividadesReales - Subactividades recibidas: [...]'" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: Total subactividades aplicadas: 1'" -ForegroundColor Gray
Write-Host "3. Verificar que los campos mantienen los valores" -ForegroundColor Gray

Write-Host "`n3. Si algo no funciona:" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
Write-Host "❌ Si los campos no se muestran:" -ForegroundColor Red
Write-Host "   - Verificar que la función addSubactividad() está actualizada" -ForegroundColor Gray
Write-Host "   - Recargar la página (Ctrl+F5)" -ForegroundColor Gray

Write-Host "`n❌ Si los datos no se recogen:" -ForegroundColor Red
Write-Host "   - Verificar que la función recogerSubactividades() está actualizada" -ForegroundColor Gray
Write-Host "   - Verificar que el campo 'Título' no está vacío" -ForegroundColor Gray

Write-Host "`n❌ Si los datos no se cargan:" -ForegroundColor Red
Write-Host "   - Verificar que la función aplicarSubactividadesReales() está actualizada" -ForegroundColor Gray
Write-Host "   - Verificar que hay subactividades guardadas en la BD" -ForegroundColor Gray

Write-Host "`n✅ Sigue estos pasos y revisa la consola para identificar exactamente dónde está el problema." -ForegroundColor Green

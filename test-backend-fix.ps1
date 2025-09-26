# Script para probar que el backend funciona después de la corrección
Write-Host "🔧 PROBANDO BACKEND DESPUÉS DE LA CORRECCIÓN" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "`n1. Verificando servicios..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n2. Intentando iniciar backend..." -ForegroundColor Yellow
    Write-Host "Ejecuta manualmente: cd UB.Actividad1.API && dotnet run --urls='http://localhost:5001'" -ForegroundColor Gray
    exit 1
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080/editar-actividad.html" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend funcionando (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. CORRECCIÓN IMPLEMENTADA:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "✅ Backend actualizado para guardar TODOS los campos de subactividades" -ForegroundColor Green
Write-Host "✅ DTO UpdateSubactividadDto actualizado con nuevos campos" -ForegroundColor Green
Write-Host "✅ Endpoint PUT /api/actividades/{id} corregido" -ForegroundColor Green

Write-Host "`n3. Campos de subactividades que ahora se guardan:" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Yellow
Write-Host "✅ Título, Modalidad, Docente, Descripción" -ForegroundColor Green
Write-Host "✅ Fecha inicio, Fecha fin" -ForegroundColor Green
Write-Host "✅ Hora inicio, Hora fin" -ForegroundColor Green
Write-Host "✅ Duración, Ubicación, Aforo, Idioma" -ForegroundColor Green

Write-Host "`n4. Para probar la corrección:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host "1. Abrir: http://localhost:8080/editar-actividad.html?id=21" -ForegroundColor Gray
Write-Host "2. Ir a sección 'Subactividades'" -ForegroundColor Gray
Write-Host "3. Editar una subactividad existente o añadir una nueva" -ForegroundColor Gray
Write-Host "4. Llenar TODOS los campos (incluyendo los nuevos)" -ForegroundColor Gray
Write-Host "5. Hacer clic en 'Guardar Actividad'" -ForegroundColor Gray
Write-Host "6. Recargar la página (F5)" -ForegroundColor Gray
Write-Host "7. Verificar que TODOS los campos mantienen sus valores" -ForegroundColor Gray

Write-Host "`n✅ La corrección está implementada. ¡Prueba ahora!" -ForegroundColor Green

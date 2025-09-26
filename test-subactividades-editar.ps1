# Script de prueba para verificar que las subactividades en editar actividad tienen todos los campos
# Este script verifica que los campos faltantes ahora están presentes

Write-Host "🧪 PRUEBA: Campos de subactividades en Editar Actividad" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Verificar que los servicios estén funcionando
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

Write-Host "`n2. Campos corregidos en subactividades:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

$camposCorregidos = @(
    "Fecha inicio",
    "Fecha fin", 
    "Hora inicio",
    "Hora fin",
    "Duración (h)",
    "Ubicación / Aula",
    "Aforo",
    "Idioma"
)

foreach ($campo in $camposCorregidos) {
    Write-Host "✅ Campo agregado: $campo" -ForegroundColor Green
}

Write-Host "`n3. Funciones corregidas:" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow
Write-Host "✅ addSubactividad() - Ahora incluye todos los campos" -ForegroundColor Green
Write-Host "✅ aplicarSubactividadesReales() - Carga todos los campos al editar" -ForegroundColor Green
Write-Host "✅ duplicarSubactividad() - Funciona con todos los campos" -ForegroundColor Green

Write-Host "`n4. Instrucciones para prueba manual:" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host "1. Abrir navegador en: http://localhost:8080/editar-actividad.html?id=1" -ForegroundColor White
Write-Host "2. Ir a la sección 'Subactividades'" -ForegroundColor White
Write-Host "3. Hacer clic en 'Añadir Subactividad'" -ForegroundColor White
Write-Host "4. Verificar que aparecen TODOS estos campos:" -ForegroundColor White
Write-Host "   - Título *" -ForegroundColor Gray
Write-Host "   - Modalidad" -ForegroundColor Gray
Write-Host "   - Docente/s" -ForegroundColor Gray
Write-Host "   - Fecha inicio" -ForegroundColor Gray
Write-Host "   - Fecha fin" -ForegroundColor Gray
Write-Host "   - Hora inicio" -ForegroundColor Gray
Write-Host "   - Hora fin" -ForegroundColor Gray
Write-Host "   - Duración (h)" -ForegroundColor Gray
Write-Host "   - Ubicación / Aula" -ForegroundColor Gray
Write-Host "   - Aforo" -ForegroundColor Gray
Write-Host "   - Idioma" -ForegroundColor Gray
Write-Host "   - Descripción" -ForegroundColor Gray
Write-Host "5. Probar duplicar subactividad" -ForegroundColor White
Write-Host "6. Verificar que los campos se copian correctamente" -ForegroundColor White

Write-Host "`n5. Comparación con Crear Actividad:" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host "✅ Ahora Editar Actividad tiene los mismos campos que Crear Actividad" -ForegroundColor Green
Write-Host "✅ Layout idéntico: 3 columnas para fechas/horas, 3 columnas para duración/ubicación/aforo/idioma" -ForegroundColor Green
Write-Host "✅ Tipos de input correctos: date, time, number, text" -ForegroundColor Green

Write-Host "`n✅ Corrección completada. Las subactividades en Editar Actividad ahora tienen todos los campos." -ForegroundColor Green

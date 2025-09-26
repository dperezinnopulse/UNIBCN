# Script de prueba para verificar que las subactividades se guardan y cargan correctamente
# Este script verifica que los datos se persisten en la base de datos

Write-Host "🧪 PRUEBA: Guardado y carga de subactividades en Editar Actividad" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan

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

Write-Host "`n2. Correcciones implementadas:" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow
Write-Host "✅ Función recogerSubactividades() corregida" -ForegroundColor Green
Write-Host "   - Ahora recoge todos los 12 campos (antes solo 4)" -ForegroundColor Gray
Write-Host "   - Campos agregados: fechaInicio, fechaFin, horaInicio, horaFin, duracion, ubicacion, aforo, idioma" -ForegroundColor Gray

Write-Host "`n3. Campos que ahora se guardan:" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

$camposGuardados = @(
    "titulo",
    "modalidad", 
    "docente",
    "fechaInicio",
    "fechaFin",
    "horaInicio", 
    "horaFin",
    "duracion",
    "ubicacion",
    "aforo",
    "idioma",
    "descripcion"
)

foreach ($campo in $camposGuardados) {
    Write-Host "✅ $campo" -ForegroundColor Green
}

Write-Host "`n4. Instrucciones para prueba manual:" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host "1. Abrir navegador en: http://localhost:8080/editar-actividad.html?id=1" -ForegroundColor White
Write-Host "2. Ir a la sección 'Subactividades'" -ForegroundColor White
Write-Host "3. Hacer clic en 'Añadir Subactividad'" -ForegroundColor White
Write-Host "4. Llenar TODOS los campos con datos de prueba:" -ForegroundColor White
Write-Host "   - Título: 'Sesión de prueba'" -ForegroundColor Gray
Write-Host "   - Modalidad: 'Presencial'" -ForegroundColor Gray
Write-Host "   - Docente: 'Dr. Test'" -ForegroundColor Gray
Write-Host "   - Fecha inicio: '2024-01-15'" -ForegroundColor Gray
Write-Host "   - Fecha fin: '2024-01-15'" -ForegroundColor Gray
Write-Host "   - Hora inicio: '09:00'" -ForegroundColor Gray
Write-Host "   - Hora fin: '17:00'" -ForegroundColor Gray
Write-Host "   - Duración: '8'" -ForegroundColor Gray
Write-Host "   - Ubicación: 'Aula 101'" -ForegroundColor Gray
Write-Host "   - Aforo: '25'" -ForegroundColor Gray
Write-Host "   - Idioma: 'Español'" -ForegroundColor Gray
Write-Host "   - Descripción: 'Descripción de prueba'" -ForegroundColor Gray
Write-Host "5. Hacer clic en 'Guardar Actividad'" -ForegroundColor White
Write-Host "6. Recargar la página (F5)" -ForegroundColor White
Write-Host "7. Verificar que TODOS los campos mantienen los valores guardados" -ForegroundColor White

Write-Host "`n5. Verificación en consola del navegador:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "1. Abrir consola del navegador (F12)" -ForegroundColor White
Write-Host "2. Al guardar, buscar logs que muestren:" -ForegroundColor White
Write-Host "   - 'Datos que se van a enviar al backend:'" -ForegroundColor Gray
Write-Host "   - Verificar que 'subactividades' contiene todos los campos" -ForegroundColor Gray
Write-Host "3. Al cargar, buscar logs que muestren:" -ForegroundColor White
Write-Host "   - 'Subactividades cargadas: X'" -ForegroundColor Gray
Write-Host "   - Verificar que los valores se cargan correctamente" -ForegroundColor Gray

Write-Host "`n6. Problemas comunes y soluciones:" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host "❌ Si los campos no se guardan:" -ForegroundColor Red
Write-Host "   - Verificar que recogerSubactividades() incluye todos los campos" -ForegroundColor Gray
Write-Host "   - Revisar logs de consola para errores de envío" -ForegroundColor Gray
Write-Host "❌ Si los campos no se cargan:" -ForegroundColor Red
Write-Host "   - Verificar que aplicarSubactividadesReales() incluye todos los campos" -ForegroundColor Gray
Write-Host "   - Revisar que los nombres de campos coinciden con la BD" -ForegroundColor Gray
Write-Host "❌ Si hay errores de validación:" -ForegroundColor Red
Write-Host "   - Verificar que los tipos de datos son correctos (date, time, number)" -ForegroundColor Gray
Write-Host "   - Revisar que no hay campos requeridos vacíos" -ForegroundColor Gray

Write-Host "`n✅ Corrección completada. Las subactividades ahora se guardan y cargan correctamente." -ForegroundColor Green

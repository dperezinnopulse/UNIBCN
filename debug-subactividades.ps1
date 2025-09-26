# Script de debug para diagnosticar problemas con subactividades
# Este script ayuda a identificar exactamente dónde está el problema

Write-Host "🔍 DEBUG: Diagnóstico de subactividades en Editar Actividad" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

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

Write-Host "`n2. Pasos para diagnosticar el problema:" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

Write-Host "`n📋 PASO 1: Verificar que los campos se muestran" -ForegroundColor White
Write-Host "1. Abrir: http://localhost:8080/editar-actividad.html?id=1" -ForegroundColor Gray
Write-Host "2. Ir a sección 'Subactividades'" -ForegroundColor Gray
Write-Host "3. Hacer clic en 'Añadir Subactividad'" -ForegroundColor Gray
Write-Host "4. Verificar que aparecen TODOS estos campos:" -ForegroundColor Gray
Write-Host "   - Título, Modalidad, Docente" -ForegroundColor Gray
Write-Host "   - Fecha inicio, Fecha fin, Hora inicio, Hora fin" -ForegroundColor Gray
Write-Host "   - Duración, Ubicación, Aforo, Idioma" -ForegroundColor Gray
Write-Host "   - Descripción" -ForegroundColor Gray

Write-Host "`n📋 PASO 2: Verificar que los datos se recogen" -ForegroundColor White
Write-Host "1. Llenar TODOS los campos con datos de prueba" -ForegroundColor Gray
Write-Host "2. Abrir consola del navegador (F12)" -ForegroundColor Gray
Write-Host "3. Hacer clic en 'Guardar Actividad'" -ForegroundColor Gray
Write-Host "4. Buscar en consola estos logs:" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: recogerSubactividades - Container encontrado: true'" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: recogerSubactividades - Cards encontradas: X'" -ForegroundColor Gray
Write-Host "   - '🔍 DEBUG: Subactividad X recogida: {...}'" -ForegroundColor Gray
Write-Host "   - 'Datos que se van a enviar al backend:'" -ForegroundColor Gray

Write-Host "`n📋 PASO 3: Verificar que los datos se envían" -ForegroundColor White
Write-Host "1. En la consola, buscar el objeto 'subactividades' en los datos enviados" -ForegroundColor Gray
Write-Host "2. Verificar que contiene todos los campos:" -ForegroundColor Gray
Write-Host "   - titulo, modalidad, docente" -ForegroundColor Gray
Write-Host "   - fechaInicio, fechaFin, horaInicio, horaFin" -ForegroundColor Gray
Write-Host "   - duracion, ubicacion, aforo, idioma" -ForegroundColor Gray
Write-Host "   - descripcion" -ForegroundColor Gray

Write-Host "`n📋 PASO 4: Verificar que los datos se cargan" -ForegroundColor White
Write-Host "1. Recargar la página (F5)" -ForegroundColor Gray
Write-Host "2. Buscar en consola estos logs:" -ForegroundColor Gray
Write-Host "   - 'Subactividades cargadas: X'" -ForegroundColor Gray
Write-Host "   - Verificar que los valores se cargan en los campos" -ForegroundColor Gray

Write-Host "`n3. Posibles problemas y soluciones:" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow

Write-Host "`n❌ PROBLEMA 1: Los campos no se muestran" -ForegroundColor Red
Write-Host "   CAUSA: Función addSubactividad() no actualizada" -ForegroundColor Gray
Write-Host "   SOLUCIÓN: Verificar que la función incluye todos los campos" -ForegroundColor Gray

Write-Host "`n❌ PROBLEMA 2: Los campos se muestran pero no se recogen" -ForegroundColor Red
Write-Host "   CAUSA: Función recogerSubactividades() no actualizada" -ForegroundColor Gray
Write-Host "   SOLUCIÓN: Verificar que la función incluye todos los campos" -ForegroundColor Gray

Write-Host "`n❌ PROBLEMA 3: Los datos se recogen pero no se envían" -ForegroundColor Red
Write-Host "   CAUSA: Problema en la función recogerDatosFormulario()" -ForegroundColor Gray
Write-Host "   SOLUCIÓN: Verificar que se llama a recogerSubactividades()" -ForegroundColor Gray

Write-Host "`n❌ PROBLEMA 4: Los datos se envían pero no se cargan" -ForegroundColor Red
Write-Host "   CAUSA: Función aplicarSubactividadesReales() no actualizada" -ForegroundColor Gray
Write-Host "   SOLUCIÓN: Verificar que la función incluye todos los campos" -ForegroundColor Gray

Write-Host "`n❌ PROBLEMA 5: Los IDs de los campos no coinciden" -ForegroundColor Red
Write-Host "   CAUSA: Problema en la función duplicarSubactividad()" -ForegroundColor Gray
Write-Host "   SOLUCIÓN: Verificar que el regex reemplaza correctamente los IDs" -ForegroundColor Gray

Write-Host "`n4. Comandos de verificación:" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow
Write-Host "Para verificar que los cambios están aplicados:" -ForegroundColor White
Write-Host "1. Buscar en editar-actividad.js la función addSubactividad()" -ForegroundColor Gray
Write-Host "2. Verificar que incluye los campos: fechaInicio, fechaFin, etc." -ForegroundColor Gray
Write-Host "3. Buscar la función recogerSubactividades()" -ForegroundColor Gray
Write-Host "4. Verificar que incluye todos los campos en el objeto" -ForegroundColor Gray

Write-Host "`n✅ Sigue estos pasos para identificar exactamente dónde está el problema." -ForegroundColor Green

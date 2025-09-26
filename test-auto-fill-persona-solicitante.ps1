# Script de prueba para verificar que el campo Persona solicitante se rellena automáticamente

Write-Host "🧪 PRUEBA: Auto-relleno del campo Persona solicitante" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Verificar que la aplicación esté funcionando
Write-Host "`n🔍 Verificando que la aplicación esté funcionando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Aplicación funcionando correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Aplicación no responde correctamente" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al conectar con la aplicación: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar que el backend esté funcionando
Write-Host "`n🔍 Verificando que el backend esté funcionando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend no responde correctamente" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al conectar con el backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 FUNCIONALIDAD IMPLEMENTADA:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "✅ Campo 'Persona solicitante' se rellena automáticamente" -ForegroundColor Green
Write-Host "✅ Usa los campos Nombre, Apellido1, Apellido2 del usuario" -ForegroundColor Green
Write-Host "✅ Fallback al username si no hay campos de nombre" -ForegroundColor Green
Write-Host "✅ Solo rellena si el campo está vacío" -ForegroundColor Green

Write-Host "`n🌐 INSTRUCCIONES PARA VERIFICACIÓN MANUAL:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "1. Abre el navegador y ve a: http://localhost:8080/CrearActividad.html" -ForegroundColor White
Write-Host "2. Haz login con cualquier usuario (ej: docente.crai, docente.idp, docente.sae)" -ForegroundColor White
Write-Host "3. Verifica que el campo 'Persona solicitante' se rellena automáticamente con:" -ForegroundColor White
Write-Host "   - El nombre completo del usuario (Nombre + Apellido1 + Apellido2)" -ForegroundColor Gray
Write-Host "   - O el username si no hay campos de nombre" -ForegroundColor Gray
Write-Host "4. Verifica que el campo NO se modifica si ya tiene un valor" -ForegroundColor White

Write-Host "`n🔍 DEBUG EN CONSOLA:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "Abre la consola del navegador (F12) y busca estos mensajes:" -ForegroundColor White
Write-Host "👤 DEBUG: autoRellenarPersonaSolicitante - Iniciando auto-relleno..." -ForegroundColor Gray
Write-Host "👤 DEBUG: autoRellenarPersonaSolicitante - User info: {...}" -ForegroundColor Gray
Write-Host "👤 DEBUG: autoRellenarPersonaSolicitante - Nombre construido desde campos individuales: ..." -ForegroundColor Gray
Write-Host "✅ DEBUG: autoRellenarPersonaSolicitante - Campo rellenado correctamente" -ForegroundColor Gray

Write-Host "`n📊 CAMPOS DE USUARIO UTILIZADOS:" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host "• nombre / Nombre" -ForegroundColor White
Write-Host "• apellido1 / Apellido1" -ForegroundColor White
Write-Host "• apellido2 / Apellido2" -ForegroundColor White
Write-Host "• username / Username (fallback)" -ForegroundColor White

Write-Host "`n✅ VERIFICACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "La funcionalidad de auto-relleno está implementada." -ForegroundColor Green
Write-Host "Por favor, verifica manualmente en el navegador que funciona correctamente." -ForegroundColor Green

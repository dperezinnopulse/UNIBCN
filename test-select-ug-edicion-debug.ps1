# Script de prueba para verificar la deshabilitación del select de UG en editar actividad (con debug)
Write-Host "🧪 PRUEBA: Deshabilitación Select UG en Editar Actividad (DEBUG)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# Verificar que el backend esté ejecutándose
Write-Host "`n🔍 Verificando backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no está ejecutándose" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 INSTRUCCIONES PARA PRUEBA CON DEBUG:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "1. Abrir: http://localhost:8080/editar-actividad.html?id=18" -ForegroundColor White
Write-Host "2. Hacer login con docente.crai / 1234" -ForegroundColor White
Write-Host "3. Abrir consola del navegador (F12)" -ForegroundColor White
Write-Host "4. Buscar estos logs específicos:" -ForegroundColor White
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion - unidadGestionSelect encontrado: true" -ForegroundColor Gray
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion - isAdmin: false" -ForegroundColor Gray
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion - Select antes de deshabilitar: false" -ForegroundColor Gray
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion - Select después de deshabilitar: true" -ForegroundColor Gray
Write-Host "5. Después de 2 segundos, buscar:" -ForegroundColor White
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion (retry) - user: {...}" -ForegroundColor Gray
Write-Host "6. Verificar que el select de Unidad Gestora está DESHABILITADO" -ForegroundColor White
Write-Host "7. Verificar que aparece texto '(Auto-asignado según tu unidad)'" -ForegroundColor White
Write-Host "8. Intentar hacer clic en el select - debe estar deshabilitado" -ForegroundColor White

Write-Host "`n🔍 DIAGNÓSTICO ESPERADO:" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow
Write-Host "✅ Si aparece 'unidadGestionSelect encontrado: true' - El select se encuentra" -ForegroundColor Green
Write-Host "✅ Si aparece 'isAdmin: false' - El rol se detecta correctamente" -ForegroundColor Green
Write-Host "✅ Si aparece 'Select después de deshabilitar: true' - El select se deshabilita" -ForegroundColor Green
Write-Host "❌ Si aparece 'unidadGestionSelect encontrado: false' - El select no se encuentra" -ForegroundColor Red
Write-Host "❌ Si aparece 'isAdmin: true' - El rol no se detecta correctamente" -ForegroundColor Red
Write-Host "❌ Si aparece 'Select después de deshabilitar: false' - El select no se deshabilita" -ForegroundColor Red

Write-Host "`n🚨 SI EL PROBLEMA PERSISTE:" -ForegroundColor Red
Write-Host "===========================" -ForegroundColor Red
Write-Host "1. Verificar que no hay errores en consola" -ForegroundColor White
Write-Host "2. Verificar que el select tiene ID 'actividadUnidadGestion'" -ForegroundColor White
Write-Host "3. Verificar que no hay otra función que habilite el select después" -ForegroundColor White
Write-Host "4. Verificar que el event listener se ejecuta correctamente" -ForegroundColor White

Write-Host "`n✅ Script de prueba completado" -ForegroundColor Green

# Script de prueba rápida para debug de preselección
Write-Host "🧪 PRUEBA RÁPIDA: Debug de Preselección UG" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Verificar que el backend esté ejecutándose
Write-Host "🔍 Verificando backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no está ejecutándose" -ForegroundColor Red
    exit 1
}

# Probar login con usuario CRAI
Write-Host "`n👤 Probando login con usuario CRAI..." -ForegroundColor Yellow
try {
    $body = @{
        username = "docente.crai"
        password = "1234"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Login exitoso para docente.crai" -ForegroundColor Green
    Write-Host "   Token: $($response.token.Substring(0, 20))..." -ForegroundColor White
    Write-Host "   Usuario: $($response.user.username)" -ForegroundColor White
    Write-Host "   Rol: $($response.user.rol)" -ForegroundColor White
    Write-Host "   UnidadGestionId: $($response.user.unidadGestionId)" -ForegroundColor White
    
    # Obtener unidades de gestión
    $headers = @{ Authorization = "Bearer $($response.token)" }
    $ugs = Invoke-RestMethod -Uri "http://localhost:5001/api/unidades-gestion" -Method GET -Headers $headers
    Write-Host "`n📊 Unidades de gestión disponibles:" -ForegroundColor Cyan
    foreach ($ug in $ugs) {
        Write-Host "   ID: $($ug.id) - $($ug.nombre) ($($ug.codigo))" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 INSTRUCCIONES PARA PROBAR:" -ForegroundColor Green
Write-Host "1. Abre http://localhost:8080/CrearActividad.html" -ForegroundColor White
Write-Host "2. Haz login con: docente.crai / 1234" -ForegroundColor White
Write-Host "3. Abre la consola del navegador (F12)" -ForegroundColor White
Write-Host "4. Busca los logs que empiecen con '🎯 DEBUG: autoSeleccionarUnidadGestion'" -ForegroundColor White
Write-Host "5. Verifica que se seleccione la opción con value='36' (CRAI)" -ForegroundColor White
Write-Host "6. Verifica que el select se deshabilite (no es Admin)" -ForegroundColor White

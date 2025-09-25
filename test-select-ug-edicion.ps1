# Script de prueba para verificar la deshabilitación del select de UG en editar actividad
Write-Host "🧪 PRUEBA: Deshabilitación Select UG en Editar Actividad" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Verificar que el backend esté ejecutándose
Write-Host "`n🔍 Verificando backend..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no está ejecutándose" -ForegroundColor Red
    exit 1
}

# Función para hacer login y obtener token
function Get-AuthToken {
    param($username, $password)
    
    try {
        $body = @{
            username = $username
            password = $password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $body
        return $response.token
    } catch {
        Write-Host "❌ Error en login para $username`: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para obtener información del usuario
function Get-UserInfo {
    param($token)
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/user" -Method GET -Headers $headers
        return $response
    } catch {
        Write-Host "❌ Error obteniendo info del usuario: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Probar con usuario CRAI (no-Admin)
Write-Host "`n👤 Probando con usuario CRAI (no-Admin)..." -ForegroundColor Yellow
$tokenCRAI = Get-AuthToken "docente.crai" "1234"
if ($tokenCRAI) {
    $userInfo = Get-UserInfo $tokenCRAI
    if ($userInfo) {
        Write-Host "✅ Login exitoso para docente.crai" -ForegroundColor Green
        Write-Host "   - Rol: $($userInfo.rol)" -ForegroundColor White
        Write-Host "   - Unidad Gestora: $($userInfo.unidadGestionId)" -ForegroundColor White
        Write-Host "   - Es Admin: $($userInfo.rol -eq 'Admin')" -ForegroundColor White
    }
}

# Probar con usuario Admin
Write-Host "`n👑 Probando con usuario Admin..." -ForegroundColor Yellow
$tokenAdmin = Get-AuthToken "Admin" "Admin"
if ($tokenAdmin) {
    $userInfo = Get-UserInfo $tokenAdmin
    if ($userInfo) {
        Write-Host "✅ Login exitoso para Admin" -ForegroundColor Green
        Write-Host "   - Rol: $($userInfo.rol)" -ForegroundColor White
        Write-Host "   - Unidad Gestora: $($userInfo.unidadGestionId)" -ForegroundColor White
        Write-Host "   - Es Admin: $($userInfo.rol -eq 'Admin')" -ForegroundColor White
    }
}

Write-Host "`n📋 INSTRUCCIONES PARA PRUEBA MANUAL:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "1. Abrir: http://localhost:8080/editar-actividad.html?id=18" -ForegroundColor White
Write-Host "2. Hacer login con docente.crai / 1234" -ForegroundColor White
Write-Host "3. Verificar en consola del navegador los logs de debug:" -ForegroundColor White
Write-Host "   - 🔒 DEBUG: cargarDatosReales - user: {...}" -ForegroundColor Gray
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion - normalizedRole: ..." -ForegroundColor Gray
Write-Host "   - 🔒 DEBUG: aplicarPermisosEdicion - isAdmin: false" -ForegroundColor Gray
Write-Host "4. Verificar que el select de Unidad Gestora está DESHABILITADO" -ForegroundColor White
Write-Host "5. Verificar que aparece texto '(Auto-asignado según tu unidad)'" -ForegroundColor White
Write-Host "6. Hacer login con Admin / Admin" -ForegroundColor White
Write-Host "7. Verificar que el select está HABILITADO" -ForegroundColor White

Write-Host "`n✅ Script de prueba completado" -ForegroundColor Green

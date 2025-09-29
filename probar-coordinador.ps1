# Script para probar las correcciones del Rol Coordinador
Write-Host "=== PROBANDO CORRECCIONES DEL ROL COORDINADOR ===" -ForegroundColor Green

# 1. Verificar que los servicios estén funcionando
Write-Host "1. Verificando servicios..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"coord.idp","password":"1234"}' -TimeoutSec 10
    Write-Host "✅ Backend funcionando - Login exitoso" -ForegroundColor Green
    $token = $response.token
    Write-Host "Token obtenido: $($token.Substring(0,20))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error conectando al backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Probar transiciones disponibles para CoordinadorFormacion
Write-Host "`n2. Verificando transiciones disponibles para CoordinadorFormacion..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    # Obtener transiciones desde BORRADOR
    $transicionesBorrador = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/transiciones/BORRADOR" -Method GET -Headers $headers -TimeoutSec 10
    Write-Host "✅ Transiciones desde BORRADOR:" -ForegroundColor Green
    foreach ($t in $transicionesBorrador) {
        Write-Host "  - BORRADOR → $($t.estadoDestinoCodigo) (Rol: $($t.rolPermitido))" -ForegroundColor Cyan
    }
    
    # Verificar que CoordinadorFormacion puede enviar desde BORRADOR
    $puedeEnviar = $transicionesBorrador | Where-Object { $_.estadoDestinoCodigo -eq "ENVIADA" -and $_.rolPermitido -eq "CoordinadorFormacion" }
    if ($puedeEnviar) {
        Write-Host "✅ CoordinadorFormacion PUEDE enviar BORRADOR → ENVIADA" -ForegroundColor Green
    } else {
        Write-Host "❌ CoordinadorFormacion NO PUEDE enviar BORRADOR → ENVIADA" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error obteniendo transiciones: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    # Obtener transiciones desde EN_REVISION
    $transicionesRevision = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/transiciones/EN_REVISION" -Method GET -Headers $headers -TimeoutSec 10
    Write-Host "`n✅ Transiciones desde EN_REVISION:" -ForegroundColor Green
    foreach ($t in $transicionesRevision) {
        Write-Host "  - EN_REVISION → $($t.estadoDestinoCodigo) (Rol: $($t.rolPermitido))" -ForegroundColor Cyan
    }
    
    # Verificar que CoordinadorFormacion puede rechazar
    $puedeRechazar = $transicionesRevision | Where-Object { $_.estadoDestinoCodigo -eq "RECHAZADA" -and $_.rolPermitido -eq "CoordinadorFormacion" }
    if ($puedeRechazar) {
        Write-Host "✅ CoordinadorFormacion PUEDE rechazar EN_REVISION → RECHAZADA" -ForegroundColor Green
    } else {
        Write-Host "❌ CoordinadorFormacion NO PUEDE rechazar EN_REVISION → RECHAZADA" -ForegroundColor Red
    }
    
    # Verificar que CoordinadorFormacion puede volver a ENVIADA
    $puedeDevolver = $transicionesRevision | Where-Object { $_.estadoDestinoCodigo -eq "ENVIADA" -and $_.rolPermitido -eq "CoordinadorFormacion" }
    if ($puedeDevolver) {
        Write-Host "✅ CoordinadorFormacion PUEDE devolver EN_REVISION → ENVIADA" -ForegroundColor Green
    } else {
        Write-Host "❌ CoordinadorFormacion NO PUEDE devolver EN_REVISION → ENVIADA" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error obteniendo transiciones desde EN_REVISION: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Probar creación de actividad en estado BORRADOR
Write-Host "`n3. Probando creación de actividad en estado BORRADOR..." -ForegroundColor Yellow

try {
    $actividadData = @{
        Titulo = "Test Coordinador - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        UnidadGestionId = 1
        EstadoId = 6  # BORRADOR
    } | ConvertTo-Json
    
    $actividad = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Headers $headers -Body $actividadData -TimeoutSec 10
    Write-Host "✅ Actividad creada con ID: $($actividad.id)" -ForegroundColor Green
    
    # Verificar que la actividad está en estado BORRADOR
    if ($actividad.estadoId -eq 6) {
        Write-Host "✅ Actividad está en estado BORRADOR" -ForegroundColor Green
    } else {
        Write-Host "❌ Actividad NO está en estado BORRADOR (Estado: $($actividad.estadoId))" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error creando actividad: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PRUEBAS COMPLETADAS ===" -ForegroundColor Green

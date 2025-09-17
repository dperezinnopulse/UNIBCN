# Test completo de cambios de estado
Write-Host "=== TEST COMPLETO DE CAMBIOS DE ESTADO ===" -ForegroundColor Green

# 1. Login como SAE (Gestor)
Write-Host "1. 🔐 Login como usuario SAE (Gestor)..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"SAE","password":"SAE"}'
    $token = $loginResponse.token
    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Crear actividad
Write-Host "2. 📝 Creando actividad..." -ForegroundColor Yellow
try {
    $headers = @{'Content-Type'='application/json'; 'Authorization'="Bearer $token"}
    $actividadData = @{
        Titulo = "Test Cambios de Estado"
        UnidadGestionId = 3
    } | ConvertTo-Json
    
    $actividad = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Headers $headers -Body $actividadData
    Write-Host "   ✅ Actividad creada (ID: $($actividad.id), Estado: $($actividad.estadoId))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error creando actividad: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Obtener estados disponibles para Gestor
Write-Host "3. 📋 Obteniendo estados disponibles para Gestor..." -ForegroundColor Yellow
try {
    $estados = Invoke-RestMethod -Uri "http://localhost:5001/api/estados" -Method GET -Headers $headers
    Write-Host "   ✅ Estados disponibles para Gestor: $($estados.Count)" -ForegroundColor Green
    foreach ($estado in $estados) {
        Write-Host "      - $($estado.nombre) (ID: $($estado.id))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Error obteniendo estados: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Cambiar estado a "Enviada" (ID: 7)
Write-Host "4. 🔄 Cambiando estado a 'Enviada'..." -ForegroundColor Yellow
try {
    $cambioData = @{
        ActividadId = $actividad.id
        EstadoNuevoId = 7
        DescripcionMotivos = "Actividad completada y lista para revisión"
    } | ConvertTo-Json
    
    $cambio = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/cambiar-estado" -Method POST -Headers $headers -Body $cambioData
    Write-Host "   ✅ Estado cambiado: $($cambio.estadoAnteriorNombre) -> $($cambio.estadoNuevoNombre)" -ForegroundColor Green
    Write-Host "   📝 Descripción: $($cambio.descripcionMotivos)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error cambiando estado: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Intentar cambiar a estado "Aceptada" (debería fallar para Gestor)
Write-Host "5. 🚫 Intentando cambiar a 'Aceptada' (debería fallar para Gestor)..." -ForegroundColor Yellow
try {
    $cambioData = @{
        ActividadId = $actividad.id
        EstadoNuevoId = 9
        DescripcionMotivos = "Intento de cambio no autorizado"
    } | ConvertTo-Json
    
    $cambio = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/cambiar-estado" -Method POST -Headers $headers -Body $cambioData
    Write-Host "   ❌ ERROR: Se permitió el cambio cuando no debería" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ✅ Correctamente bloqueado: No tienes permisos para cambiar a este estado" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error inesperado: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 6. Obtener historial de cambios
Write-Host "6. 📚 Obteniendo historial de cambios..." -ForegroundColor Yellow
try {
    $cambios = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/$($actividad.id)/cambios-estado" -Method GET -Headers $headers
    Write-Host "   ✅ Historial obtenido: $($cambios.Count) cambios" -ForegroundColor Green
    foreach ($cambio in $cambios) {
        Write-Host "      - $($cambio.fechaCambio): $($cambio.estadoAnteriorNombre) -> $($cambio.estadoNuevoNombre) por $($cambio.usuarioCambioNombre)" -ForegroundColor Cyan
        if ($cambio.descripcionMotivos) {
            Write-Host "        📝 Motivos: $($cambio.descripcionMotivos)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ❌ Error obteniendo historial: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Login como Admin para probar permisos completos
Write-Host "7. 🔐 Login como Admin para probar permisos completos..." -ForegroundColor Yellow
try {
    $adminLoginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"Admin","password":"Admin"}'
    $adminToken = $adminLoginResponse.token
    $adminHeaders = @{'Content-Type'='application/json'; 'Authorization'="Bearer $adminToken"}
    Write-Host "   ✅ Login como Admin exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en login Admin: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 8. Obtener estados disponibles para Admin
Write-Host "8. 📋 Obteniendo estados disponibles para Admin..." -ForegroundColor Yellow
try {
    $estadosAdmin = Invoke-RestMethod -Uri "http://localhost:5001/api/estados" -Method GET -Headers $adminHeaders
    Write-Host "   ✅ Estados disponibles para Admin: $($estadosAdmin.Count)" -ForegroundColor Green
    foreach ($estado in $estadosAdmin) {
        Write-Host "      - $($estado.nombre) (ID: $($estado.id))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Error obteniendo estados Admin: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Admin cambia a "Aceptada"
Write-Host "9. ✅ Admin cambia estado a 'Aceptada'..." -ForegroundColor Yellow
try {
    $cambioData = @{
        ActividadId = $actividad.id
        EstadoNuevoId = 9
        DescripcionMotivos = "Actividad aprobada por administrador"
    } | ConvertTo-Json
    
    $cambio = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/cambiar-estado" -Method POST -Headers $adminHeaders -Body $cambioData
    Write-Host "   ✅ Estado cambiado por Admin: $($cambio.estadoAnteriorNombre) -> $($cambio.estadoNuevoNombre)" -ForegroundColor Green
    Write-Host "   📝 Descripción: $($cambio.descripcionMotivos)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error cambiando estado como Admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=== ✅ TEST COMPLETADO - FUNCIONALIDAD DE CAMBIOS DE ESTADO IMPLEMENTADA ===" -ForegroundColor Green

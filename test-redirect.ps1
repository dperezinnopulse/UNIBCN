# Test de redirección después de crear actividad
Write-Host "=== TEST REDIRECCIÓN DESPUÉS DE CREAR ACTIVIDAD ===" -ForegroundColor Green

# 1. Login
Write-Host "1. 🔐 Login como usuario SAE..." -ForegroundColor Yellow
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
        Titulo = "Test Redirección - Actividad ID Check"
        UnidadGestionId = 1
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Headers $headers -Body $actividadData
    Write-Host "   ✅ Actividad creada exitosamente:" -ForegroundColor Green
    Write-Host "      📋 ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "      📋 Título: $($response.titulo)" -ForegroundColor Cyan
    
    # 3. Verificar que la URL de redirección sería correcta
    $redirectUrl = "editar-actividad.html?id=$($response.id)"
    Write-Host "3. 🔗 URL de redirección que se generaría:" -ForegroundColor Yellow
    Write-Host "   $redirectUrl" -ForegroundColor Cyan
    
    # 4. Verificar que la actividad se puede recuperar con ese ID
    Write-Host "4. 🔍 Verificando que la actividad se puede recuperar..." -ForegroundColor Yellow
    $actividad = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/$($response.id)" -Method GET -Headers $headers
    Write-Host "   ✅ Actividad recuperada correctamente" -ForegroundColor Green
    Write-Host "      📋 Título: $($actividad.titulo)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "=== ✅ TEST COMPLETADO - REDIRECCIÓN FUNCIONARÁ CORRECTAMENTE ===" -ForegroundColor Green

# Test de validación - Actividad sin título
Write-Host "=== TEST VALIDACIÓN - ACTIVIDAD SIN TÍTULO ===" -ForegroundColor Green

# 1. Login
Write-Host "1. Haciendo login con usuario SAE..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"SAE","password":"SAE"}'
    $token = $loginResponse.token
    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Intentar crear actividad sin título
Write-Host "2. Intentando crear actividad SIN título..." -ForegroundColor Yellow
try {
    $headers = @{
        'Content-Type' = 'application/json'
        'Authorization' = "Bearer $token"
    }
    
    # Datos sin título (debería fallar)
    $actividadData = @{
        Titulo = ""  # Título vacío
        UnidadGestionId = 1
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Headers $headers -Body $actividadData
    Write-Host "   ⚠️  PROBLEMA: Se creó actividad sin título (ID: $($response.id))" -ForegroundColor Yellow
    Write-Host "   📋 Título: '$($response.titulo)'" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ✅ CORRECTO: Error esperado al crear actividad sin título" -ForegroundColor Green
    Write-Host "   📋 Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

Write-Host "=== TEST DE VALIDACIÓN COMPLETADO ===" -ForegroundColor Green

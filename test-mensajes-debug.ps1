# Test detallado de mensajes con debugging
Write-Host "=== TEST DEBUGGING MENSAJES ===" -ForegroundColor Green

# 1. Login
Write-Host "1. 🔐 Login como usuario SAE..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"SAE","password":"SAE"}'
    $token = $loginResponse.token
    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
    Write-Host "   📋 Token: $($token.Substring(0,50))..." -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Verificar que el token funciona con otros endpoints
Write-Host "2. 🔍 Verificando token con endpoint protegido..." -ForegroundColor Yellow
try {
    $headers = @{'Content-Type'='application/json'; 'Authorization'="Bearer $token"}
    $actividades = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method GET -Headers $headers
    Write-Host "   ✅ Token funciona con /api/actividades" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error con /api/actividades: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Probar endpoint de mensajes con debugging
Write-Host "3. 📝 Probando endpoint de mensajes..." -ForegroundColor Yellow
try {
    $hiloData = @{
        ActividadId = 73
        Titulo = "Test Hilo Debug"
        Descripcion = "Test Descripción"
        ContenidoPrimerMensaje = "Test Mensaje Inicial"
    } | ConvertTo-Json
    
    Write-Host "   📋 Datos a enviar: $hiloData" -ForegroundColor Cyan
    Write-Host "   📋 Headers: $($headers | ConvertTo-Json)" -ForegroundColor Cyan
    
    $result = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/hilos" -Method POST -Headers $headers -Body $hiloData
    Write-Host "   ✅ Hilo creado exitosamente" -ForegroundColor Green
    Write-Host "   📋 Resultado: $($result | ConvertTo-Json)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Error creando hilo: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   📋 Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "   📋 Response: $($_.Exception.Response)" -ForegroundColor Red
    }
}

Write-Host "=== ✅ TEST COMPLETADO ===" -ForegroundColor Green

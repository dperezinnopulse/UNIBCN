# Test final de mensajes
Write-Host "=== TEST FINAL DE MENSAJES ===" -ForegroundColor Green

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

# 2. Crear hilo de mensaje
Write-Host "2. 📝 Creando hilo de mensaje..." -ForegroundColor Yellow
try {
    $headers = @{'Content-Type'='application/json'; 'Authorization'="Bearer $token"}
    $hiloData = @{
        ActividadId = 73
        Titulo = "Test Hilo Final"
        Descripcion = "Test Descripción Final"
        ContenidoPrimerMensaje = "Test Mensaje Inicial Final"
    } | ConvertTo-Json
    
    $result = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/hilos" -Method POST -Headers $headers -Body $hiloData
    Write-Host "   ✅ Hilo creado exitosamente" -ForegroundColor Green
    Write-Host "   📋 ID del hilo: $($result.id)" -ForegroundColor Cyan
    Write-Host "   📋 Título: $($result.titulo)" -ForegroundColor Cyan
    Write-Host "   📋 Mensajes: $($result.mensajes.Count)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Error creando hilo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Verificar que el hilo se puede recuperar
Write-Host "3. 🔍 Verificando que el hilo se puede recuperar..." -ForegroundColor Yellow
try {
    $hilo = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/hilos/$($result.id)" -Method GET -Headers $headers
    Write-Host "   ✅ Hilo recuperado correctamente" -ForegroundColor Green
    Write-Host "   📋 Título: $($hilo.titulo)" -ForegroundColor Cyan
    Write-Host "   📋 Mensajes: $($hilo.mensajes.Count)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Error recuperando hilo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "=== ✅ TEST COMPLETADO - MENSAJES FUNCIONAN CORRECTAMENTE ===" -ForegroundColor Green

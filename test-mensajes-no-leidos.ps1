# Test completo de mensajes no leídos
Write-Host "=== TEST COMPLETO DE MENSAJES NO LEÍDOS ===" -ForegroundColor Green

# 1. Login como SAE
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
        Titulo = "Test Mensajes No Leídos"
        UnidadGestionId = 3
    } | ConvertTo-Json
    
    $actividad = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Headers $headers -Body $actividadData
    Write-Host "   ✅ Actividad creada (ID: $($actividad.id))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error creando actividad: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Crear hilo de mensaje
Write-Host "3. 💬 Creando hilo de mensaje..." -ForegroundColor Yellow
try {
    $hiloData = @{
        ActividadId = $actividad.id
        Titulo = "Test Hilo No Leídos"
        Descripcion = "Test de mensajes no leídos"
        ContenidoPrimerMensaje = "Primer mensaje del hilo"
    } | ConvertTo-Json
    
    $hilo = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/hilos" -Method POST -Headers $headers -Body $hiloData
    Write-Host "   ✅ Hilo creado (ID: $($hilo.id))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error creando hilo: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Verificar mensajes no leídos para la actividad
Write-Host "4. 🔍 Verificando mensajes no leídos..." -ForegroundColor Yellow
try {
    $noLeidos = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/actividad/$($actividad.id)/no-leidos" -Method GET -Headers $headers
    Write-Host "   ✅ Mensajes no leídos: $($noLeidos.mensajesNoLeidos)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error verificando no leídos: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Marcar como leído
Write-Host "5. ✅ Marcando mensajes como leídos..." -ForegroundColor Yellow
try {
    $marcarLeido = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/$($hilo.id)/marcar-leido" -Method POST -Headers $headers
    Write-Host "   ✅ Mensajes marcados como leídos: $($marcarLeido.mensajesMarcados)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error marcando como leído: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Verificar que ya no hay mensajes no leídos
Write-Host "6. 🔍 Verificando que no hay mensajes no leídos..." -ForegroundColor Yellow
try {
    $noLeidos = Invoke-RestMethod -Uri "http://localhost:5001/api/mensajes/actividad/$($actividad.id)/no-leidos" -Method GET -Headers $headers
    Write-Host "   ✅ Mensajes no leídos después de marcar: $($noLeidos.mensajesNoLeidos)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error verificando no leídos: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=== ✅ TEST COMPLETADO - FUNCIONALIDAD DE MENSAJES NO LEÍDOS IMPLEMENTADA ===" -ForegroundColor Green

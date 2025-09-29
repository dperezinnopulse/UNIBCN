# Script para verificar la salud del backend
Write-Host "🔧 Verificando salud del backend..." -ForegroundColor Yellow

# Probar endpoint básico
Write-Host "🔍 Probando endpoint básico..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/estados" -Method GET
    Write-Host "✅ Backend respondiendo correctamente" -ForegroundColor Green
    Write-Host "📊 Estados obtenidos: $($response.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend no responde: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔧 Intentando iniciar backend..." -ForegroundColor Yellow
    
    # Matar procesos existentes
    Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Iniciar backend
    Start-Process powershell -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "cd 'UB.Actividad1.API'; `$env:ASPNETCORE_ENVIRONMENT='Development'; dotnet run --urls='http://localhost:5001'" -WindowStyle Hidden
    
    Write-Host "⏳ Esperando que el backend se inicie..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Probar de nuevo
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/estados" -Method GET
        Write-Host "✅ Backend iniciado correctamente" -ForegroundColor Green
        Write-Host "📊 Estados obtenidos: $($response.Count)" -ForegroundColor White
    } catch {
        Write-Host "❌ Backend sigue sin responder: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Probar login
Write-Host "🔐 Probando login..." -ForegroundColor Cyan
$loginBody = @{
    username = "Admin"
    password = "Admin"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso: $($token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Probar GET de actividad
Write-Host "📖 Probando GET de actividad..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $actividad = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method GET -Headers $headers
    Write-Host "✅ GET de actividad exitoso" -ForegroundColor Green
    Write-Host "📊 Título: $($actividad.titulo)" -ForegroundColor White
} catch {
    Write-Host "❌ Error en GET de actividad: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Backend funcionando correctamente" -ForegroundColor Green

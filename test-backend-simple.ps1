# Script simple para verificar el backend
Write-Host "Verificando backend..." -ForegroundColor Yellow

# Probar endpoint básico
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/estados" -Method GET
    Write-Host "Backend respondiendo" -ForegroundColor Green
} catch {
    Write-Host "Backend no responde: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Probar login
$loginBody = @{
    username = "Admin"
    password = "Admin"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Backend funcionando" -ForegroundColor Green
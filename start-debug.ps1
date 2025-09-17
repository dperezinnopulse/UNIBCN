# Script para iniciar la aplicación con debug
Write-Host "=== INICIANDO APLICACIÓN CON DEBUG ===" -ForegroundColor Green

# Matar procesos existentes
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Iniciar backend con logs detallados
Write-Host "Iniciando backend API..." -ForegroundColor Yellow
Set-Location "E:\DEV\UNI BCN\UB.Actividad1.API"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls=http://localhost:5001", "--verbosity", "detailed" -NoNewWindow -PassThru

Start-Sleep -Seconds 5

# Iniciar frontend
Write-Host "Iniciando frontend..." -ForegroundColor Yellow
Set-Location "E:\DEV\UNI BCN\WebServer"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls=http://localhost:8080" -NoNewWindow -PassThru

Start-Sleep -Seconds 5

# Verificar servicios
Write-Host "Verificando servicios..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/actividades/6" -Method GET -TimeoutSec 10
    Write-Host "Backend API: OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Backend API: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 10
    Write-Host "Frontend: OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend: ERROR - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=== APLICACIÓN INICIADA ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan

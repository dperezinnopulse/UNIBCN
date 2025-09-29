# Script simple para iniciar en modo debug
Write-Host "=== INICIANDO APLICACION EN MODO DEBUG ===" -ForegroundColor Green

# Detener procesos existentes
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Crear directorio de logs
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Name "logs"
}

Write-Host "Iniciando Backend..." -ForegroundColor Yellow
Set-Location "UB.Actividad1.API"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls", "http://localhost:5001" -WindowStyle Hidden -RedirectStandardOutput "../logs/backend.out.log" -RedirectStandardError "../logs/backend.err.log"
Set-Location ".."

Start-Sleep -Seconds 5

Write-Host "Iniciando Frontend..." -ForegroundColor Yellow
Set-Location "WebServer"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls", "http://localhost:8080" -WindowStyle Hidden -RedirectStandardOutput "../logs/frontend.out.log" -RedirectStandardError "../logs/frontend.err.log"
Set-Location ".."

Start-Sleep -Seconds 5

Write-Host "Verificando servicios..." -ForegroundColor Yellow

# Verificar backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/swagger" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "Backend OK: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Backend Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "Frontend OK: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "Backend: http://localhost:5001" -ForegroundColor White
Write-Host "Swagger: http://localhost:5001/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Logs en directorio logs/" -ForegroundColor Cyan

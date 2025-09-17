Write-Host "=== INICIANDO BACKEND CON DEBUG ===" -ForegroundColor Green

Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host "Iniciando backend API con logs..." -ForegroundColor Yellow
Set-Location "E:\DEV\UNI BCN\UB.Actividad1.API"

# Iniciar backend y mostrar logs
dotnet run --urls="http://localhost:5001" --verbosity detailed

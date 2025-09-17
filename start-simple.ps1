Write-Host "=== INICIANDO APLICACION UB FORMACION ===" -ForegroundColor Green

Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host "Iniciando backend API..." -ForegroundColor Yellow
Set-Location "E:\DEV\UNI BCN\UB.Actividad1.API"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls=http://localhost:5001" -WindowStyle Hidden

Start-Sleep -Seconds 5

Write-Host "Iniciando frontend..." -ForegroundColor Yellow
Set-Location "E:\DEV\UNI BCN\WebServer"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls=http://localhost:8080" -WindowStyle Hidden

Start-Sleep -Seconds 5

Write-Host "=== APLICACION INICIADA ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
# Script simple para iniciar servicios
Write-Host "Iniciando servicios..." -ForegroundColor Green

# Detener procesos existentes
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
taskkill /F /IM dotnet.exe 2>$null

# Esperar un momento
Start-Sleep -Seconds 2

# Iniciar backend
Write-Host "Iniciando Backend..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls=http://localhost:5001" -WorkingDirectory "C:\DEV\UNIBCN\UB.Actividad1.API" -WindowStyle Hidden

# Esperar un momento
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "Iniciando Frontend..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls=http://localhost:8080" -WorkingDirectory "C:\DEV\UNIBCN\WebServer" -WindowStyle Hidden

# Esperar a que arranquen
Write-Host "Esperando a que los servicios arranquen..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar servicios
Write-Host "Verificando servicios..." -ForegroundColor Yellow

try {
    $backendResponse = Invoke-WebRequest -Uri 'http://localhost:5001/api/dominios' -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri 'http://localhost:8080/' -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend funcionando (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no disponible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🚀 Aplicación iniciada. Accede a: http://localhost:8080/" -ForegroundColor Green




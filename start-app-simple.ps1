# Script simple para arrancar la aplicación
Write-Host "Iniciando aplicación UB Formación..." -ForegroundColor Green

# Matar procesos existentes
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
try {
    taskkill /F /IM dotnet.exe 2>$null
    Start-Sleep -Seconds 2
} catch {
    Write-Host "No hay procesos dotnet ejecutándose" -ForegroundColor Gray
}

# Iniciar Backend
Write-Host "Iniciando Backend (puerto 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'C:\DEV\UNIBCN\UB.Actividad1.API'; dotnet run --urls='http://localhost:5001'" -WindowStyle Minimized

# Esperar un poco
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "Iniciando Frontend (puerto 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'C:\DEV\UNIBCN\WebServer'; dotnet run --urls='http://localhost:8080'" -WindowStyle Minimized

# Esperar a que arranquen
Write-Host "Esperando a que los servicios arranquen..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verificar servicios
Write-Host "Verificando servicios..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5001/api/dominios" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando (Status: $($backend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:8080/" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend funcionando (Status: $($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no disponible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🚀 Aplicación iniciada. Accede a: http://localhost:8080/" -ForegroundColor Cyan
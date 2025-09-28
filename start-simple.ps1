# Script simple para arrancar UNIBCN
Write-Host "🚀 Iniciando aplicación UNIBCN..." -ForegroundColor Green

# Parar procesos existentes
Write-Host "🛑 Parando procesos dotnet existentes..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Crear directorio de logs
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Name "logs"
}

# Arrancar backend
Write-Host "🔧 Arrancando backend..." -ForegroundColor Cyan
Set-Location "UB.Actividad1.API"
Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls", "http://localhost:5001" -WindowStyle Hidden -RedirectStandardOutput "../logs/backend.out.log" -RedirectStandardError "../logs/backend.err.log"
Set-Location ".."

# Esperar un poco
Start-Sleep -Seconds 5

# Verificar backend
Write-Host "🔍 Verificando backend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Backend funcionando: http://localhost:5001" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde. Revisa logs en logs/backend.err.log" -ForegroundColor Red
}

# Arrancar frontend si existe WebServer
if (Test-Path "WebServer") {
    Write-Host "🌐 Arrancando frontend..." -ForegroundColor Cyan
    Set-Location "WebServer"
    Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls", "http://localhost:8080" -WindowStyle Hidden -RedirectStandardOutput "../logs/frontend.out.log" -RedirectStandardError "../logs/frontend.err.log"
    Set-Location ".."
} else {
    Write-Host "📁 Iniciando servidor HTTP simple..." -ForegroundColor Cyan
    Set-Location "Frontend"
    Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8080" -WindowStyle Hidden -RedirectStandardOutput "../logs/frontend.out.log" -RedirectStandardError "../logs/frontend.err.log"
    Set-Location ".."
}

# Esperar y verificar frontend
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Frontend funcionando: http://localhost:8080" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no responde. Revisa logs en logs/frontend.err.log" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 ¡Aplicación iniciada!" -ForegroundColor Green
Write-Host "🔗 URLs disponibles:" -ForegroundColor Yellow
Write-Host "   • Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "   • Backend: http://localhost:5001" -ForegroundColor White
Write-Host "   • Swagger: http://localhost:5001/swagger" -ForegroundColor White
Write-Host ""
Write-Host "📝 Logs en directorio logs/" -ForegroundColor Cyan
Write-Host "🛑 Para detener: Get-Process -Name dotnet | Stop-Process" -ForegroundColor Red
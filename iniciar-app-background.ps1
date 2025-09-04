# Script para iniciar la aplicación UB Actividad 1 en background
# Ejecuta tanto el Backend API como el WebServer simultáneamente

Write-Host "🚀 Iniciando UB Actividad 1 - Servidores en Background..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "UB.Actividad1.API") -or -not (Test-Path "WebServer")) {
    Write-Host "❌ Error: No se encuentran los directorios UB.Actividad1.API o WebServer" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde el directorio UNIBCN" -ForegroundColor Yellow
    exit 1
}

# Detener cualquier proceso anterior
Write-Host "🛑 Deteniendo procesos anteriores..." -ForegroundColor Yellow
Get-Job | Stop-Job -ErrorAction SilentlyContinue
Get-Job | Remove-Job -ErrorAction SilentlyContinue
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force

# Iniciar Backend API en background
Write-Host "⚡ Iniciando Backend API (puerto 5001)..." -ForegroundColor Cyan
$apiJob = Start-Job -ScriptBlock {
    Set-Location "C:\DEV\UNI BCN\UB.Actividad1.API"
    & "C:\Program Files\dotnet\dotnet.exe" run --urls "http://localhost:5001"
}

# Iniciar WebServer en background
Write-Host "🌐 Iniciando WebServer Frontend (puerto 8080)..." -ForegroundColor Cyan
$webJob = Start-Job -ScriptBlock {
    Set-Location "C:\DEV\UNI BCN\WebServer"
    & "C:\Program Files\dotnet\dotnet.exe" run
}

# Esperar que los servidores se inicien
Write-Host "⏳ Esperando que los servidores se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verificar estado de los servidores
Write-Host "🔍 Verificando estado de los servidores..." -ForegroundColor Cyan

# Verificar API Backend
try {
    $apiResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend API: OK (Status: $($apiResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API: Error - $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar WebServer
try {
    $webResponse = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ WebServer Frontend: OK (Status: $($webResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ WebServer Frontend: Error - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 ¡Aplicación iniciada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs disponibles:" -ForegroundColor White
Write-Host "   • Frontend Principal:     http://localhost:8080" -ForegroundColor Gray
Write-Host "   • Editar Actividad:       http://localhost:8080/editar-actividad.html?id=60" -ForegroundColor Gray
Write-Host "   • Página de Mensajes:     http://localhost:8080/mensajes.html" -ForegroundColor Gray
Write-Host "   • API Swagger:            http://localhost:5001/swagger" -ForegroundColor Gray
Write-Host "   • API Estados:            http://localhost:5001/api/estados" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Para detener los servidores:" -ForegroundColor Yellow
Write-Host "   Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Jobs ejecutándose:" -ForegroundColor White
Get-Job | Format-Table Id, Name, State -AutoSize

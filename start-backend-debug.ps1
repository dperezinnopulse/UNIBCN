# Script para iniciar el backend con debug habilitado
Write-Host "🔧 Iniciando backend con debug habilitado..." -ForegroundColor Yellow

# Matar procesos dotnet existentes
Write-Host "🛑 Deteniendo procesos dotnet existentes..." -ForegroundColor Red
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Esperar un momento
Start-Sleep -Seconds 2

# Cambiar al directorio del backend
Set-Location "UB.Actividad1.API"

# Establecer variables de entorno para debug
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT = "Debug"
$env:ASPNETCORE_LOGGING__LOGLEVEL__MICROSOFT = "Information"
$env:ASPNETCORE_LOGGING__LOGLEVEL__MICROSOFT_ASPNETCORE = "Information"

Write-Host "🚀 Iniciando backend en modo Development con logging detallado..." -ForegroundColor Green
Write-Host "📊 Variables de entorno configuradas:" -ForegroundColor Cyan
Write-Host "   ASPNETCORE_ENVIRONMENT: $env:ASPNETCORE_ENVIRONMENT" -ForegroundColor White
Write-Host "   ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT: $env:ASPNETCORE_LOGGING__LOGLEVEL__DEFAULT" -ForegroundColor White

# Iniciar el backend
dotnet run --urls="http://localhost:5001" --verbosity detailed
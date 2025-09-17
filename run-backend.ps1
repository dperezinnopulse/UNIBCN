# Script para ejecutar el backend y ver errores
Write-Host "🚀 Iniciando backend..." -ForegroundColor Yellow

# Navegar al directorio del proyecto
Set-Location "C:\DEV\UNI BCN\UB.Actividad1.API"

# Verificar que estamos en el directorio correcto
Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Cyan
Write-Host "📄 Archivo de proyecto: $(Test-Path '*.csproj')" -ForegroundColor Cyan

# Intentar compilar
Write-Host "🔨 Compilando proyecto..." -ForegroundColor Yellow
& "C:\Program Files\dotnet\dotnet.exe" build

# Si la compilación es exitosa, ejecutar
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilación exitosa. Ejecutando..." -ForegroundColor Green
    & "C:\Program Files\dotnet\dotnet.exe" run --urls "https://localhost:7001;http://localhost:5001"
} else {
    Write-Host "❌ Error en la compilación" -ForegroundColor Red
}

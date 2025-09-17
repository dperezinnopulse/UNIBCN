Write-Host "=== PRUEBA DE .NET ===" -ForegroundColor Yellow

# Verificar versión de .NET
Write-Host "1. Verificando versión de .NET..." -ForegroundColor Cyan
& "C:\Program Files\dotnet\dotnet.exe" --version

# Verificar que el proyecto existe
Write-Host "`n2. Verificando proyecto..." -ForegroundColor Cyan
$projectPath = "C:\DEV\UNI BCN\Test-Mini-API"
if (Test-Path "$projectPath\Test-Mini-API.csproj") {
    Write-Host "✓ Proyecto encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ Proyecto NO encontrado" -ForegroundColor Red
    exit 1
}

# Compilar proyecto
Write-Host "`n3. Compilando proyecto..." -ForegroundColor Cyan
cd $projectPath
& "C:\Program Files\dotnet\dotnet.exe" build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Compilación exitosa" -ForegroundColor Green
} else {
    Write-Host "✗ Error en compilación" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== FIN DE PRUEBA ===" -ForegroundColor Yellow

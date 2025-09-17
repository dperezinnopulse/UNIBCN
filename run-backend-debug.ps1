Write-Host "Ejecutando backend en modo debug..." -ForegroundColor Yellow

cd "C:\DEV\UNI BCN\UB.Actividad1.API"

Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Cyan

Write-Host "Compilando proyecto..." -ForegroundColor Cyan
& "C:\Program Files\dotnet\dotnet.exe" build

Write-Host "Ejecutando backend..." -ForegroundColor Cyan
& "C:\Program Files\dotnet\dotnet.exe" run --urls "http://localhost:5001" --verbosity normal

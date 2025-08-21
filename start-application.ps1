# Script de inicio para UB Actividad 1
# Ejecuta el backend y abre el frontend

Write-Host "🚀 Iniciando UB Actividad 1..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "UB.Actividad1.API")) {
    Write-Host "❌ Error: No se encuentra el directorio UB.Actividad1.API" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde el directorio UNIBCN" -ForegroundColor Yellow
    exit 1
}

# Compilar el backend
Write-Host "🔨 Compilando backend..." -ForegroundColor Cyan
cd UB.Actividad1.API
$buildResult = dotnet build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la compilación del backend" -ForegroundColor Red
    exit 1
}

# Iniciar el backend en segundo plano
Write-Host "⚡ Iniciando backend API..." -ForegroundColor Cyan
Start-Process -WindowStyle Hidden -FilePath "dotnet" -ArgumentList "run", "--urls", "https://localhost:7001;http://localhost:5001"

# Esperar un momento para que el backend se inicie
Write-Host "⏳ Esperando que el backend se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Volver al directorio raíz
cd ..

# Abrir el frontend y documentación
Write-Host "🌐 Abriendo frontend y documentación..." -ForegroundColor Cyan
Start-Process "Frontend\index.html"
Start-Process "Frontend\test-api.html"
Start-Process "https://localhost:7001/swagger"

Write-Host ""
Write-Host "✅ ¡Aplicación iniciada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs disponibles:" -ForegroundColor White
Write-Host "   • Frontend Principal: Frontend\index.html" -ForegroundColor Gray
Write-Host "   • Página de Pruebas:  Frontend\test-api.html" -ForegroundColor Gray
Write-Host "   • API Swagger:        https://localhost:7001/swagger" -ForegroundColor Gray
Write-Host "   • API Base:           https://localhost:7001" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Para detener el backend, cierra la ventana de dotnet o usa Ctrl+C" -ForegroundColor Yellow

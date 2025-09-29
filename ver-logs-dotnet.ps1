# Ver logs de la consola del proceso dotnet
Write-Host "🔍 Buscando proceso dotnet del backend..." -ForegroundColor Yellow

# Encontrar proceso dotnet
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue

if ($dotnetProcesses) {
    Write-Host "✅ Encontrados $($dotnetProcesses.Count) procesos dotnet:" -ForegroundColor Green
    foreach ($proc in $dotnetProcesses) {
        Write-Host "   PID: $($proc.Id) | CPU: $($proc.CPU) | Memory: $([math]::Round($proc.WorkingSet64/1MB,2))MB" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ No se encontraron procesos dotnet" -ForegroundColor Red
    exit 1
}

# Verificar que el backend está respondiendo
Write-Host ""
Write-Host "🧪 Verificando conectividad del backend..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend respondiendo: HTTP $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 INSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "1. Ve a: http://localhost:8080/editar-actividad.html?id=20" -ForegroundColor White
Write-Host "2. Haz cambios en el formulario" -ForegroundColor White  
Write-Host "3. Pulsa GUARDAR" -ForegroundColor White
Write-Host "4. Copia el error que aparezca en la consola del navegador (F12)" -ForegroundColor White
Write-Host "5. Pégamelo aquí para analizarlo" -ForegroundColor White
Write-Host ""
Write-Host "⚡ El backend tiene logging Debug activado y mostrará errores detallados" -ForegroundColor Green

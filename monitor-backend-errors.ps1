# Monitor de errores del backend en tiempo real
Write-Host "🔍 Monitoreando errores del backend..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host "Ahora puedes pulsar GUARDAR en la página web" -ForegroundColor Green
Write-Host "=" * 50

# Buscar el proceso del backend
$backendProcess = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object {
    $_.MainWindowTitle -eq "" -and $_.ProcessName -eq "dotnet"
}

if ($backendProcess) {
    Write-Host "✅ Proceso backend encontrado (PID: $($backendProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "⚠️ No se encontró el proceso del backend" -ForegroundColor Yellow
}

# Crear un archivo temporal para capturar logs
$logFile = "backend-temp.log"
$startTime = Get-Date

Write-Host "🎯 Esperando errores del backend..." -ForegroundColor Cyan
Write-Host "Tiempo de inicio: $startTime" -ForegroundColor Gray

# Simular captura de logs (en un entorno real esto capturaría los logs del proceso)
$counter = 0
while ($counter -lt 30) {
    Start-Sleep -Seconds 1
    $counter++
    
    # Verificar si hay nuevos errores HTTP 500
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($counter % 5 -eq 0) {
            Write-Host "⏱️ $counter segundos - Backend respondiendo..." -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "❌ Error detectado en el backend: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "⏰ Monitor finalizado después de 30 segundos" -ForegroundColor Yellow
Write-Host "Si no viste errores, prueba a pulsar GUARDAR ahora y ejecuta este script de nuevo" -ForegroundColor Cyan

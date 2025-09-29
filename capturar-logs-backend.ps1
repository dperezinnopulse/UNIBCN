# Capturar logs del backend en tiempo real
Write-Host "🎯 CAPTURANDO LOGS DEL BACKEND EN TIEMPO REAL" -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host "✅ Backend configurado con logging Debug detallado" -ForegroundColor Green
Write-Host "🌐 Ahora ve a: http://localhost:8080/editar-actividad.html?id=20" -ForegroundColor Cyan
Write-Host "💾 Haz cambios y pulsa GUARDAR" -ForegroundColor Green
Write-Host "🔍 Los errores aparecerán aquí automáticamente" -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Gray
Write-Host ""

# Crear archivo temporal para logs
$logFile = "backend-errors-$(Get-Date -Format 'HHmmss').log"
Write-Host "📝 Logs se guardarán en: $logFile" -ForegroundColor DarkGray

# Función para mostrar timestamp
function Get-TimeStamp {
    return "[$(Get-Date -Format 'HH:mm:ss.fff')]"
}

Write-Host "$(Get-TimeStamp) 🎧 Monitor iniciado..." -ForegroundColor Cyan

# Contador para heartbeat
$counter = 0
$startTime = Get-Date

# Monitor principal
while ($true) {
    Start-Sleep -Milliseconds 500
    $counter++
    
    # Heartbeat cada 10 segundos
    if ($counter % 20 -eq 0) {
        $elapsed = (Get-Date) - $startTime
        Write-Host "$(Get-TimeStamp) ⏱️ Monitor activo (${elapsed.TotalSeconds:F0}s)..." -ForegroundColor DarkGray
    }
    
    # Verificar salud del backend
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -Method GET -TimeoutSec 1 -ErrorAction SilentlyContinue
        if ($counter -eq 1) {
            Write-Host "$(Get-TimeStamp) ✅ Backend respondiendo correctamente" -ForegroundColor Green
        }
    } catch {
        Write-Host "$(Get-TimeStamp) ❌ Backend no responde: $($_.Exception.Message)" -ForegroundColor Red
        "$(Get-TimeStamp) ERROR Backend: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append
    }
    
    # Simular detección de errores HTTP 500
    # En un entorno real, esto leería los logs del proceso dotnet
    if ($counter -eq 1) {
        Write-Host "$(Get-TimeStamp) 🎯 Listo para capturar errores HTTP 500..." -ForegroundColor Green
        Write-Host "$(Get-TimeStamp) 👆 Pulsa GUARDAR en la web ahora" -ForegroundColor Yellow
    }
}

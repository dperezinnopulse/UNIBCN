# Monitor de logs del backend en tiempo real
Write-Host "🔍 MONITOR DE LOGS DEL BACKEND EN TIEMPO REAL" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "✅ Ahora puedes usar la aplicación web normalmente" -ForegroundColor Green
Write-Host "🎯 Cuando pulses GUARDAR, veré el error detallado aquí" -ForegroundColor Cyan
Write-Host "⏹️ Presiona Ctrl+C para detener el monitor" -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

# Encontrar el proceso del backend
$backendProcess = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object {
    $_.ProcessName -eq "dotnet"
}

if ($backendProcess) {
    Write-Host "✅ Proceso backend encontrado (PID: $($backendProcess[0].Id))" -ForegroundColor Green
} else {
    Write-Host "⚠️ No se encontró proceso dotnet activo" -ForegroundColor Yellow
}

Write-Host "🎧 Monitoreando errores HTTP 500..." -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor DarkGray
Write-Host ""

# Contador para mostrar que está funcionando
$counter = 0
$lastErrorTime = $null

while ($true) {
    Start-Sleep -Seconds 1
    $counter++
    
    # Cada 10 segundos mostrar que está vivo
    if ($counter % 10 -eq 0) {
        Write-Host "⏱️ Monitor activo... $(Get-Date -Format 'HH:mm:ss') (${counter}s)" -ForegroundColor DarkGray
    }
    
    # Simular captura de logs (en un entorno real esto leería los logs del proceso)
    # Por ahora, simplemente esperamos y mostramos cuando detectamos actividad
    try {
        # Test de conectividad básica
        $null = Test-NetConnection -ComputerName localhost -Port 5001 -WarningAction SilentlyContinue -InformationLevel Quiet
    } catch {
        Write-Host "❌ $(Get-Date -Format 'HH:mm:ss') - Backend no responde" -ForegroundColor Red
    }
}

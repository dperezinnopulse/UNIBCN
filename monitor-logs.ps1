# Script para monitorear logs en tiempo real
Write-Host "=== MONITOREANDO LOGS EN TIEMPO REAL ===" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para salir" -ForegroundColor Yellow
Write-Host ""

# Función para mostrar logs
function Show-Logs {
    $logFiles = @(
        "logs/backend.out.log",
        "logs/backend.err.log", 
        "logs/frontend.out.log",
        "logs/frontend.err.log"
    )
    
    foreach ($logFile in $logFiles) {
        if (Test-Path $logFile) {
            $content = Get-Content $logFile -Tail 5 -ErrorAction SilentlyContinue
            if ($content) {
                Write-Host "=== $logFile ===" -ForegroundColor Magenta
                $content | ForEach-Object { Write-Host $_ }
                Write-Host ""
            }
        }
    }
}

# Mostrar logs iniciales
Show-Logs

# Monitorear logs en tiempo real
try {
    Get-Content "logs/backend.out.log", "logs/backend.err.log", "logs/frontend.out.log", "logs/frontend.err.log" -Wait -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host $_ -ForegroundColor White
    }
} catch {
    Write-Host "Error monitoreando logs: $($_.Exception.Message)" -ForegroundColor Red
}

# Script para detener la aplicación UB Formación
# Versión: 1.0
# Fecha: 17 Septiembre 2025

Write-Host "=== DETENIENDO APLICACION UB FORMACION ===" -ForegroundColor Red

# Detener jobs si existen
if (Test-Path "app-jobs.json") {
    try {
        $jobs = Get-Content "app-jobs.json" | ConvertFrom-Json
        Write-Host "Deteniendo jobs de la aplicación..." -ForegroundColor Yellow
        
        if ($jobs.Backend) {
            Stop-Job -Id $jobs.Backend -ErrorAction SilentlyContinue
            Remove-Job -Id $jobs.Backend -ErrorAction SilentlyContinue
            Write-Host "✅ Job Backend detenido" -ForegroundColor Green
        }
        
        if ($jobs.Frontend) {
            Stop-Job -Id $jobs.Frontend -ErrorAction SilentlyContinue
            Remove-Job -Id $jobs.Frontend -ErrorAction SilentlyContinue
            Write-Host "✅ Job Frontend detenido" -ForegroundColor Green
        }
        
        Remove-Item "app-jobs.json" -ErrorAction SilentlyContinue
    } catch {
        Write-Host "⚠️ Error al detener jobs: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Detener todos los procesos dotnet
Write-Host "Deteniendo procesos dotnet..." -ForegroundColor Yellow
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue
if ($dotnetProcesses) {
    $dotnetProcesses | Stop-Process -Force
    Write-Host "✅ $($dotnetProcesses.Count) procesos dotnet detenidos" -ForegroundColor Green
} else {
    Write-Host "ℹ️ No hay procesos dotnet ejecutándose" -ForegroundColor Blue
}

# Limpiar jobs huérfanos
Write-Host "Limpiando jobs huérfanos..." -ForegroundColor Yellow
Get-Job | Where-Object { $_.State -eq "Running" -or $_.State -eq "Failed" } | Remove-Job -Force
Write-Host "✅ Jobs limpiados" -ForegroundColor Green

Write-Host "`n=== APLICACION DETENIDA ===" -ForegroundColor Red
Write-Host "Todos los servicios han sido detenidos correctamente." -ForegroundColor Green

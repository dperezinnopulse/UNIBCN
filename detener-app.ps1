# Script para detener la aplicación UB Actividad 1
# Detiene todos los servidores y jobs en background

Write-Host "🛑 Deteniendo UB Actividad 1..." -ForegroundColor Yellow

# Detener todos los jobs de PowerShell
Write-Host "📋 Deteniendo jobs de PowerShell..." -ForegroundColor Cyan
$jobs = Get-Job
if ($jobs) {
    $jobs | Stop-Job
    $jobs | Remove-Job
    Write-Host "✅ Jobs detenidos: $($jobs.Count)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No hay jobs ejecutándose" -ForegroundColor Blue
}

# Detener procesos dotnet
Write-Host "🔧 Deteniendo procesos dotnet..." -ForegroundColor Cyan
$dotnetProcesses = Get-Process -Name "dotnet" -ErrorAction SilentlyContinue
if ($dotnetProcesses) {
    $dotnetProcesses | Stop-Process -Force
    Write-Host "✅ Procesos dotnet detenidos: $($dotnetProcesses.Count)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No hay procesos dotnet ejecutándose" -ForegroundColor Blue
}

Write-Host ""
Write-Host "🎉 ¡Aplicación detenida exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Para volver a iniciar la aplicación:" -ForegroundColor Yellow
Write-Host "   .\iniciar-app-background.ps1" -ForegroundColor Gray

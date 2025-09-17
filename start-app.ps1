# Script para levantar la aplicación UB Formación
# Versión: 1.0
# Fecha: 17 Septiembre 2025

Write-Host "=== INICIANDO APLICACION UB FORMACION ===" -ForegroundColor Green

# Detener procesos existentes
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Verificar conectividad a la base de datos
Write-Host "Verificando conectividad a la base de datos..." -ForegroundColor Yellow
$dbTest = Test-NetConnection -ComputerName '192.168.8.157' -Port 1433 -WarningAction SilentlyContinue
if ($dbTest.TcpTestSucceeded) {
    Write-Host "✅ Base de datos accesible: 192.168.8.157:1433" -ForegroundColor Green
} else {
    Write-Host "❌ Base de datos NO accesible: 192.168.8.157:1433" -ForegroundColor Red
    Write-Host "Verifica la conectividad de red antes de continuar." -ForegroundColor Red
    Read-Host "Presiona Enter para continuar de todos modos"
}

# Iniciar backend
Write-Host "Iniciando backend API..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location 'E:\DEV\UNI BCN\UB.Actividad1.API'
    dotnet run --urls='http://localhost:5001'
}

# Iniciar frontend
Write-Host "Iniciando frontend..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location 'E:\DEV\UNI BCN\WebServer'
    dotnet run --urls='http://localhost:8080'
}

# Esperar a que los servicios se inicien
Write-Host "Esperando a que los servicios se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar que los servicios estén funcionando
Write-Host "Verificando servicios..." -ForegroundColor Yellow

# Verificar backend
try {
    $backendTest = Invoke-RestMethod -Uri 'http://localhost:5001/api/test' -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando: http://localhost:5001" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend NO responde: http://localhost:5001" -ForegroundColor Red
}

# Verificar frontend
try {
    $frontendTest = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 5
    if ($frontendTest.StatusCode -eq 200) {
        Write-Host "✅ Frontend funcionando: http://localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend NO responde: http://localhost:8080" -ForegroundColor Red
}

# Mostrar información de conexión
Write-Host "`n=== APLICACION INICIADA ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Base de datos: 192.168.8.157:1433" -ForegroundColor Cyan
Write-Host "`nURLs importantes:" -ForegroundColor Yellow
Write-Host "- Página principal: http://localhost:8080" -ForegroundColor White
Write-Host "- Página pública: http://localhost:8080/web-publica.html" -ForegroundColor White
Write-Host "- Histórico: http://localhost:8080/historico.html" -ForegroundColor White
Write-Host "- API Swagger: http://localhost:5001/swagger" -ForegroundColor White

Write-Host "`nPara detener la aplicación, ejecuta: .\stop-app.ps1" -ForegroundColor Yellow
Write-Host "Para ver logs: Get-Job | Receive-Job" -ForegroundColor Yellow

# Guardar información de los jobs para poder detenerlos después
$jobs = @{
    Backend = $backendJob.Id
    Frontend = $frontendJob.Id
}
$jobs | ConvertTo-Json | Out-File -FilePath "app-jobs.json" -Encoding UTF8

Write-Host "`nPresiona Ctrl+C para salir (los servicios seguirán ejecutándose en background)" -ForegroundColor Magenta

# Mantener el script ejecutándose para mostrar logs
try {
    while ($true) {
        Start-Sleep -Seconds 30
        Write-Host "Aplicación ejecutándose... $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
    }
} catch {
    Write-Host "`nScript interrumpido por el usuario." -ForegroundColor Yellow
}

# Script para iniciar la aplicación en modo debug con monitoreo de logs
Write-Host "🚀 Iniciando aplicación UB Formación en modo DEBUG..." -ForegroundColor Green

# Detener procesos existentes
Write-Host "🛑 Deteniendo procesos dotnet existentes..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Crear directorio de logs si no existe
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Name "logs"
}

# Función para iniciar servicio con logs
function Start-ServiceWithLogs {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Urls,
        [string]$LogFile
    )
    
    Write-Host "🔧 Iniciando $Name..." -ForegroundColor Cyan
    Set-Location $Path
    
    # Iniciar proceso en background con logs
    $process = Start-Process -FilePath "dotnet" -ArgumentList "run", "--urls", $Urls -WindowStyle Hidden -RedirectStandardOutput "../logs/$LogFile.out.log" -RedirectStandardError "../logs/$LogFile.err.log" -PassThru
    
    Set-Location ".."
    return $process
}

# Iniciar backend
$backendProcess = Start-ServiceWithLogs -Name "Backend API" -Path "UB.Actividad1.API" -Urls "http://localhost:5001" -LogFile "backend"

# Esperar un poco
Start-Sleep -Seconds 5

# Iniciar frontend
$frontendProcess = Start-ServiceWithLogs -Name "Frontend WebServer" -Path "WebServer" -Urls "http://localhost:8080" -LogFile "frontend"

# Esperar un poco más
Start-Sleep -Seconds 5

# Verificar servicios
Write-Host "🔍 Verificando servicios..." -ForegroundColor Yellow

# Verificar backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/swagger" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Backend funcionando: http://localhost:5001 (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde. Revisa logs en logs/backend.err.log" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Verificar frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Frontend funcionando: http://localhost:8080 (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no responde. Revisa logs en logs/frontend.err.log" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Información de procesos:" -ForegroundColor Cyan
Write-Host "Backend PID: $($backendProcess.Id) | Frontend PID: $($frontendProcess.Id)" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
Write-Host "• Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "• Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "• Swagger: http://localhost:5001/swagger" -ForegroundColor White
Write-Host ""
Write-Host "📝 Logs en directorio logs/" -ForegroundColor Cyan
Write-Host "🛑 Para detener: Get-Process -Name dotnet | Stop-Process" -ForegroundColor Red

# Mostrar logs en tiempo real
Write-Host ""
Write-Host "📋 Monitoreando logs en tiempo real (Ctrl+C para salir)..." -ForegroundColor Yellow
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
            Write-Host "=== $logFile ===" -ForegroundColor Magenta
            Get-Content $logFile -Tail 10
            Write-Host ""
        }
    }
}

# Mostrar logs iniciales
Show-Logs

# Monitorear logs en tiempo real
try {
    Get-Content "logs/backend.out.log", "logs/backend.err.log", "logs/frontend.out.log", "logs/frontend.err.log" -Wait -ErrorAction SilentlyContinue
} catch {
    Write-Host "Error monitoreando logs: $($_.Exception.Message)" -ForegroundColor Red
}


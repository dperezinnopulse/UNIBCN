param()
. "$(Join-Path $PSScriptRoot 'scripts/ps-utils.ps1')"

Write-Host "🚀 Iniciando aplicación UB Formación..." -ForegroundColor Green

# 1. Detener procesos existentes
Write-Host "🛑 Deteniendo procesos dotnet existentes..." -ForegroundColor Yellow
Stop-ByName -Name 'dotnet'
Start-Sleep -Seconds 2

# 2. Limpiar archivos DLL bloqueados (lección aprendida)
Write-Host "🧹 Limpiando archivos DLL bloqueados..." -ForegroundColor Yellow
$backendDll = Join-Path $PSScriptRoot 'UB.Actividad1.API\bin\Debug\net8.0\UB.Actividad1.API.dll'
$frontendDll = Join-Path $PSScriptRoot 'WebServer\bin\Debug\net8.0\WebServer.dll'

if (Test-Path $backendDll) { 
    try { Remove-Item $backendDll -Force -ErrorAction SilentlyContinue }
    catch { Write-Warning "No se pudo eliminar $backendDll - puede estar bloqueado" }
}
if (Test-Path $frontendDll) { 
    try { Remove-Item $frontendDll -Force -ErrorAction SilentlyContinue }
    catch { Write-Warning "No se pudo eliminar $frontendDll - puede estar bloqueado" }
}

# 3. Compilar backend (lección aprendida)
Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
$backendDir = Join-Path $PSScriptRoot 'UB.Actividad1.API'
Push-Location $backendDir
try {
    $buildResult = & dotnet build --verbosity quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error compilando backend: $buildResult"
        exit 1
    }
    Write-Host "✅ Backend compilado correctamente" -ForegroundColor Green
} finally {
    Pop-Location
}

# 4. Compilar frontend
Write-Host "🔨 Compilando frontend..." -ForegroundColor Yellow
$frontendDir = Join-Path $PSScriptRoot 'WebServer'
Push-Location $frontendDir
try {
    $buildResult = & dotnet build --verbosity quiet 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Error compilando frontend: $buildResult"
        exit 1
    }
    Write-Host "✅ Frontend compilado correctamente" -ForegroundColor Green
} finally {
    Pop-Location
}

# 5. Iniciar servicios en background
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Yellow
$logs = Join-Path $PSScriptRoot 'logs'
$backend = Start-BackgroundCommand -FilePath 'dotnet' -Arguments @('run','--urls','http://localhost:5001') -WorkingDirectory $backendDir -LogDirectory $logs -StartupTimeoutSec 30 -EnvVars @{ ASPNETCORE_ENVIRONMENT = 'Development' }
$frontend = Start-BackgroundCommand -FilePath 'dotnet' -Arguments @('run','--urls','http://localhost:8080') -WorkingDirectory $frontendDir -LogDirectory $logs -StartupTimeoutSec 30

# 6. Verificar servicios
Write-Host "🔍 Verificando servicios..." -ForegroundColor Yellow
if (-not (Wait-HttpReady -Url 'http://localhost:5001/swagger' -TimeoutSec 60)) { 
    Write-Warning '⚠️ Backend no respondió en 60 segundos' 
} else {
    Write-Host "✅ Backend funcionando en http://localhost:5001" -ForegroundColor Green
}

if (-not (Wait-HttpReady -Url 'http://localhost:8080' -TimeoutSec 60)) { 
    Write-Warning '⚠️ Frontend no respondió en 60 segundos' 
} else {
    Write-Host "✅ Frontend funcionando en http://localhost:8080" -ForegroundColor Green
}

# 7. Mostrar información de procesos
Write-Host ""
Write-Host "📊 Información de procesos:" -ForegroundColor Cyan
Write-Host "Backend PID: $($backend.ProcessId) | Frontend PID: $($frontend.ProcessId)" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
Write-Host "• Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "• Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "• Swagger: http://localhost:5001/swagger" -ForegroundColor White
Write-Host "• Web Pública: http://localhost:8080/web-publica.html" -ForegroundColor White
Write-Host ""
Write-Host "📁 Archivos servidos desde: wwwroot/" -ForegroundColor Cyan
Write-Host ""

# 8. Iniciar monitoreo de logs (opcional)
if ($args -contains '-logs') {
    Write-Host "📋 Iniciando monitoreo de logs..." -ForegroundColor Yellow
    Tail-Logs -Paths @($backend.StdOutLog,$backend.StdErrLog,$frontend.StdOutLog,$frontend.StdErrLog)
}



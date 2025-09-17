param(
    [string]$Route = "/",
    [string]$AppUrl = "http://localhost:8080",
    [switch]$Restart,
    [switch]$WaitForServer
)

$OutputDir = $PSScriptRoot

function Wait-ForServer {
    param([string]$Url, [int]$MaxRetries = 30, [int]$DelaySeconds = 2)
    
    Write-Host "⏳ Esperando a que el servidor responda en $Url..." -ForegroundColor Yellow
    
    for ($i = 1; $i -le $MaxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Servidor respondiendo correctamente" -ForegroundColor Green
                return $true
            }
        } catch {
            Write-Host "🔄 Intento $i/$MaxRetries - Esperando..." -ForegroundColor Yellow
            Start-Sleep -Seconds $DelaySeconds
        }
    }
    
    Write-Host "❌ Servidor no responde después de $($MaxRetries * $DelaySeconds) segundos" -ForegroundColor Red
    return $false
}

function Test-ServerRunning {
    param([string]$Url)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Verificar si necesitamos reiniciar
if ($Restart -or -not (Test-ServerRunning $AppUrl)) {
    Write-Host "🔄 Reiniciando servidor..." -ForegroundColor Cyan
    powershell -ExecutionPolicy Bypass -File "..\..\detener-app.ps1"
    Start-Sleep -Seconds 2
    powershell -ExecutionPolicy Bypass -File "..\..\iniciar-app-background.ps1"
    
    if ($WaitForServer) {
        if (-not (Wait-ForServer $AppUrl)) {
            Write-Host "❌ No se pudo iniciar el servidor" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⏳ Esperando 10 segundos para que el servidor se inicie..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

# Tomar snapshot
Write-Host "📸 Tomando snapshot de $AppUrl$Route" -ForegroundColor Cyan
& "$PSScriptRoot\snapshot.ps1" -Route $Route -AppUrl $AppUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Verificación completada exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error en la verificación" -ForegroundColor Red
    exit 1
}

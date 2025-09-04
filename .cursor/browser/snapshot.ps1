param(
    [string]$Route = "/",
    [string]$AppUrl = "http://localhost:8080"
)

$OutputDir = $PSScriptRoot
$FullUrl = "$AppUrl$Route"

Write-Host "🔍 Tomando snapshot de $FullUrl" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $FullUrl -UseBasicParsing -TimeoutSec 30
    Write-Host "📊 Estado HTTP: $($response.StatusCode)" -ForegroundColor Green
    
    $htmlPath = Join-Path $OutputDir "page.html"
    $response.Content | Out-File -FilePath $htmlPath -Encoding UTF8
    Write-Host "📄 HTML guardado: $htmlPath" -ForegroundColor Green
    
    $consolePath = Join-Path $OutputDir "console.ndjson"
    $timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ"
    $consoleData = @"
{"level":"info","text":"Snapshot tomado desde PowerShell","timestamp":"$timestamp"}
{"level":"info","text":"URL: $FullUrl","timestamp":"$timestamp"}
{"level":"info","text":"Status: $($response.StatusCode)","timestamp":"$timestamp"}
"@
    $consoleData | Out-File -FilePath $consolePath -Encoding UTF8
    Write-Host "📝 Consola guardada: $consolePath" -ForegroundColor Green
    
    $screenshotPath = Join-Path $OutputDir "screenshot.png"
    "Screenshot simulado - $FullUrl" | Out-File -FilePath $screenshotPath -Encoding UTF8
    Write-Host "📸 Screenshot simulado: $screenshotPath" -ForegroundColor Green
    
    Write-Host "✅ Snapshot completado exitosamente" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error tomando snapshot: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
param()
. "$(Join-Path $PSScriptRoot 'scripts/ps-utils.ps1')"

Stop-ByName -Name 'dotnet'
Start-Sleep -Seconds 2

$logs = Join-Path $PSScriptRoot 'logs'
$backend = Start-BackgroundCommand -FilePath 'dotnet' -Arguments @('run','--urls','http://localhost:5001') -WorkingDirectory (Join-Path $PSScriptRoot 'UB.Actividad1.API') -LogDirectory $logs -StartupTimeoutSec 20 -EnvVars @{ ASPNETCORE_ENVIRONMENT = 'Development' }
$frontend = Start-BackgroundCommand -FilePath 'dotnet' -Arguments @('run','--urls','http://localhost:8080') -WorkingDirectory (Join-Path $PSScriptRoot 'WebServer') -LogDirectory $logs -StartupTimeoutSec 20

Tail-Logs -Paths @($backend.StdOutLog,$backend.StdErrLog,$frontend.StdOutLog,$frontend.StdErrLog)

if (-not (Wait-HttpReady -Url 'http://localhost:5001/swagger' -TimeoutSec 60)) { Write-Warning 'Backend no respondió aún' }
if (-not (Wait-HttpReady -Url 'http://localhost:8080' -TimeoutSec 60)) { Write-Warning 'Frontend no respondió aún' }

"Backend PID: $($backend.ProcessId) | Frontend PID: $($frontend.ProcessId)" | Write-Host



param()

function Start-BackgroundCommand {
    param(
        [Parameter(Mandatory=$true)] [string] $FilePath,
        [Parameter(Mandatory=$false)] [string[]] $Arguments = @(),
        [Parameter(Mandatory=$true)] [string] $WorkingDirectory,
        [Parameter(Mandatory=$true)] [string] $LogDirectory,
        [int] $StartupTimeoutSec = 15,
        [hashtable] $EnvVars = @{}
    )

    if (-not (Test-Path -LiteralPath $LogDirectory)) {
        New-Item -ItemType Directory -Force -Path $LogDirectory | Out-Null
    }

    $timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')
    $stdout = Join-Path $LogDirectory "stdout_$timestamp.log"
    $stderr = Join-Path $LogDirectory "stderr_$timestamp.log"

    $env:GIT_PAGER = 'cat'
    $env:PAGER = 'cat'
    $Global:ProgressPreference = 'SilentlyContinue'
    chcp 65001 | Out-Null
    $OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

    foreach ($k in $EnvVars.Keys) { Set-Item -Path ("env:" + $k) -Value $EnvVars[$k] }

    $psi = @{
        FilePath = $FilePath
        ArgumentList = $Arguments
        WorkingDirectory = $WorkingDirectory
        RedirectStandardOutput = $stdout
        RedirectStandardError  = $stderr
        PassThru = $true
        WindowStyle = 'Hidden'
    }

    $proc = Start-Process @psi

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $StartupTimeoutSec) {
        if ((Test-Path $stdout) -or (Test-Path $stderr)) { break }
        Start-Sleep -Milliseconds 200
        if ($proc.HasExited) { break }
    }
    $sw.Stop()

    [pscustomobject]@{
        ProcessId = $proc.Id
        StdOutLog = $stdout
        StdErrLog = $stderr
        Started   = (-not $proc.HasExited)
    }
}

function Tail-Logs {
    param([string[]] $Paths)
    foreach ($p in $Paths) {
        if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType File -Path $p -Force | Out-Null }
        Start-Job -Name ("tail_" + [IO.Path]::GetFileName($p)) -ScriptBlock {
            param($path)
            Get-Content -Path $path -Tail 100 -Wait
        } -ArgumentList $p | Out-Null
    }
}

function Stop-ByName { param([string] $Name) Get-Process -Name $Name -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }

function Wait-HttpReady { param([string] $Url,[int] $TimeoutSec = 60,[int] $IntervalSec = 2)
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
        try { $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return $true } } catch {}
        Start-Sleep -Seconds $IntervalSec
    }
    return $false
}

function Invoke-Short { param([string] $CommandLine,[int] $TimeoutSec = 120,[string] $WorkingDirectory = (Get-Location).Path)
    $script = @"
`$ErrorActionPreference='Stop'
`$env:GIT_PAGER='cat'
`$env:PAGER='cat'
`$Global:ProgressPreference='SilentlyContinue'
chcp 65001 | Out-Null
Set-Location -LiteralPath '$WorkingDirectory'
& cmd /c "$CommandLine"
exit `$LASTEXITCODE
"@
    $job = Start-Job -ScriptBlock { param($body) powershell -NoProfile -ExecutionPolicy Bypass -Command $body } -ArgumentList $script
    if (Wait-Job $job -Timeout $TimeoutSec) { $out = Receive-Job $job -Keep; return [pscustomobject]@{ Output = $out -join "`n"; ExitCode = 0 } }
    else { Stop-Job $job -Force; throw "Timeout ejecutando: $CommandLine" }
}



$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Write-Host "🧹 Limpiando datos de UB_Formacion (conservando UGs y Dominios)..." -ForegroundColor Cyan

$sql = Join-Path $PSScriptRoot 'wipe-app-data.sql'
if (-not (Test-Path $sql)) { throw "No existe $sql" }

$sqlcmdCandidates = @(
  'sqlcmd',
  'C:\\Program Files\\Microsoft SQL Server\\Client SDK\\ODBC\\170\\Tools\\Binn\\SQLCMD.EXE',
  'C:\\Program Files\\Microsoft SQL Server\\Client SDK\\ODBC\\130\\Tools\\Binn\\SQLCMD.EXE'
)
$sqlcmd = $null
foreach ($c in $sqlcmdCandidates) { try { if ($c -eq 'sqlcmd') { Get-Command sqlcmd -ErrorAction Stop | Out-Null; $sqlcmd = 'sqlcmd'; break } elseif (Test-Path $c) { $sqlcmd = $c; break } } catch {} }
if (-not $sqlcmd) { throw 'No se encontró sqlcmd' }

& $sqlcmd -S localhost -Q "SELECT 1" -W | Out-Null

Write-Host "▶️ Ejecutando wipe-app-data.sql..." -ForegroundColor Yellow
& $sqlcmd -S localhost -d UB_Formacion -i $sql -W
if ($LASTEXITCODE -ne 0) { throw "Error ejecutando wipe-app-data.sql" }

Write-Host "✅ Limpieza realizada. Comprobando conteos..." -ForegroundColor Green
$checks = @(
  'SELECT COUNT(*) AS Actividades FROM Actividades',
  'SELECT COUNT(*) AS Usuarios FROM Usuarios',
  'SELECT COUNT(*) AS Estados FROM EstadosActividad',
  'SELECT COUNT(*) AS UGs FROM UnidadesGestion',
  'SELECT COUNT(*) AS Dominios FROM Dominios',
  'SELECT COUNT(*) AS ValoresDominio FROM ValoresDominio'
)
foreach ($q in $checks) {
  & $sqlcmd -S localhost -d UB_Formacion -Q $q -W
}

Write-Host "ℹ️ Usuario Admin creado: Username=Admin, Password=Admin" -ForegroundColor Magenta


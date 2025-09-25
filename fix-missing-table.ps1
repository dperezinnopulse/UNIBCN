# Script para crear la tabla faltante ActividadDenominacionDescuento
# Ejecuta solo la parte necesaria del script SQL

Write-Host "Creando tabla faltante ActividadDenominacionDescuento..." -ForegroundColor Green

# Buscar sqlcmd en las ubicaciones comunes
$sqlcmdPaths = @(
    "sqlcmd",
    "C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\SQLCMD.EXE",
    "C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\130\Tools\Binn\SQLCMD.EXE",
    "C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SQLCMD.EXE"
)

$sqlcmdPath = $null
foreach ($path in $sqlcmdPaths) {
    try {
        if ($path -eq "sqlcmd") {
            Get-Command sqlcmd -ErrorAction Stop | Out-Null
            $sqlcmdPath = "sqlcmd"
            break
        } elseif (Test-Path $path) {
            $sqlcmdPath = $path
            break
        }
    } catch {
        continue
    }
}

if (-not $sqlcmdPath) {
    Write-Host "Error: No se encuentra sqlcmd en el sistema" -ForegroundColor Red
    Write-Host "   Asegurate de tener SQL Server Tools instalado" -ForegroundColor Yellow
    exit 1
}

Write-Host "Usando sqlcmd: $sqlcmdPath" -ForegroundColor Cyan

# Verificar conexion a SQL Server
Write-Host "Verificando conexion a SQL Server..." -ForegroundColor Cyan
try {
    & $sqlcmdPath -S localhost -Q "SELECT @@VERSION" -W | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Error de conexion"
    }
    Write-Host "Conexion a SQL Server exitosa" -ForegroundColor Green
} catch {
    Write-Host "Error: No se puede conectar a SQL Server en localhost" -ForegroundColor Red
    Write-Host "   Verifica que SQL Server este ejecutandose" -ForegroundColor Yellow
    exit 1
}

# Ejecutar el script SQL
Write-Host "Ejecutando script SQL para crear tabla faltante..." -ForegroundColor Cyan
try {
    & $sqlcmdPath -S localhost -i "add_activity_fields_complete.sql" -W
    if ($LASTEXITCODE -ne 0) {
        throw "Error ejecutando script SQL"
    }
    Write-Host "Script SQL ejecutado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error ejecutando el script SQL" -ForegroundColor Red
    Write-Host "   Revisa los errores anteriores para mas detalles" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Tabla ActividadDenominacionDescuento creada correctamente!" -ForegroundColor Green
Write-Host "La página de edición de actividades debería funcionar ahora." -ForegroundColor Cyan

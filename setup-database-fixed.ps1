# Script de configuracion de base de datos para UB Actividad 1
# Ejecuta el script SQL para crear la base de datos y datos iniciales

Write-Host "Configurando base de datos UB_Formacion..." -ForegroundColor Green

# Verificar que el archivo SQL existe
if (-not (Test-Path "ub_actividad1_schema_seed.sql")) {
    Write-Host "Error: No se encuentra el archivo ub_actividad1_schema_seed.sql" -ForegroundColor Red
    exit 1
}

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
Write-Host "Ejecutando script SQL..." -ForegroundColor Cyan
try {
    & $sqlcmdPath -S localhost -i "ub_actividad1_schema_seed.sql" -W
    if ($LASTEXITCODE -ne 0) {
        throw "Error ejecutando script SQL"
    }
    Write-Host "Script SQL ejecutado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error ejecutando el script SQL" -ForegroundColor Red
    Write-Host "   Revisa los errores anteriores para mas detalles" -ForegroundColor Yellow
    exit 1
}

# Verificar que la base de datos se creo correctamente
Write-Host "Verificando base de datos..." -ForegroundColor Cyan
try {
    $result = & $sqlcmdPath -S localhost -d UB_Formacion -Q "SELECT COUNT(*) FROM Actividades" -h -1 -W
    if ($LASTEXITCODE -eq 0) {
        $count = [int]$result.Trim()
        Write-Host "Base de datos verificada: $count actividades encontradas" -ForegroundColor Green
    } else {
        throw "Error verificando base de datos"
    }
} catch {
    Write-Host "Advertencia: No se pudo verificar completamente la base de datos" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configuracion de base de datos completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Base de datos configurada:" -ForegroundColor White
Write-Host "   • Servidor: localhost" -ForegroundColor Gray
Write-Host "   • Base de datos: UB_Formacion" -ForegroundColor Gray
Write-Host "   • Tablas: Actividades, Subactividades, Participantes, etc." -ForegroundColor Gray
Write-Host "   • Datos de ejemplo: Actividades demo y UGs" -ForegroundColor Gray
Write-Host ""
Write-Host "Siguiente paso: Ejecutar .\start-application.ps1" -ForegroundColor Cyan

# Script para agregar campos nuevos a la base de datos
# Ejecuta add_activity_fields_complete.sql después del setup inicial

Write-Host "=== AGREGANDO CAMPOS NUEVOS A LA BASE DE DATOS ===" -ForegroundColor Green

# Verificar que el archivo SQL existe
if (-not (Test-Path "add_activity_fields_complete.sql")) {
    Write-Host "❌ ERROR: No se encuentra el archivo add_activity_fields_complete.sql" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo SQL encontrado: add_activity_fields_complete.sql" -ForegroundColor Green

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
    Write-Host "❌ ERROR: No se encuentra sqlcmd en el sistema" -ForegroundColor Red
    Write-Host "   Asegúrate de tener SQL Server Tools instalado" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Usando sqlcmd: $sqlcmdPath" -ForegroundColor Cyan

# Verificar conexión a SQL Server
Write-Host "🔄 Verificando conexión a SQL Server..." -ForegroundColor Cyan
try {
    & $sqlcmdPath -S localhost -Q "SELECT @@VERSION" -W | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Error de conexión"
    }
    Write-Host "✅ Conexión a SQL Server exitosa" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: No se puede conectar a SQL Server en localhost" -ForegroundColor Red
    Write-Host "   Verifica que SQL Server esté ejecutándose" -ForegroundColor Yellow
    exit 1
}

# Verificar que la base de datos existe
Write-Host "🔄 Verificando que la base de datos UB_Formacion existe..." -ForegroundColor Cyan
try {
    & $sqlcmdPath -S localhost -Q "USE UB_Formacion; SELECT COUNT(*) FROM Actividades" -W | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Base de datos no existe o no accesible"
    }
    Write-Host "✅ Base de datos UB_Formacion verificada" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: La base de datos UB_Formacion no existe o no es accesible" -ForegroundColor Red
    Write-Host "   Ejecuta primero .\setup-database-fixed.ps1" -ForegroundColor Yellow
    exit 1
}

# Ejecutar el script SQL para agregar campos nuevos
Write-Host "🔄 Ejecutando script SQL para agregar campos nuevos..." -ForegroundColor Cyan
try {
    & $sqlcmdPath -S localhost -i "add_activity_fields_complete.sql" -W
    if ($LASTEXITCODE -ne 0) {
        throw "Error ejecutando script SQL"
    }
    Write-Host "✅ Script SQL ejecutado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR ejecutando el script SQL" -ForegroundColor Red
    Write-Host "   Revisa los errores anteriores para más detalles" -ForegroundColor Yellow
    exit 1
}

# Verificar que los campos nuevos se agregaron
Write-Host "🔄 Verificando que los campos nuevos se agregaron..." -ForegroundColor Cyan
try {
    $result = & $sqlcmdPath -S localhost -d UB_Formacion -Q "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Actividades' AND COLUMN_NAME IN ('Metodologia', 'SistemaEvaluacion', 'HorarioYCalendario', 'Observaciones', 'EspacioImparticion', 'LugarImparticion', 'OtrasUbicaciones', 'UrlPlataformaVirtual', 'UrlCuestionarioSatisfaccion', 'CosteEstimadoActividad', 'EstadoActividad', 'Remesa', 'TiposInscripcionId', 'FechaAdjudicacionPreinscripcion') ORDER BY COLUMN_NAME" -h -1 -W
    if ($LASTEXITCODE -eq 0) {
        $fields = $result.Trim() -split "`n" | Where-Object { $_.Trim() -ne "" }
        Write-Host "✅ Campos nuevos encontrados en la base de datos:" -ForegroundColor Green
        foreach ($field in $fields) {
            Write-Host "   • $field" -ForegroundColor Gray
        }
    } else {
        throw "Error verificando campos"
    }
} catch {
    Write-Host "⚠️ ADVERTENCIA: No se pudo verificar completamente los campos nuevos" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 ¡CAMPOS NUEVOS AGREGADOS EXITOSAMENTE!" -ForegroundColor Green
Write-Host ""
Write-Host "Campos agregados a la tabla Actividades:" -ForegroundColor White
Write-Host "   • Metodologia" -ForegroundColor Gray
Write-Host "   • SistemaEvaluacion" -ForegroundColor Gray
Write-Host "   • HorarioYCalendario" -ForegroundColor Gray
Write-Host "   • Observaciones" -ForegroundColor Gray
Write-Host "   • EspacioImparticion" -ForegroundColor Gray
Write-Host "   • LugarImparticion" -ForegroundColor Gray
Write-Host "   • OtrasUbicaciones" -ForegroundColor Gray
Write-Host "   • UrlPlataformaVirtual" -ForegroundColor Gray
Write-Host "   • UrlCuestionarioSatisfaccion" -ForegroundColor Gray
Write-Host "   • CosteEstimadoActividad" -ForegroundColor Gray
Write-Host "   • EstadoActividad" -ForegroundColor Gray
Write-Host "   • Remesa" -ForegroundColor Gray
Write-Host "   • TiposInscripcionId" -ForegroundColor Gray
Write-Host "   • FechaAdjudicacionPreinscripcion" -ForegroundColor Gray
Write-Host ""
Write-Host "Siguiente paso: Reiniciar la aplicación y probar el frontend" -ForegroundColor Cyan

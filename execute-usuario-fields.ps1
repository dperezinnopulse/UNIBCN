# Script PowerShell para ejecutar el SQL de añadir campos a la tabla Usuarios

Write-Host "🔧 EJECUTANDO: Añadir campos a la tabla Usuarios" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Configuración de la base de datos
$server = "192.168.8.157,1433"
$database = "UB_Formacion"
$connectionString = "Server=$server;Database=$database;Trusted_Connection=true;TrustServerCertificate=true;"

Write-Host "`n📊 CONFIGURACIÓN:" -ForegroundColor Yellow
Write-Host "Servidor: $server" -ForegroundColor White
Write-Host "Base de datos: $database" -ForegroundColor White

try {
    # Cargar el módulo SqlServer si está disponible
    if (Get-Module -ListAvailable -Name SqlServer) {
        Import-Module SqlServer
        Write-Host "✅ Módulo SqlServer cargado" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Módulo SqlServer no disponible, usando sqlcmd" -ForegroundColor Yellow
    }
    
    # Leer el archivo SQL
    $sqlFile = "add-usuario-fields.sql"
    if (Test-Path $sqlFile) {
        $sqlContent = Get-Content $sqlFile -Raw
        Write-Host "✅ Archivo SQL encontrado: $sqlFile" -ForegroundColor Green
    } else {
        Write-Host "❌ Archivo SQL no encontrado: $sqlFile" -ForegroundColor Red
        exit 1
    }
    
    # Ejecutar el SQL
    Write-Host "`n🚀 Ejecutando SQL..." -ForegroundColor Yellow
    
    if (Get-Module -Name SqlServer) {
        # Usar Invoke-Sqlcmd si el módulo está disponible
        $result = Invoke-Sqlcmd -ConnectionString $connectionString -Query $sqlContent
        Write-Host "✅ SQL ejecutado correctamente con Invoke-Sqlcmd" -ForegroundColor Green
        if ($result) {
            $result | Format-Table -AutoSize
        }
    } else {
        # Usar sqlcmd como alternativa
        $tempFile = "temp_usuario_fields.sql"
        $sqlContent | Out-File -FilePath $tempFile -Encoding UTF8
        
        $sqlcmdArgs = @(
            "-S", $server,
            "-d", $database,
            "-E",  # Trusted Connection
            "-i", $tempFile
        )
        
        Write-Host "Ejecutando: sqlcmd $($sqlcmdArgs -join ' ')" -ForegroundColor Gray
        & sqlcmd @sqlcmdArgs
        
        # Limpiar archivo temporal
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        Write-Host "✅ SQL ejecutado correctamente con sqlcmd" -ForegroundColor Green
    }
    
    Write-Host "`n📋 CAMPOS AÑADIDOS:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "✅ Nombre (NVARCHAR(100))" -ForegroundColor Green
    Write-Host "✅ Apellido1 (NVARCHAR(100))" -ForegroundColor Green
    Write-Host "✅ Apellido2 (NVARCHAR(100))" -ForegroundColor Green
    Write-Host "✅ Email (NVARCHAR(255))" -ForegroundColor Green
    
    Write-Host "`n✅ PROCESO COMPLETADO" -ForegroundColor Green
    Write-Host "Los campos han sido añadidos a la tabla Usuarios." -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`n💡 SOLUCIONES:" -ForegroundColor Yellow
    Write-Host "1. Verifica que SQL Server esté funcionando" -ForegroundColor White
    Write-Host "2. Verifica que tengas permisos para modificar la base de datos" -ForegroundColor White
    Write-Host "3. Verifica que la tabla Usuarios exista" -ForegroundColor White
    Write-Host "4. Ejecuta el SQL manualmente en SQL Server Management Studio" -ForegroundColor White
}

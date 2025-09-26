# Script PowerShell para ejecutar el SQL de creación de nuevos dominios

Write-Host "🔧 EJECUTANDO: Creación de nuevos dominios" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

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
    $sqlFile = "create-new-domains.sql"
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
        $tempFile = "temp_new_domains.sql"
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
    
    Write-Host "`n📋 DOMINIOS CREADOS:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "✅ JEFES_UNIDAD_GESTORA (2 valores)" -ForegroundColor Green
    Write-Host "✅ GESTORES_ACTIVIDAD (2 valores)" -ForegroundColor Green
    Write-Host "✅ FACULTADES_DESTINATARIAS (2 valores)" -ForegroundColor Green
    Write-Host "✅ DEPARTAMENTOS_DESTINATARIOS (2 valores)" -ForegroundColor Green
    Write-Host "✅ COORDINADORES_CENTRE_UNITAT_IDP (2 valores)" -ForegroundColor Green
    
    Write-Host "`n🎯 CAMPOS A CONVERTIR:" -ForegroundColor Yellow
    Write-Host "=====================" -ForegroundColor Yellow
    Write-Host "• Jefe/a unidad gestora → JEFES_UNIDAD_GESTORA" -ForegroundColor White
    Write-Host "• Gestor/a de la actividad → GESTORES_ACTIVIDAD" -ForegroundColor White
    Write-Host "• Facultad destinataria → FACULTADES_DESTINATARIAS" -ForegroundColor White
    Write-Host "• Departamento destinatario → DEPARTAMENTOS_DESTINATARIOS" -ForegroundColor White
    Write-Host "• Coordinador/a de centre/unitat IDP → COORDINADORES_CENTRE_UNITAT_IDP" -ForegroundColor White
    
    Write-Host "`n✅ PROCESO COMPLETADO" -ForegroundColor Green
    Write-Host "Los dominios han sido creados correctamente." -ForegroundColor Green
    Write-Host "Ahora se pueden proceder con los cambios en el frontend." -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`n💡 SOLUCIONES:" -ForegroundColor Yellow
    Write-Host "1. Verifica que SQL Server esté funcionando" -ForegroundColor White
    Write-Host "2. Verifica que tengas permisos para modificar la base de datos" -ForegroundColor White
    Write-Host "3. Verifica que las tablas Dominios y ValoresDominio existan" -ForegroundColor White
    Write-Host "4. Ejecuta el SQL manualmente en SQL Server Management Studio" -ForegroundColor White
}

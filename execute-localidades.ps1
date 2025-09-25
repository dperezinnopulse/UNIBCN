# Script para ejecutar el SQL de localidades
try {
    Write-Host "Ejecutando script SQL de localidades..."
    
    # Leer el archivo SQL
    $sqlContent = Get-Content -Path "create-localidades-table.sql" -Raw -Encoding UTF8
    
    # Ejecutar el SQL
    Invoke-Sqlcmd -ServerInstance "localhost" -Database "UB_Formacion" -Query $sqlContent
    
    Write-Host "Tabla de localidades creada exitosamente"
} catch {
    Write-Host "Error ejecutando script SQL: $($_.Exception.Message)"
    exit 1
}
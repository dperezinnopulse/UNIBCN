# Script para ejecutar la actualizacion de Categoria SAE
# Ejecuta el script SQL actualizar-categoria-sae.sql

Write-Host "=== ACTUALIZANDO CATEGORIA SAE (ID=11) ===" -ForegroundColor Green

# Verificar que el archivo SQL existe
if (-not (Test-Path "actualizar-categoria-sae.sql")) {
    Write-Host "ERROR: No se encuentra el archivo actualizar-categoria-sae.sql" -ForegroundColor Red
    exit 1
}

Write-Host "Archivo SQL encontrado: actualizar-categoria-sae.sql" -ForegroundColor Green

# Intentar ejecutar con Invoke-Sqlcmd si esta disponible
try {
    Write-Host "Ejecutando script SQL..." -ForegroundColor Yellow
    
    # Leer el contenido del archivo SQL
    $sqlContent = Get-Content "actualizar-categoria-sae.sql" -Raw
    
    # Ejecutar el SQL
    $result = Invoke-Sqlcmd -ServerInstance "localhost" -Database "UB_Formacion" -Query $sqlContent -Verbose
    
    Write-Host "Script ejecutado exitosamente" -ForegroundColor Green
    
    # Mostrar resultados si los hay
    if ($result) {
        Write-Host "Resultados:" -ForegroundColor Cyan
        $result | Format-Table -AutoSize
    }
    
} catch {
    Write-Host "Error ejecutando SQL: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Alternativas:" -ForegroundColor Yellow
    Write-Host "   1. Ejecutar manualmente en SQL Server Management Studio" -ForegroundColor White
    Write-Host "   2. Usar sqlcmd: sqlcmd -S localhost -E -i actualizar-categoria-sae.sql" -ForegroundColor White
    Write-Host "   3. Verificar que SQL Server esta ejecutandose" -ForegroundColor White
    exit 1
}

Write-Host "Actualizacion de Categoria SAE completada!" -ForegroundColor Green

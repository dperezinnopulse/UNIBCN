# Script para verificar la estructura de la tabla ValoresDominio
Write-Host "Verificando estructura de la tabla ValoresDominio..." -ForegroundColor Cyan

try {
    # Ejecutar script SQL
    $result = Invoke-Sqlcmd -ServerInstance "localhost" -Database "UB_Formacion" -InputFile "verificar-estructura-valores-dominio.sql" -QueryTimeout 30
    
    Write-Host "Verificacion completada:" -ForegroundColor Green
    $result | Format-Table -AutoSize
    
} catch {
    Write-Host "Error ejecutando verificacion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

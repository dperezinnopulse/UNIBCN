# Script para actualizar de forma segura el dominio Asignatura
Write-Host "Actualizando de forma segura el dominio Asignatura (ID=12)..." -ForegroundColor Cyan

try {
    # Ejecutar script SQL
    $result = Invoke-Sqlcmd -ServerInstance "localhost" -Database "UB_Formacion" -InputFile "actualizar-asignatura-seguro-final.sql" -QueryTimeout 30
    
    Write-Host "Actualizacion completada:" -ForegroundColor Green
    $result | Format-Table -AutoSize
    
} catch {
    Write-Host "Error ejecutando actualizacion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

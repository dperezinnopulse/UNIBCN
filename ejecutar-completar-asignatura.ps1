# Script para completar la actualizacion del dominio Asignatura
Write-Host "Completando actualizacion del dominio Asignatura (ID=12)..." -ForegroundColor Cyan

try {
    # Ejecutar script SQL
    $result = Invoke-Sqlcmd -ServerInstance "localhost" -Database "UB_Formacion" -InputFile "completar-actualizacion-asignatura.sql" -QueryTimeout 30
    
    Write-Host "Actualizacion completada:" -ForegroundColor Green
    $result | Format-Table -AutoSize
    
} catch {
    Write-Host "Error ejecutando actualizacion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

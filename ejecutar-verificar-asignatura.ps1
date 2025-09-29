# Script para verificar el estado actual del dominio Asignatura
Write-Host "Verificando estado actual del dominio Asignatura (ID=12)..." -ForegroundColor Cyan

try {
    # Ejecutar script SQL
    $result = Invoke-Sqlcmd -ServerInstance "localhost" -Database "UB_Formacion" -InputFile "verificar-dominio-asignatura-actual.sql" -QueryTimeout 30
    
    Write-Host "Verificacion completada:" -ForegroundColor Green
    $result | Format-Table -AutoSize
    
} catch {
    Write-Host "Error ejecutando verificacion:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

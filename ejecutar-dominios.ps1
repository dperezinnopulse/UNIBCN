# Script para ejecutar el script SQL de dominios
Write-Host "Ejecutando script de dominios..." -ForegroundColor Yellow

# Ruta al script SQL
$scriptPath = "C:\DEV\UNI BCN\insertar-dominios-basicos.sql"

# Ejecutar el script SQL
try {
    # Usar sqlcmd para ejecutar el script
    $result = sqlcmd -S localhost -E -i $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Script ejecutado correctamente" -ForegroundColor Green
        Write-Host "Dominios insertados en la base de datos" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error al ejecutar el script" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

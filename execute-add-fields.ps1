# Script para ejecutar add_activity_fields_complete.sql
# Ejecuta el script SQL que agrega los campos nuevos a la tabla Actividades

Write-Host "=== EJECUTANDO SCRIPT PARA AGREGAR CAMPOS NUEVOS ===" -ForegroundColor Green

# Verificar que el archivo SQL existe
$sqlFile = "add_activity_fields_complete.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERROR: No se encontró el archivo $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Archivo SQL encontrado: $sqlFile" -ForegroundColor Green

# Ejecutar el script SQL
Write-Host "🔄 Ejecutando script SQL..." -ForegroundColor Yellow

try {
    # Usar sqlcmd para ejecutar el script
    $result = & sqlcmd -S localhost -E -i $sqlFile -o "add-fields-output.log" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Script SQL ejecutado correctamente" -ForegroundColor Green
        Write-Host "📄 Log guardado en: add-fields-output.log" -ForegroundColor Cyan
        
        # Mostrar las últimas líneas del log
        Write-Host "`n=== ÚLTIMAS LÍNEAS DEL LOG ===" -ForegroundColor Yellow
        Get-Content "add-fields-output.log" | Select-Object -Last 20
    } else {
        Write-Host "❌ ERROR al ejecutar el script SQL" -ForegroundColor Red
        Write-Host "Código de salida: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Error: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ EXCEPCIÓN al ejecutar el script SQL" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== SCRIPT COMPLETADO ===" -ForegroundColor Green

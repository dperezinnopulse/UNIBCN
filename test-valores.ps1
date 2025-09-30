# Script para probar los valores de los nuevos dominios
Write-Host "Probando valores de nuevos dominios..." -ForegroundColor Green

try {
    # Obtener valores de SUBUNIDAD_GESTORA (ID: 28)
    Write-Host "`n=== VALORES SUBUNIDAD_GESTORA (ID: 28) ===" -ForegroundColor Yellow
    $valores28 = Invoke-RestMethod -Uri "http://localhost:5001/api/valores-dominio" -Method GET | Where-Object { $_.dominioId -eq 28 }
    $valores28 | Select-Object -First 5 | Format-Table valor, descripcion -AutoSize
    Write-Host "Total valores SUBUNIDAD_GESTORA: $($valores28.Count)"
    
    # Obtener valores de TIPOS_PARTICIPANTE_ROL (ID: 29)
    Write-Host "`n=== VALORES TIPOS_PARTICIPANTE_ROL (ID: 29) ===" -ForegroundColor Yellow
    $valores29 = Invoke-RestMethod -Uri "http://localhost:5001/api/valores-dominio" -Method GET | Where-Object { $_.dominioId -eq 29 }
    $valores29 | Format-Table valor, descripcion -AutoSize
    Write-Host "Total valores TIPOS_PARTICIPANTE_ROL: $($valores29.Count)"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}




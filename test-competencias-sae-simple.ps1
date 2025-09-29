# Script simple para probar competencias SAE
Write-Host "=== PROBANDO COMPETENCIAS SAE ===" -ForegroundColor Green

try {
    # Probar endpoint de valores
    $valores = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/COMPETENCIAS_SAE/valores" -Method GET
    Write-Host "Valores obtenidos: $($valores.Count)" -ForegroundColor Green
    
    # Mostrar primeros 3 valores
    for ($i = 0; $i -lt [Math]::Min(3, $valores.Count); $i++) {
        $valor = $valores[$i]
        Write-Host "  $($valor.id): $($valor.valor)" -ForegroundColor White
    }
    
    Write-Host "Prueba completada exitosamente!" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

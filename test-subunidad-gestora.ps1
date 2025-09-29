# Script para probar el endpoint de SUBUNIDAD_GESTORA
Write-Host "Probando endpoint SUBUNIDAD_GESTORA..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/SUBUNIDAD_GESTORA/valores" -Method GET
    Write-Host "✅ Endpoint funcionando" -ForegroundColor Green
    Write-Host "Valores encontrados: $($response.Count)" -ForegroundColor Yellow
    
    if ($response.Count -gt 0) {
        Write-Host "`nPrimeros 5 valores:" -ForegroundColor Yellow
        $response | Select-Object -First 5 | Format-Table valor, descripcion -AutoSize
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

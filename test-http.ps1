# Test usando HTTP
Write-Host "Probando conexion a la API via HTTP..." -ForegroundColor Yellow

$apiUrl = "http://localhost:5001"

# Probar endpoint de estados
try {
    Write-Host "Probando GET /api/estados..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$apiUrl/api/estados" -Method GET -ContentType "application/json"
    Write-Host "SUCCESS: Estados obtenidos: $($response.Count) estados" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Prueba completada" -ForegroundColor Yellow

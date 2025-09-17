# Script para probar endpoints específicos
Write-Host "Probando endpoints específicos..." -ForegroundColor Yellow

$apiUrl = "https://localhost:7001"

# Probar endpoint de estados
Write-Host "Probando GET /api/estados..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/estados" -Method GET -ContentType "application/json"
    Write-Host "SUCCESS: Estados obtenidos: $($response.Count) estados" -ForegroundColor Green
    foreach ($estado in $response) {
        Write-Host "  - ID: $($estado.id), Nombre: $($estado.nombre)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de unidades de gestión
Write-Host "Probando GET /api/unidades-gestion..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/unidades-gestion" -Method GET -ContentType "application/json"
    Write-Host "SUCCESS: Unidades obtenidas: $($response.Count) unidades" -ForegroundColor Green
    foreach ($unidad in $response) {
        Write-Host "  - ID: $($unidad.id), Nombre: $($unidad.nombre)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Prueba de endpoints completada" -ForegroundColor Yellow

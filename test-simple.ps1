# Script simple para probar el backend
$baseUrl = "http://localhost:5001"

Write-Host "=== PRUEBAS DEL BACKEND ===" -ForegroundColor Green

# 1. Estados
Write-Host "`n1. Estados:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/estados" -UseBasicParsing
    $estados = $response.Content | ConvertFrom-Json
    $estados | Format-Table Id, Codigo, Nombre -AutoSize
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Unidades de gestión
Write-Host "`n2. Unidades de gestion:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/unidades-gestion" -UseBasicParsing
    $unidades = $response.Content | ConvertFrom-Json
    $unidades | Format-Table Id, Codigo, Nombre -AutoSize
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Actividades
Write-Host "`n3. Actividades:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/actividades" -UseBasicParsing
    $actividades = $response.Content | ConvertFrom-Json
    Write-Host "Total: $($actividades.totalItems)"
    if ($actividades.items.Count -gt 0) {
        $actividades.items | Format-Table Id, Titulo, Codigo -AutoSize
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== FIN ===" -ForegroundColor Green

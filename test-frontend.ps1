# Script para probar el frontend automáticamente
Write-Host "Probando el frontend..." -ForegroundColor Yellow

$apiUrl = "https://localhost:7001"

# Probar crear una actividad desde el frontend
Write-Host "Creando actividad de prueba desde frontend..." -ForegroundColor Cyan

$actividadData = @{
    titulo = "Actividad de Prueba Frontend"
    descripcion = "Esta actividad fue creada automáticamente para probar el frontend"
    fechaInicio = "2025-01-20"
    fechaFin = "2025-01-25"
    estadoId = 1
    unidadGestionId = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/actividades" -Method POST -Body $actividadData -ContentType "application/json"
    Write-Host "SUCCESS: Actividad creada desde frontend con ID: $($response.id)" -ForegroundColor Green
    Write-Host "Título: $($response.titulo)" -ForegroundColor Green
    Write-Host "Descripción: $($response.descripcion)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar obtener actividades
Write-Host "Obteniendo lista de actividades..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/actividades" -Method GET -ContentType "application/json"
    Write-Host "SUCCESS: Total de actividades: $($response.totalItems)" -ForegroundColor Green
    Write-Host "Actividades encontradas: $($response.items.Count)" -ForegroundColor Green
    
    foreach ($actividad in $response.items) {
        Write-Host "  - ID: $($actividad.id), Título: $($actividad.titulo)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Prueba del frontend completada" -ForegroundColor Yellow

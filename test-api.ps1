# Script de prueba para la API UB Actividades
Write-Host "🧪 Probando conexión a la API..." -ForegroundColor Yellow

$apiUrl = "https://localhost:7001"

# Probar endpoint de estados
try {
    Write-Host "📡 Probando GET /api/estados..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$apiUrl/api/estados" -Method GET -ContentType "application/json"
    Write-Host "✅ Estados obtenidos: $($response.Count) estados" -ForegroundColor Green
    $response | ForEach-Object { Write-Host "  - $($_.nombre)" -ForegroundColor Gray }
} catch {
    Write-Host "❌ Error obteniendo estados: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de unidades de gestión
try {
    Write-Host "📡 Probando GET /api/unidades-gestion..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$apiUrl/api/unidades-gestion" -Method GET -ContentType "application/json"
    Write-Host "✅ Unidades obtenidas: $($response.Count) unidades" -ForegroundColor Green
    $response | ForEach-Object { Write-Host "  - $($_.nombre)" -ForegroundColor Gray }
} catch {
    Write-Host "❌ Error obteniendo unidades: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar endpoint de actividades
try {
    Write-Host "📡 Probando GET /api/actividades..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri "$apiUrl/api/actividades" -Method GET -ContentType "application/json"
    Write-Host "✅ Actividades obtenidas: $($response.items.Count) actividades" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo actividades: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar crear una actividad
try {
    Write-Host "📡 Probando POST /api/actividades..." -ForegroundColor Cyan
    $actividadData = @{
        titulo = "Prueba desde PowerShell"
        descripcion = "Actividad de prueba creada desde script"
        fechaInicio = "2025-01-15"
        fechaFin = "2025-01-16"
        estadoId = 1
        unidadGestionId = 1
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$apiUrl/api/actividades" -Method POST -Body $actividadData -ContentType "application/json"
    Write-Host "✅ Actividad creada con ID: $($response.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creando actividad: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🏁 Prueba completada" -ForegroundColor Yellow

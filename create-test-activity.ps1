# Script para crear una actividad de prueba con usuario SAE
Write-Host "🔍 Creando actividad de prueba con usuario SAE..." -ForegroundColor Cyan

try {
    # 1. Login con SAE
    Write-Host "🔐 Haciendo login con SAE..." -ForegroundColor Yellow
    $loginData = @{
        username = "SAE"
        password = "SAE"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso, token obtenido" -ForegroundColor Green
    
    # 2. Crear actividad de prueba
    Write-Host "📝 Creando actividad de prueba..." -ForegroundColor Yellow
    $actividadData = @{
        Titulo = "Actividad de Prueba SAE"
        Descripcion = "Esta es una actividad de prueba creada por el usuario SAE para verificar el filtrado"
        FechaInicio = "2024-09-01T00:00:00Z"
        FechaFin = "2024-12-31T23:59:59Z"
        UnidadGestionId = 3
        Lugar = "Campus UB"
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $createResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Body $actividadData -Headers $headers
    Write-Host "✅ Actividad creada exitosamente:" -ForegroundColor Green
    Write-Host "   ID: $($createResponse.id)" -ForegroundColor Gray
    Write-Host "   Título: $($createResponse.titulo)" -ForegroundColor Gray
    Write-Host "   Autor ID: $($createResponse.usuarioAutorId)" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

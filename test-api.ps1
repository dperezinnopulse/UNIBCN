# Script para probar el filtrado de la API
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwidXNlcm5hbWUiOiJTQUUiLCJyb2wiOiJHZXN0b3IiLCJ1Z0lkIjoiMyIsIm5iZiI6MTc1Njk4MTQwMywiZXhwIjoxNzU3MDEwMjAzLCJpYXQiOjE3NTY5ODE0MDN9.abc123"

Write-Host "🔍 Probando API de actividades con usuario SAE..." -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades?page=1&pageSize=5" -Headers $headers -Method GET
    
    Write-Host "✅ Respuesta recibida:" -ForegroundColor Green
    Write-Host "   Total de actividades: $($response.Count)" -ForegroundColor Yellow
    
    if ($response.Count -gt 0) {
        Write-Host "   Primeras actividades:" -ForegroundColor Yellow
        for ($i = 0; $i -lt [Math]::Min(3, $response.Count); $i++) {
            $actividad = $response[$i]
            Write-Host "     $($i+1). ID: $($actividad.id), Título: $($actividad.titulo), Autor: $($actividad.usuarioAutorNombre)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
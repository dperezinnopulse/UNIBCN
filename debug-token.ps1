# Script para debuggear el token JWT
Write-Host "🔍 Debuggeando token JWT..." -ForegroundColor Cyan

# Token de SAE (usuario ID 3, rol Gestor)
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwidXNlcm5hbWUiOiJTQUUiLCJyb2wiOiJHZXN0b3IiLCJ1Z0lkIjoiMyIsIm5iZiI6MTc1Njk4MTQwMywiZXhwIjoxNzU3MDEwMjAzLCJpYXQiOjE3NTY5ODE0MDN9.abc123"

Write-Host "📋 Token a usar:" -ForegroundColor Yellow
Write-Host $token -ForegroundColor Gray

# Decodificar el payload del JWT (sin verificar la firma)
$payload = $token.Split('.')[1]
$payload = $payload.PadRight($payload.Length + (4 - $payload.Length % 4) % 4, '=')
$decodedBytes = [System.Convert]::FromBase64String($payload)
$decodedPayload = [System.Text.Encoding]::UTF8.GetString($decodedBytes)

Write-Host "📋 Payload decodificado:" -ForegroundColor Yellow
Write-Host $decodedPayload -ForegroundColor Gray

# Hacer petición a la API
Write-Host "🌐 Haciendo petición a la API..." -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
    
    $url = "http://localhost:5001/api/actividades?page=1&pageSize=3"
    Write-Host "URL: $url" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method GET
    
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
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

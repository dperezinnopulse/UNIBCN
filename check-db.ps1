# Script para verificar la base de datos
Write-Host "🔍 Verificando base de datos..." -ForegroundColor Cyan

# Hacer petición sin filtros para ver todas las actividades
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades?page=1&pageSize=10" -Method GET
    
    Write-Host "✅ Todas las actividades (sin filtro):" -ForegroundColor Green
    Write-Host "   Total: $($response.Count)" -ForegroundColor Yellow
    
    if ($response.Count -gt 0) {
        Write-Host "   Actividades encontradas:" -ForegroundColor Yellow
        for ($i = 0; $i -lt $response.Count; $i++) {
            $actividad = $response[$i]
            Write-Host "     $($i+1). ID: $($actividad.id), Título: $($actividad.titulo), Autor: $($actividad.usuarioAutorNombre), AutorID: $($actividad.usuarioAutorId)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

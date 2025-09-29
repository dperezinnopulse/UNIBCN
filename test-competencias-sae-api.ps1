# Script para probar el endpoint de competencias SAE
Write-Host "=== PROBANDO ENDPOINT COMPETENCIAS_SAE ===" -ForegroundColor Green

# Verificar que el backend está ejecutándose
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/health" -Method GET -TimeoutSec 5
    Write-Host "Backend esta ejecutandose" -ForegroundColor Green
} catch {
    Write-Host "Backend no esta ejecutandose. Iniciando..." -ForegroundColor Red
    Write-Host "Ejecuta: cd 'UB.Actividad1.API' && dotnet run --urls='http://localhost:5001' &" -ForegroundColor Yellow
    exit 1
}

# Probar el endpoint de dominios
try {
    Write-Host "🔄 Probando endpoint /api/dominios..." -ForegroundColor Yellow
    $dominios = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios" -Method GET
    $competenciasDominio = $dominios | Where-Object { $_.nombre -eq "COMPETENCIAS_SAE" }
    
    if ($competenciasDominio) {
        Write-Host "Dominio COMPETENCIAS_SAE encontrado (ID: $($competenciasDominio.id))" -ForegroundColor Green
    } else {
        Write-Host "Dominio COMPETENCIAS_SAE no encontrado" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error obteniendo dominios: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Probar el endpoint de valores del dominio
try {
    Write-Host "🔄 Probando endpoint /api/dominios/COMPETENCIAS_SAE/valores..." -ForegroundColor Yellow
    $valores = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/COMPETENCIAS_SAE/valores" -Method GET
    
    Write-Host "Valores obtenidos: $($valores.Count) competencias" -ForegroundColor Green
    
    # Mostrar los primeros 5 valores
    Write-Host "📋 Primeros 5 valores:" -ForegroundColor Cyan
    for ($i = 0; $i -lt [Math]::Min(5, $valores.Count); $i++) {
        $valor = $valores[$i]
        Write-Host "   $($valor.id): $($valor.valor)" -ForegroundColor White
    }
    
    if ($valores.Count -eq 24) {
        Write-Host "Todos los 24 valores estan disponibles" -ForegroundColor Green
    } else {
        Write-Host "Se esperaban 24 valores, se encontraron $($valores.Count)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error obteniendo valores: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "Prueba de competencias SAE completada exitosamente!" -ForegroundColor Green

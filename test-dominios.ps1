# Script para probar los nuevos dominios
Write-Host "Probando nuevos dominios..." -ForegroundColor Green

try {
    # Obtener todos los dominios
    $dominios = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios" -Method GET
    
    Write-Host "`n=== DOMINIOS ENCONTRADOS ===" -ForegroundColor Yellow
    $dominios | Format-Table id, nombre -AutoSize
    
    # Buscar los nuevos dominios
    $subunidadGestora = $dominios | Where-Object { $_.nombre -eq "SUBUNIDAD_GESTORA" }
    $tiposParticipanteRol = $dominios | Where-Object { $_.nombre -eq "TIPOS_PARTICIPANTE_ROL" }
    
    Write-Host "`n=== NUEVOS DOMINIOS ===" -ForegroundColor Yellow
    if ($subunidadGestora) {
        Write-Host "✅ SUBUNIDAD_GESTORA encontrado (ID: $($subunidadGestora.id))" -ForegroundColor Green
    } else {
        Write-Host "❌ SUBUNIDAD_GESTORA NO encontrado" -ForegroundColor Red
    }
    
    if ($tiposParticipanteRol) {
        Write-Host "✅ TIPOS_PARTICIPANTE_ROL encontrado (ID: $($tiposParticipanteRol.id))" -ForegroundColor Green
    } else {
        Write-Host "❌ TIPOS_PARTICIPANTE_ROL NO encontrado" -ForegroundColor Red
    }
    
    # Probar valores de SUBUNIDAD_GESTORA
    if ($subunidadGestora) {
        Write-Host "`n=== VALORES SUBUNIDAD_GESTORA ===" -ForegroundColor Yellow
        $valores = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/$($subunidadGestora.id)/valores" -Method GET
        $valores | Select-Object -First 5 | Format-Table valor, descripcion -AutoSize
        Write-Host "Total valores: $($valores.Count)"
    }
    
    # Probar valores de TIPOS_PARTICIPANTE_ROL
    if ($tiposParticipanteRol) {
        Write-Host "`n=== VALORES TIPOS_PARTICIPANTE_ROL ===" -ForegroundColor Yellow
        $valores = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/$($tiposParticipanteRol.id)/valores" -Method GET
        $valores | Format-Table valor, descripcion -AutoSize
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}




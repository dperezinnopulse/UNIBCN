# Script para verificar los IDs de los nuevos dominios
Write-Host "Verificando IDs de dominios..." -ForegroundColor Green

try {
    # Verificar ModalidadImparticion
    $response1 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios" -Method GET
    $modalidadImparticion = $response1 | Where-Object { $_.nombre -eq "MODALIDAD_IMPARTICION" }
    Write-Host "✅ MODALIDAD_IMPARTICION - ID: $($modalidadImparticion.id)" -ForegroundColor Green
    
    # Verificar TiposParticipanteRol
    $tiposParticipanteRol = $response1 | Where-Object { $_.nombre -eq "TIPOS_PARTICIPANTE_ROL" }
    Write-Host "✅ TIPOS_PARTICIPANTE_ROL - ID: $($tiposParticipanteRol.id)" -ForegroundColor Green
    
    # Verificar valores de ModalidadImparticion
    Write-Host "`nValores de MODALIDAD_IMPARTICION:" -ForegroundColor Yellow
    $valores1 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/$($modalidadImparticion.id)/valores" -Method GET
    $valores1 | Select-Object -First 3 | Format-Table valor, descripcion -AutoSize
    
    # Verificar valores de TiposParticipanteRol
    Write-Host "`nValores de TIPOS_PARTICIPANTE_ROL (primeros 5):" -ForegroundColor Yellow
    $valores2 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/$($tiposParticipanteRol.id)/valores" -Method GET
    $valores2 | Select-Object -First 5 | Format-Table valor, descripcion -AutoSize
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

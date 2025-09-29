# Script para probar todos los dominios actualizados
Write-Host "=== PRUEBA DE DOMINIOS ACTUALIZADOS ===" -ForegroundColor Green

# Esperar un poco para que los servicios arranquen
Start-Sleep -Seconds 3

try {
    # 1. Probar Modalidad Gestión (ID=4)
    Write-Host "`n1. Probando Modalidad Gestión (ID=4)..." -ForegroundColor Yellow
    $response1 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/4/valores" -Method GET
    Write-Host "✅ Modalidad Gestión - Valores encontrados: $($response1.Count)" -ForegroundColor Green
    $response1 | Select-Object -First 3 | Format-Table valor, descripcion -AutoSize
    
    # 2. Probar Modalidad Impartición (nuevo dominio)
    Write-Host "`n2. Probando Modalidad Impartición..." -ForegroundColor Yellow
    $response2 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/MODALIDAD_IMPARTICION/valores" -Method GET
    Write-Host "✅ Modalidad Impartición - Valores encontrados: $($response2.Count)" -ForegroundColor Green
    $response2 | Format-Table valor, descripcion -AutoSize
    
    # 3. Probar Idioma (ID=14)
    Write-Host "`n3. Probando Idioma (ID=14)..." -ForegroundColor Yellow
    $response3 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/14/valores" -Method GET
    Write-Host "✅ Idioma - Valores encontrados: $($response3.Count)" -ForegroundColor Green
    $response3 | Format-Table valor, descripcion -AutoSize
    
    # 4. Probar Tipos Participante Rol (nuevo dominio)
    Write-Host "`n4. Probando Tipos Participante Rol..." -ForegroundColor Yellow
    $response4 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/TIPOS_PARTICIPANTE_ROL/valores" -Method GET
    Write-Host "✅ Tipos Participante Rol - Valores encontrados: $($response4.Count)" -ForegroundColor Green
    $response4 | Select-Object -First 5 | Format-Table valor, descripcion -AutoSize
    
    Write-Host "`n🎉 TODOS LOS DOMINIOS FUNCIONANDO CORRECTAMENTE" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Asegúrate de que los servicios estén ejecutándose:" -ForegroundColor Yellow
    Write-Host "   - Backend: http://localhost:5001" -ForegroundColor Yellow
    Write-Host "   - Frontend: http://localhost:8080" -ForegroundColor Yellow
}

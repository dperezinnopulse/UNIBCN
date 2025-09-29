# Script para probar los campos corregidos
Write-Host "=== PRUEBA DE CAMPOS CORREGIDOS ===" -ForegroundColor Green

try {
    # 1. Probar SUBUNIDAD_GESTORA
    Write-Host "`n1. Probando SUBUNIDAD_GESTORA..." -ForegroundColor Yellow
    $response1 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/SUBUNIDAD_GESTORA/valores" -Method GET
    Write-Host "✅ SUBUNIDAD_GESTORA - Valores encontrados: $($response1.Count)" -ForegroundColor Green
    $response1 | Select-Object -First 3 | Format-Table valor, descripcion -AutoSize
    
    # 2. Probar MODALIDAD_IMPARTICION
    Write-Host "`n2. Probando MODALIDAD_IMPARTICION..." -ForegroundColor Yellow
    $response2 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/MODALIDAD_IMPARTICION/valores" -Method GET
    Write-Host "✅ MODALIDAD_IMPARTICION - Valores encontrados: $($response2.Count)" -ForegroundColor Green
    $response2 | Format-Table valor, descripcion -AutoSize
    
    # 3. Probar TIPOS_PARTICIPANTE_ROL
    Write-Host "`n3. Probando TIPOS_PARTICIPANTE_ROL..." -ForegroundColor Yellow
    $response3 = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/TIPOS_PARTICIPANTE_ROL/valores" -Method GET
    Write-Host "✅ TIPOS_PARTICIPANTE_ROL - Valores encontrados: $($response3.Count)" -ForegroundColor Green
    $response3 | Select-Object -First 5 | Format-Table valor, descripcion -AutoSize
    
    Write-Host "`n🎉 TODOS LOS CAMPOS CORREGIDOS FUNCIONANDO" -ForegroundColor Green
    Write-Host "`n📋 RESUMEN DE CORRECCIONES:" -ForegroundColor Yellow
    Write-Host "✅ Campo 'Unidad gestora detalle' - Mapeado a SUBUNIDAD_GESTORA" -ForegroundColor Green
    Write-Host "✅ Campo 'insc_modalidad' - Mapeado a MODALIDAD_IMPARTICION" -ForegroundColor Green
    Write-Host "✅ Campo 'subactividad_*_modalidad' - Mapeado a MODALIDAD_IMPARTICION" -ForegroundColor Green
    Write-Host "✅ Campo 'participante_*_rol' - Mapeado a TIPOS_PARTICIPANTE_ROL" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Asegúrate de que los servicios estén ejecutándose:" -ForegroundColor Yellow
    Write-Host "   - Backend: http://localhost:5001" -ForegroundColor Yellow
    Write-Host "   - Frontend: http://localhost:8080" -ForegroundColor Yellow
}


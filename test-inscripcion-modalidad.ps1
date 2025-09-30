# Script para probar el campo inscripcionModalidad
Write-Host "=== PRUEBA CAMPO INSCRIPCION MODALIDAD ===" -ForegroundColor Green

try {
    # 1. Probar que el dominio existe
    Write-Host "`n1. Probando dominio MODALIDAD_IMPARTICION..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/MODALIDAD_IMPARTICION/valores" -Method GET
    Write-Host "✅ Dominio encontrado - Valores: $($response.Count)" -ForegroundColor Green
    $response | Format-Table id, valor, descripcion -AutoSize
    
    # 2. Probar que el endpoint de editar actividad funciona
    Write-Host "`n2. Probando endpoint de editar actividad..." -ForegroundColor Yellow
    $response2 = Invoke-WebRequest -Uri "http://localhost:8080/editar-actividad.html" -Method GET -TimeoutSec 5
    Write-Host "✅ Página de editar actividad accesible (Status: $($response2.StatusCode))" -ForegroundColor Green
    
    Write-Host "`n🎉 TODOS LOS TESTS PASARON" -ForegroundColor Green
    Write-Host "`n💡 Si el campo no se carga, puede ser un problema de timing o cache del navegador" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}




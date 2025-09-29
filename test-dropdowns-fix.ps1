# Script para probar que los dropdowns se cargan correctamente
Write-Host "Probando que los dropdowns se cargan correctamente..." -ForegroundColor Cyan

try {
    # Probar login
    Write-Host "1. Probando login..." -ForegroundColor Yellow
    $loginBody = @{
        username = "Admin"
        password = "Admin"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    
    # Probar endpoint de dominios
    Write-Host "2. Probando endpoint de dominios..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Probar MODALIDAD_IMPARTICION
    $modalidadResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/MODALIDAD_IMPARTICION/valores" -Method GET -Headers $headers
    Write-Host "✅ MODALIDAD_IMPARTICION: $($modalidadResponse.Count) valores" -ForegroundColor Green
    
    # Probar COMPETENCIAS_SAE
    $competenciasResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/COMPETENCIAS_SAE/valores" -Method GET -Headers $headers
    Write-Host "✅ COMPETENCIAS_SAE: $($competenciasResponse.Count) valores" -ForegroundColor Green
    
    # Probar unidades de gestión
    Write-Host "3. Probando endpoint de unidades de gestión..." -ForegroundColor Yellow
    $unidadesResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/unidades-gestion" -Method GET -Headers $headers
    Write-Host "✅ Unidades de gestión: $($unidadesResponse.Count) unidades" -ForegroundColor Green
    
    Write-Host "`n🎉 Todas las pruebas pasaron correctamente!" -ForegroundColor Green
    Write-Host "Los dropdowns deberían cargarse correctamente en la aplicación." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error en las pruebas:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

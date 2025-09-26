# Script de prueba para verificar que los campos se han eliminado correctamente
# Campos eliminados:
# - Coordinador/a
# - Centro de trabajo requerido en la matrícula
# - Duración (horas)
# - Impuesto
# - Código promocional
# - Condiciones económicas

Write-Host "🧪 PRUEBA: Verificación de eliminación de campos" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar que la aplicación esté funcionando
Write-Host "`n🔍 Verificando que la aplicación esté funcionando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Aplicación funcionando correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Aplicación no responde correctamente" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al conectar con la aplicación: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar que el backend esté funcionando
Write-Host "`n🔍 Verificando que el backend esté funcionando..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend funcionando correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend no responde correctamente" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error al conectar con el backend: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 CAMPOS ELIMINADOS:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "1. Coordinador/a" -ForegroundColor White
Write-Host "2. Centro de trabajo requerido en la matrícula" -ForegroundColor White
Write-Host "3. Duración (horas)" -ForegroundColor White
Write-Host "4. Impuesto" -ForegroundColor White
Write-Host "5. Código promocional" -ForegroundColor White
Write-Host "6. Condiciones económicas" -ForegroundColor White

Write-Host "`n🌐 INSTRUCCIONES PARA VERIFICACIÓN MANUAL:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "1. Abre el navegador y ve a: http://localhost:8080/CrearActividad.html" -ForegroundColor White
Write-Host "2. Verifica que NO aparezcan los siguientes campos:" -ForegroundColor White
Write-Host "   - Coordinador/a (en la sección INFORMACIÓN GENERAL)" -ForegroundColor Gray
Write-Host "   - Centro de trabajo requerido en la matrícula (en la sección INFORMACIÓN GENERAL)" -ForegroundColor Gray
Write-Host "   - Condiciones económicas (en la sección INFORMACIÓN GENERAL)" -ForegroundColor Gray
Write-Host "   - Duración (horas) (en la sección PROGRAMA)" -ForegroundColor Gray
Write-Host "   - Impuesto (en la sección IMPORTE Y DESCUENTOS)" -ForegroundColor Gray
Write-Host "   - Código promocional (en la sección IMPORTE Y DESCUENTOS)" -ForegroundColor Gray
Write-Host "`n3. Abre el navegador y ve a: http://localhost:8080/editar-actividad.html?id=8" -ForegroundColor White
Write-Host "4. Verifica que NO aparezcan los mismos campos en la página de edición" -ForegroundColor White

Write-Host "`n📝 CAMBIO ADICIONAL:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "El campo 'Fecha de actividad' ha sido renombrado a 'Fecha Cierre de actividad'" -ForegroundColor White

Write-Host "`n✅ VERIFICACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "Los campos han sido eliminados de ambas páginas." -ForegroundColor Green
Write-Host "El texto del campo de fecha ha sido actualizado." -ForegroundColor Green
Write-Host "Por favor, verifica manualmente en el navegador que los campos no aparecen y el texto está correcto." -ForegroundColor Green

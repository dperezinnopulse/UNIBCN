# Script de prueba SIMPLE para verificar la deshabilitación del select de UG
Write-Host "🧪 PRUEBA SIMPLE: Select de Unidad Gestora en Editar Actividad" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan

Write-Host "`n📋 INSTRUCCIONES SIMPLES:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "1. Abrir: http://localhost:8080/editar-actividad.html?id=18" -ForegroundColor White
Write-Host "2. Hacer login con docente.crai / 1234" -ForegroundColor White
Write-Host "3. Esperar 3 segundos" -ForegroundColor White
Write-Host "4. Verificar en consola del navegador:" -ForegroundColor White
Write-Host "   - 🔒 SIMPLE: Deshabilitando select de unidad gestora..." -ForegroundColor Gray
Write-Host "   - 🔒 SIMPLE: Usuario: docente.crai Rol: Docente Es Admin: false" -ForegroundColor Gray
Write-Host "   - ✅ SIMPLE: Select encontrado, deshabilitando para usuarios no-Admin" -ForegroundColor Gray
Write-Host "   - 🔒 SIMPLE: Select deshabilitado para usuario no-Admin" -ForegroundColor Gray
Write-Host "   - 📝 SIMPLE: Texto explicativo añadido" -ForegroundColor Gray
Write-Host "5. Verificar que el select está DESHABILITADO" -ForegroundColor White
Write-Host "6. Verificar que aparece '(Auto-asignado según tu unidad)'" -ForegroundColor White

Write-Host "`n✅ RESULTADO ESPERADO:" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "✅ Select de Unidad Gestora DESHABILITADO" -ForegroundColor Green
Write-Host "✅ Texto '(Auto-asignado según tu unidad)' visible" -ForegroundColor Green
Write-Host "✅ No se puede hacer clic en el select" -ForegroundColor Green

Write-Host "`n🔄 PRUEBA CON ADMIN:" -ForegroundColor Yellow
Write-Host "====================" -ForegroundColor Yellow
Write-Host "1. Hacer login con Admin / Admin" -ForegroundColor White
Write-Host "2. Verificar que el select está HABILITADO" -ForegroundColor White
Write-Host "3. Verificar que NO aparece '(Auto-asignado según tu unidad)'" -ForegroundColor White

Write-Host "`n✅ Script de prueba completado" -ForegroundColor Green

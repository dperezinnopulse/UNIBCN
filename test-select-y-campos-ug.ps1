# Script de prueba para verificar select deshabilitado Y campos específicos por UG
Write-Host "🧪 PRUEBA: Select Deshabilitado + Campos Específicos por UG" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

Write-Host "`n📋 INSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-Host "1. Abrir: http://localhost:8080/editar-actividad.html?id=18" -ForegroundColor White
Write-Host "2. Hacer login con docente.crai / 1234" -ForegroundColor White
Write-Host "3. Esperar 3 segundos" -ForegroundColor White
Write-Host "4. Verificar en consola del navegador:" -ForegroundColor White
Write-Host "   - 🔒 SIMPLE: Deshabilitando select de unidad gestora..." -ForegroundColor Gray
Write-Host "   - 🔒 SIMPLE: Usuario: docente.crai Rol: Docente Es Admin: false" -ForegroundColor Gray
Write-Host "   - ✅ SIMPLE: Select encontrado, deshabilitando para usuarios no-Admin" -ForegroundColor Gray
Write-Host "   - 🔒 SIMPLE: Select deshabilitado para usuario no-Admin" -ForegroundColor Gray
Write-Host "   - ℹ️ SIMPLE: No se modifican campos específicos por unidad gestora" -ForegroundColor Gray
Write-Host "5. Verificar que el select está DESHABILITADO" -ForegroundColor White
Write-Host "6. Verificar que aparece '(Auto-asignado según tu unidad)'" -ForegroundColor White

Write-Host "`n🔍 VERIFICACIÓN DE CAMPOS ESPECÍFICOS:" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host "✅ Solo deben mostrarse campos de CRAI (usuario docente.crai)" -ForegroundColor Green
Write-Host "❌ NO deben mostrarse campos de IDP" -ForegroundColor Red
Write-Host "❌ NO deben mostrarse campos de SAE" -ForegroundColor Red
Write-Host "✅ Campos CRAI deben estar visibles y habilitados" -ForegroundColor Green

Write-Host "`n🔄 PRUEBA CON USUARIO IDP:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "1. Hacer login con usuario IDP" -ForegroundColor White
Write-Host "2. Verificar que solo se muestran campos de IDP" -ForegroundColor White
Write-Host "3. Verificar que NO se muestran campos de CRAI ni SAE" -ForegroundColor White

Write-Host "`n🔄 PRUEBA CON USUARIO SAE:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "1. Hacer login con usuario SAE" -ForegroundColor White
Write-Host "2. Verificar que solo se muestran campos de SAE" -ForegroundColor White
Write-Host "3. Verificar que NO se muestran campos de IDP ni CRAI" -ForegroundColor White

Write-Host "`n🔄 PRUEBA CON ADMIN:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "1. Hacer login con Admin / Admin" -ForegroundColor White
Write-Host "2. Verificar que el select está HABILITADO" -ForegroundColor White
Write-Host "3. Verificar que se muestran TODOS los campos (IDP, CRAI, SAE)" -ForegroundColor White
Write-Host "4. Verificar que NO aparece '(Auto-asignado según tu unidad)'" -ForegroundColor White

Write-Host "`n✅ RESULTADO ESPERADO:" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "✅ Select deshabilitado para usuarios no-Admin" -ForegroundColor Green
Write-Host "✅ Solo campos de la unidad gestora del usuario visibles" -ForegroundColor Green
Write-Host "✅ Admin puede ver y editar todo" -ForegroundColor Green

Write-Host "`n✅ Script de prueba completado" -ForegroundColor Green

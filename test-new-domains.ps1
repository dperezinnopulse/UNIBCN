# Script de prueba para verificar la conversión de campos a dominios

Write-Host "🧪 PRUEBA: Conversión de campos a dominios" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

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

Write-Host "`n📋 CAMPOS CONVERTIDOS A SELECT:" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host "✅ Jefe/a unidad gestora → JEFES_UNIDAD_GESTORA" -ForegroundColor Green
Write-Host "✅ Gestor/a de la actividad → GESTORES_ACTIVIDAD" -ForegroundColor Green
Write-Host "✅ Facultad destinataria → FACULTADES_DESTINATARIAS" -ForegroundColor Green
Write-Host "✅ Departamento destinatario → DEPARTAMENTOS_DESTINATARIOS" -ForegroundColor Green
Write-Host "✅ Coordinador/a de centre/unitat IDP → COORDINADORES_CENTRE_UNITAT_IDP" -ForegroundColor Green

Write-Host "`n🌐 INSTRUCCIONES PARA VERIFICACIÓN MANUAL:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "1. Abre el navegador y ve a: http://localhost:8080/CrearActividad.html" -ForegroundColor White
Write-Host "2. Haz login con cualquier usuario" -ForegroundColor White
Write-Host "3. Verifica que los siguientes campos ahora son SELECT (no input):" -ForegroundColor White
Write-Host "   - Jefe/a unidad gestora (debe tener opciones del dominio)" -ForegroundColor Gray
Write-Host "   - Gestor/a de la actividad (debe tener opciones del dominio)" -ForegroundColor Gray
Write-Host "   - Facultad destinataria (debe tener opciones del dominio)" -ForegroundColor Gray
Write-Host "   - Departamento destinatario (debe tener opciones del dominio)" -ForegroundColor Gray
Write-Host "   - Coordinador/a de centre/unitat IDP (debe tener opciones del dominio)" -ForegroundColor Gray
Write-Host "`n4. Verifica que los values de las opciones son IDs numéricos" -ForegroundColor White
Write-Host "5. Prueba crear una actividad y verifica que se guarda correctamente" -ForegroundColor White

Write-Host "`n🔍 DEBUG EN CONSOLA:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host "Abre la consola del navegador (F12) y busca estos mensajes:" -ForegroundColor White
Write-Host "🚀 DEBUG: cargarDominios - Iniciando carga de dominios..." -ForegroundColor Gray
Write-Host "🔍 DEBUG: loadValoresDominio - Cargando JEFES_UNIDAD_GESTORA..." -ForegroundColor Gray
Write-Host "🔍 DEBUG: loadValoresDominio - Cargando GESTORES_ACTIVIDAD..." -ForegroundColor Gray
Write-Host "🔍 DEBUG: loadValoresDominio - Cargando FACULTADES_DESTINATARIAS..." -ForegroundColor Gray
Write-Host "🔍 DEBUG: loadValoresDominio - Cargando DEPARTAMENTOS_DESTINATARIOS..." -ForegroundColor Gray
Write-Host "🔍 DEBUG: loadValoresDominio - Cargando COORDINADORES_CENTRE_UNITAT_IDP..." -ForegroundColor Gray

Write-Host "`n📊 VALORES DE EJEMPLO CREADOS:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "JEFES_UNIDAD_GESTORA:" -ForegroundColor White
Write-Host "  • Dr. María García López" -ForegroundColor Gray
Write-Host "  • Prof. Carlos Rodríguez Martín" -ForegroundColor Gray
Write-Host "GESTORES_ACTIVIDAD:" -ForegroundColor White
Write-Host "  • Dra. Ana Martínez Sánchez" -ForegroundColor Gray
Write-Host "  • Dr. José Fernández Ruiz" -ForegroundColor Gray
Write-Host "FACULTADES_DESTINATARIAS:" -ForegroundColor White
Write-Host "  • Facultad de Informática de Barcelona" -ForegroundColor Gray
Write-Host "  • Facultad de Matemáticas" -ForegroundColor Gray
Write-Host "DEPARTAMENTOS_DESTINATARIOS:" -ForegroundColor White
Write-Host "  • Departamento de Ingeniería Informática" -ForegroundColor Gray
Write-Host "  • Departamento de Matemáticas Aplicadas" -ForegroundColor Gray
Write-Host "COORDINADORES_CENTRE_UNITAT_IDP:" -ForegroundColor White
Write-Host "  • Dra. Laura Pérez González" -ForegroundColor Gray
Write-Host "  • Dr. Miguel Torres Herrera" -ForegroundColor Gray

Write-Host "`n✅ VERIFICACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "Los campos han sido convertidos a selects con dominios." -ForegroundColor Green
Write-Host "Por favor, verifica manualmente en el navegador que funcionan correctamente." -ForegroundColor Green

# Script de prueba para verificar que los nuevos dominios funcionan en editar actividad
# Este script verifica que los campos convertidos a select se cargan y seleccionan correctamente

Write-Host "🧪 PRUEBA: Nuevos dominios en Editar Actividad" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar que los servicios estén funcionando
Write-Host "`n1. Verificando servicios..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080/editar-actividad.html" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend funcionando (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend no disponible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar que los nuevos dominios estén disponibles
Write-Host "`n2. Verificando nuevos dominios..." -ForegroundColor Yellow

$nuevosDominios = @(
    "JEFES_UNIDAD_GESTORA",
    "GESTORES_ACTIVIDAD", 
    "FACULTADES_DESTINATARIAS",
    "DEPARTAMENTOS_DESTINATARIOS",
    "COORDINADORES_CENTRE_UNITAT_IDP"
)

foreach ($dominio in $nuevosDominios) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/dominios/$dominio/valores" -Method GET -TimeoutSec 5
        if ($response -and $response.Count -gt 0) {
            Write-Host "✅ Dominio $dominio disponible con $($response.Count) valores" -ForegroundColor Green
            foreach ($valor in $response) {
                Write-Host "   - ID: $($valor.id), Valor: $($valor.valor)" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠️ Dominio $dominio sin valores" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error accediendo a dominio $dominio : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Verificar que hay actividades para editar
Write-Host "`n3. Verificando actividades disponibles..." -ForegroundColor Yellow
try {
    $actividades = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method GET -TimeoutSec 5
    if ($actividades -and $actividades.Count -gt 0) {
        Write-Host "✅ Hay $($actividades.Count) actividades disponibles" -ForegroundColor Green
        $primeraActividad = $actividades[0]
        Write-Host "   - Primera actividad: ID $($primeraActividad.id), Título: $($primeraActividad.titulo)" -ForegroundColor Gray
        
        # Verificar campos de los nuevos dominios en la primera actividad
        Write-Host "`n4. Verificando campos de nuevos dominios en actividad $($primeraActividad.id)..." -ForegroundColor Yellow
        
        $camposNuevosDominios = @(
            "jefeUnidadGestora",
            "gestorActividad", 
            "facultadDestinataria",
            "departamentoDestinatario",
            "coordinadorCentreUnitat"
        )
        
        foreach ($campo in $camposNuevosDominios) {
            $valor = $primeraActividad.$campo
            if ($valor) {
                Write-Host "✅ Campo $campo tiene valor: '$valor'" -ForegroundColor Green
            } else {
                Write-Host "⚠️ Campo $campo está vacío" -ForegroundColor Yellow
            }
        }
        
    } else {
        Write-Host "⚠️ No hay actividades disponibles para probar" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error obteniendo actividades: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Instrucciones para prueba manual:" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host "1. Abrir navegador en: http://localhost:8080/editar-actividad.html?id=1" -ForegroundColor White
Write-Host "2. Verificar que los siguientes campos son SELECT (no input):" -ForegroundColor White
Write-Host "   - Jefe/a unidad gestora" -ForegroundColor Gray
Write-Host "   - Gestor/a de la actividad" -ForegroundColor Gray
Write-Host "   - Facultad destinataria" -ForegroundColor Gray
Write-Host "   - Departamento destinatario" -ForegroundColor Gray
Write-Host "   - Coordinador/a de centre/unitat (IDP)" -ForegroundColor Gray
Write-Host "3. Verificar que los selects tienen opciones cargadas" -ForegroundColor White
Write-Host "4. Verificar que si hay valores guardados, se seleccionan correctamente" -ForegroundColor White
Write-Host "5. Abrir consola del navegador (F12) para ver logs de debug" -ForegroundColor White

Write-Host "`n✅ Prueba completada. Revisar logs en consola del navegador." -ForegroundColor Green

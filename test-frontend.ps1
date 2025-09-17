# Test del frontend - Simulación de creación de actividad
Write-Host "=== TEST FRONTEND - CREACIÓN DE ACTIVIDAD ===" -ForegroundColor Green

# 1. Login
Write-Host "1. Haciendo login con usuario SAE..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"SAE","password":"SAE"}'
    $token = $loginResponse.token
    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Crear actividad (simulando datos del frontend)
Write-Host "2. Creando actividad desde frontend..." -ForegroundColor Yellow
try {
    $headers = @{
        'Content-Type' = 'application/json'
        'Authorization' = "Bearer $token"
    }
    
    # Datos como los enviaría el frontend (PascalCase)
    $actividadData = @{
        Titulo = "Test Actividad SAE desde Frontend"
        Descripcion = ""
        FechaInicio = $null
        FechaFin = $null
        Lugar = ""
        Codigo = ""
        AnioAcademico = ""
        UnidadGestionId = 1
        TipoActividad = "Seminario"
        CoordinadorCentreUnitat = ""
        CentreTreballeAlumne = ""
        CreditosTotalesCRAI = $null
        CreditosTotalesSAE = $null
        CreditosMinimosSAE = $null
        CreditosMaximosSAE = $null
        TipusEstudiSAE = "Master"
        CategoriaSAE = "Intermedi"
        CompetenciesSAE = "Test competencies"
        InscripcionInicio = $null
        InscripcionFin = $null
        InscripcionPlazas = $null
        InscripcionListaEspera = $false
        InscripcionModalidad = ""
        InscripcionRequisitosES = ""
        InscripcionRequisitosCA = ""
        InscripcionRequisitosEN = ""
        ProgramaDescripcionES = ""
        ProgramaDescripcionCA = ""
        ProgramaDescripcionEN = ""
        ProgramaContenidosES = ""
        ProgramaContenidosCA = ""
        ProgramaContenidosEN = ""
        ProgramaObjetivosES = ""
        ProgramaObjetivosCA = ""
        ProgramaObjetivosEN = ""
        ProgramaDuracion = $null
        ProgramaInicio = $null
        ProgramaFin = $null
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades" -Method POST -Headers $headers -Body $actividadData
    Write-Host "   ✅ Actividad creada exitosamente con ID: $($response.id)" -ForegroundColor Green
    Write-Host "   📋 Título: $($response.titulo)" -ForegroundColor Cyan
    Write-Host "   🏢 Unidad Gestión ID: $($response.unidadGestionId)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Error creando actividad: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "=== TEST COMPLETADO EXITOSAMENTE ===" -ForegroundColor Green
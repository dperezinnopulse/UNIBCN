# Test script to verify activity update PUT functionality
Write-Host "Testing activity update PUT functionality..." -ForegroundColor Green

# First, get a login token
Write-Host "Getting login token..." -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "Admin"
        password = "Admin"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "Login successful" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test updating activity 26
Write-Host "Testing PUT /api/actividades/26..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $updateBody = @{
        Titulo = "SAE lsitas - Updated"
        Codigo = "axssx"
        Descripcion = "axsx"
        AnioAcademico = "2024-2025"
        UnidadGestionId = 3
        TipoActividad = "78"
        LineaEstrategica = "100"
        ObjetivoEstrategico = "113"
        CodigoRelacionado = "xasx"
        PersonaSolicitante = "Admin"
        JefeUnidadGestora = "116"
        GestorActividad = "67"
        FacultadDestinataria = "134"
        DepartamentoDestinatario = "71"
        CentroUnidadUBDestinataria = "22"
        OtrosCentrosInstituciones = "xasx"
        PlazasTotales = 2
        HorasTotales = 2
        ModalidadGestion = "189"
        ActividadPago = "S"
        MotivoCierre = "xasxsa"
        CreditosTotalesSAE = 2
        CreditosMinimosSAE = 2
        CreditosMaximosSAE = 2
        TipusEstudiSAE = "47"
        CategoriaSAE = "242"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method PUT -Headers $headers -Body $updateBody
    Write-Host "Activity update successful!" -ForegroundColor Green
    Write-Host "Updated activity ID: $($response.id)" -ForegroundColor Cyan
} catch {
    Write-Host "Activity update failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
    }
}

Write-Host "Test completed!" -ForegroundColor Green

# Test directo del endpoint PUT que está fallando
Write-Host "🧪 Probando el endpoint PUT /api/actividades/26" -ForegroundColor Yellow

# Primero hacer login para obtener el token
try {
    Write-Host "1. Haciendo login..." -ForegroundColor Cyan
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"Admin","password":"Admin"}'
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Preparar headers con token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Datos de prueba similares a los que envía el frontend
$testData = @{
    "Titulo" = "SAE lsitas - Simple Test"
    "Descripcion" = "Test simple"
    "Codigo" = "axssx"
    "AnioAcademico" = "2024-2025"
    "UnidadGestionId" = 3
    "TipoActividad" = "78"
    "LineaEstrategica" = "100"
    "ObjetivoEstrategico" = "113"
    "CodigoRelacionado" = "xasx"
    "ActividadReservada" = "106"
    "ActividadPago" = "S"
    "MotivoCierre" = "xasxsa"
    "PersonaSolicitante" = "Admin"
    "JefeUnidadGestora" = "116"
    "GestorActividad" = "67"
    "FacultadDestinataria" = "134"
    "DepartamentoDestinatario" = "71"
    "CentroUnidadUBDestinataria" = "22"
    "OtrosCentrosInstituciones" = "xasx"
    "PlazasTotales" = 2
    "HorasTotales" = 2
    "ModalidadGestion" = "189"
    "CreditosTotalesSAE" = 2
    "CreditosMinimosSAE" = 2
    "CreditosMaximosSAE" = 2
    "InscripcionListaEspera" = $false
    "Preinscripcion" = $true
    "EstadoActividad" = "63"
    "TPV" = $false
} | ConvertTo-Json

Write-Host "2. Enviando PUT request..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:5001/api/actividades/26" -ForegroundColor Gray
Write-Host "Datos:" -ForegroundColor Gray
Write-Host $testData -ForegroundColor DarkGray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method PUT -Headers $headers -Body $testData
    Write-Host "✅ PUT exitoso!" -ForegroundColor Green
    Write-Host "Respuesta: $($response | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR HTTP $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    
    # Intentar leer el detalle del error
    if ($_.Exception.Response) {
        try {
            $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $errorBody = $streamReader.ReadToEnd()
            Write-Host "Detalle del error:" -ForegroundColor Yellow
            Write-Host $errorBody -ForegroundColor Red
        } catch {
            Write-Host "No se pudo leer el detalle del error" -ForegroundColor DarkRed
        }
    }
}

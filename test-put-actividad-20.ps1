# Test directo del PUT que está fallando con los datos exactos del frontend
Write-Host "🧪 Reproduciendo el error HTTP 500 con actividad ID 20" -ForegroundColor Yellow

# Login para obtener token
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"Admin","password":"Admin"}'
    $token = $loginResponse.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers con token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Datos EXACTOS que envía el frontend (copiados del log)
$frontendData = @'
{
  "Titulo": "sadsadsad SAE",
  "Descripcion": "dsadsadsad",
  "Codigo": "asdasdsad",
  "AnioAcademico": "2024-2025",
  "UnidadGestionId": 3,
  "LineaEstrategica": "100",
  "ObjetivoEstrategico": "114",
  "CodigoRelacionado": "saSA",
  "ActividadReservada": 106,
  "ActividadPago": "S",
  "FechaActividad": "2025-09-06T00:00:00.000Z",
  "MotivoCierre": "SADSasd",
  "PersonaSolicitante": "Admin",
  "JefeUnidadGestora": "117",
  "UnidadGestoraDetalle": "172",
  "GestorActividad": "68",
  "FacultadDestinataria": "133",
  "DepartamentoDestinatario": "71",
  "CentroUnidadUBDestinataria": "22",
  "OtrosCentrosInstituciones": "dasd",
  "PlazasTotales": 2,
  "HorasTotales": 2,
  "ModalidadGestion": "192",
  "FechaInicioImparticion": "2025-10-03T00:00:00.000Z",
  "FechaFinImparticion": "2025-09-25T00:00:00.000Z",
  "CreditosTotalesSAE": 2,
  "CreditosMinimosSAE": 2,
  "CreditosMaximosSAE": 2,
  "TipusEstudiSAE": "237",
  "CategoriaSAE": "246",
  "CompetenciesSAE": "265",
  "InscripcionListaEspera": false,
  "InscripcionModalidad": "195",
  "Preinscripcion": true,
  "EstadoActividad": "63",
  "Metodologia": "zxczx",
  "SistemaEvaluacion": "zxczxc",
  "HorarioYCalendario": "zxcxzc",
  "Observaciones": "zxczxc",
  "EspacioImparticion": "zxczxc",
  "LugarImparticion": "zxczxc",
  "OtrasUbicaciones": "zxc",
  "UrlPlataformaVirtual": "https://inno.es",
  "UrlCuestionarioSatisfaccion": "https://sasdd.es",
  "CosteEstimadoActividad": 111,
  "TiposFinanciacionId": 57,
  "AnoInicialFinanciacion": 2000,
  "AnoFinalFinanciacion": 2000,
  "PlazasAfectadasDescuento": 1,
  "DenominacionDescuentoIds": [58],
  "FechaLimitePago": "2025-09-22T00:00:00.000Z",
  "TPV": true,
  "Remesa": "60",
  "TiposInscripcionId": 59,
  "FechaAdjudicacionPreinscripcion": "2025-09-22T00:00:00.000Z"
}
'@

Write-Host "🚀 Enviando PUT request exacto del frontend..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:5001/api/actividades/20" -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/20" -Method PUT -Headers $headers -Body $frontendData
    Write-Host "✅ PUT exitoso!" -ForegroundColor Green
    Write-Host "Respuesta: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR HTTP $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    
    # Capturar el detalle del error del backend
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorBody = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            
            Write-Host "=" * 60 -ForegroundColor Yellow
            Write-Host "🔍 DETALLE DEL ERROR DEL BACKEND:" -ForegroundColor Yellow
            Write-Host "=" * 60 -ForegroundColor Yellow
            Write-Host $errorBody -ForegroundColor Red
            Write-Host "=" * 60 -ForegroundColor Yellow
        } catch {
            Write-Host "No se pudo leer el detalle del error: $($_.Exception.Message)" -ForegroundColor DarkRed
        }
    }
}

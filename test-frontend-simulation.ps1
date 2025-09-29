# Script para simular exactamente lo que hace el frontend
Write-Host "🔧 Simulando comportamiento del frontend..." -ForegroundColor Yellow

# Obtener token de autenticación
Write-Host "🔐 Obteniendo token de autenticación..." -ForegroundColor Cyan
$loginBody = @{
    username = "Admin"
    password = "Admin"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Token obtenido: $($token.Substring(0, 20))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers con autenticación
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Simular exactamente los datos que envía el frontend (formato PascalCase)
$formData = @{
    # Básicos
    Codigo = "axssx"
    Titulo = "SAE lsitas - Frontend Simulation"
    Descripcion = "Test de simulación del frontend"
    AnioAcademico = "2024-2025"
    UnidadGestionId = 3

    # Información general
    TipoActividad = "78"
    LineaEstrategica = "100"
    ObjetivoEstrategico = "113"
    CodigoRelacionado = "xasx"
    ActividadReservada = $null
    ActividadPago = "S"
    FechaActividad = $null
    MotivoCierre = "xasxsa"
    PersonaSolicitante = "Admin"
    Coordinador = ""
    JefeUnidadGestora = "116"
    UnidadGestoraDetalle = ""
    GestorActividad = "67"
    FacultadDestinataria = "134"
    DepartamentoDestinatario = "71"
    CentroUnidadUBDestinataria = "22"
    OtrosCentrosInstituciones = "xasx"
    PlazasTotales = 2
    HorasTotales = 2.0
    CentroTrabajoRequerido = ""
    ModalidadGestion = "189"
    FechaInicioImparticion = $null
    FechaFinImparticion = $null

    # Campos específicos por UG
    CoordinadorCentreUnitat = ""
    CentreTreballeAlumne = ""
    CreditosTotalesCRAI = $null
    CreditosTotalesSAE = 2.0
    CreditosMinimosSAE = 2.0
    CreditosMaximosSAE = 2.0
    TipusEstudiSAE = $null  # Esto puede ser el problema
    CategoriaSAE = $null    # Esto puede ser el problema
    CompetenciesSAE = ""    # String vacío

    # Inscripción
    InscripcionInicio = $null
    InscripcionFin = $null
    InscripcionPlazas = $null
    InscripcionListaEspera = $false
    InscripcionModalidad = ""
    InscripcionRequisitosES = ""
    InscripcionRequisitosCA = ""
    InscripcionRequisitosEN = ""

    # Programa
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

    # Traducción del título
    TituloCA = ""
    TituloES = ""
    TituloEN = ""

    # Entidades relacionadas (vacías para simplificar)
    Subactividades = @()
    Participantes = @()
    Colaboradoras = @()
    Importes = @()

    # Nuevos campos
    Preinscripcion = $true
    EstadoActividad = "63"
    AsignaturaId = $null
    GrupoAsignatura = ""
    DisciplinaRelacionadaId = $null
    Metodologia = ""
    SistemaEvaluacion = ""
    HorarioYCalendario = ""
    IdiomaImparticionId = $null
    TiposCertificacionId = $null
    Observaciones = ""
    MateriaDisciplinaId = $null
    EspacioImparticion = ""
    LugarImparticion = ""
    OtrasUbicaciones = ""
    UrlPlataformaVirtual = ""
    UrlCuestionarioSatisfaccion = ""
    AmbitoFormacionId = $null
    CosteEstimadoActividad = $null
    TiposFinanciacionId = $null
    AnoInicialFinanciacion = $null
    AnoFinalFinanciacion = $null
    PlazasAfectadasDescuento = $null
    DenominacionDescuentoIds = $null
    FechaLimitePago = $null
    TPV = $false
    Remesa = ""
    TiposInscripcionId = $null
    FechaAdjudicacionPreinscripcion = $null
    EsBorrador = $null
} | ConvertTo-Json -Depth 3

Write-Host "📤 Enviando PUT request simulando frontend..." -ForegroundColor Cyan
Write-Host "📊 Datos enviados (primeros 500 caracteres):" -ForegroundColor White
Write-Host $formData.Substring(0, [Math]::Min(500, $formData.Length)) -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method PUT -Headers $headers -Body $formData
    Write-Host "✅ PUT exitoso:" -ForegroundColor Green
    Write-Host "Título actualizado: $($response.titulo)" -ForegroundColor White
} catch {
    Write-Host "❌ Error en PUT:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    
    # Intentar leer el contenido del error
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Content: $errorContent" -ForegroundColor Red
    } catch {
        Write-Host "No se pudo leer el contenido del error" -ForegroundColor Red
    }
    
    Write-Host "Exception Message: $($_.Exception.Message)" -ForegroundColor Red
}

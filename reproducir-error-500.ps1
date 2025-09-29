# Reproducir error HTTP 500 con datos del frontend
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"Admin","password":"Admin"}'
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Datos exactos del frontend
$data = '{"Titulo":"sadsadsad SAE","Descripcion":"dsadsadsad","Codigo":"asdasdsad","AnioAcademico":"2024-2025","UnidadGestionId":3,"LineaEstrategica":"100","ObjetivoEstrategico":"114","CodigoRelacionado":"saSA","ActividadReservada":106,"ActividadPago":"S","FechaActividad":"2025-09-06T00:00:00.000Z","MotivoCierre":"SADSasd","PersonaSolicitante":"Admin","JefeUnidadGestora":"117","UnidadGestoraDetalle":"172","GestorActividad":"68","FacultadDestinataria":"133","DepartamentoDestinatario":"71","CentroUnidadUBDestinataria":"22","OtrosCentrosInstituciones":"dasd","PlazasTotales":2,"HorasTotales":2,"ModalidadGestion":"192","FechaInicioImparticion":"2025-10-03T00:00:00.000Z","FechaFinImparticion":"2025-09-25T00:00:00.000Z","CreditosTotalesSAE":2,"CreditosMinimosSAE":2,"CreditosMaximosSAE":2,"TipusEstudiSAE":"237","CategoriaSAE":"246","CompetenciesSAE":"265","InscripcionListaEspera":false,"InscripcionModalidad":"195","Preinscripcion":true,"EstadoActividad":"63","Metodologia":"zxczx","SistemaEvaluacion":"zxczxc","HorarioYCalendario":"zxcxzc","Observaciones":"zxczxc","EspacioImparticion":"zxczxc","LugarImparticion":"zxczxc","OtrasUbicaciones":"zxc","UrlPlataformaVirtual":"https://inno.es","UrlCuestionarioSatisfaccion":"https://sasdd.es","CosteEstimadoActividad":111,"TiposFinanciacionId":57,"AnoInicialFinanciacion":2000,"AnoFinalFinanciacion":2000,"PlazasAfectadasDescuento":1,"DenominacionDescuentoIds":[58],"FechaLimitePago":"2025-09-22T00:00:00.000Z","TPV":true,"Remesa":"60","TiposInscripcionId":59,"FechaAdjudicacionPreinscripcion":"2025-09-22T00:00:00.000Z"}'

try {
    Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/20" -Method PUT -Headers $headers -Body $data
    Write-Host "EXITO"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorDetail = $reader.ReadToEnd()
        Write-Host "DETALLE: $errorDetail"
    }
}

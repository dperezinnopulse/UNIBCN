# Test con el JSON exacto del frontend
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"Admin","password":"Admin"}'
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# JSON EXACTO del frontend
$jsonExacto = '{"Titulo":"sadsadsad SAE","Descripcion":"dsadsadsad","Codigo":"asdasdsad","UnidadGestionId":3,"ActividadReservada":106,"ActividadPago":"S","CentroUnidadUBDestinataria":"22","CreditosTotalesSAE":2,"CreditosMinimosSAE":2,"CreditosMaximosSAE":2,"TipusEstudiSAE":"46","InscripcionListaEspera":false,"InscripcionModalidad":"195","Preinscripcion":true,"EstadoActividad":"63","Metodologia":"zxczx","SistemaEvaluacion":"zxczxc","HorarioYCalendario":"zxcxzc","IdiomaImparticionId":53,"TiposCertificacionId":54,"Observaciones":"zxczxc","MateriaDisciplinaId":55,"EspacioImparticion":"zxczxc","LugarImparticion":"zxczxc","OtrasUbicaciones":"zxc","UrlPlataformaVirtual":"https://inno.es","UrlCuestionarioSatisfaccion":"https://sasdd.es","CosteEstimadoActividad":111,"TiposFinanciacionId":57,"PlazasAfectadasDescuento":1,"DenominacionDescuentoIds":[58],"FechaLimitePago":"2025-09-22T00:00:00.000Z","TPV":true,"Remesa":"60","TiposInscripcionId":59,"FechaAdjudicacionPreinscripcion":"2025-09-22T00:00:00.000Z"}'

Write-Host "Probando JSON exacto del frontend..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/20" -Method PUT -Headers $headers -Body $jsonExacto
    Write-Host "EXITO!" -ForegroundColor Green
} catch {
    Write-Host "ERROR HTTP $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorDetail = $reader.ReadToEnd()
        Write-Host "DETALLE DEL ERROR:" -ForegroundColor Yellow
        Write-Host $errorDetail -ForegroundColor Red
    }
}

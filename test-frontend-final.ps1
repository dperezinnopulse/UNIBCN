# Script para probar el frontend con datos limpios
Write-Host "🔧 Probando frontend con datos limpios..." -ForegroundColor Yellow

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

# Simular datos limpios como los que enviaría el frontend actualizado
$formDataLimpio = @{
    Titulo = "SAE lsitas - Frontend Clean Test"
    Descripcion = "Test con datos limpios"
    TipoActividad = "78"
    LineaEstrategica = "100"
    ObjetivoEstrategico = "113"
    ModalidadGestion = "189"
    ActividadPago = "S"
    JefeUnidadGestora = "116"
    GestorActividad = "67"
    FacultadDestinataria = "134"
    DepartamentoDestinatario = "71"
    CentroUnidadUBDestinataria = "22"
    TipusEstudiSAE = "1"
    CategoriaSAE = "2"
    CompetenciesSAE = "3"
    UnidadGestionId = 3
    Preinscripcion = $true
    EstadoActividad = "63"
    InscripcionListaEspera = $false
    TPV = $false
} | ConvertTo-Json

Write-Host "📤 Enviando PUT request con datos limpios..." -ForegroundColor Cyan
Write-Host "📊 Datos enviados:" -ForegroundColor White
Write-Host $formDataLimpio -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method PUT -Headers $headers -Body $formDataLimpio
    Write-Host "✅ PUT exitoso:" -ForegroundColor Green
    Write-Host "Título actualizado: $($response.titulo)" -ForegroundColor White
    Write-Host "🎉 ¡El error HTTP 500 ha sido solucionado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en PUT:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Exception Message: $($_.Exception.Message)" -ForegroundColor Red
}
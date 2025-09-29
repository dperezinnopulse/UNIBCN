# Script para probar PUT con debug detallado
Write-Host "🔧 Probando PUT con debug detallado..." -ForegroundColor Yellow

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

# Datos de prueba para PUT
$putData = @{
    Titulo = "SAE lsitas - Debug Test"
    Descripcion = "Test de debug"
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
} | ConvertTo-Json

Write-Host "📤 Enviando PUT request..." -ForegroundColor Cyan
Write-Host "📊 Datos enviados:" -ForegroundColor White
Write-Host $putData -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5001/api/actividades/26" -Method PUT -Headers $headers -Body $putData
    Write-Host "✅ PUT exitoso:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White
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

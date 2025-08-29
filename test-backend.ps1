# Script para probar el backend de UB Actividades
# Ejecutar desde PowerShell: .\test-backend.ps1

$baseUrl = "http://localhost:5001"

Write-Host "=== PRUEBAS DEL BACKEND UB ACTIVIDADES ===" -ForegroundColor Green
Write-Host "URL Base: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Función para hacer peticiones HTTP
function Test-Endpoint {
    param($url, $description, $method = "GET", $body = $null)
    
    Write-Host "🔍 $description" -ForegroundColor Cyan
    Write-Host "   URL: $url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        
        if ($method -eq "POST" -and $body) {
            $params.Method = "POST"
            $params.ContentType = "application/json"
            $params.Body = $body
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
            Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
            
            # Intentar parsear JSON
            try {
                $data = $response.Content | ConvertFrom-Json
                if ($data -is [array]) {
                    Write-Host "   📊 Items: $($data.Count)" -ForegroundColor Green
                    if ($data.Count -gt 0) {
                        $data | Select-Object -First 3 | Format-Table -AutoSize
                    }
                } elseif ($data.items) {
                    Write-Host "   📊 Total: $($data.totalItems), Página: $($data.page)" -ForegroundColor Green
                    if ($data.items.Count -gt 0) {
                        $data.items | Select-Object -First 3 | Format-Table -AutoSize
                    }
                } else {
                    $data | Format-Table -AutoSize
                }
            } catch {
                Write-Host "   📄 Respuesta: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
            }
        } else {
            Write-Host "   ⚠️ Status: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# 1. Probar endpoints básicos
Test-Endpoint "$baseUrl/api/estados" "Estados disponibles"
Test-Endpoint "$baseUrl/api/unidades-gestion" "Unidades de gestión"

# 2. Probar listado de actividades
Test-Endpoint "$baseUrl/api/actividades" "Listado de actividades"
Test-Endpoint "$baseUrl/api/actividades?page=1`&pageSize=5" "Listado de actividades (paginado)"

# 3. Crear una actividad de prueba
$testActivity = @{
    titulo = "Actividad de Prueba desde PowerShell"
    descripcion = "Esta actividad fue creada para probar el backend"
    codigo = "TEST-PS-$(Get-Date -Format 'yyyyMMddHHmmss')"
    anioAcademico = "2024-25"
    estadoId = 1
    unidadGestionId = 1
    lugar = "Aula Virtual"
    fechaInicio = "2025-01-20"
    fechaFin = "2025-01-25"
    actividadPago = $false
    org_principal = "Universidad de Barcelona"
    org_nif = "Q0818001A"
    org_web = "https://www.ub.edu"
    org_contacto = "Departamento de Formación"
    org_email = "formacion@ub.edu"
    org_tel = "934021100"
    inscripcionInicio = "2025-01-15"
    inscripcionFin = "2025-01-19"
    inscripcionPlazas = 50
    inscripcionListaEspera = $true
    inscripcionModalidad = "Presencial"
    inscripcionRequisitosES = "Estudiantes de la UB"
    inscripcionRequisitosCA = "Estudiants de la UB"
    inscripcionRequisitosEN = "UB students"
    programaDescripcionES = "Programa completo de formación"
    programaDescripcionCA = "Programa complet de formació"
    programaDescripcionEN = "Complete training program"
    programaContenidosES = "Contenidos del programa"
    programaContenidosCA = "Continguts del programa"
    programaContenidosEN = "Program contents"
    programaObjetivosES = "Objetivos del programa"
    programaObjetivosCA = "Objectius del programa"
    programaObjetivosEN = "Program objectives"
    programaDuracion = 20.5
    programaInicio = "2025-01-20"
    programaFin = "2025-01-25"
    imp_base = 150.00
    imp_tipo = "IVA 21%"
    imp_descuento_pct = 10
    imp_codigo = "DESCUENTO10"
    imp_condiciones_es = "Condiciones en español"
    imp_condiciones_ca = "Condicions en català"
    imp_condiciones_en = "Terms in English"
    participantes = @(
        @{
            nombre = "Dr. Juan Pérez"
            email = "juan.perez@ub.edu"
            rol = "Ponente"
        },
        @{
            nombre = "Dra. María García"
            email = "maria.garcia@ub.edu"
            rol = "Coordinación"
        }
    )
    subactividades = @(
        @{
            titulo = "Sesión 1: Introducción"
            descripcion = "Sesión introductoria al tema"
            modalidad = "Presencial"
            docente = "Dr. Juan Pérez"
            fechaInicio = "2025-01-20"
            fechaFin = "2025-01-20"
            horaInicio = "09:00"
            horaFin = "11:00"
            duracion = 2.0
            ubicacion = "Aula 101"
            aforo = 30
            idioma = "Español"
        },
        @{
            titulo = "Sesión 2: Desarrollo"
            descripcion = "Sesión de desarrollo del contenido"
            modalidad = "Online"
            docente = "Dra. María García"
            fechaInicio = "2025-01-22"
            fechaFin = "2025-01-22"
            horaInicio = "15:00"
            horaFin = "17:00"
            duracion = 2.0
            ubicacion = "Zoom"
            aforo = 50
            idioma = "Español"
        }
    )
} | ConvertTo-Json -Depth 10

Test-Endpoint "$baseUrl/api/actividades" "Crear actividad de prueba" "POST" $testActivity

# 4. Obtener la actividad creada (asumiendo que se creó con ID 1)
Test-Endpoint "$baseUrl/api/actividades/1" "Obtener actividad por ID"

# 5. Probar endpoints de relaciones
Test-Endpoint "$baseUrl/api/actividades/1/participantes" "Participantes de la actividad"
Test-Endpoint "$baseUrl/api/actividades/1/subactividades" "Subactividades de la actividad"

Write-Host "=== FIN DE LAS PRUEBAS ===" -ForegroundColor Green
Write-Host "Para mas informacion, consulta los logs del backend" -ForegroundColor Yellow

# Script de prueba para verificar la preselección de unidad gestora
# Este script prueba la funcionalidad implementada

Write-Host "🧪 PRUEBA: Preselección de Unidad Gestora" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Función para hacer login y obtener token
function Get-AuthToken {
    param($username, $password)
    
    try {
        $body = @{
            username = $username
            password = $password
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $body
        return $response.token
    } catch {
        Write-Host "❌ Error en login para $username`: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para obtener información del usuario
function Get-UserInfo {
    param($token)
    
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/usuarios/yo" -Method GET -Headers $headers
        return $response
    } catch {
        Write-Host "❌ Error obteniendo información del usuario: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Función para obtener unidades de gestión
function Get-UnidadesGestion {
    param($token)
    
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "http://localhost:5001/api/unidades-gestion" -Method GET -Headers $headers
        return $response
    } catch {
        Write-Host "❌ Error obteniendo unidades de gestión: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Verificar que el backend esté ejecutándose
Write-Host "🔍 Verificando que el backend esté ejecutándose..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no está ejecutándose. Ejecuta: cd UB.Actividad1.API && dotnet run --urls='http://localhost:5001' &" -ForegroundColor Red
    exit 1
}

# Probar con diferentes usuarios
$usuarios = @(
    @{ username = "Admin"; password = "Admin"; expectedRole = "Admin" },
    @{ username = "SAE"; password = "SAE"; expectedRole = "Gestor"; expectedUG = 3 },
    @{ username = "docente.crai"; password = "1234"; expectedRole = "Docente"; expectedUG = 2 },
    @{ username = "tecnico.idp"; password = "1234"; expectedRole = "TecnicoFormacion"; expectedUG = 1 }
)

Write-Host "`n📋 Probando con diferentes usuarios:" -ForegroundColor Cyan

foreach ($usuario in $usuarios) {
    Write-Host "`n👤 Usuario: $($usuario.username)" -ForegroundColor Yellow
    
    # Login
    $token = Get-AuthToken -username $usuario.username -password $usuario.password
    if (-not $token) {
        continue
    }
    
    # Obtener información del usuario
    $userInfo = Get-UserInfo -token $token
    if (-not $userInfo) {
        continue
    }
    
    Write-Host "   Rol: $($userInfo.rol)" -ForegroundColor White
    Write-Host "   Unidad Gestión ID: $($userInfo.unidadGestionId)" -ForegroundColor White
    
    # Verificar rol esperado
    if ($userInfo.rol -eq $usuario.expectedRole) {
        Write-Host "   ✅ Rol correcto" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Rol esperado: $($usuario.expectedRole), obtenido: $($userInfo.rol)" -ForegroundColor Yellow
    }
    
    # Verificar unidad de gestión esperada
    if ($usuario.expectedUG -and $userInfo.unidadGestionId -eq $usuario.expectedUG) {
        Write-Host "   ✅ Unidad de gestión correcta" -ForegroundColor Green
    } elseif ($usuario.expectedUG) {
        Write-Host "   ⚠️ UG esperada: $($usuario.expectedUG), obtenida: $($userInfo.unidadGestionId)" -ForegroundColor Yellow
    }
    
    # Verificar si debería poder editar el select
    if ($userInfo.rol -eq "Admin") {
        Write-Host "   🔓 Admin: Puede editar unidad gestora" -ForegroundColor Blue
    } else {
        Write-Host "   🔒 No-Admin: Unidad gestora debe estar bloqueada" -ForegroundColor Blue
    }
}

# Obtener unidades de gestión disponibles
Write-Host "`n📊 Unidades de gestión disponibles:" -ForegroundColor Cyan
$token = Get-AuthToken -username "Admin" -password "Admin"
if ($token) {
    $ugs = Get-UnidadesGestion -token $token
    if ($ugs) {
        foreach ($ug in $ugs) {
            Write-Host "   ID: $($ug.id) - $($ug.nombre) ($($ug.codigo))" -ForegroundColor White
        }
    }
}

Write-Host "`n🎯 PRUEBA COMPLETADA" -ForegroundColor Green
Write-Host "Para probar en el navegador:" -ForegroundColor Cyan
Write-Host "1. Abre http://localhost:8080/CrearActividad.html" -ForegroundColor White
Write-Host "2. Haz login con diferentes usuarios" -ForegroundColor White
Write-Host "3. Verifica que la unidad gestora se preselecciona correctamente" -ForegroundColor White
Write-Host "4. Verifica que solo los Admin pueden cambiar la unidad gestora" -ForegroundColor White

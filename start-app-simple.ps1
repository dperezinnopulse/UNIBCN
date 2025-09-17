# Script simple para levantar la aplicación UB Formación
# Versión: 1.0 - Modo simple (sin jobs, directo)

Write-Host "=== INICIANDO APLICACION UB FORMACION (MODO SIMPLE) ===" -ForegroundColor Green

# Detener procesos existentes
Write-Host "Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Verificar conectividad a la base de datos
Write-Host "Verificando conectividad a la base de datos..." -ForegroundColor Yellow
$dbTest = Test-NetConnection -ComputerName '192.168.8.157' -Port 1433 -WarningAction SilentlyContinue
if ($dbTest.TcpTestSucceeded) {
    Write-Host "✅ Base de datos accesible: 192.168.8.157:1433" -ForegroundColor Green
} else {
    Write-Host "❌ Base de datos NO accesible: 192.168.8.157:1433" -ForegroundColor Red
}

Write-Host "`nIniciando servicios en ventanas separadas..." -ForegroundColor Yellow

# Iniciar backend en ventana separada
Write-Host "Iniciando backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\DEV\UNI BCN\UB.Actividad1.API'; Write-Host '=== BACKEND API ===' -ForegroundColor Green; dotnet run --urls='http://localhost:5001'"

# Iniciar frontend en ventana separada
Write-Host "Iniciando frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\DEV\UNI BCN\WebServer'; Write-Host '=== FRONTEND ===' -ForegroundColor Green; dotnet run --urls='http://localhost:8080'"

# Esperar a que los servicios se inicien
Write-Host "Esperando a que los servicios se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar que los servicios estén funcionando
Write-Host "Verificando servicios..." -ForegroundColor Yellow

# Verificar backend
try {
    $backendTest = Invoke-RestMethod -Uri 'http://localhost:5001/api/test' -Method GET -TimeoutSec 5
    Write-Host "✅ Backend funcionando: http://localhost:5001" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend NO responde: http://localhost:5001" -ForegroundColor Red
}

# Verificar frontend
try {
    $frontendTest = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 5
    if ($frontendTest.StatusCode -eq 200) {
        Write-Host "✅ Frontend funcionando: http://localhost:8080" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend NO responde: http://localhost:8080" -ForegroundColor Red
}

# Mostrar información de conexión
Write-Host "`n=== APLICACION INICIADA ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Base de datos: 192.168.8.157:1433" -ForegroundColor Cyan
Write-Host "`nURLs importantes:" -ForegroundColor Yellow
Write-Host "- Página principal: http://localhost:8080" -ForegroundColor White
Write-Host "- Página pública: http://localhost:8080/web-publica.html" -ForegroundColor White
Write-Host "- Histórico: http://localhost:8080/historico.html" -ForegroundColor White
Write-Host "- API Swagger: http://localhost:5001/swagger" -ForegroundColor White

Write-Host "`nPara detener la aplicación, ejecuta: .\stop-app.ps1" -ForegroundColor Yellow
Write-Host "O cierra las ventanas de PowerShell que se abrieron." -ForegroundColor Yellow

Write-Host "`nPresiona Enter para salir..." -ForegroundColor Magenta
Read-Host

@echo off
echo === INICIANDO APLICACION UB FORMACION ===

echo Deteniendo procesos existentes...
taskkill /F /IM dotnet.exe 2>nul
timeout /t 3 /nobreak >nul

echo Iniciando backend API...
cd /d "E:\DEV\UNI BCN\UB.Actividad1.API"
start "Backend API" dotnet run --urls="http://localhost:5001"

timeout /t 5 /nobreak >nul

echo Iniciando frontend...
cd /d "E:\DEV\UNI BCN\WebServer"
start "Frontend" dotnet run --urls="http://localhost:8080"

timeout /t 5 /nobreak >nul

echo === APLICACION INICIADA ===
echo Backend: http://localhost:5001
echo Frontend: http://localhost:8080
echo Endpoint de prueba: http://localhost:5001/api/test

pause

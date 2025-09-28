#!/bin/bash

echo "Iniciando aplicación UB..."

# Parar procesos existentes
pkill -f dotnet 2>/dev/null || true
sleep 2

# Crear logs
mkdir -p logs

# Backend
cd UB.Actividad1.API
nohup dotnet run --urls="http://localhost:5001" > ../logs/backend.log 2>&1 &
echo "Backend iniciado (PID: $!)"
cd ..

# Frontend  
cd WebServer
nohup dotnet run --urls="http://localhost:8080" > ../logs/frontend.log 2>&1 &
echo "Frontend iniciado (PID: $!)"
cd ..

echo "Esperando servicios..."
sleep 10

echo "Verificando puertos..."
netstat -tuln 2>/dev/null | grep -E ":5001|:8080" || echo "No se pudieron verificar puertos"

echo "URLs:"
echo "- Frontend: http://localhost:8080"  
echo "- Backend: http://localhost:5001"
echo "- Swagger: http://localhost:5001/swagger"

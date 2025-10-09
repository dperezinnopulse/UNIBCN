#!/bin/bash

# Script robusto para arrancar la aplicación UB Formación en WSL/Linux
# Adaptado del script PowerShell original

echo "🚀 Iniciando aplicación UB Formación..."

# Parar procesos dotnet existentes
echo "🛑 Parando procesos dotnet existentes..."
pkill -f dotnet
sleep 2

# Crear directorio de logs si no existe
mkdir -p logs

# Configurar variables de entorno
export GIT_PAGER=cat
export PAGER=cat
export ASPNETCORE_ENVIRONMENT=Development

# Función para verificar si un servicio está listo
wait_for_service() {
    local url=$1
    local timeout=${2:-60}
    local interval=${3:-2}
    
    echo "⏳ Esperando que $url esté disponible..."
    local elapsed=0
    
    while [ $elapsed -lt $timeout ]; do
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo "✅ $url está disponible"
            return 0
        fi
        sleep $interval
        elapsed=$((elapsed + interval))
    done
    
    echo "⚠️  $url no respondió en $timeout segundos"
    return 1
}

# Arrancar backend
echo "🔧 Arrancando backend en puerto 5001..."
cd UB.Actividad1.API
nohup dotnet run --urls="http://localhost:5001" > ../logs/backend.out.log 2> ../logs/backend.err.log &
BACKEND_PID=$!
cd ..

# Arrancar frontend
echo "🌐 Arrancando frontend en puerto 8080..."
cd WebServer
nohup dotnet run --urls="http://localhost:8080" > ../logs/frontend.out.log 2> ../logs/frontend.err.log &
FRONTEND_PID=$!
cd ..

echo "📊 PIDs de los procesos:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"

# Esperar a que los servicios estén listos
wait_for_service "http://localhost:5001/swagger" 60
wait_for_service "http://localhost:8080" 60

echo ""
echo "🎉 Aplicación iniciada correctamente!"
echo "📱 URLs disponibles:"
echo "   Backend API: http://localhost:5001"
echo "   Frontend: http://localhost:8080"
echo "   Swagger: http://localhost:5001/swagger"
echo "   Web pública: http://localhost:5001/web-publica.html"
echo "   Manual alumno: http://localhost:5001/manual-alumnos/index.html"
echo ""
echo "📋 Para ver logs en tiempo real:"
echo "   Backend: tail -f logs/backend.out.log"
echo "   Frontend: tail -f logs/frontend.out.log"
echo ""
echo "🛑 Para parar la aplicación: pkill -f dotnet"




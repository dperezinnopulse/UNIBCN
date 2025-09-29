#!/bin/bash

# Script para levantar la aplicación UNIBCN en WSL
# Versión: 1.0
# Fecha: $(date)

echo "🚀 Iniciando aplicación UNIBCN..."

# Verificar que estamos en el directorio correcto
if [ ! -d "UB.Actividad1.API" ]; then
    echo "❌ Error: No se encuentra el directorio UB.Actividad1.API"
    echo "   Asegúrate de ejecutar este script desde el directorio UNIBCN"
    exit 1
fi

# Detener procesos existentes de dotnet
echo "🛑 Deteniendo procesos existentes..."
pkill -f "dotnet.*UB.Actividad1.API" 2>/dev/null || true
sleep 2

# Compilar el backend
echo "🔨 Compilando backend..."
cd UB.Actividad1.API
dotnet build
if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación del backend"
    exit 1
fi

# Iniciar el backend en segundo plano
echo "⚡ Iniciando backend API..."
nohup dotnet run --urls "https://localhost:7001;http://localhost:5001" > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend iniciado con PID: $BACKEND_PID"

# Volver al directorio raíz
cd ..

# Esperar un momento para que el backend se inicie
echo "⏳ Esperando que el backend se inicie..."
sleep 8

# Verificar que el backend esté funcionando
echo "🔍 Verificando backend..."
if curl -s http://localhost:5001/api/estados > /dev/null 2>&1; then
    echo "✅ Backend funcionando: http://localhost:5001"
else
    echo "❌ Backend NO responde: http://localhost:5001"
    echo "   Revisa los logs en backend.log"
fi

# Iniciar frontend si existe el directorio WebServer
if [ -d "WebServer" ]; then
    echo "🌐 Iniciando frontend..."
    cd WebServer
    nohup dotnet run --urls "http://localhost:8080" > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend iniciado con PID: $FRONTEND_PID"
    cd ..
    
    # Esperar y verificar frontend
    sleep 5
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Frontend funcionando: http://localhost:8080"
    else
        echo "❌ Frontend NO responde: http://localhost:8080"
    fi
else
    echo "📁 Iniciando servidor HTTP simple para frontend..."
    cd Frontend
    nohup python3 -m http.server 8080 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend iniciado con PID: $FRONTEND_PID"
    cd ..
    
    # Esperar y verificar frontend
    sleep 3
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo "✅ Frontend funcionando: http://localhost:8080"
    else
        echo "❌ Frontend NO responde: http://localhost:8080"
    fi
fi

echo ""
echo "✅ ¡Aplicación iniciada exitosamente!"
echo ""
echo "🔗 URLs disponibles:"
echo "   • Frontend Principal: http://localhost:8080"
echo "   • Backend API:        http://localhost:5001"
echo "   • API Swagger:        https://localhost:7001/swagger"
echo "   • Página de Pruebas:  http://localhost:8080/test-api.html"
echo ""
echo "📋 PIDs de los procesos:"
echo "   • Backend: $BACKEND_PID"
echo "   • Frontend: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   • Backend: backend.log"
echo "   • Frontend: frontend.log"
echo ""
echo "🛑 Para detener la aplicación:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "💡 La aplicación está ejecutándose en segundo plano."
echo "   Puedes cerrar esta terminal y la aplicación seguirá funcionando."


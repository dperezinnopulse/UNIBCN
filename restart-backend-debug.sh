#!/bin/bash
echo "🛑 Parando procesos dotnet..."
pkill -f "dotnet run" 2>/dev/null || true
sleep 2

echo "🔧 Arrancando backend con debug..."
cd UB.Actividad1.API
dotnet run --urls="http://localhost:5001" > ../logs/backend-debug.out.log 2> ../logs/backend-debug.err.log &
BACKEND_PID=$!

echo "📊 Backend PID: $BACKEND_PID"
echo "⏳ Esperando que el backend esté listo..."
sleep 5

echo "🧪 Probando endpoint con debug..."
curl -s http://localhost:5001/api/actividades/8 || echo "Error en la petición"

echo "📋 Últimas líneas del log de debug:"
tail -n 20 ../logs/backend-debug.out.log

echo "❌ Errores (si los hay):"
tail -n 10 ../logs/backend-debug.err.log

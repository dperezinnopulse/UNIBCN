#!/bin/bash
echo "🔐 Probando autenticación..."

# Hacer login
echo "📝 Haciendo login..."
TOKEN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username":"coord.idp","password":"coord.idp"}' http://localhost:5001/api/auth/login)

echo "🔑 Respuesta del login:"
echo "$TOKEN_RESPONSE"

# Extraer token
TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✅ Token obtenido: ${TOKEN:0:20}..."
    
    echo "🧪 Probando endpoint con token..."
    curl -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/actividades/8
else
    echo "❌ No se pudo obtener token"
fi

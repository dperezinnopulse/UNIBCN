#!/usr/bin/env python3
import requests
import json

print("🔍 Verificando estado del backend...")

# Verificar backend
try:
    response = requests.get("http://localhost:5001/api/auth/hash?pwd=test", timeout=3)
    print(f"✅ Backend funcionando - Status: {response.status_code}")
except Exception as e:
    print(f"❌ Backend no disponible: {e}")

# Verificar frontend
try:
    response = requests.get("http://localhost:8080", timeout=3)
    print(f"✅ Frontend funcionando - Status: {response.status_code}")
except Exception as e:
    print(f"❌ Frontend no disponible: {e}")

# Verificar página específica
try:
    response = requests.get("http://localhost:8080/editar-actividad.html?id=6", timeout=3)
    print(f"✅ Página editar-actividad - Status: {response.status_code}")
except Exception as e:
    print(f"❌ Página no disponible: {e}")

print("\n📊 Estado de los servicios verificado")

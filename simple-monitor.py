#!/usr/bin/env python3
import requests
import time

def monitor_errors():
    print("🔍 Monitoreando errores de backend...")
    
    try:
        # Verificar backend
        response = requests.get("http://localhost:5001/api/auth/hash?pwd=test", timeout=2)
        print(f"Backend: {response.status_code}")
    except:
        print("Backend: ❌ No disponible")
    
    try:
        # Verificar frontend
        response = requests.get("http://localhost:8080", timeout=2)
        print(f"Frontend: {response.status_code}")
    except:
        print("Frontend: ❌ No disponible")

if __name__ == "__main__":
    monitor_errors()

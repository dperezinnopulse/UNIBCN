#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

# Configuración
PORT = 8080
DIRECTORY = r"C:\DEV\UNI BCN\Frontend"

# Cambiar al directorio del frontend
os.chdir(DIRECTORY)

print(f"🚀 Iniciando servidor web en puerto {PORT}...")
print(f"📁 Sirviendo archivos desde: {DIRECTORY}")
print(f"🌐 URL: http://localhost:{PORT}")
print("Presiona Ctrl+C para detener...")
print()

# Crear el servidor
Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Servidor iniciado en http://localhost:{PORT}")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Servidor detenido")
except Exception as e:
    print(f"❌ Error: {e}")

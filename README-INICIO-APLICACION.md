# 🚀 Guía de Inicio de la Aplicación UB Actividad 1

## 📋 Resumen
Esta aplicación tiene **DOS servidores .NET** que deben ejecutarse simultáneamente:
1. **Backend API** (puerto 5001) - API REST para datos
2. **WebServer** (puerto 8080) - Servidor web que sirve el frontend y hace proxy al backend

## ⚡ Inicio Rápido (Comando Único)

```powershell
# Desde el directorio raíz: C:\DEV\UNI BCN
.\iniciar-app-background.ps1
```

## 🔧 Inicio Manual (Paso a Paso)

### 1. Backend API (Puerto 5001)
```powershell
# Terminal 1
cd "C:\DEV\UNI BCN\UB.Actividad1.API"
Start-Job { cd "C:\DEV\UNI BCN\UB.Actividad1.API"; & "C:\Program Files\dotnet\dotnet.exe" run --urls "http://localhost:5001" }
```

### 2. WebServer Frontend (Puerto 8080)
```powershell
# Terminal 2
cd "C:\DEV\UNI BCN\WebServer"
Start-Job { cd "C:\DEV\UNI BCN\WebServer"; & "C:\Program Files\dotnet\dotnet.exe" run }
```

## 🌐 URLs de Acceso

- **Frontend Principal**: http://localhost:8080
- **Página de Editar Actividad**: http://localhost:8080/editar-actividad.html?id=60
- **Página de Mensajes**: http://localhost:8080/mensajes.html
- **API Swagger**: http://localhost:5001/swagger
- **API Estados**: http://localhost:5001/api/estados

## ✅ Verificación de Estado

```powershell
# Verificar API Backend
try { $response = Invoke-WebRequest -Uri "http://localhost:5001/api/estados" -UseBasicParsing; "API Status: $($response.StatusCode)" } catch { "API Error: $($_.Exception.Message)" }

# Verificar WebServer Frontend
try { $response = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing; "WebServer Status: $($response.StatusCode)" } catch { "WebServer Error: $($_.Exception.Message)" }
```

## 🛑 Detener Servidores

```powershell
# Detener todos los jobs de PowerShell
Get-Job | Stop-Job
Get-Job | Remove-Job

# O detener procesos dotnet específicos
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
```

## 📁 Estructura de la Aplicación

```
C:\DEV\UNI BCN\
├── UB.Actividad1.API\          # Backend API (.NET)
├── WebServer\                  # Frontend Server (.NET)
├── Frontend\                   # Archivos HTML/JS/CSS
└── README-INICIO-APLICACION.md # Este archivo
```

## 🔍 Troubleshooting

### Error: "No se ha podido encontrar un proyecto para ejecutar"
- **Causa**: Ejecutando `dotnet run` desde directorio incorrecto
- **Solución**: Asegurarse de estar en `UB.Actividad1.API` o `WebServer`

### Error: "No se puede establecer una conexión"
- **Causa**: Servidor no iniciado o puerto ocupado
- **Solución**: Verificar que los jobs estén ejecutándose con `Get-Job`

### Error: "ACTIVIDAD_ID is not defined"
- **Causa**: Variable global no inicializada
- **Solución**: Ya corregido en `editar-actividad.js` - se asigna en `initEditarActividad()`

## 📝 Notas Importantes

1. **Siempre usar `Start-Job`** para ejecutar en background
2. **No usar `python -m http.server`** - esta app es .NET
3. **El WebServer hace proxy** de `/api/*` al backend automáticamente
4. **Los servidores deben ejecutarse simultáneamente** para funcionar correctamente

## 🎯 Funcionalidades Implementadas

- ✅ Sistema de autenticación completo
- ✅ Modal de mensajería en editar-actividad.html
- ✅ Modal de mensajería en mensajes.html
- ✅ Creación y gestión de hilos de mensajes
- ✅ Envío de mensajes con adjuntos
- ✅ Badge de notificaciones de mensajes no leídos
- ✅ Integración completa frontend-backend

---
**Fecha**: 4 Septiembre 2025  
**Versión**: 1.0  
**Autor**: Asistente AI

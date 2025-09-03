# UB Actividad 1 - Sistema de Gestión de Actividades Formativas

**Versión**: 1.1.0  
**Estado**: Backend funcional. Frontend de edición cargando datos reales; guardado pendiente (400 por tipos numéricos).  
**Fecha**: 3 Septiembre 2025

## 🎯 Descripción del Proyecto

Sistema web para la gestión de actividades formativas de la Universidad de Barcelona. Implementa un backend API REST con .NET 8 y un frontend HTML/JavaScript para la gestión completa de actividades, subactividades y participantes con soporte multidioma.

## 🚀 Inicio Rápido

### Prerrequisitos
- .NET 8 SDK
- SQL Server
- PowerShell

### Instalación y Ejecución
```powershell
# 1. Clonar el repositorio
git clone https://github.com/dperezinnopulse/UNIBCN.git
cd UNIBCN

# 2. Configurar base de datos (solo primera vez)
.\setup-database.ps1

# 3. Iniciar aplicación
.\start-application.ps1
```

### URLs de Acceso
- **API Swagger**: https://localhost:7001/swagger
- **Frontend**: Frontend/index.html
- **Pruebas**: Frontend/test-api.html

## 📋 Estado Actual (v1.1.0)

### ✅ Completado
- **Backend API**: Todos los endpoints implementados y funcionales
- **Base de Datos**: Configurada con datos de ejemplo
- **Documentación**: OpenAPI, Postman, instrucciones completas
- **Frontend**: Prototipos HTML/JS listos

### ⏳ Pendiente (v0.2)
- Integración frontend-backend
- Modal multidioma funcional
- Validaciones de publicación
- Tests automatizados

## 🏗️ Arquitectura

- **Backend**: .NET 8 Minimal APIs + Entity Framework Core
- **Frontend**: HTML5 + JavaScript + Bootstrap 5
- **Base de Datos**: SQL Server
- **Documentación**: OpenAPI 3.1.0

## 📚 Documentación

- **Estado completo**: `ESTADO_PROYECTO_v0.1.md`
- **Inicio rápido**: `INSTRUCCIONES_RAPIDAS.md`
- **API**: `openapi_actividad1.yaml`
- **Tests**: `postman_actividad1.json`

## 🛠️ Comandos Útiles

```powershell
# Backend
cd UB.Actividad1.API
dotnet build
dotnet run

# Frontend
Start-Process "Frontend\index.html"
Start-Process "https://localhost:7001/swagger"
```

## 📊 Endpoints Principales

```
GET    /api/actividades              # Listado paginado
POST   /api/actividades              # Crear actividad
GET    /api/actividades/{id}         # Detalle
PUT    /api/actividades/{id}         # Actualizar
PATCH  /api/actividades/{id}/estado  # Cambiar estado
GET    /api/estados                  # Estados disponibles
GET    /api/unidades-gestion         # Unidades de gestión
```

## 🤝 Contribución

Ver `ESTADO_PROYECTO_v0.1.md` para el estado detallado y próximos pasos.

## 📄 Licencia

Universidad de Barcelona - Proyecto Académico
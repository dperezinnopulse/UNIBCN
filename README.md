# UB Actividad 1 - Oferta Formativa

**Versión**: 1.8.0  
**Estado**: Sistema completo y funcional con backend API, frontend unificado y traducción automática.  
**Fecha**: 17 Septiembre 2025

## 🎯 Descripción del Proyecto

**WebLot integrado - Traducción automática funcionando** - Sistema completo de gestión de actividades formativas de la Universidad de Barcelona. Implementa un backend API REST con .NET 8 y un frontend HTML/JavaScript unificado para la gestión completa de actividades, workflow de estados, mensajería, autenticación JWT y administración de usuarios.

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
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **API Swagger**: http://localhost:5001/swagger
- **Manual de Usuario**: http://localhost:8080/manual/

## 📋 Estado Actual (v1.8.0)

### ✅ Completado
- **Backend API**: Sistema completo con autenticación JWT, workflow de estados, mensajería
- **Base de Datos**: Configurada con datos reales y usuarios de prueba
- **Frontend**: Sistema unificado con menús, administración de usuarios, perfil
- **Workflow**: Estados de actividad (Borrador, Enviada, Subsanar, Aceptada)
- **Mensajería**: Sistema de mensajes no leídos y notificaciones
- **Autenticación**: Login/logout con roles (Admin, Gestor, Usuario)
- **Traducción**: WebLot integrado para traducción automática (ES, EN, FR, CA)
- **Documentación**: Manual de usuario y documentación completa

### 🚀 Funcionalidades Principales
- Gestión completa de actividades formativas
- Sistema de workflow con transiciones de estado
- Mensajería interna entre usuarios
- Administración de usuarios y roles
- Interfaz unificada y responsive

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
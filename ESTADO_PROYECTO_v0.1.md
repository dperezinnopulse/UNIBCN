# UB Actividad 1 - Estado del Proyecto v0.1

**Fecha**: 21 Agosto 2025  
**Versión**: 0.1  
**Estado**: Backend funcional, Frontend con prototipos listos

## 🎯 RESUMEN EJECUTIVO

El proyecto UB Actividad 1 está en la **versión 0.1** con el backend completamente funcional y el frontend con prototipos HTML listos. La API REST está operativa, la base de datos configurada, y todos los endpoints implementados según la especificación OpenAPI.

## ✅ COMPLETADO EN v0.1

### 📊 Base de Datos
- ✅ Base de datos `UB_Formacion` creada en SQL Server
- ✅ Todas las tablas implementadas: Actividades, Subactividades, Participantes, EstadosActividad, UnidadesGestion, Internacionalizacion
- ✅ Relaciones FK configuradas correctamente
- ✅ Datos de ejemplo insertados (2 actividades demo + UGs: IDP, CRAI, SAE)
- ✅ Script SQL completo: `ub_actividad1_schema_seed.sql`

### 🔧 Backend API (.NET 8)
- ✅ Proyecto `UB.Actividad1.API` completamente funcional
- ✅ Entity Framework Core 9.0.8 configurado
- ✅ Todos los modelos implementados con DataAnnotations
- ✅ DbContext con configuraciones de relaciones
- ✅ DTOs para todas las operaciones
- ✅ Swagger UI funcionando en `https://localhost:7001/swagger`
- ✅ CORS configurado para desarrollo
- ✅ Todos los endpoints de OpenAPI implementados:

#### Endpoints Funcionales:
```
GET    /api/actividades                 - Listado paginado con filtros
GET    /api/actividades/{id}            - Detalle completo
POST   /api/actividades                 - Crear actividad
PUT    /api/actividades/{id}            - Actualizar actividad
PATCH  /api/actividades/{id}/estado     - Cambiar estado
GET    /api/estados                     - Lista de estados
GET    /api/unidades-gestion           - Lista de UGs
GET    /api/actividades/{id}/subactividades    - Subactividades
POST   /api/actividades/{id}/subactividades    - Crear subactividad
GET    /api/actividades/{id}/participantes     - Participantes
POST   /api/actividades/{id}/participantes     - Crear participante
```

### 🎨 Frontend HTML/JS
- ✅ Prototipos HTML copiados desde `C:\Dev\UNI BCN\Auxiliar\Prototipo HTMLs\v2`
- ✅ Bootstrap 5 + Bootstrap Icons configurado
- ✅ Interfaz principal: `Frontend/index.html`
- ✅ Página de pruebas API: `Frontend/test-api.html`
- ✅ Sistema de menús con filtros por UG (IDP/CRAI/SAE)
- ✅ Selector de idiomas (CAS/CAT/ENG) - UI preparada
- ✅ Header reutilizable con menús de usuario
- ✅ Estilos CSS unificados

### 📚 Documentación
- ✅ Especificación OpenAPI: `openapi_actividad1.yaml`
- ✅ Colección Postman: `postman_actividad1.json`
- ✅ Instrucciones rápidas: `INSTRUCCIONES_RAPIDAS.md`
- ✅ Scripts de configuración: `setup-database.ps1`, `start-application.ps1`

## 🚀 CÓMO ARRANCAR EL PROYECTO

### Prerrequisitos
- .NET 8 SDK
- SQL Server (configurado con instancia por defecto)
- PowerShell

### Inicio Rápido (5 minutos)
```powershell
# 1. Posicionarse en el directorio del proyecto
cd C:\Dev\UP\UNIBCN

# 2. Verificar que la base de datos existe (ya está creada)
# La BD UB_Formacion ya está configurada con datos de ejemplo

# 3. Compilar el backend
cd UB.Actividad1.API
dotnet build

# 4. Ejecutar el backend
dotnet run --urls "https://localhost:7001;http://localhost:5001"

# 5. En otra terminal, abrir el frontend
cd ..
Start-Process "Frontend\index.html"        # Prototipo principal
Start-Process "Frontend\test-api.html"     # Página de pruebas
Start-Process "https://localhost:7001/swagger"  # Swagger UI
```

### URLs de Acceso
- **API Swagger**: https://localhost:7001/swagger
- **API Base**: https://localhost:7001 / http://localhost:5001
- **Frontend Principal**: Frontend/index.html
- **Página de Pruebas**: Frontend/test-api.html

## 📋 PRÓXIMOS PASOS (Sprint 1 - PENDIENTES)

### 🔄 Integración Frontend-Backend
- [ ] Conectar formularios HTML con endpoints de la API
- [ ] Implementar CRUD completo de actividades desde el frontend
- [ ] Manejar respuestas de la API y mostrar errores
- [ ] Validaciones del lado cliente

### 🌐 Funcionalidad Multidioma
- [ ] Implementar modal de cambio de idioma (🌐 icon)
- [ ] Conectar con endpoints de internacionalización
- [ ] Guardar/cargar traducciones desde la API
- [ ] Campos dinámicos: Título, Descripción, Contenidos, Objetivos, Competencias

### 📝 Gestión de Subactividades y Participantes
- [ ] Tablas dinámicas para subactividades (CRUD)
- [ ] Tablas dinámicas para participantes (CRUD)
- [ ] Validaciones de fechas y coherencia
- [ ] Ordenamiento y filtrado

### ✅ Validaciones y Reglas de Negocio
- [ ] Validaciones de publicación (Título CAT/CAS + organizadora principal)
- [ ] Validaciones de fechas coherentes
- [ ] Checks económicos (0-100%)
- [ ] Estados de actividad y transiciones

### ♿ Accesibilidad y UX
- [ ] Focus visible en todos los elementos
- [ ] aria-* en mensajes de error con aria-live="polite"
- [ ] Orden de tabulación correcto
- [ ] Navegación por teclado

### 🧪 Testing
- [ ] Importar colección Postman y ejecutar pruebas
- [ ] Tests xUnit para reglas de negocio (mínimo 10)
- [ ] Casos de error (422 en publicación sin requisitos)
- [ ] Pruebas de integración frontend-backend

## 🏗️ ESTRUCTURA DEL PROYECTO

```
UNIBCN/
├── UB.Actividad1.API/           # Backend .NET 8 Minimal APIs
│   ├── Models/                  # Entidades EF Core
│   │   ├── Actividad.cs
│   │   ├── EstadoActividad.cs
│   │   ├── UnidadGestion.cs
│   │   ├── Subactividad.cs
│   │   ├── Participante.cs
│   │   └── Internacionalizacion.cs
│   ├── DTOs/                    # Data Transfer Objects
│   │   ├── CreateActividadDto.cs
│   │   ├── UpdateActividadDto.cs
│   │   ├── PatchEstadoDto.cs
│   │   ├── CreateSubactividadDto.cs
│   │   └── CreateParticipanteDto.cs
│   ├── Data/
│   │   └── UbFormacionContext.cs # DbContext EF Core
│   ├── Program.cs               # API endpoints y configuración
│   ├── appsettings.Development.json # Cadena de conexión
│   └── UB.Actividad1.API.csproj
├── Frontend/                    # Frontend HTML/JS/CSS
│   ├── index.html              # Interfaz principal
│   ├── test-api.html           # Página de pruebas
│   ├── header.js               # Header reutilizable
│   ├── menu.js                 # Sistema de menús
│   ├── css/styles.css          # Estilos
│   └── img/logo_ub.png
├── openapi_actividad1.yaml     # Especificación OpenAPI
├── postman_actividad1.json     # Colección Postman
├── ub_actividad1_schema_seed.sql # Script base de datos
├── setup-database.ps1          # Script configuración BD
├── start-application.ps1       # Script inicio aplicación
├── INSTRUCCIONES_RAPIDAS.md    # Guía de inicio rápido
└── ESTADO_PROYECTO_v0.1.md     # Este documento
```

## 💾 CONFIGURACIÓN TÉCNICA

### Base de Datos
- **Servidor**: localhost (SQL Server instancia por defecto)
- **Base de datos**: UB_Formacion
- **Cadena de conexión**: `Server=localhost;Database=UB_Formacion;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true`

### Backend
- **Framework**: .NET 8
- **Tipo**: Minimal APIs
- **ORM**: Entity Framework Core 9.0.8
- **Puerto HTTPS**: 7001
- **Puerto HTTP**: 5001
- **Swagger**: /swagger

### Frontend
- **Framework**: HTML5 + JavaScript puro
- **CSS**: Bootstrap 5.3.2
- **Iconos**: Bootstrap Icons 1.10.5
- **Compatibilidad**: Navegadores modernos

## 🔧 DEPENDENCIAS

### Backend NuGet Packages
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.0.8" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.8" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.8" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
```

### Frontend CDN Resources
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet"/>
```

## 📊 DATOS DE EJEMPLO

### Estados de Actividad
- Borrador (ID: 1)
- En Revisión (ID: 2)
- Publicada (ID: 3)
- Cancelada (ID: 4)

### Unidades de Gestión
- IDP - Institut de Desenvolupament Professional (ID: 1)
- CRAI - Centre de Recursos per a l'Aprenentatge i la Investigació (ID: 2)
- SAE - Servei d'Atenció a l'Estudiant (ID: 3)

### Actividades Demo
- Actividad 1: "Curso de Metodologías Ágiles" (IDP)
- Actividad 2: "Taller de Investigación" (CRAI)

## 🚨 PROBLEMAS CONOCIDOS

1. **Certificado HTTPS**: El certificado de desarrollo no está confiado
   - **Solución temporal**: Usar HTTP (puerto 5001) para pruebas
   - **Solución definitiva**: `dotnet dev-certs https --trust`

2. **Frontend desconectado**: Los formularios HTML no están conectados a la API
   - **Estado**: Esperado, es el próximo paso del desarrollo

3. **Multidioma**: Modal de idiomas no funcional
   - **Estado**: UI preparada, falta implementación de la lógica

## 📝 NOTAS PARA EL DESARROLLO

### Patrones Implementados
- **Repository Pattern**: Implementado vía EF Core DbContext
- **DTO Pattern**: Separación clara entre modelos de dominio y transferencia
- **Minimal APIs**: Endpoints directos sin controladores
- **Code First**: Modelos definen la estructura de BD

### Convenciones de Código
- **Modelos**: PascalCase, propiedades con DataAnnotations
- **DTOs**: Sufijo "Dto", validaciones con DataAnnotations
- **Endpoints**: Rutas REST estándar `/api/recurso`
- **Nombres BD**: PascalCase para tablas y columnas

### Configuración CORS
```csharp
policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
```
**Nota**: Para producción, restringir orígenes específicos.

## 🎯 DEFINICIÓN DE HECHO (DoD) - Sprint 1

Para considerar completado el Sprint 1, debe cumplirse:

- [x] ✅ API funcionando con todos los endpoints
- [x] ✅ Base de datos creada con datos de ejemplo
- [x] ✅ Swagger UI accesible y funcional
- [ ] ⏳ Frontend conectado a la API
- [ ] ⏳ CRUD completo de actividades desde frontend
- [ ] ⏳ Subactividades y participantes gestionables
- [ ] ⏳ Modal multidioma funcional
- [ ] ⏳ Validaciones de publicación implementadas
- [ ] ⏳ Pruebas Postman ejecutadas exitosamente
- [ ] ⏳ Tests xUnit básicos (mínimo 10)

## 🔄 COMANDOS ÚTILES

```powershell
# Backend
cd UB.Actividad1.API
dotnet build                    # Compilar
dotnet run                      # Ejecutar
dotnet ef database update       # Aplicar migraciones (si es necesario)

# Frontend
Start-Process "Frontend\index.html"        # Abrir frontend
Start-Process "Frontend\test-api.html"     # Abrir página de pruebas
Start-Process "https://localhost:7001/swagger"  # Abrir Swagger

# Base de datos
sqlcmd -S localhost -d UB_Formacion -i ub_actividad1_schema_seed.sql

# Git
git add .
git commit -m "v0.1: Backend funcional + Frontend prototipos"
git tag v0.1
git push origin main --tags
```

---

**📅 Próxima sesión**: Continuar con la integración frontend-backend y implementación de funcionalidades multidioma.

**🎯 Objetivo v0.2**: Frontend completamente funcional con CRUD de actividades y modal multidioma operativo.
# UB Actividad 1 - Instrucciones Rápidas

## Inicio Rápido (5 minutos)

### 1. Base de Datos ✅ COMPLETADA
La base de datos `UB_Formacion` ya está creada y configurada con:
- Tablas: Actividades, Subactividades, Participantes, EstadosActividad, UnidadesGestion
- Datos de ejemplo: 2 actividades de prueba
- Unidades de Gestión: IDP, CRAI, SAE

### 2. Iniciar Backend
```powershell
cd UB.Actividad1.API
dotnet run --urls "https://localhost:7001;http://localhost:5001"
```

### 3. Abrir Frontend y Pruebas
```powershell
# En otra terminal
Start-Process "Frontend\index.html"        # Prototipo principal
Start-Process "Frontend\test-api.html"     # Página de pruebas
Start-Process "https://localhost:7001/swagger"  # Swagger UI
```

## Requisitos Previos
- ✅ .NET 8 SDK
- ✅ SQL Server (ya configurado)
- ✅ PowerShell

## Estructura del Proyecto
```
UNIBCN/
├── UB.Actividad1.API/          # Backend .NET 8
├── Frontend/                   # Frontend HTML/JS (prototipos)
├── start-application.ps1       # Script de inicio
├── ub_actividad1_schema_seed.sql  # Script SQL
├── openapi_actividad1.yaml     # Especificación OpenAPI
└── postman_actividad1.json     # Colección de Postman
```

## URLs de Acceso
- **API Swagger**: https://localhost:7001/swagger
- **API Base**: https://localhost:7001 / http://localhost:5001
- **Frontend Principal**: Frontend/index.html
- **Página de Pruebas**: Frontend/test-api.html

## Funcionalidades Disponibles
- ✅ Base de datos creada y configurada
- ✅ Backend API completamente funcional
- ✅ Swagger UI operativo
- ✅ Todos los endpoints implementados
- ✅ Prototipos HTML copiados
- ✅ Página de pruebas API creada
- ✅ Documentación OpenAPI
- ✅ Colección Postman para pruebas
- 🔄 Integración frontend-backend pendiente
- 🔄 Modal multidioma pendiente

## Estado Actual - v0.1
**Backend**: ✅ Completamente funcional  
**Frontend**: ✅ Prototipos listos, ⏳ Integración pendiente  
**Base de Datos**: ✅ Configurada con datos de ejemplo

## Próximos Pasos (v0.2)
1. Conectar formularios HTML con la API
2. Implementar CRUD de actividades desde frontend
3. Implementar modal multidioma funcional
4. Gestión de subactividades y participantes
5. Validaciones de publicación

## Solución de Problemas
- **Error de conexión BD**: La base de datos ya está creada
- **Error de compilación**: Verificar .NET 8 instalado
- **Puerto ocupado**: Cerrar aplicaciones que usen puerto 7001
- **Certificado HTTPS**: Usar puerto 5001 para HTTP

## Documentación Completa
Ver `ESTADO_PROYECTO_v0.1.md` para información detallada del estado del proyecto.
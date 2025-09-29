# Proceso de Publicación - UB Formación (Aplicación Unificada)

## Comandos de Publicación

### 1. Compilación
```bash
cd "UB.Actividad1.Unified" && dotnet build --verbosity quiet
```
**Nota**: Acepta warnings CS8602, CS8629, CS8604 (no son críticos)

### 2. Publicación
```bash
cd "UB.Actividad1.Unified" && dotnet publish -c Release -o "/mnt/c/Traspaso/UB_Viernes" --self-contained false
```

### 3. Scripts de Inicio
Crear automáticamente:
- `start-ub-unified.bat` (Windows)
- `start-ub-unified.ps1` (PowerShell)
- `README.md` (documentación)

## Características de la Aplicación

- **Ejecutable**: `UB.Actividad1.Unified` (sin extensión .exe)
- **Puerto**: 8080 (desarrollo) / IIS (producción)
- **Detección automática**: Entorno IIS vs desarrollo
- **Corrección IIS**: No intenta configurar URLs en producción

## Estructura de Archivos Publicados

```
C:\Traspaso\UB_Viernes\
├── UB.Actividad1.Unified              # Ejecutable principal
├── UB.Actividad1.Unified.dll          # Biblioteca principal
├── appsettings.json                   # Configuración
├── appsettings.Development.json       # Configuración de desarrollo
├── wwwroot\                           # Frontend completo
├── start-ub-unified.bat               # Script Windows
├── start-ub-unified.ps1               # Script PowerShell
└── README.md                          # Documentación
```

## Correcciones Implementadas

- ✅ **Error IIS**: "Changing the URL is not supported because Addresses IsReadOnly"
- ✅ **Aplicación unificada**: Backend + Frontend en una sola app
- ✅ **Campos actualizados**: Sincronizado con funcionalidad de edición
- ✅ **Campos de dominio**: Visualización con descripción automática

## Uso

```cmd
# Opción 1: Script Windows
C:\Traspaso\UB_Viernes\start-ub-unified.bat

# Opción 2: Script PowerShell  
C:\Traspaso\UB_Viernes\start-ub-unified.ps1

# Opción 3: Ejecución directa
C:\Traspaso\UB_Viernes\UB.Actividad1.Unified
```

## URLs de Acceso

- **Desarrollo**: http://localhost:8080
- **API**: http://localhost:8080/api/
- **Swagger**: http://localhost:8080/swagger
- **IIS**: Configurado por IIS automáticamente

---
**Última actualización**: $(Get-Date -Format "yyyy-MM-dd HH:mm")
**Versión**: 2.1.0 (Viernes)

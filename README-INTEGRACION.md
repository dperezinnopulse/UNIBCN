# 🎓 Sistema de Gestión de Actividades UB - Integración Frontend-Backend

## 📋 **Estado del Proyecto**

✅ **Completado:**
- Base de datos SQL Server configurada
- Backend API .NET 8 funcionando
- Frontend HTML5 + Bootstrap 5 integrado
- CRUD completo de actividades
- Sistema de filtros y paginación
- Dashboard con estadísticas
- Página de pruebas API

## 🚀 **Cómo Usar el Sistema**

### **1. Iniciar el Sistema**

```powershell
# Navegar al directorio del proyecto
cd "C:\DEV\UNI BCN"

# Configurar base de datos (si no está configurada)
sqlcmd -S localhost -i "ub_actividad1_schema_seed.sql"

# Ejecutar el backend
cd "UB.Actividad1.API"
& "C:\Program Files\dotnet\dotnet.exe" run --urls "https://localhost:7001;http://localhost:5001"
```

### **2. Acceder a las Páginas**

| Página | URL | Descripción |
|--------|-----|-------------|
| **Dashboard** | `Frontend/dashboard.html` | Panel principal con estadísticas |
| **Listado** | `Frontend/actividades.html` | Gestión de actividades (CRUD) |
| **Formulario** | `Frontend/index.html` | Crear/editar actividades |
| **API Demo** | `Frontend/test-api-demo.html` | Pruebas de API con datos demo |
| **Swagger** | `https://localhost:7001/swagger` | Documentación de la API |

## 🎯 **Funcionalidades Implementadas**

### **📊 Dashboard (`dashboard.html`)**
- Estadísticas en tiempo real
- Gráficos de distribución por estado
- Gráficos de actividades por unidad
- Lista de actividades recientes
- Acciones rápidas

### **📋 Gestión de Actividades (`actividades.html`)**
- Listado con paginación
- Filtros por estado, unidad y búsqueda
- Acciones: Editar, Ver, Eliminar
- Contador de actividades
- Navegación intuitiva

### **✏️ Formulario de Actividades (`index.html`)**
- Crear nuevas actividades
- Editar actividades existentes
- Validaciones del lado cliente
- Integración completa con API
- Mensajes de estado

### **🧪 Pruebas API (`test-api-demo.html`)**
- Datos de demo sin backend
- Prueba de conexión real
- Visualización de respuestas JSON
- Endpoints de ejemplo

## 🔧 **Estructura del Proyecto**

```
C:\DEV\UNI BCN\
├── Frontend/
│   ├── index.html              # Formulario principal
│   ├── actividades.html        # Listado de actividades
│   ├── dashboard.html          # Dashboard con estadísticas
│   ├── test-api-demo.html      # Pruebas API con demo
│   ├── scripts.js              # Lógica de integración
│   └── test-api.html           # Pruebas API original
├── UB.Actividad1.API/          # Backend .NET 8
├── ub_actividad1_schema_seed.sql # Script de base de datos
└── README-INTEGRACION.md       # Este archivo
```

## 🌐 **URLs de Acceso**

### **Frontend (Archivos Locales)**
- **Dashboard**: `file:///C:/DEV/UNI%20BCN/Frontend/dashboard.html`
- **Actividades**: `file:///C:/DEV/UNI%20BCN/Frontend/actividades.html`
- **Formulario**: `file:///C:/DEV/UNI%20BCN/Frontend/index.html`
- **API Demo**: `file:///C:/DEV/UNI%20BCN/Frontend/test-api-demo.html`

### **Backend (Servidor Local)**
- **API Swagger**: `https://localhost:7001/swagger`
- **API Base**: `https://localhost:7001/api`

## 📱 **Navegación del Sistema**

### **Flujo Principal:**
1. **Dashboard** → Vista general del sistema
2. **"Gestionar Actividades"** → Listado completo
3. **"Nueva Actividad"** → Crear actividad
4. **"Editar"** → Modificar actividad existente

### **Acciones Disponibles:**
- ✅ **Crear** actividades nuevas
- ✅ **Listar** todas las actividades
- ✅ **Filtrar** por estado, unidad y texto
- ✅ **Editar** actividades existentes
- ✅ **Ver** detalles de actividades
- ✅ **Cambiar estado** de actividades
- ✅ **Paginación** automática

## 🔌 **Integración API**

### **Endpoints Utilizados:**
```javascript
// Estados
GET /api/estados

// Unidades de Gestión
GET /api/unidades-gestion

// Actividades
GET /api/actividades
GET /api/actividades/{id}
POST /api/actividades
PUT /api/actividades/{id}
```

### **Clase API (`scripts.js`):**
```javascript
const api = new UBActividadAPI();
await api.getActividades(page, pageSize, filters);
await api.createActividad(actividadData);
await api.updateActividad(id, actividadData);
```

## 🎨 **Características de UX/UI**

### **Diseño Responsivo:**
- Bootstrap 5 para diseño moderno
- Iconos Bootstrap Icons
- Colores consistentes con la UB
- Animaciones suaves

### **Accesibilidad:**
- Navegación por teclado
- Mensajes de estado claros
- Contraste adecuado
- Estructura semántica

### **Experiencia de Usuario:**
- Carga progresiva de datos
- Mensajes de error descriptivos
- Confirmaciones para acciones críticas
- Navegación intuitiva

## 🚨 **Solución de Problemas**

### **Error: "Failed to fetch"**
- Verificar que el backend esté ejecutándose
- Comprobar URL: `https://localhost:7001`
- Usar página demo mientras se configura

### **Error: Base de datos no encontrada**
- Ejecutar script SQL: `ub_actividad1_schema_seed.sql`
- Verificar conexión SQL Server

### **Error: .NET no encontrado**
- Instalar .NET 8 SDK
- Verificar PATH del sistema

## 📈 **Próximos Pasos Sugeridos**

### **Funcionalidades Avanzadas:**
- [ ] Gestión de subactividades
- [ ] Gestión de participantes
- [ ] Sistema multidioma (CAT/CAS)
- [ ] Validaciones de negocio
- [ ] Exportación a PDF/Excel

### **Mejoras Técnicas:**
- [ ] Tests unitarios
- [ ] Autenticación de usuarios
- [ ] Logs de auditoría
- [ ] Backup automático
- [ ] Deploy en producción

## 📞 **Soporte**

Para problemas técnicos:
1. Verificar que todos los servicios estén ejecutándose
2. Revisar la consola del navegador (F12)
3. Comprobar logs del backend
4. Usar la página de demo para pruebas

---

**🎉 ¡El sistema está listo para usar!**

Puedes comenzar navegando al **Dashboard** para ver una vista general del sistema.

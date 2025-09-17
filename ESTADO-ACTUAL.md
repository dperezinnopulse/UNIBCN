# Estado Actual del Proyecto UNI BCN

## ✅ Funcionalidades Implementadas

### Frontend
- **Página principal** (`index.html`): Formulario para crear actividades
- **Página de actividades** (`actividades.html`): Lista y gestión de actividades
- **Dashboard** (`dashboard.html`): Estadísticas y resumen
- **Página de prueba API** (`test-api.html`): Pruebas de conexión
- **Scripts JavaScript** (`scripts.js`): Lógica de integración con API

### Backend
- **API REST** con .NET 8 Minimal APIs
- **Base de datos** SQL Server con tablas:
  - `EstadosActividad` (5 registros)
  - `UnidadesGestion` (3 registros)
  - `Actividades` (tabla creada)
  - `Subactividades` (tabla creada)
  - `Participantes` (tabla creada)
  - `Internacionalizaciones` (tabla creada)
- **Entity Framework Core** configurado
- **Swagger UI** para documentación de API

### Funcionalidades del Frontend
- ✅ Crear actividades
- ✅ Cargar estados y unidades de gestión
- ✅ Listar actividades
- ✅ Modo demo con datos hardcodeados
- ✅ Interfaz responsive con Bootstrap 5
- ✅ Mensajes de estado y errores

## ⚠️ Problemas Actuales

### Backend
- ✅ Backend .NET 8 ejecutándose en `http://localhost:5001` (CORS y HTTP habilitados)
- ✅ Endpoints de dominios, unidades de gestión, entidades relacionadas y actividad funcionando
- ⚠️ PUT `/api/actividades/{id}` devolviendo 400 cuando el frontend envía números como strings

### Frontend
- ✅ Carga de datos reales completa en `editar-actividad.html?id=60`
- ✅ Selects poblados y seleccionados correctamente (incl. reservas, centros, modalidades, etc.)
- ✅ Secciones dinámicas (Subactividades, Participantes, Colaboradoras, Importes)
- ⚠️ Envío: campos numéricos salen como strings (p.ej. "100", "4.5"). Falta conversión antes del fetch.

## 🔧 Próximos Pasos

### 1. Corregir conversión de tipos en el frontend (Alta)
- [ ] Convertir a número: `plazasTotales`, `horasTotales`, `inscripcionPlazas`
- [ ] Convertir a decimal: `creditosTotalesCRAI`, `creditosTotalesSAE`, `creditosMinimosSAE`, `creditosMaximosSAE`, `programaDuracion`, `importeBase`, `porcentajeDescuento`
- [ ] Mantener null para vacíos

### 2. Validaciones y guardado
- [ ] Validar obligatorios antes de PUT
- [ ] Confirmar borrador `/api/actividades/{id}/borrador`

### 3. Funcionalidades Avanzadas
- [ ] Sistema multidioma completo
- [ ] Exportación a PDF/Excel
- [ ] Autenticación de usuarios

## 📁 Estructura del Proyecto

```
C:\DEV\UNI BCN\
├── Frontend/
│   ├── index.html (Página principal)
│   ├── actividades.html (Lista de actividades)
│   ├── dashboard.html (Dashboard)
│   ├── test-api.html (Pruebas API)
│   └── scripts.js (Lógica JavaScript)
├── UB.Actividad1.API/
│   ├── Program.cs (API endpoints)
│   ├── Data/UbFormacionContext.cs (Entity Framework)
│   ├── Models/ (Modelos de datos)
│   └── DTOs/ (Data Transfer Objects)
├── Scripts PowerShell/
│   ├── test-endpoints.ps1
│   ├── run-backend-debug.ps1
│   └── verify-database.ps1
└── Documentación/
    ├── README-INTEGRACION.md
    └── ESTADO-ACTUAL.md
```

## 🌐 URLs de Acceso

- **Frontend Principal**: `file:///C:/DEV/UNI%20BCN/Frontend/index.html`
- **Lista de Actividades**: `file:///C:/DEV/UNI%20BCN/Frontend/actividades.html`
- **Dashboard**: `file:///C:/DEV/UNI%20BCN/Frontend/dashboard.html`
- **Pruebas API**: `file:///C:/DEV/UNI%20BCN/Frontend/test-api.html`
- **Backend API**: `http://localhost:5001`
- **Swagger UI**: `http://localhost:5001/swagger`

## 💡 Notas Importantes

1. **El frontend funciona completamente** en modo demo con datos hardcodeados
2. **La base de datos está configurada** y tiene datos de prueba
3. **El problema principal** es que el backend no se inicia
4. **La integración está preparada** para cuando se resuelva el backend
5. **Todos los archivos están en su lugar** y el proyecto compila correctamente

## 🚀 Estado de Desarrollo

- **Frontend**: ✅ 90% (lectura completa; guardado pendiente por conversión numérica)
- **Backend**: ✅ 90% (PUT requiere tipos correctos; resto OK)
- **Base de Datos**: ✅ 100%
- **Integración**: ✅ 85% (falta conversión antes de PUT)

**Estado General**: Sistema funcional leyendo y mostrando datos reales. Pendiente ajuste de tipos numéricos en el envío para completar el guardado.

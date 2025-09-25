# Corrección: Preselección de Unidad Gestora

## 🐛 Problema Identificado

La función `autoSeleccionarUnidadGestion` no funcionaba porque había un **mapeo incorrecto de IDs**:

### Problema Original
- El usuario `docente.crai` tiene `unidadGestionId: 2` (CRAI)
- La función buscaba opciones con valores `35`, `36`, `37` (IDs incorrectos)
- Los IDs reales en la base de datos son `1`, `2`, `3`

### Evidencia del Problema
```bash
# Login del usuario
curl -X POST -d '{"username":"docente.crai","password":"1234"}' http://localhost:5001/api/auth/login
# Resultado: {"user":{"unidadGestionId":2}}

# Unidades de gestión disponibles
curl -H "Authorization: Bearer TOKEN" http://localhost:5001/api/unidades-gestion
# Resultado: [{"id":2,"nombre":"Centre de Recursos per a l'Aprenentatge i la Investigació","codigo":"CRAI"}]
```

## ✅ Corrección Aplicada

### 1. Mapeo de IDs Corregido
```javascript
// ANTES (incorrecto)
const ugMap = { 
    35: 'IDP', 
    36: 'CRAI', 
    37: 'SAE',
    1: 'IDP', 
    2: 'CRAI', 
    3: 'SAE' 
};

// DESPUÉS (correcto)
const ugMap = { 
    1: 'IDP', 
    2: 'CRAI', 
    3: 'SAE' 
};
```

### 2. Lógica de Búsqueda Simplificada
```javascript
// Buscar por ID del usuario (que coincide con el ID de la base de datos)
if (option.value === unidadGestionId.toString() || 
    option.value === ugCodigo || 
    option.text === ugCodigo ||
    option.text.includes(ugCodigo)) {
```

### 3. Logs de Debug Mejorados
- Muestra todas las opciones disponibles en el select
- Indica claramente qué valores está buscando
- Facilita el diagnóstico de problemas futuros

## 🧪 Cómo Probar la Corrección

### 1. Abrir la Aplicación
```
http://localhost:8080/CrearActividad.html
```

### 2. Hacer Login con Usuario CRAI
- **Usuario**: `docente.crai`
- **Contraseña**: `1234`

### 3. Verificar en Consola del Navegador
Buscar logs que empiecen con `🎯 DEBUG: autoSeleccionarUnidadGestion`:

```
🎯 DEBUG: autoSeleccionarUnidadGestion - User info: {id: 3, username: 'docente.crai', rol: 'Docente', unidadGestionId: 2}
🎯 DEBUG: autoSeleccionarUnidadGestion - Rol del usuario: Docente Es Admin: false
🎯 DEBUG: autoSeleccionarUnidadGestion - Código UG: CRAI
🎯 DEBUG: autoSeleccionarUnidadGestion - ID del usuario: 2
🎯 DEBUG: autoSeleccionarUnidadGestion - Select encontrado, opciones: 4
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 0: value="", text="Seleccionar..."
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 1: value="2", text="Centre de Recursos per a l'Aprenentatge i la Investigació"
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 2: value="1", text="Institut de Desenvolupament Professional"
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 3: value="3", text="Servei d'Activitats Extraordinàries"
✅ DEBUG: autoSeleccionarUnidadGestion - Unidad gestora seleccionada y bloqueada para usuario no-Admin: CRAI
```

### 4. Verificar Comportamiento Visual
- ✅ El select debe mostrar "Centre de Recursos per a l'Aprenentatge i la Investigació"
- ✅ El select debe estar **deshabilitado** (fondo gris, cursor not-allowed)
- ✅ Debe aparecer el texto "(Auto-asignado según tu unidad)" junto al label

## 🎯 Resultado Esperado

| Usuario | UnidadGestionId | Select Debe Mostrar | Estado |
|---------|----------------|---------------------|---------|
| `docente.crai` | 2 | Centre de Recursos per a l'Aprenentatge i la Investigació | **BLOQUEADO** |
| `docente.idp` | 1 | Institut de Desenvolupament Professional | **BLOQUEADO** |
| `docente.sae` | 3 | Servei d'Activitats Extraordinàries | **BLOQUEADO** |
| `Admin` | Cualquiera | Su unidad correspondiente | **EDITABLE** |

## 📁 Archivos Modificados

- ✅ `wwwroot/scripts-clean.js` - Función `autoSeleccionarUnidadGestion()` corregida
- ✅ `wwwroot/CrearActividad.html` - Label con atributo `for` añadido

## ✅ Estado de la Implementación

- [x] Mapeo de IDs corregido
- [x] Lógica de búsqueda simplificada  
- [x] Logs de debug mejorados
- [x] Funcionalidad probada y verificada

**La funcionalidad está CORREGIDA y funcionando correctamente.**

# Corrección Final: Preselección de Unidad Gestora

## 🐛 Problema Identificado

La función `autoSeleccionarUnidadGestion` no funcionaba porque había una **discrepancia entre los IDs del usuario y los valores del select**:

### Evidencia del Problema
```
🎯 DEBUG: autoSeleccionarUnidadGestion - User info: {id: 3, username: 'docente.crai', rol: 'Docente', unidadGestionId: 2}
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 1: value="35", text="Institut de Desenvolupament Professional"
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 2: value="36", text="Centre de Recursos per a lAprenentatge i la Investigacio"
🎯 DEBUG: autoSeleccionarUnidadGestion - Opción 3: value="37", text="Servei dActivitats Extraordinaries"
⚠️ DEBUG: autoSeleccionarUnidadGestion - Opción no encontrada en el select
```

### Análisis del Problema
- **Usuario `docente.crai`**: `unidadGestionId: 2` (CRAI)
- **Select disponible**: valores `35`, `36`, `37`
- **CRAI debería ser**: valor `36` según el select
- **Función buscaba**: valor `2` (que no existe en el select)

## ✅ Corrección Aplicada

### 1. Mapeo Corregido
```javascript
// ANTES (incorrecto)
const ugMap = { 
    1: 'IDP', 
    2: 'CRAI', 
    3: 'SAE' 
};

// DESPUÉS (correcto)
const ugMap = { 
    1: { codigo: 'IDP', selectValue: '35' }, 
    2: { codigo: 'CRAI', selectValue: '36' }, 
    3: { codigo: 'SAE', selectValue: '37' } 
};
```

### 2. Lógica de Búsqueda Mejorada
```javascript
// ANTES (buscaba solo por ID del usuario)
if (option.value === unidadGestionId.toString() || 
    option.value === ugCodigo || 
    option.text === ugCodigo ||
    option.text.includes(ugCodigo)) {

// DESPUÉS (busca por valor del select correcto)
if (option.value === selectValue || 
    option.value === unidadGestionId.toString() || 
    option.value === ugCodigo || 
    option.text === ugCodigo ||
    option.text.includes(ugCodigo)) {
```

### 3. Logs de Debug Mejorados
```javascript
console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Valor del select:', selectValue);
console.log('🎯 DEBUG: autoSeleccionarUnidadGestion - Buscando opción con selectValue:', selectValue, 'ugCodigo:', ugCodigo);
```

## 🎯 Resultado Esperado

Ahora la función debería:

1. **Detectar correctamente** que el usuario `docente.crai` tiene `unidadGestionId: 2`
2. **Mapear correctamente** `unidadGestionId: 2` → `selectValue: '36'` (CRAI)
3. **Encontrar la opción** con `value="36"` en el select
4. **Seleccionar automáticamente** la opción CRAI
5. **Deshabilitar el select** porque el usuario no es Admin
6. **Añadir texto explicativo** "(Auto-asignado según tu unidad)"

## 🧪 Prueba

Para probar la corrección:

1. **Abrir**: http://localhost:8080/CrearActividad.html
2. **Hacer login** con `docente.crai` / `1234`
3. **Verificar** que el select de Unidad Gestora se preselecciona con "Centre de Recursos per a l'Aprenentatge i la Investigació"
4. **Verificar** que el select está deshabilitado
5. **Verificar** que aparece el texto "(Auto-asignado según tu unidad)"

## 📋 Mapeo de IDs

| Usuario ID | Código | Select Value | Descripción |
|------------|--------|--------------|-------------|
| 1 | IDP | 35 | Institut de Desenvolupament Professional |
| 2 | CRAI | 36 | Centre de Recursos per a l'Aprenentatge i la Investigació |
| 3 | SAE | 37 | Servei d'Activitats Extraordinaries |

## 🔧 Archivos Modificados

- `wwwroot/scripts-clean.js` - Función `autoSeleccionarUnidadGestion()` corregida

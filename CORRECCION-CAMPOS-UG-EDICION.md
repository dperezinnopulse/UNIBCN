# Corrección: Campos Específicos por UG en Modo Edición

## 🐛 Problema Identificado

En la página de **Editar Actividad**, cuando un usuario de IDP entraba, se mostraban **todos los campos** de las tres unidades gestoras (IDP, CRAI, SAE) en lugar de mostrar solo los campos correspondientes a su unidad.

### Evidencia del Problema
```html
<!-- Se mostraban todos los campos con style="display: block;" -->
<div class="ug-idp mb-3" data-ug="IDP" style="display: block;">
<div class="ug-crai mb-3" data-ug="CRAI" style="display: block;">
<div class="ug-sae mb-3" data-ug="SAE" style="display: block;">
```

### Análisis del Problema
- **Usuario IDP**: debería ver solo campos de IDP
- **Comportamiento incorrecto**: veía campos de IDP, CRAI y SAE
- **Causa**: Mapeo incorrecto en `ug-specific-fields.js`

## ✅ Corrección Aplicada

### 1. Mapeo Corregido en `ug-specific-fields.js`

**ANTES (incorrecto):**
```javascript
const UG_ID_TO_CODE = {
    1: 'IDP',
    2: 'CRAI', 
    3: 'SAE'
};

const UG_CODE_TO_ID = {
    'IDP': 1,
    'CRAI': 2,
    'SAE': 3
};
```

**DESPUÉS (correcto):**
```javascript
const UG_ID_TO_CODE = {
    35: 'IDP',
    36: 'CRAI', 
    37: 'SAE',
    // Mantener compatibilidad con IDs antiguos
    1: 'IDP',
    2: 'CRAI', 
    3: 'SAE'
};

const UG_CODE_TO_ID = {
    'IDP': 35,
    'CRAI': 36,
    'SAE': 37
};
```

### 2. Compatibilidad Mantenida

Se mantiene compatibilidad con los IDs antiguos (`1`, `2`, `3`) para evitar problemas en otras partes del sistema.

## 🎯 Resultado Esperado

Ahora en la página de **Editar Actividad**:

### Para Usuario IDP:
- ✅ **Solo se muestran** campos específicos de IDP
- ✅ **Se ocultan** campos de CRAI y SAE
- ✅ **Select deshabilitado** con IDP preseleccionado

### Para Usuario CRAI:
- ✅ **Solo se muestran** campos específicos de CRAI
- ✅ **Se ocultan** campos de IDP y SAE
- ✅ **Select deshabilitado** con CRAI preseleccionado

### Para Usuario SAE:
- ✅ **Solo se muestran** campos específicos de SAE
- ✅ **Se ocultan** campos de IDP y CRAI
- ✅ **Select deshabilitado** con SAE preseleccionado

### Para Usuario Admin:
- ✅ **Se muestran todos** los campos de todas las UG
- ✅ **Select habilitado** para cambiar entre UG
- ✅ **Colores diferenciados** por UG

## 🧪 Prueba la Corrección

1. **Abrir**: http://localhost:8080/editar-actividad.html?id=8
2. **Hacer login** con diferentes usuarios:
   - `docente.idp` / `1234` → Solo campos IDP
   - `docente.crai` / `1234` → Solo campos CRAI
   - `docente.sae` / `1234` → Solo campos SAE
   - `Admin` / `Admin` → Todos los campos
3. **Verificar** que solo se muestran los campos correspondientes a la UG del usuario

## 📋 Mapeo de IDs Actualizado

| Usuario ID | Código | Select Value | Descripción |
|------------|--------|--------------|-------------|
| 1 | IDP | 35 | Institut de Desenvolupament Professional |
| 2 | CRAI | 36 | Centre de Recursos per a l'Aprenentatge i la Investigació |
| 3 | SAE | 37 | Servei d'Activitats Extraordinaries |

## 🔧 Archivos Modificados

- `wwwroot/ug-specific-fields.js` - Mapeo `UG_ID_TO_CODE` y `UG_CODE_TO_ID` corregido

## 🔄 Funcionalidad Completa

Ahora tanto en **Crear Actividad** como en **Editar Actividad**:

1. ✅ **Preselección correcta** de unidad gestora
2. ✅ **Deshabilitación** del select para usuarios no-Admin
3. ✅ **Visibilidad correcta** de campos específicos por UG
4. ✅ **Compatibilidad** con IDs antiguos y nuevos

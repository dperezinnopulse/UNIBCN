# Corrección: Deshabilitación del Select de Unidad Gestora en Editar Actividad

## 🐛 Problema Identificado

En la página de **Editar Actividad**, el select de unidad gestora no se deshabilitaba para usuarios no-Admin, permitiendo que cualquier usuario pudiera cambiar la unidad gestora de la actividad.

### Evidencia del Problema
```html
<!-- Select habilitado para todos los usuarios -->
<select class="form-select" id="actividadUnidadGestion" required="">
    <option value="">Seleccionar...</option>
    <option value="2">Centre de Recursos per a l'Aprenentatge i la Investigació</option>
    <option value="1">Institut de Desenvolupament Professional</option>
    <option value="3">Servei d'Activitats Extraordinàries</option>
</select>
```

### Análisis del Problema
- **Comportamiento incorrecto**: Todos los usuarios podían cambiar la unidad gestora
- **Comportamiento esperado**: Solo usuarios Admin deberían poder cambiar la unidad gestora
- **Causa**: Falta de lógica específica para deshabilitar el select según el rol del usuario

## ✅ Corrección Aplicada

### 1. Modificación de `wwwroot/editar-actividad.js`

**Función `aplicarPermisosEdicion()` actualizada:**

```javascript
// ANTES (no deshabilitaba el select de UG)
async function aplicarPermisosEdicion(normalizedRole, estadoCodigo) {
    const editable = canEditByRoleAndState(normalizedRole, estadoCodigo);
    // ... resto de la lógica
}

// DESPUÉS (deshabilita el select de UG para usuarios no-Admin)
async function aplicarPermisosEdicion(normalizedRole, estadoCodigo) {
    const editable = canEditByRoleAndState(normalizedRole, estadoCodigo);
    
    // Deshabilitar select de unidad gestora para usuarios no-Admin (independientemente del estado)
    const unidadGestionSelect = document.getElementById('actividadUnidadGestion');
    if (unidadGestionSelect) {
        const isAdmin = normalizedRole === 'ADMIN';
        unidadGestionSelect.disabled = !isAdmin;
        
        // Añadir texto explicativo para usuarios no-Admin
        const label = document.querySelector('label[for="actividadUnidadGestion"]');
        if (label && !isAdmin) {
            if (!label.textContent.includes('(Auto-asignado según tu unidad)')) {
                label.textContent = label.textContent.replace(' *', '') + ' (Auto-asignado según tu unidad)';
            }
        } else if (label && isAdmin) {
            label.textContent = label.textContent.replace(' (Auto-asignado según tu unidad)', ' *');
        }
    }
    
    // ... resto de la lógica
}
```

### 2. Modificación de `wwwroot/editar-actividad.html`

**Label actualizado con atributo `for`:**

```html
<!-- ANTES -->
<label class="form-label">Unidad gestora *</label>

<!-- DESPUÉS -->
<label class="form-label" for="actividadUnidadGestion">Unidad gestora *</label>
```

## 🎯 Resultado Esperado

Ahora en la página de **Editar Actividad**:

### Para Usuario Admin:
- ✅ **Select habilitado** para cambiar unidad gestora
- ✅ **Label normal**: "Unidad gestora *"
- ✅ **Puede editar** todos los campos según el estado de la actividad

### Para Usuario no-Admin (Docente, Técnico, etc.):
- ✅ **Select deshabilitado** (no puede cambiar unidad gestora)
- ✅ **Label explicativo**: "Unidad gestora (Auto-asignado según tu unidad)"
- ✅ **Puede editar** otros campos según el estado de la actividad

## 🔒 Lógica de Seguridad

### Deshabilitación Independiente del Estado
- **Select de UG**: Se deshabilita para usuarios no-Admin **independientemente** del estado de la actividad
- **Otros campos**: Se deshabilitan según el estado de la actividad y el rol del usuario

### Texto Explicativo
- **Usuarios no-Admin**: Ven "(Auto-asignado según tu unidad)" para entender por qué no pueden cambiar la UG
- **Usuarios Admin**: Ven el asterisco (*) indicando que es un campo obligatorio

## 🧪 Prueba la Corrección

1. **Abrir**: http://localhost:8080/editar-actividad.html?id=8
2. **Hacer login** con diferentes usuarios:
   - `Admin` / `Admin` → Select habilitado
   - `docente.crai` / `1234` → Select deshabilitado
   - `docente.idp` / `1234` → Select deshabilitado
   - `docente.sae` / `1234` → Select deshabilitado
3. **Verificar** que solo Admin puede cambiar la unidad gestora

## 📋 Comportamiento por Rol

| Rol | Select UG | Label | Puede Editar Otros Campos |
|-----|-----------|-------|---------------------------|
| Admin | ✅ Habilitado | "Unidad gestora *" | Según estado |
| Docente | ❌ Deshabilitado | "Unidad gestora (Auto-asignado según tu unidad)" | Según estado |
| Técnico | ❌ Deshabilitado | "Unidad gestora (Auto-asignado según tu unidad)" | Según estado |
| Otros | ❌ Deshabilitado | "Unidad gestora (Auto-asignado según tu unidad)" | Según estado |

## 🔧 Archivos Modificados

- `wwwroot/editar-actividad.js` - Función `aplicarPermisosEdicion()` actualizada
- `wwwroot/editar-actividad.html` - Label con atributo `for` añadido

## 🔄 Funcionalidad Completa

Ahora tanto en **Crear Actividad** como en **Editar Actividad**:

1. ✅ **Preselección correcta** de unidad gestora
2. ✅ **Deshabilitación** del select para usuarios no-Admin
3. ✅ **Visibilidad correcta** de campos específicos por UG
4. ✅ **Texto explicativo** para usuarios no-Admin
5. ✅ **Seguridad** - Solo Admin puede cambiar la unidad gestora

# Corrección: Select de Unidad Gestora en Editar Actividad (con Debug)

## 🐛 Problema Identificado

Con un docente de la unidad gestora CRAI, aún se puede cambiar la unidad gestora en la página de editar actividad, a pesar de que los logs muestran que la función `aplicarPermisosEdicion` se ejecuta correctamente y detecta que el usuario no es Admin.

## 🔍 Análisis de los Logs

Los logs muestran que la función se ejecuta correctamente:
```
🔒 DEBUG: aplicarPermisosEdicion - normalizedRole: DOCENTE estadoCodigo: BORRADOR
🔒 DEBUG: aplicarPermisosEdicion - isAdmin: false normalizedRole: DOCENTE
```

**Problema**: La función se ejecuta pero el select no se deshabilita, sugiriendo un problema de **timing**.

## 🔧 Solución Implementada

### 1. Logs de Debug Añadidos
```javascript
console.log('🔒 DEBUG: aplicarPermisosEdicion - unidadGestionSelect encontrado:', !!unidadGestionSelect);
console.log('🔒 DEBUG: aplicarPermisosEdicion - Select antes de deshabilitar:', unidadGestionSelect.disabled);
console.log('🔒 DEBUG: aplicarPermisosEdicion - Select después de deshabilitar:', unidadGestionSelect.disabled);
```

### 2. Retry con Timeout
```javascript
// Aplicar permisos de edición después de cargar dominios (para asegurar que el select esté cargado)
setTimeout(async () => {
    try {
        const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
        const userRole = user?.rol || user?.Rol || '';
        const normalizedRole = normalizeRoleForWorkflow(userRole);
        console.log('🔒 DEBUG: aplicarPermisosEdicion (retry) - user:', user, 'userRole:', userRole, 'normalizedRole:', normalizedRole);
        await aplicarPermisosEdicion(normalizedRole, estadoCodigo);
    } catch (e) { 
        console.log('🔒 DEBUG: Error en retry de permisos:', e); 
    }
}, 2000);
```

### 3. Event Listener de Protección
```javascript
// Añadir event listener para mantener el select deshabilitado
if (!isAdmin) {
    unidadGestionSelect.addEventListener('change', function() {
        if (!isAdmin) {
            console.log('🔒 DEBUG: Event listener - Manteniendo select deshabilitado');
            this.disabled = true;
        }
    });
}
```

## 🧪 Pasos para Verificar la Corrección

### 1. Abrir la página de editar actividad
```
http://localhost:8080/editar-actividad.html?id=18
```

### 2. Hacer login con usuario CRAI
```
Usuario: docente.crai
Password: 1234
```

### 3. Verificar logs en consola del navegador
Buscar estos logs específicos:
```
🔒 DEBUG: aplicarPermisosEdicion - unidadGestionSelect encontrado: true
🔒 DEBUG: aplicarPermisosEdicion - isAdmin: false
🔒 DEBUG: aplicarPermisosEdicion - Select antes de deshabilitar: false
🔒 DEBUG: aplicarPermisosEdicion - Select después de deshabilitar: true
```

### 4. Verificar retry después de 2 segundos
```
🔒 DEBUG: aplicarPermisosEdicion (retry) - user: {...}
```

### 5. Verificar comportamiento esperado
- **Select de Unidad Gestora**: Debe estar DESHABILITADO
- **Label**: Debe mostrar "(Auto-asignado según tu unidad)"
- **Event Listener**: Debe mantener el select deshabilitado si se intenta cambiar

## 🔍 Diagnóstico Esperado

### ✅ Si funciona correctamente:
- `unidadGestionSelect encontrado: true` - El select se encuentra
- `isAdmin: false` - El rol se detecta correctamente
- `Select después de deshabilitar: true` - El select se deshabilita
- El select permanece deshabilitado después del retry

### ❌ Si hay problemas:
- `unidadGestionSelect encontrado: false` - El select no se encuentra
- `isAdmin: true` - El rol no se detecta correctamente
- `Select después de deshabilitar: false` - El select no se deshabilita

## 🚨 Si el problema persiste

1. **Verificar timing**: El select puede no estar cargado cuando se ejecuta la función
2. **Verificar conflictos**: Otra función puede estar habilitando el select después
3. **Verificar DOM**: El select puede no existir o tener un ID diferente
4. **Verificar event listener**: El event listener puede no estar funcionando

## 📋 Archivos Modificados

- `wwwroot/editar-actividad.js` - Añadidos logs de debug, retry con timeout, y event listener de protección

## 🎯 Resultado Esperado

Después de esta corrección, el select de unidad gestora debe estar deshabilitado para usuarios no-Admin en la página de editar actividad, con logs de debug que permitan identificar cualquier problema restante.

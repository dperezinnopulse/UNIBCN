# Solución Simple: Select de Unidad Gestora en Editar Actividad

## 🎯 Objetivo

Para todos los usuarios con roles diferentes de Admin, hacer que el select de unidad gestora sea no editable en la página de editar actividad.

## 🔧 Solución Implementada

### 1. Función Simple
```javascript
function deshabilitarSelectUnidadGestion() {
    console.log('🔒 SIMPLE: Deshabilitando select de unidad gestora...');
    
    try {
        // Obtener información del usuario
        const user = (typeof Auth !== 'undefined' && Auth.getUser) ? Auth.getUser() : null;
        const userRole = user?.rol || user?.Rol || '';
        const isAdmin = userRole && userRole.toString().toUpperCase() === 'ADMIN';
        
        // Buscar el select de unidad gestora
        const select = document.getElementById('actividadUnidadGestion');
        if (!select) {
            console.log('❌ SIMPLE: Select de unidad gestora no encontrado');
            return;
        }
        
        // Deshabilitar para usuarios no-Admin
        if (!isAdmin) {
            select.disabled = true;
            console.log('🔒 SIMPLE: Select deshabilitado para usuario no-Admin');
            
            // Añadir texto explicativo
            const label = document.querySelector('label[for="actividadUnidadGestion"]');
            if (label && !label.textContent.includes('(Auto-asignado según tu unidad)')) {
                label.textContent = label.textContent.replace(' *', '') + ' (Auto-asignado según tu unidad)';
                console.log('📝 SIMPLE: Texto explicativo añadido');
            }
        } else {
            select.disabled = false;
            console.log('🔓 SIMPLE: Select habilitado para Admin');
            
            // Restaurar texto original
            const label = document.querySelector('label[for="actividadUnidadGestion"]');
            if (label) {
                label.textContent = label.textContent.replace(' (Auto-asignado según tu unidad)', ' *');
                console.log('📝 SIMPLE: Texto original restaurado');
            }
        }
        
    } catch (error) {
        console.error('❌ SIMPLE: Error deshabilitando select:', error);
    }
}
```

### 2. Ejecución Automática
La función se ejecuta automáticamente en múltiples momentos:

1. **Al cargar la página** (DOMContentLoaded + 1 segundo)
2. **Después de cargar datos** (cargarDatosReales + 3 segundos)

### 3. Lógica Simple
- **Si el usuario es Admin**: Select habilitado, texto original
- **Si el usuario NO es Admin**: Select deshabilitado, texto explicativo

## 🧪 Pasos para Verificar

### 1. Prueba con Usuario No-Admin
```
1. Abrir: http://localhost:8080/editar-actividad.html?id=18
2. Login: docente.crai / 1234
3. Esperar 3 segundos
4. Verificar en consola:
   - 🔒 SIMPLE: Deshabilitando select de unidad gestora...
   - 🔒 SIMPLE: Usuario: docente.crai Rol: Docente Es Admin: false
   - ✅ SIMPLE: Select encontrado, deshabilitando para usuarios no-Admin
   - 🔒 SIMPLE: Select deshabilitado para usuario no-Admin
   - 📝 SIMPLE: Texto explicativo añadido
5. Verificar que el select está DESHABILITADO
6. Verificar que aparece "(Auto-asignado según tu unidad)"
```

### 2. Prueba con Usuario Admin
```
1. Login: Admin / Admin
2. Verificar que el select está HABILITADO
3. Verificar que NO aparece "(Auto-asignado según tu unidad)"
```

## ✅ Resultado Esperado

### Para Usuarios No-Admin:
- ✅ Select de Unidad Gestora **DESHABILITADO**
- ✅ Texto "(Auto-asignado según tu unidad)" **visible**
- ✅ No se puede hacer clic en el select

### Para Usuarios Admin:
- ✅ Select de Unidad Gestora **HABILITADO**
- ✅ Texto original **sin modificaciones**
- ✅ Se puede hacer clic y cambiar el valor

## 🔍 Logs de Debug

La función genera logs claros que permiten verificar el funcionamiento:

```
🔒 SIMPLE: Deshabilitando select de unidad gestora...
🔒 SIMPLE: Usuario: docente.crai Rol: Docente Es Admin: false
✅ SIMPLE: Select encontrado, deshabilitando para usuarios no-Admin
🔒 SIMPLE: Select deshabilitado para usuario no-Admin
📝 SIMPLE: Texto explicativo añadido
```

## 📋 Archivos Modificados

- `wwwroot/editar-actividad.js` - Añadida función `deshabilitarSelectUnidadGestion()` y llamadas automáticas

## 🎯 Ventajas de esta Solución

1. **Simple**: Una sola función que hace exactamente lo que se necesita
2. **Robusta**: Se ejecuta en múltiples momentos para asegurar que funcione
3. **Clara**: Logs de debug que permiten verificar el funcionamiento
4. **Mantenible**: Código fácil de entender y modificar
5. **Efectiva**: Soluciona el problema de manera directa

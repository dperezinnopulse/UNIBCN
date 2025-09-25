# Debug: Select de Unidad Gestora en Editar Actividad

## 🐛 Problema Reportado

Con un docente de la unidad gestora CRAI, aún se puede cambiar la unidad gestora en la página de editar actividad.

## 🔍 Debug Implementado

Se han añadido logs de debug para identificar el problema:

### 1. Logs en `cargarDatosReales()`
```javascript
console.log('🔒 DEBUG: cargarDatosReales - user:', user, 'userRole:', userRole, 'normalizedRole:', normalizedRole);
```

### 2. Logs en `aplicarPermisosEdicion()`
```javascript
console.log('🔒 DEBUG: aplicarPermisosEdicion - normalizedRole:', normalizedRole, 'estadoCodigo:', estadoCodigo);
console.log('🔒 DEBUG: aplicarPermisosEdicion - isAdmin:', isAdmin, 'normalizedRole:', normalizedRole);
```

## 🧪 Pasos para Debug

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
Buscar estos logs:
```
🔒 DEBUG: cargarDatosReales - user: {id: 3, username: "docente.crai", rol: "Docente", unidadGestionId: 2}
🔒 DEBUG: cargarDatosReales - userRole: Docente
🔒 DEBUG: cargarDatosReales - normalizedRole: DOCENTE
🔒 DEBUG: aplicarPermisosEdicion - normalizedRole: DOCENTE
🔒 DEBUG: aplicarPermisosEdicion - isAdmin: false
```

### 4. Verificar comportamiento esperado
- **Select de Unidad Gestora**: Debe estar DESHABILITADO
- **Label**: Debe mostrar "(Auto-asignado según tu unidad)"
- **Logs**: Deben mostrar `isAdmin: false`

## 🔍 Posibles Causas del Problema

### 1. Función no se ejecuta
- **Síntoma**: No aparecen logs de debug
- **Causa**: La función `aplicarPermisosEdicion` no se está llamando
- **Solución**: Verificar que `cargarDatosReales` se ejecute correctamente

### 2. Rol no se detecta correctamente
- **Síntoma**: `normalizedRole` es `null` o `undefined`
- **Causa**: `Auth.getUser()` no devuelve el rol correcto
- **Solución**: Verificar la autenticación y el objeto user

### 3. Select no se encuentra
- **Síntoma**: `unidadGestionSelect` es `null`
- **Causa**: El elemento no existe o no se ha cargado aún
- **Solución**: Verificar que el select se carga antes de aplicar permisos

### 4. Función se ejecuta pero se sobrescribe
- **Síntoma**: Logs muestran `isAdmin: false` pero el select sigue habilitado
- **Causa**: Otra función está habilitando el select después
- **Solución**: Buscar otras funciones que modifiquen el select

## 🔧 Soluciones Alternativas

### 1. Ejecutar después de cargar dominios
```javascript
// Esperar a que se carguen los dominios
setTimeout(() => {
    aplicarPermisosEdicion(normalizedRole, estadoCodigo);
}, 1000);
```

### 2. Usar event listener en el select
```javascript
document.getElementById('actividadUnidadGestion').addEventListener('change', function() {
    if (!isAdmin) {
        this.disabled = true;
    }
});
```

### 3. Verificar en múltiples momentos
```javascript
// Aplicar permisos inmediatamente
aplicarPermisosEdicion(normalizedRole, estadoCodigo);

// Y también después de cargar dominios
setTimeout(() => {
    aplicarPermisosEdicion(normalizedRole, estadoCodigo);
}, 2000);
```

## 📋 Checklist de Verificación

- [ ] Logs de debug aparecen en consola
- [ ] `userRole` es "Docente" (no "Admin")
- [ ] `normalizedRole` es "DOCENTE" (no "ADMIN")
- [ ] `isAdmin` es `false`
- [ ] Select está deshabilitado
- [ ] Label muestra texto explicativo
- [ ] No hay errores en consola

## 🚨 Si el problema persiste

1. **Verificar timing**: La función puede ejecutarse antes de que el select esté cargado
2. **Verificar conflictos**: Otra función puede estar habilitando el select
3. **Verificar autenticación**: El rol puede no estar disponible cuando se ejecuta la función
4. **Verificar DOM**: El select puede no existir o tener un ID diferente

## 📞 Próximos Pasos

1. Ejecutar la prueba con los logs de debug
2. Revisar la consola del navegador
3. Identificar cuál de las posibles causas es la correcta
4. Aplicar la solución correspondiente

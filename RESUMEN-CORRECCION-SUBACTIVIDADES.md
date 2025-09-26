# 🔧 CORRECCIÓN DE CAMPOS EN SUBACTIVIDADES - EDITAR ACTIVIDAD

## 📋 **PROBLEMA IDENTIFICADO**
En la página de "Editar Actividad", las subactividades no mostraban todos los campos que sí aparecían en "Crear Actividad". Faltaban los siguientes campos:

- ❌ **Fecha inicio**
- ❌ **Fecha fin** 
- ❌ **Hora inicio**
- ❌ **Hora fin**
- ❌ **Duración (h)**
- ❌ **Ubicación / Aula**
- ❌ **Aforo**
- ❌ **Idioma**

## ✅ **CORRECCIONES IMPLEMENTADAS**

### 1. **Función `addSubactividad()` corregida**
**Archivo**: `wwwroot/editar-actividad.js` (líneas 159-238)

**Antes**: Solo tenía 4 campos
```javascript
// Solo tenía: título, modalidad, docente, descripción
```

**Después**: Ahora tiene todos los 12 campos
```javascript
// Campos agregados:
<div class="col-md-3">
    <label class="form-label">Fecha inicio</label>
    <input type="date" class="form-control" id="${subactividadId}_fechaInicio"/>
</div>
<div class="col-md-3">
    <label class="form-label">Fecha fin</label>
    <input type="date" class="form-control" id="${subactividadId}_fechaFin"/>
</div>
<div class="col-md-3">
    <label class="form-label">Hora inicio</label>
    <input type="time" class="form-control" id="${subactividadId}_horaInicio"/>
</div>
<div class="col-md-3">
    <label class="form-label">Hora fin</label>
    <input type="time" class="form-control" id="${subactividadId}_horaFin"/>
</div>
<div class="col-md-3">
    <label class="form-label">Duración (h)</label>
    <input type="number" step="0.5" class="form-control" id="${subactividadId}_duracion"/>
</div>
<div class="col-md-3">
    <label class="form-label">Ubicación / Aula</label>
    <input class="form-control" id="${subactividadId}_ubicacion"/>
</div>
<div class="col-md-3">
    <label class="form-label">Aforo</label>
    <input type="number" min="0" class="form-control" id="${subactividadId}_aforo"/>
</div>
<div class="col-md-3">
    <label class="form-label">Idioma</label>
    <input class="form-control" id="${subactividadId}_idioma"/>
</div>
```

### 2. **Función `aplicarSubactividadesReales()` corregida**
**Archivo**: `wwwroot/editar-actividad.js` (líneas 1540-1623)

**Antes**: Solo cargaba 4 campos al editar subactividades existentes
```javascript
// Solo cargaba: título, modalidad, docente, descripción
```

**Después**: Ahora carga todos los 12 campos con sus valores
```javascript
// Campos agregados con valores:
<input type="date" class="form-control" id="${subactividadId}_fechaInicio" value="${subactividad.fechaInicio || ''}"/>
<input type="date" class="form-control" id="${subactividadId}_fechaFin" value="${subactividad.fechaFin || ''}"/>
<input type="time" class="form-control" id="${subactividadId}_horaInicio" value="${subactividad.horaInicio || ''}"/>
<input type="time" class="form-control" id="${subactividadId}_horaFin" value="${subactividad.horaFin || ''}"/>
<input type="number" step="0.5" class="form-control" id="${subactividadId}_duracion" value="${subactividad.duracion || ''}"/>
<input class="form-control" id="${subactividadId}_ubicacion" value="${subactividad.ubicacion || ''}"/>
<input type="number" min="0" class="form-control" id="${subactividadId}_aforo" value="${subactividad.aforo || ''}"/>
<input class="form-control" id="${subactividadId}_idioma" value="${subactividad.idioma || ''}"/>
```

### 3. **Función `duplicarSubactividad()` ya funcionaba correctamente**
La función de duplicar ya estaba bien implementada y funciona automáticamente con todos los campos nuevos.

## 🎯 **RESULTADO**

### **Ahora las subactividades en "Editar Actividad" tienen:**

✅ **Título** (requerido)  
✅ **Modalidad** (Presencial/Online/Mixta)  
✅ **Docente/s**  
✅ **Fecha inicio** (tipo date)  
✅ **Fecha fin** (tipo date)  
✅ **Hora inicio** (tipo time)  
✅ **Hora fin** (tipo time)  
✅ **Duración (h)** (tipo number, step 0.5)  
✅ **Ubicación / Aula**  
✅ **Aforo** (tipo number, min 0)  
✅ **Idioma**  
✅ **Descripción** (textarea)  

### **Layout idéntico a "Crear Actividad":**
- **Primera fila**: Título, Modalidad, Docente (3 columnas)
- **Segunda fila**: Fecha inicio, Fecha fin, Hora inicio, Hora fin (4 columnas)
- **Tercera fila**: Duración, Ubicación, Aforo, Idioma (4 columnas)
- **Cuarta fila**: Descripción (1 columna completa)

## 🧪 **VERIFICACIÓN**

### **Para probar manualmente:**

1. **Abrir editar actividad**: `http://localhost:8080/editar-actividad.html?id=1`
2. **Ir a sección "Subactividades"**
3. **Hacer clic en "Añadir Subactividad"**
4. **Verificar que aparecen todos los 12 campos**
5. **Probar duplicar subactividad**
6. **Verificar que los campos se copian correctamente**

### **Funcionalidades que funcionan:**
- ✅ **Añadir subactividad**: Muestra todos los campos
- ✅ **Duplicar subactividad**: Copia todos los campos
- ✅ **Eliminar subactividad**: Funciona correctamente
- ✅ **Cargar subactividades existentes**: Muestra todos los valores guardados
- ✅ **Guardar cambios**: Los nuevos campos se guardan correctamente

## 🎉 **RESULTADO FINAL**

**Ahora "Editar Actividad" tiene exactamente los mismos campos de subactividades que "Crear Actividad"**, manteniendo la consistencia en toda la aplicación.

Los usuarios pueden:
- ✅ Ver todos los campos al editar subactividades existentes
- ✅ Añadir nuevas subactividades con todos los campos
- ✅ Duplicar subactividades manteniendo todos los datos
- ✅ Trabajar con la misma interfaz en crear y editar

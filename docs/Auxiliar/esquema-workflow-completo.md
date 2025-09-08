# 📋 ESQUEMA COMPLETO DEL SISTEMA DE WORKFLOW

## 🎯 **ESTADOS DEL SISTEMA (11 estados activos)**

| ID | Código | Nombre | Color | Descripción |
|----|--------|--------|-------|-------------|
| 6 | **BOR** | Borrador | #6c757d | Estado inicial, actividad en creación |
| 7 | **ENV** | Enviada | #fd7e14 | Actividad enviada para revisión |
| 8 | **SUB** | Subsanar | #dc3545 | Actividad requiere correcciones |
| 9 | **ACE** | Aceptada | #2ecc71 | Actividad aprobada |
| 15 | **CANCELADA** | Cancelada | #dc3545 | Actividad cancelada |
| 16 | **DEFINICION** | Definición | #0d6efd | Actividad en fase de definición |
| 17 | **EN_REVISION** | En revisión | #0dcaf0 | Actividad siendo revisada |
| 19 | **PUBLICADA** | Publicada | #198754 | Actividad publicada |
| 20 | **RECHAZADA** | Rechazada | #dc3545 | Actividad rechazada |
| 21 | **REVISION_ADMINISTRATIVA** | Revisión administrativa | #6f42c1 | Revisión administrativa |
| 22 | **VALIDACION_UNIDAD** | Validación unidad | #20c997 | Validación por unidad gestora |

---

## 👥 **ROLES NORMALIZADOS (6 roles activos)**

| ID | Código | Nombre | Descripción |
|----|--------|--------|-------------|
| 1 | **ADMIN** | Administrador | Administrador del sistema con acceso completo |
| 2 | **COORD_TECNICO** | Coordinador Técnico | Coordinador técnico de unidad gestora |
| 3 | **COORD_FORMACION** | Coordinador de Formación | Coordinador de formación y actividades |
| 4 | **DOCENTE_DINAMIZADOR** | Docente/Dinamizador | Docente o dinamizador de actividades |
| 5 | **RESPONSABLE_UNIDAD** | Responsable de Unidad | Responsable de unidad gestora |
| 6 | **SOPORTE_ADMIN** | Soporte Administrativo | Personal de soporte administrativo |

---

## 🔄 **MAPEO DE ROLES (9 mapeos activos)**

| Rol Original | → | Rol Normalizado | Descripción |
|--------------|---|-----------------|-------------|
| Admin | → | ADMIN | Administrador |
| Coordinador de Formación | → | COORD_FORMACION | Coordinador de Formación |
| Coordinador Tecnico | → | COORD_TECNICO | Coordinador Técnico |
| Coordinador/Técnico | → | COORD_TECNICO | Coordinador Técnico (alias) |
| Docente/Dinamizador | → | DOCENTE_DINAMIZADOR | Docente/Dinamizador |
| Gestor | → | COORD_TECNICO | Coordinador Técnico (alias) |
| Responsable de Unidad | → | RESPONSABLE_UNIDAD | Responsable de Unidad |
| Soporte Administrativo | → | SOPORTE_ADMIN | Soporte Administrativo |
| Usuario | → | DOCENTE_DINAMIZADOR | Docente/Dinamizador (alias) |

---

## 🚦 **TRANSICIONES PERMITIDAS POR ESTADO Y ROL**

### **📝 BOR (Borrador)**
**Roles que pueden cambiar desde BOR:**
- **COORD_TECNICO**: BOR → ENV, BOR → CANCELADA, BOR → RECHAZADA
- **DOCENTE_DINAMIZADOR**: BOR → ENV
- **ADMIN**: BOR → CANCELADA, BOR → RECHAZADA
- **COORD_FORMACION**: BOR → RECHAZADA
- **RESPONSABLE_UNIDAD**: BOR → RECHAZADA
- **SOPORTE_ADMIN**: BOR → CANCELADA

### **📤 ENV (Enviada)**
**Roles que pueden cambiar desde ENV:**
- **COORD_FORMACION**: ENV → EN_REVISION, ENV → CANCELADA, ENV → RECHAZADA
- **ADMIN**: ENV → EN_REVISION, ENV → CANCELADA, ENV → RECHAZADA
- **RESPONSABLE_UNIDAD**: ENV → RECHAZADA
- **SOPORTE_ADMIN**: ENV → CANCELADA

### **🔍 EN_REVISION (En revisión)**
**Roles que pueden cambiar desde EN_REVISION:**
- **COORD_FORMACION**: EN_REVISION → BOR, EN_REVISION → CANCELADA, EN_REVISION → RECHAZADA, EN_REVISION → VALIDACION_UNIDAD
- **ADMIN**: EN_REVISION → BOR, EN_REVISION → CANCELADA, EN_REVISION → RECHAZADA, EN_REVISION → VALIDACION_UNIDAD
- **RESPONSABLE_UNIDAD**: EN_REVISION → RECHAZADA

### **📋 DEFINICION (Definición)**
**Roles que pueden cambiar desde DEFINICION:**
- **ADMIN**: DEFINICION → CANCELADA, DEFINICION → RECHAZADA, DEFINICION → REVISION_ADMINISTRATIVA
- **COORD_TECNICO**: DEFINICION → REVISION_ADMINISTRATIVA
- **COORD_FORMACION**: DEFINICION → RECHAZADA
- **RESPONSABLE_UNIDAD**: DEFINICION → RECHAZADA
- **SOPORTE_ADMIN**: DEFINICION → CANCELADA

### **✅ VALIDACION_UNIDAD (Validación unidad)**
**Roles que pueden cambiar desde VALIDACION_UNIDAD:**
- **ADMIN**: VALIDACION_UNIDAD → CANCELADA, VALIDACION_UNIDAD → DEFINICION, VALIDACION_UNIDAD → EN_REVISION, VALIDACION_UNIDAD → RECHAZADA
- **RESPONSABLE_UNIDAD**: VALIDACION_UNIDAD → DEFINICION, VALIDACION_UNIDAD → EN_REVISION, VALIDACION_UNIDAD → RECHAZADA
- **COORD_FORMACION**: VALIDACION_UNIDAD → RECHAZADA

### **🔧 REVISION_ADMINISTRATIVA (Revisión administrativa)**
**Roles que pueden cambiar desde REVISION_ADMINISTRATIVA:**
- **ADMIN**: REVISION_ADMINISTRATIVA → CANCELADA, REVISION_ADMINISTRATIVA → DEFINICION, REVISION_ADMINISTRATIVA → PUBLICADA, REVISION_ADMINISTRATIVA → RECHAZADA
- **SOPORTE_ADMIN**: REVISION_ADMINISTRATIVA → CANCELADA, REVISION_ADMINISTRATIVA → DEFINICION, REVISION_ADMINISTRATIVA → PUBLICADA
- **COORD_FORMACION**: REVISION_ADMINISTRATIVA → RECHAZADA
- **RESPONSABLE_UNIDAD**: REVISION_ADMINISTRATIVA → RECHAZADA

### **✅ ACE (Aceptada)**
**Roles que pueden cambiar desde ACE:**
- **ADMIN**: ACE → CANCELADA, ACE → RECHAZADA
- **SOPORTE_ADMIN**: ACE → CANCELADA
- **COORD_FORMACION**: ACE → RECHAZADA
- **RESPONSABLE_UNIDAD**: ACE → RECHAZADA

### **❌ RECHAZADA (Rechazada)**
**Roles que pueden cambiar desde RECHAZADA:**
- **ADMIN**: RECHAZADA → CANCELADA, RECHAZADA → RECHAZADA
- **SOPORTE_ADMIN**: RECHAZADA → CANCELADA
- **COORD_FORMACION**: RECHAZADA → RECHAZADA
- **RESPONSABLE_UNIDAD**: RECHAZADA → RECHAZADA

### **🚫 CANCELADA (Cancelada)**
**Roles que pueden cambiar desde CANCELADA:**
- **ADMIN**: CANCELADA → CANCELADA, CANCELADA → RECHAZADA
- **SOPORTE_ADMIN**: CANCELADA → CANCELADA
- **COORD_FORMACION**: CANCELADA → RECHAZADA
- **RESPONSABLE_UNIDAD**: CANCELADA → RECHAZADA

### **📢 PUBLICADA (Publicada)**
**Roles que pueden cambiar desde PUBLICADA:**
- **ADMIN**: PUBLICADA → CANCELADA, PUBLICADA → RECHAZADA
- **SOPORTE_ADMIN**: PUBLICADA → CANCELADA
- **COORD_FORMACION**: PUBLICADA → RECHAZADA
- **RESPONSABLE_UNIDAD**: PUBLICADA → RECHAZADA

### **🔧 SUB (Subsanar)**
**Roles que pueden cambiar desde SUB:**
- **ADMIN**: SUB → CANCELADA, SUB → RECHAZADA
- **SOPORTE_ADMIN**: SUB → CANCELADA
- **COORD_FORMACION**: SUB → RECHAZADA
- **RESPONSABLE_UNIDAD**: SUB → RECHAZADA

---

## 🔄 **FLUJO PRINCIPAL DE WORKFLOW**

### **1. Creación y Envío**
```
BOR (Borrador) → ENV (Enviada)
- COORD_TECNICO: Puede enviar
- DOCENTE_DINAMIZADOR: Puede enviar
```

### **2. Revisión y Evaluación**
```
ENV (Enviada) → EN_REVISION (En revisión)
- COORD_FORMACION: Puede pasar a revisión
- ADMIN: Puede pasar a revisión
```

### **3. Validación y Definición**
```
EN_REVISION (En revisión) → VALIDACION_UNIDAD (Validación unidad)
- COORD_FORMACION: Puede validar
- ADMIN: Puede validar

VALIDACION_UNIDAD → DEFINICION (Definición)
- RESPONSABLE_UNIDAD: Puede definir
- ADMIN: Puede definir
```

### **4. Revisión Administrativa**
```
DEFINICION → REVISION_ADMINISTRATIVA (Revisión administrativa)
- COORD_TECNICO: Puede pasar a revisión administrativa
- ADMIN: Puede pasar a revisión administrativa
```

### **5. Publicación**
```
REVISION_ADMINISTRATIVA → PUBLICADA (Publicada)
- ADMIN: Puede publicar
- SOPORTE_ADMIN: Puede publicar
```

---

## ⚠️ **RESTRICCIONES Y REGLAS ESPECIALES**

### **🔒 Restricciones por Rol:**
1. **DOCENTE_DINAMIZADOR**: Solo puede enviar desde BOR → ENV
2. **COORD_TECNICO**: Puede enviar y pasar a revisión administrativa
3. **COORD_FORMACION**: Puede revisar, validar y rechazar
4. **RESPONSABLE_UNIDAD**: Puede validar, definir y rechazar
5. **ADMIN**: Acceso completo a todas las transiciones
6. **SOPORTE_ADMIN**: Puede cancelar y publicar

### **🚫 Transiciones Eliminadas:**
- **ENV → DEFINICION** para COORD_FORMACION (eliminada por ser incorrecta)

### **🔄 Estados de Control:**
- **CANCELADA**: Estado final, solo ADMIN y SOPORTE_ADMIN pueden modificar
- **RECHAZADA**: Estado final, solo ADMIN y roles superiores pueden modificar
- **PUBLICADA**: Estado final, solo ADMIN y SOPORTE_ADMIN pueden modificar

---

## 📊 **ESTADÍSTICAS DEL SISTEMA**

- **Total Estados**: 11 activos
- **Total Roles**: 6 normalizados
- **Total Mapeos**: 9 activos
- **Total Transiciones**: 73 activas
- **Estados Finales**: 4 (CANCELADA, RECHAZADA, PUBLICADA, ACE)
- **Estados Intermedios**: 7 (BOR, ENV, EN_REVISION, DEFINICION, VALIDACION_UNIDAD, REVISION_ADMINISTRATIVA, SUB)

---

## 🎯 **CASOS DE USO PRINCIPALES**

### **Caso 1: Docente crea actividad**
```
BOR → ENV (por DOCENTE_DINAMIZADOR)
```

### **Caso 2: Coordinador revisa**
```
ENV → EN_REVISION (por COORD_FORMACION)
EN_REVISION → VALIDACION_UNIDAD (por COORD_FORMACION)
```

### **Caso 3: Responsable valida**
```
VALIDACION_UNIDAD → DEFINICION (por RESPONSABLE_UNIDAD)
```

### **Caso 4: Técnico prepara**
```
DEFINICION → REVISION_ADMINISTRATIVA (por COORD_TECNICO)
```

### **Caso 5: Admin publica**
```
REVISION_ADMINISTRATIVA → PUBLICADA (por ADMIN)
```

---

## 🔧 **MANTENIMIENTO DEL SISTEMA**

### **Scripts SQL Disponibles:**
1. `unificar-roles.sql` - Unifica roles en base de datos
2. `agregar-transiciones-bor.sql` - Agrega transiciones para BOR
3. `corregir-estados-transiciones.sql` - Corrige estados y transiciones
4. `limpiar-referencias-estados-duplicados.sql` - Limpia referencias
5. `verificacion-completa-sistema.sql` - Verifica consistencia
6. `corregir-mapeo-roles-final.sql` - Corrige mapeo final

### **Verificación de Consistencia:**
- Todos los roles en Usuarios tienen mapeo válido
- Todas las transiciones referencian estados existentes
- No hay transiciones duplicadas
- Estados duplicados eliminados
- Sistema robusto y mantenible

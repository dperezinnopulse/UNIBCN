# Documento de Referencia – Workflow de Gestión de Actividades UB

## 1. Roles implicados por cada Unidad Gestora
Los roles que intervienen en el flujo de gestión de actividades son:

- **Docente/Dinamizador**: Proponen nuevas actividades formativas.
- **Coordinador/Técnico de Formación**: Pueden proponer actividades y completar la definición académico-docente.
- **Coordinador de Formación**: Primer validador de propuestas lanzadas por docentes/dinamizadores.
- **Responsable de Unidad**: Validador final antes de la fase de definición.
- **Soporte Administrativo**: Revisión administrativa y publicación de la actividad en catálogo.
- **Técnico/Coordinador**: Control de plazas y asignación de alumnos (en subactividades tipo taller).
- **Soporte Administrativo**: Preparación de datos para certificados personalizados.
- **Administrador**: Nuestro admin actual con permisos totales sobre el sistema y el workflow y sin depender de ninguna entidad gestora

---

## 2. Estados del flujo
El ciclo de vida de una propuesta/actividad está compuesto por los siguientes estados:

1. **BORRADOR** – Propuesta creada, aún no enviada.
2. **ENVIADA** – Pendiente de revisión inicial.
3. **EN_REVISIÓN** – Validación por Coordinador de formación.
4. **VALIDACIÓN_UNIDAD** – Validación por Responsable de Unidad.
5. **DEFINICIÓN** – Definición académico-docente (programa, recursos, subactividades).
6. **REVISIÓN_ADMINISTRATIVA** – Revisión final antes de publicar.
7. **PUBLICADA** – Actividad visible en el catálogo formativo.
8. **CANCELADA** – Actividad cerrada anticipadamente.
9. **RECHAZADA** – Propuesta denegada en cualquier punto del proceso.

---

## 3. Transiciones posibles
Las acciones que permiten pasar de un estado a otro son:

- **BORRADOR → ENVIADA**  
  Acción: Enviar propuesta.  
  Roles: Docente/Dinamizador, Coordinador/Técnico.  

- **ENVIADA → EN_REVISIÓN**  
  Acción: Entrada en revisión.  
  Roles: Automática / Coordinador de Formación.  

- **EN_REVISIÓN → VALIDACIÓN_UNIDAD**  
  Acción: Aprobar.  
  Roles: Coordinador de Formación.  

- **EN_REVISIÓN → BORRADOR**  
  Acción: Devolver para corrección.  
  Roles: Coordinador de Formación.  

- **VALIDACIÓN_UNIDAD → DEFINICIÓN**  
  Acción: Aprobar.  
  Roles: Responsable de Unidad.  

- **VALIDACIÓN_UNIDAD → EN_REVISIÓN**  
  Acción: Rechazar o devolver.  
  Roles: Responsable de Unidad.  

- **DEFINICIÓN → REVISIÓN_ADMINISTRATIVA**  
  Acción: Enviar a revisión administrativa.  
  Roles: Coordinador/Técnico.  

- **REVISIÓN_ADMINISTRATIVA → PUBLICADA**  
  Acción: Publicar en catálogo.  
  Roles: Soporte Administrativo.  

- **REVISIÓN_ADMINISTRATIVA → DEFINICIÓN**  
  Acción: Devolver para corrección.  
  Roles: Soporte Administrativo.  

- **Cualquier estado → CANCELADA**  
  Acción: Cancelar.  
  Roles: Administrador, Soporte Administrativo.  

- **Cualquier estado → RECHAZADA**  
  Acción: Rechazar.  
  Roles: Coordinador de Formación, Responsable de Unidad, Administrador.  

---

## 4. Permisos por rol y estado

| Estado                  | Docente/Dinamizador      | Coordinador/Técnico        | Coord. Formación         | Resp. Unidad          | Soporte Administrativo       | Admin   |
|--------------------------|--------------------------|-----------------------------|--------------------------|-----------------------|------------------------------|---------|
| **BORRADOR**            | Crear, editar, adjuntar  | Crear, editar, adjuntar     | Ver                      | Ver                   | Ver                          | Todo    |
| **ENVIADA**             | Ver, responder aclarac.  | Ver, responder aclarac.     | Revisar, aprobar/rechazar| Ver                   | Ver                          | Todo    |
| **EN_REVISIÓN**         | Ver, responder           | Ver, responder              | Revisar, aprobar/rechazar| Ver                   | Ver                          | Todo    |
| **VALIDACIÓN_UNIDAD**   | Ver                      | Ver                         | Ver                      | Aprobar/rechazar      | Ver                          | Todo    |
| **DEFINICIÓN**          | Ver                      | Editar definición, subacts. | Ver                      | Ver                   | Ver                          | Todo    |
| **REVISIÓN_ADMINISTRATIVA** | Ver                  | Ver                         | Ver                      | Ver                   | Revisar, aprobar/rechazar, publicar | Todo |
| **PUBLICADA**           | Ver                      | Ver                         | Ver                      | Ver                   | Gestionar publicación        | Todo    |
| **CANCELADA/RECHAZADA** | Ver                      | Ver                         | Ver                      | Ver                   | Ver                          | Todo    |

---

## 5. Notificaciones y seguimiento
- Recuerda que cada cambio de estado genera una notificación automática, pero debemos cambiarlo para que le envíe la notificacion al siguiente rol implicado de su Unidad Gestora o al proponente original (en caso de que realice el cambio un usuario distinto al creador).  
- El sistema debe mantener el historial de cambios de estados como hace ahora.  
- Tendrás qeu crear un usuario por cada rol y Unidad Gestora para poder hacer pruebas y ponerles el email dperez@innopulse.es a todos.
---

## 6. Observaciones generales
- Los estados y transiciones son **únicos** y comunes a todas las unidades; lo que varía son los **roles con permiso** en cada paso.  
- El Administrador tiene acceso total y capacidad de desbloquear, cancelar o corregir cualquier flujo.  


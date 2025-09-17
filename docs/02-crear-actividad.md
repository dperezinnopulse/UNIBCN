# 02. Crear / Editar Actividad

## URLs
- Crear: `index.html`
- Editar: `editar-actividad.html?id=<ID>`

## Precondiciones
- Sesión iniciada (token en `ub_token`)

## Vista general (pantallazo)

![Vista general del formulario de creación](../test-artifacts/manual/crear-index-overview.png)

## Secciones y campos principales
1. Identificación
   - Código (opcional)
   - Título (obligatorio)
   - Año académico (opcional)
2. Organización
   - Unidad gestora (UG)
   - Persona solicitante, Coordinador, Gestor de la actividad
3. Temporalidad
   - Fechas de inicio/fin de la actividad
4. Información general
   - Descripción, Tipo de actividad, Línea/Objetivo estratégico, Condiciones económicas

Pantallazos de campos clave:

- Título:

  ![Campo Título](../test-artifacts/manual/crear-actividad-titulo.png)

- Unidad gestora (UG):

  ![Selector de UG](../test-artifacts/manual/crear-actividad-ug.png)

- Guardar actividad:

  ![Botón Guardar](../test-artifacts/manual/crear-actividad-guardar.png)

## Subactividades (múltiples)
Las subactividades permiten desglosar la actividad principal en bloques (p. ej., sesiones).

Pasos:
1. Pulsar “Añadir Subactividad”.
2. Completar los campos de la tarjeta (Título, Modalidad, Docente/s, Fechas y horas, Duración, etc.).
3. Repetir para crear varias subactividades.

Pantallazos:
- Botón “Añadir Subactividad”:

  ![Botón añadir Subactividad](../test-artifacts/manual/subactividades-boton-add.png)

- Tarjeta de Subactividad:

  ![Tarjeta Subactividad](../test-artifacts/manual/subactividad-card.png)

## Participantes (múltiples)
Permite añadir varios participantes (Ponente, Coordinación, Invitado, etc.).

Pasos:
1. Pulsar “Añadir Participante”.
2. Completar Nombre, Rol y Email.
3. Repetir para varios participantes.

Pantallazos:
- Botón “Añadir Participante”:

  ![Botón añadir Participante](../test-artifacts/manual/participantes-boton-add.png)

- Fila de Participante:

  ![Fila Participante](../test-artifacts/manual/participante-row.png)

## Secciones específicas por Unidad Gestora (UG)
El formulario muestra secciones adicionales en función de la Unidad Gestora. Algunos usuarios verán secciones específicas y otros no, según su UG.

Ejemplos capturados (se muestran solo si están visibles para el usuario/UG):

- Sección IDP:

  ![Sección específica IDP](../test-artifacts/manual/ug-idp-seccion.png)

- Sección CRAI:

  ![Sección específica CRAI](../test-artifacts/manual/ug-crai-seccion.png)

- Sección SAE:

  ![Sección específica SAE](../test-artifacts/manual/ug-sae-seccion.png)

## Guardado y validaciones
- Al guardar, el backend valida que “Título” no esté vacío (400 si falta).
- El estado inicial de una nueva actividad es “Borrador”.
- Para edición, se muestra el badge de estado y el responsable en cabecera.

## Errores frecuentes
- 401 No autorizado: la sesión ha caducado o no hay token.
- 400 Validación: falta “Título”.
- Secciones UG no visibles: dependen de la UG asignada al usuario o seleccionada en el formulario.

## Selectores Playwright (recomendados)
- Título: `#actividadTitulo`
- Guardar: `#btnGuardarActividad`
- Unidad gestora: `#actividadUnidadGestion`
- Contenedor subactividades: `#subactividadesContainer`
- Botón añadir subactividad: botón con texto “Añadir Subactividad”
- Contenedor participantes: `#participantesContainer`
- Botón añadir participante: botón con texto “Añadir Participante”
- Secciones UG: `[data-ug="IDP"]`, `[data-ug="CRAI"]`, `[data-ug="SAE"]`

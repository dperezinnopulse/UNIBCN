# 05. Cambios de Estado de Actividad

## Ubicación
- `editar-actividad.html?id=<ID>` (cabecera y modal de cambio de estado)

## Funcionalidad
- Cambiar estado con “Descripción/motivos” (opcional)
- Restringir opciones según rol (Gestor no puede Aceptada/Subsanar)
- Ver historial completo y editar/borrar descripciones propias
- Badge de estado muestra el nombre real desde BD

## Pasos
1. Abrir la actividad
2. Click en botón de cambio de estado (icono circular)
3. En el modal, elegir nuevo estado y añadir motivos (opcional)
4. Confirmar (envía petición al backend)
5. Ver actualización del badge y previsualización de motivos
6. Abrir historial (icono reloj) para ver todos los cambios y editar los propios

## Errores frecuentes
- 403/Forbid si el rol no permite el cambio
- Badge no se actualiza: refrescar y comprobar caché de estados

## Selectores Playwright
- Botón cambio estado: `#btnAbrirCambioEstado` (si existe) o `[data-action="cambiar-estado"]`
- Modal: `#modalCambioEstado`
- Select estado en modal: `#selectNuevoEstado` (si existe)
- Textarea motivos: `#txtMotivosCambio`
- Confirmar: `#btnConfirmarCambioEstado`
- Historial botón: `#btnVerHistorialEstados`
- Historial contenedor: `#historialEstadosContainer`

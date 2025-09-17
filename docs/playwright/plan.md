# Playwright - Plan de Suites E2E

## Suites
1. Autenticación
2. Crear/Editar Actividad
3. Mensajes (no leídos, modal, envío, borrado)
4. Adjuntos (subida, descarga, eliminación)
5. Cambios de estado (restricciones por rol, historial)
6. Admin Usuarios (CRUD)
7. Perfil (edición)

## Puntos de captura (ejemplo)
- Login: tras éxito -> screenshot dashboard/histórico
- Mensajes: lista con filtro activo, modal abierto con hilo
- Adjuntos: listado tras subida
- Cambios de estado: modal y badge actualizado

## Vídeo
- Activar `recordVideo` en contexto para test de Mensajes y Cambios de Estado

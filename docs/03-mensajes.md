# 03. Mensajes (hilos, no leídos y modal)

## URL
- `mensajes.html`
- Modal de mensajes dentro de `mensajes.html` y `editar-actividad.html`

## Funcionalidad
- Listado de hilos con indicador de “no leídos”
- Filtro “Solo no leídos”
- Apertura de hilo en modal, marcado automático como leído
- Borrado de mensajes propios (o Admin)

## Pasos
1. Abrir `mensajes.html`
2. Por defecto, vista de lista; alternar con botón “tarjetas”
3. Activar/Desactivar “Solo no leídos”
4. Abrir un hilo para ver mensajes y adjuntos
5. Enviar nuevo mensaje (con adjuntos opcionales)
6. Borrar mensaje propio

## Selectores Playwright
- Lista: `#messageList`
- Filtro no leídos: `#filtroNoLeidos`
- Botón lista: `#listViewBtn`
- Botón tarjetas: `#cardViewBtn`
- Modal: `#mensajesModal`
- Contenido modal: `#mensajesModalContent`

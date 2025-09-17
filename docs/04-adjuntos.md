# 04. Adjuntos de Actividad

## Ubicación
- En `editar-actividad.html`, sección “Adjuntos” de la actividad

## Precondiciones
- Actividad existente (`?id=<ID>`) y sesión iniciada

## Funcionalidad
- Subir uno o varios ficheros
- Añadir/editar descripción por adjunto
- Descargar adjunto
- Eliminar adjunto

## Pasos
1. Abrir `editar-actividad.html?id=<ID>`
2. Ir a la sección “Adjuntos”
3. Seleccionar uno o varios ficheros
4. (Opcional) Escribir una descripción y pulsar “Subir”
5. Ver listado de adjuntos con nombre, tamaño y acciones (descargar/eliminar/editar descripción)

## Errores frecuentes
- Tamaño o tipo de archivo no permitido (validados en backend)
- 401: sesión no válida

## Selectores Playwright (recomendados)
- Input de archivos: `#inputAdjuntos` (si existe) o `input[type="file"]` dentro de la sección de adjuntos
- Botón subir: `#btnSubirAdjuntos` (si existe)
- Lista adjuntos contenedor: `#adjuntosContainer`
- Botón descargar en item: `[data-action="descargar-adjunto"]`
- Botón eliminar en item: `[data-action="eliminar-adjunto"]`
- Campo descripción en item: `.adjunto-descripcion`

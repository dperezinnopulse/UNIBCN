# Manual de la Aplicación UB Formación

Este manual recoge los procesos funcionales de la aplicación y servirá como base para la automatización de guías con Playwright (capturas y vídeos).

## Índice

### Manual de Usuario
- 01. Login y sesión de usuario (docs/01-login.md)
- 02. Crear / Editar Actividad (docs/02-crear-actividad.md)
- 03. Mensajes (hilos y no leídos) (docs/03-mensajes.md)
- 04. Adjuntos de Actividad (docs/04-adjuntos.md)
- 05. Cambios de Estado (docs/05-cambios-estado.md)
- 06. Administración de Usuarios (Admin) (docs/06-admin-usuarios.md)
- 07. Perfil de Usuario (Gestor) (docs/07-perfil.md)
- 08. Notificaciones por Email (docs/08-emails.md)

### Workflow y Permisos
- **[Workflow UB - Especificación Completa](workflow_ub.html)** - Roles, estados, transiciones y restricciones del sistema
- **[Permisos de Edición Completos](permisos-edicion-completos.html)** - Matriz de permisos de edición por rol y estado
- [Info Estados-Roles-Flujos](Info%20Estados-Roles-Flujos.md) - Documento de referencia del workflow
- [Resumen Ejecutivo Workflow](Auxiliar/resumen-ejecutivo-workflow.html) - Resumen ejecutivo del flujo de trabajo
- [Esquema Workflow Completo](Auxiliar/esquema-workflow-completo.html) - Diagrama detallado del workflow
- [Diagrama de Flujo](Auxiliar/diagrama-flujo-workflow.html) - Diagrama visual del flujo de estados

### Playwright (Testing)
- Playwright: Convenciones de selectores (docs/playwright/selectores.md)
- Playwright: Plan de suites E2E y puntos de captura (docs/playwright/plan.md)

## Convenciones del manual
- Pasos accionables numerados y resumidos
- Sección de “Selectores Playwright” por pantalla (CSS/XPath/atributos recomendados)
- Sección “Errores frecuentes y solución” por proceso
- URLs de referencia tanto en `localhost` como en IP privada

## Entornos
- Frontend: http://localhost:8080 / http://192.168.8.157:8080
- Backend:  http://localhost:5001 / http://192.168.8.157:5001

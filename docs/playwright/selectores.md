# Playwright - Convenciones de Selectores

## Reglas
- Priorizar IDs estables (`#elementId`)
- Si no hay ID, usar atributos data- (`[data-action="..."]`, `[data-testid="..."]`)
- Evitar selectores por texto salvo en validaciones
- Evitar rutas DOM frágiles

## Cabecera y menú
- Sidebar container: `#sidebarContainer`
- Header container: `#headerContainer`
- Menú: links con `.nav-link` y `.link-text`

## Autenticación
- Token en `localStorage['ub_token']`
- Usuario en `localStorage['ub_user']`

## Pautas de snapshot
- Esperar a que los listados rendericen (contenedor no vacío)
- Forzar vista “lista” o “tarjetas” antes de snapshot
- Cerrar modales antes de finalizar test

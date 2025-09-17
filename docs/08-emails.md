# 08. Notificaciones por Email

## Eventos
- Cambio de estado de actividad (a Gestores afectados)
- Nuevo mensaje en hilo (a participantes y autor, excepto emisor)

## Contenido
- HTML compatible con Outlook Classic
- Logo corporativo y colores
- Enlaces directos a `editar-actividad.html?id=<ID>`

## Requisitos
- Backend configurado con SMTP en `appsettings.json`
- Campo `Email` de `Usuario` informado

## Errores frecuentes
- Fallo SMTP: revisar credenciales y conectividad
- Emails vacíos en usuarios: completar datos en Admin Usuarios

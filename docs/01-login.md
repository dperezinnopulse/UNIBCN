# 01. Login y sesión de usuario

## URL
- `login.html`

## Precondiciones
- Backend accesible en `http://<HOST>:5001`
- Usuario existente (Admin o Gestor)

## Pasos
1. Abrir `http://<HOST>:8080/login.html`
2. Introducir Usuario y Contraseña
3. Pulsar “Entrar”
4. Redirección a la ruta recordada o `historico.html`

## Comportamiento
- Guarda token en `localStorage['ub_token']`
- Guarda usuario en `localStorage['ub_user']`
- Redirecciona si estaba guardado `ub_post_login_redirect`

## Errores frecuentes
- “No se pudo conectar con el servidor”: backend caído o no accesible desde el host
- “Usuario o contraseña incorrectos”: credenciales inválidas

## Selectores Playwright
- Usuario: `#loginUser`
- Contraseña: `#loginPass`
- Botón Entrar: `#btnLogin`
- Mensaje error: `#loginMsg`

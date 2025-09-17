# 06. Administración de Usuarios (Admin)

## URL
- `admin-usuarios.html`

## Precondiciones
- Rol: Admin

## Funcionalidad
- Listar usuarios (ID, Usuario, Rol, UG, Email, Activo)
- Crear usuario
- Editar usuario (rol, UG, email, contraseña opcional)
- Desactivar usuario

## Pasos
1. Abrir `admin-usuarios.html`
2. Click “Nuevo” para crear usuario (requiere contraseña)
3. Editar seleccionando lápiz en una fila
4. Desactivar usando el icono de papelera

## Errores frecuentes
- 400 Usuario ya existe
- 401/403 sin permisos Admin

## Selectores Playwright
- Tabla: `#tablaUsuarios`
- Nuevo: `#btnNuevo`
- Refrescar: `#btnRefrescar`
- Modal: `#modalUsuario`
- Form usuario: `#formUsuario`
- Guardar: `#btnGuardar`
- Select UG: `#ug`

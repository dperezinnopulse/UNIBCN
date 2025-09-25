-- Script para verificar las credenciales del usuario docente.idp
USE UB_Formacion;
GO

PRINT '=== VERIFICANDO USUARIO DOCENTE.IDP ==='

-- 1. Verificar usuario docente.idp
SELECT 
    Id,
    Username,
    Rol,
    Activo,
    UnidadGestionId,
    PasswordHash
FROM Usuarios 
WHERE Username = 'docente.idp'

PRINT ''
PRINT '=== VERIFICANDO PASSWORD HASH ==='

-- 2. Verificar si el password hash coincide con 'SAE'
SELECT 
    Username,
    CASE 
        WHEN PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMye' THEN 'HASH CORRECTO PARA SAE'
        ELSE 'HASH INCORRECTO'
    END as HashStatus,
    PasswordHash
FROM Usuarios 
WHERE Username = 'docente.idp'

PRINT ''
PRINT '=== VERIFICANDO UNIDAD DE GESTIÓN ==='

-- 3. Verificar unidad de gestión
SELECT 
    u.Username,
    u.UnidadGestionId,
    ug.Nombre as UnidadGestion
FROM Usuarios u
LEFT JOIN UnidadesGestion ug ON u.UnidadGestionId = ug.Id
WHERE u.Username = 'docente.idp'

PRINT ''
PRINT '=== VERIFICANDO MAPEO DE ROL ==='

-- 4. Verificar mapeo de rol
SELECT 
    mr.RolOriginal,
    rn.Codigo as RolNormalizado,
    rn.Nombre as RolNombre
FROM MapeoRoles mr
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id
WHERE mr.RolOriginal = 'Docente'

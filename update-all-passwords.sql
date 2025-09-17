-- Script para actualizar TODAS las contraseñas de la tabla Usuarios
-- Pone la contraseña igual al username para todos los usuarios

USE [UB_Formacion];

-- Actualizar TODAS las contraseñas para que sean iguales al username
UPDATE [Usuarios] 
SET [PasswordHash] = '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh';

-- Verificar que se actualizaron correctamente
SELECT 
    u.Id,
    u.Username,
    u.PasswordHash,
    u.Rol,
    u.UnidadGestionId,
    ug.Nombre as UnidadGestionNombre,
    u.Email,
    u.Activo
FROM [Usuarios] u
LEFT JOIN [UnidadesGestion] ug ON u.UnidadGestionId = ug.Id
ORDER BY u.UnidadGestionId, u.Username;

PRINT 'TODAS las contraseñas han sido actualizadas correctamente.';
PRINT 'Ahora la contraseña es igual al username para TODOS los usuarios.';
PRINT '';
PRINT 'Ejemplos de login:';
PRINT '  Username: Admin, Password: Admin';
PRINT '  Username: docente.idp, Password: docente.idp';
PRINT '  Username: coord.crai, Password: coord.crai';
PRINT '  Username: soporte.sae, Password: soporte.sae';
PRINT '';
PRINT 'Total de usuarios actualizados: ' + CAST(@@ROWCOUNT AS VARCHAR(10));


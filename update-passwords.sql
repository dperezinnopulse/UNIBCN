-- Script para actualizar contraseñas de usuarios de prueba
-- Cambia la contraseña para que sea igual al username

USE [UB_Formacion];

-- Actualizar contraseñas de usuarios de IDP (ya existentes)
UPDATE [Usuarios] 
SET [PasswordHash] = '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh'
WHERE [Username] IN ('docente.idp', 'tecnico.idp', 'coord.idp', 'resp.idp', 'soporte.idp');

-- Actualizar contraseñas de usuarios de CRAI
UPDATE [Usuarios] 
SET [PasswordHash] = '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh'
WHERE [Username] IN ('docente.crai', 'tecnico.crai', 'coord.crai', 'resp.crai', 'soporte.crai');

-- Actualizar contraseñas de usuarios de SAE
UPDATE [Usuarios] 
SET [PasswordHash] = '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh'
WHERE [Username] IN ('docente.sae', 'tecnico.sae', 'coord.sae', 'resp.sae', 'soporte.sae');

-- Verificar que se actualizaron correctamente
SELECT 
    u.Username,
    u.PasswordHash,
    u.Rol,
    ug.Nombre as UnidadGestionNombre
FROM [Usuarios] u
LEFT JOIN [UnidadesGestion] ug ON u.UnidadGestionId = ug.Id
WHERE u.Username IN ('docente.idp', 'tecnico.idp', 'coord.idp', 'resp.idp', 'soporte.idp',
                     'docente.crai', 'tecnico.crai', 'coord.crai', 'resp.crai', 'soporte.crai',
                     'docente.sae', 'tecnico.sae', 'coord.sae', 'resp.sae', 'soporte.sae')
ORDER BY u.UnidadGestionId, u.Username;

PRINT 'Contraseñas actualizadas correctamente.';
PRINT 'Ahora la contraseña es igual al username para todos los usuarios de prueba.';
PRINT '';
PRINT 'Ejemplos de login:';
PRINT '  Username: docente.idp, Password: docente.idp';
PRINT '  Username: coord.crai, Password: coord.crai';
PRINT '  Username: soporte.sae, Password: soporte.sae';


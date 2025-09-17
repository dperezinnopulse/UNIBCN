-- Script para corregir el mapeo de roles final
-- Unificar nombres de roles entre Usuarios y MapeoRoles

PRINT '=== CORRIGIENDO MAPEO DE ROLES FINAL ==='

-- 1. Verificar el problema de codificación
PRINT '1. Verificando nombres exactos en Usuarios:'
SELECT DISTINCT Rol FROM Usuarios WHERE Activo = 1 ORDER BY Rol

PRINT '2. Verificando nombres exactos en MapeoRoles:'
SELECT DISTINCT RolOriginal FROM MapeoRoles WHERE Activo = 1 ORDER BY RolOriginal

-- 3. Agregar mapeos faltantes para roles en uso
PRINT '3. Agregando mapeos faltantes...'

-- Mapeo para "Coordinador de Formación" (exacto)
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
SELECT 'Coordinador de Formación', Id, 1
FROM RolesNormalizados WHERE Codigo = 'COORD_FORMACION'
AND NOT EXISTS (SELECT 1 FROM MapeoRoles WHERE RolOriginal = 'Coordinador de Formación' AND Activo = 1)

-- Mapeo para "Coordinador/Técnico" (exacto)
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
SELECT 'Coordinador/Técnico', Id, 1
FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO'
AND NOT EXISTS (SELECT 1 FROM MapeoRoles WHERE RolOriginal = 'Coordinador/Técnico' AND Activo = 1)

-- 4. Verificar mapeos finales
PRINT '4. Mapeos finales:'
SELECT mr.RolOriginal, rn.Codigo, rn.Nombre 
FROM MapeoRoles mr 
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id 
WHERE mr.Activo = 1 
ORDER BY mr.RolOriginal

-- 5. Verificar roles sin mapeo (debería estar vacío)
PRINT '5. Roles en usuarios sin mapeo (debería estar vacío):'
SELECT DISTINCT u.Rol, COUNT(*) as Usuarios
FROM Usuarios u
WHERE u.Activo = 1 
AND NOT EXISTS (SELECT 1 FROM MapeoRoles mr WHERE mr.RolOriginal = u.Rol AND mr.Activo = 1)
GROUP BY u.Rol
ORDER BY u.Rol

-- 6. Probar el sistema con tecnico.idp
PRINT '6. Verificando transiciones para COORD_TECNICO desde BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR' AND rn.Codigo = 'COORD_TECNICO'
ORDER BY t.EstadoDestinoCodigo

PRINT '=== CORRECCIÓN COMPLETADA ==='









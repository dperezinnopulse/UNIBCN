-- Script de diagnóstico para verificar el problema con las transiciones
USE UB_Formacion;
GO

PRINT '=== DIAGNÓSTICO DE TRANSICIONES ==='

-- 1. Verificar estructura de la tabla TransicionesEstado
PRINT '1. ESTRUCTURA DE TransicionesEstado:'
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'TransicionesEstado'
ORDER BY ORDINAL_POSITION

-- 2. Verificar si hay datos en TransicionesEstado
PRINT '2. TOTAL DE TRANSICIONES:'
SELECT COUNT(*) as TotalTransiciones FROM TransicionesEstado

-- 3. Verificar si hay transiciones activas
PRINT '3. TRANSICIONES ACTIVAS:'
SELECT COUNT(*) as TransicionesActivas FROM TransicionesEstado WHERE Activo = 1

-- 4. Verificar si hay transiciones con RolPermitidoId
PRINT '4. TRANSICIONES CON RolPermitidoId:'
SELECT COUNT(*) as ConRolPermitidoId FROM TransicionesEstado WHERE RolPermitidoId IS NOT NULL

-- 5. Verificar si hay transiciones con RolPermitido (string)
PRINT '5. TRANSICIONES CON RolPermitido (string):'
SELECT COUNT(*) as ConRolPermitido FROM TransicionesEstado WHERE RolPermitido IS NOT NULL AND RolPermitido != ''

-- 6. Verificar roles normalizados
PRINT '6. ROLES NORMALIZADOS:'
SELECT Id, Codigo, Nombre FROM RolesNormalizados WHERE Activo = 1

-- 7. Verificar mapeos de roles
PRINT '7. MAPEOS DE ROLES:'
SELECT mr.RolOriginal, rn.Codigo, rn.Nombre 
FROM MapeoRoles mr 
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id 
WHERE mr.Activo = 1

-- 8. Verificar estados de actividad
PRINT '8. ESTADOS DE ACTIVIDAD:'
SELECT Id, Codigo, Nombre FROM EstadosActividad WHERE Activo = 1

-- 9. Verificar transiciones con JOIN a RolesNormalizados
PRINT '9. TRANSICIONES CON JOIN A RolesNormalizados:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1

-- 10. Verificar transiciones con RolPermitido (string)
PRINT '10. TRANSICIONES CON RolPermitido (string):'
SELECT EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido
FROM TransicionesEstado 
WHERE Activo = 1 AND RolPermitido IS NOT NULL AND RolPermitido != ''

PRINT '=== DIAGNÓSTICO COMPLETADO ==='

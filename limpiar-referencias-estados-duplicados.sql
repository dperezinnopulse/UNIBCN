-- Script para limpiar referencias a estados duplicados y eliminarlos

PRINT '=== LIMPIANDO REFERENCIAS A ESTADOS DUPLICADOS ==='

-- 1. Actualizar referencias en CambiosEstadoActividad
PRINT '1. Actualizando referencias en CambiosEstadoActividad...'

-- BORRADOR (14) -> BOR (6)
UPDATE CambiosEstadoActividad 
SET EstadoAnteriorId = 6 
WHERE EstadoAnteriorId = 14

UPDATE CambiosEstadoActividad 
SET EstadoNuevoId = 6 
WHERE EstadoNuevoId = 14

-- ENVIADA (18) -> ENV (7)
UPDATE CambiosEstadoActividad 
SET EstadoAnteriorId = 7 
WHERE EstadoAnteriorId = 18

UPDATE CambiosEstadoActividad 
SET EstadoNuevoId = 7 
WHERE EstadoNuevoId = 18

-- 2. Verificar que no hay más referencias
PRINT '2. Verificando referencias restantes...'
SELECT COUNT(*) as Referencias FROM CambiosEstadoActividad WHERE EstadoAnteriorId IN (14, 18) OR EstadoNuevoId IN (14, 18)

-- 3. Eliminar transiciones duplicadas (limpiar las que quedaron)
PRINT '3. Eliminando transiciones duplicadas...'

-- Eliminar transiciones duplicadas de BOR -> ENV (mantener solo una)
DELETE FROM TransicionesEstado 
WHERE EstadoOrigenCodigo = 'BOR' 
AND EstadoDestinoCodigo = 'ENV' 
AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO')
AND Id NOT IN (
    SELECT MIN(Id) FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'BOR' 
    AND EstadoDestinoCodigo = 'ENV' 
    AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO')
)

-- Eliminar transiciones duplicadas de BOR -> ENV para DOCENTE_DINAMIZADOR
DELETE FROM TransicionesEstado 
WHERE EstadoOrigenCodigo = 'BOR' 
AND EstadoDestinoCodigo = 'ENV' 
AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE_DINAMIZADOR')
AND Id NOT IN (
    SELECT MIN(Id) FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'BOR' 
    AND EstadoDestinoCodigo = 'ENV' 
    AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE_DINAMIZADOR')
)

-- 4. Eliminar estados duplicados
PRINT '4. Eliminando estado BORRADOR (ID: 14)...'
DELETE FROM EstadosActividad WHERE Id = 14

PRINT '5. Eliminando estado ENVIADA (ID: 18)...'
DELETE FROM EstadosActividad WHERE Id = 18

-- 6. Verificar transiciones finales para BOR
PRINT '6. Transiciones finales para BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

-- 7. Verificar estados finales
PRINT '7. Estados finales:'
SELECT Id, Codigo, Nombre FROM EstadosActividad WHERE Activo = 1 ORDER BY Id

PRINT '=== LIMPIEZA COMPLETADA ==='









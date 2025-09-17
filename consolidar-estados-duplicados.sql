-- Script para consolidar estados duplicados
-- Eliminar BORRADOR (ID: 14) y ENVIADA (ID: 18) que no tienen actividades

PRINT '=== CONSOLIDANDO ESTADOS DUPLICADOS ==='

-- 1. Verificar transiciones que apuntan a estados duplicados
PRINT '1. Transiciones que apuntan a BORRADOR:'
SELECT COUNT(*) as Transiciones FROM TransicionesEstado WHERE EstadoDestinoCodigo = 'BORRADOR' AND Activo = 1

PRINT '2. Transiciones que apuntan a ENVIADA:'
SELECT COUNT(*) as Transiciones FROM TransicionesEstado WHERE EstadoDestinoCodigo = 'ENVIADA' AND Activo = 1

-- 3. Actualizar transiciones que apuntan a BORRADOR para que apunten a BOR
PRINT '3. Actualizando transiciones BORRADOR -> BOR...'
UPDATE TransicionesEstado 
SET EstadoDestinoCodigo = 'BOR'
WHERE EstadoDestinoCodigo = 'BORRADOR' AND Activo = 1

-- 4. Actualizar transiciones que apuntan a ENVIADA para que apunten a ENV
PRINT '4. Actualizando transiciones ENVIADA -> ENV...'
UPDATE TransicionesEstado 
SET EstadoDestinoCodigo = 'ENV'
WHERE EstadoDestinoCodigo = 'ENVIADA' AND Activo = 1

-- 5. Eliminar transiciones desde estados duplicados (ya no se necesitan)
PRINT '5. Eliminando transiciones desde BORRADOR...'
DELETE FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'BORRADOR'

PRINT '6. Eliminando transiciones desde ENVIADA...'
DELETE FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'ENVIADA'

-- 7. Eliminar estados duplicados
PRINT '7. Eliminando estado BORRADOR (ID: 14)...'
DELETE FROM EstadosActividad WHERE Id = 14

PRINT '8. Eliminando estado ENVIADA (ID: 18)...'
DELETE FROM EstadosActividad WHERE Id = 18

-- 9. Verificar transiciones finales para BOR
PRINT '9. Transiciones finales para BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

-- 10. Verificar transiciones finales para ENV
PRINT '10. Transiciones finales para ENV:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'ENV'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

-- 11. Verificar estados finales
PRINT '11. Estados finales:'
SELECT Id, Codigo, Nombre FROM EstadosActividad WHERE Activo = 1 ORDER BY Id

PRINT '=== CONSOLIDACIÓN COMPLETADA ==='









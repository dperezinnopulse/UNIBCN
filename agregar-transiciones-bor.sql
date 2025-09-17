-- Script para agregar transiciones faltantes para el estado BOR
-- Copiando las transiciones de BORRADOR a BOR

PRINT '=== AGREGANDO TRANSICIONES PARA ESTADO BOR ==='

-- 1. Verificar transiciones existentes para BOR
PRINT '1. Transiciones existentes para BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado 
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR'

-- 2. Agregar transiciones de BORRADOR a BOR
PRINT '2. Agregando transiciones de BORRADOR a BOR...'

-- Copiar todas las transiciones de BORRADOR a BOR
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitidoId, Activo)
SELECT 'BOR', t.EstadoDestinoCodigo, t.RolPermitidoId, t.Activo
FROM TransicionesEstado t
WHERE t.EstadoOrigenCodigo = 'BORRADOR' 
AND t.Activo = 1
AND NOT EXISTS (
    SELECT 1 FROM TransicionesEstado t2 
    WHERE t2.EstadoOrigenCodigo = 'BOR' 
    AND t2.EstadoDestinoCodigo = t.EstadoDestinoCodigo 
    AND t2.RolPermitidoId = t.RolPermitidoId
)

PRINT '3. Transiciones agregadas correctamente'

-- 3. Verificar transiciones agregadas para BOR
PRINT '4. Transiciones finales para BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

PRINT '=== TRANSICIONES AGREGADAS ==='


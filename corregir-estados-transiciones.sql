-- Script para corregir estados duplicados y transiciones
-- Análisis: BOR (67 actividades) vs BORRADOR (0 actividades)
-- Análisis: ENV (2 actividades) vs ENVIADA (0 actividades)

PRINT '=== CORRIGIENDO ESTADOS DUPLICADOS Y TRANSICIONES ==='

-- 1. Verificar transiciones actuales para BOR
PRINT '1. Transiciones actuales para BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

-- 2. Verificar transiciones actuales para ENV
PRINT '2. Transiciones actuales para ENV:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'ENV'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

-- 3. Agregar transiciones faltantes para BOR (desde BORRADOR)
PRINT '3. Agregando transiciones faltantes para BOR...'

-- Copiar transiciones de BORRADOR a BOR (solo las que no existen)
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'BOR', t.EstadoDestinoCodigo, t.RolPermitido, t.RolPermitidoId, t.Activo
FROM TransicionesEstado t
WHERE t.EstadoOrigenCodigo = 'BORRADOR' 
AND t.Activo = 1
AND NOT EXISTS (
    SELECT 1 FROM TransicionesEstado t2 
    WHERE t2.EstadoOrigenCodigo = 'BOR' 
    AND t2.EstadoDestinoCodigo = t.EstadoDestinoCodigo 
    AND t2.RolPermitidoId = t.RolPermitidoId
)

-- 4. Agregar transiciones faltantes para ENV (desde ENVIADA)
PRINT '4. Agregando transiciones faltantes para ENV...'

-- Copiar transiciones de ENVIADA a ENV (solo las que no existen)
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'ENV', t.EstadoDestinoCodigo, t.RolPermitido, t.RolPermitidoId, t.Activo
FROM TransicionesEstado t
WHERE t.EstadoOrigenCodigo = 'ENVIADA' 
AND t.Activo = 1
AND NOT EXISTS (
    SELECT 1 FROM TransicionesEstado t2 
    WHERE t2.EstadoOrigenCodigo = 'ENV' 
    AND t2.EstadoDestinoCodigo = t.EstadoDestinoCodigo 
    AND t2.RolPermitidoId = t.RolPermitidoId
)

-- 5. Agregar transiciones del workflow completo para BOR
PRINT '5. Agregando transiciones del workflow para BOR...'

-- BOR -> ENV (para COORD_TECNICO y DOCENTE_DINAMIZADOR)
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'BOR', 'ENV', 'Coordinador Tecnico', Id, 1
FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO'
AND NOT EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'BOR' AND EstadoDestinoCodigo = 'ENV' AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO'))

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'BOR', 'ENV', 'Docente/Dinamizador', Id, 1
FROM RolesNormalizados WHERE Codigo = 'DOCENTE_DINAMIZADOR'
AND NOT EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'BOR' AND EstadoDestinoCodigo = 'ENV' AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE_DINAMIZADOR'))

-- 6. Agregar transiciones del workflow completo para ENV
PRINT '6. Agregando transiciones del workflow para ENV...'

-- ENV -> DEFINICION (para COORD_FORMACION)
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'ENV', 'DEFINICION', 'Coordinador de Formación', Id, 1
FROM RolesNormalizados WHERE Codigo = 'COORD_FORMACION'
AND NOT EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'ENV' AND EstadoDestinoCodigo = 'DEFINICION' AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORD_FORMACION'))

-- ENV -> RECHAZADA (para COORD_FORMACION y RESPONSABLE_UNIDAD)
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'ENV', 'RECHAZADA', 'Coordinador de Formación', Id, 1
FROM RolesNormalizados WHERE Codigo = 'COORD_FORMACION'
AND NOT EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'ENV' AND EstadoDestinoCodigo = 'RECHAZADA' AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORD_FORMACION'))

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, RolPermitidoId, Activo)
SELECT 'ENV', 'RECHAZADA', 'Responsable de Unidad', Id, 1
FROM RolesNormalizados WHERE Codigo = 'RESPONSABLE_UNIDAD'
AND NOT EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'ENV' AND EstadoDestinoCodigo = 'RECHAZADA' AND RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'RESPONSABLE_UNIDAD'))

-- 7. Verificar transiciones finales
PRINT '7. Transiciones finales para BOR:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'BOR'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

PRINT '8. Transiciones finales para ENV:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 AND t.EstadoOrigenCodigo = 'ENV'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

PRINT '=== CORRECCIÓN COMPLETADA ==='


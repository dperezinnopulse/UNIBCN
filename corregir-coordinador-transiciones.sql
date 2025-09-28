-- Script para corregir transiciones del Rol Coordinador
USE UB_Formacion;
GO

PRINT '=== CORRIGIENDO TRANSICIONES DEL ROL COORDINADOR ==='

-- 1. Verificar estado actual
PRINT '1. VERIFICANDO ESTADO ACTUAL DE TRANSICIONES COORDINADOR:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido = 'CoordinadorFormacion' 
AND t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 2. Añadir transición BORRADOR → ENVIADA para CoordinadorFormacion
PRINT ''
PRINT '2. AÑADIENDO TRANSICIÓN BORRADOR → ENVIADA para CoordinadorFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'BORRADOR' 
    AND EstadoDestinoCodigo = 'ENVIADA' 
    AND RolPermitido = 'CoordinadorFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('BORRADOR', 'ENVIADA', 'CoordinadorFormacion', 'enviar', 1)
    PRINT '✅ Transición BORRADOR → ENVIADA añadida para CoordinadorFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición BORRADOR → ENVIADA ya existe para CoordinadorFormacion'
END

-- 3. Añadir transición EN_REVISION → RECHAZADA para CoordinadorFormacion
PRINT ''
PRINT '3. AÑADIENDO TRANSICIÓN EN_REVISION → RECHAZADA para CoordinadorFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'EN_REVISION' 
    AND EstadoDestinoCodigo = 'RECHAZADA' 
    AND RolPermitido = 'CoordinadorFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('EN_REVISION', 'RECHAZADA', 'CoordinadorFormacion', 'rechazar', 1)
    PRINT '✅ Transición EN_REVISION → RECHAZADA añadida para CoordinadorFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición EN_REVISION → RECHAZADA ya existe para CoordinadorFormacion'
END

-- 4. Añadir transición EN_REVISION → ENVIADA para CoordinadorFormacion
PRINT ''
PRINT '4. AÑADIENDO TRANSICIÓN EN_REVISION → ENVIADA para CoordinadorFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'EN_REVISION' 
    AND EstadoDestinoCodigo = 'ENVIADA' 
    AND RolPermitido = 'CoordinadorFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('EN_REVISION', 'ENVIADA', 'CoordinadorFormacion', 'devolver', 1)
    PRINT '✅ Transición EN_REVISION → ENVIADA añadida para CoordinadorFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición EN_REVISION → ENVIADA ya existe para CoordinadorFormacion'
END

-- 5. Verificar resultado final
PRINT ''
PRINT '5. VERIFICANDO RESULTADO FINAL:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido = 'CoordinadorFormacion' 
AND t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 6. Verificar transiciones específicas que se añadieron
PRINT ''
PRINT '6. VERIFICANDO TRANSICIONES ESPECÍFICAS AÑADIDAS:'

-- BORRADOR → ENVIADA
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'BORRADOR' AND EstadoDestinoCodigo = 'ENVIADA' AND RolPermitido = 'CoordinadorFormacion' AND Activo = 1)
    PRINT '✅ BORRADOR → ENVIADA: CoordinadorFormacion puede enviar'
ELSE
    PRINT '❌ BORRADOR → ENVIADA: CoordinadorFormacion NO puede enviar'

-- EN_REVISION → RECHAZADA
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'EN_REVISION' AND EstadoDestinoCodigo = 'RECHAZADA' AND RolPermitido = 'CoordinadorFormacion' AND Activo = 1)
    PRINT '✅ EN_REVISION → RECHAZADA: CoordinadorFormacion puede rechazar'
ELSE
    PRINT '❌ EN_REVISION → RECHAZADA: CoordinadorFormacion NO puede rechazar'

-- EN_REVISION → ENVIADA
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'EN_REVISION' AND EstadoDestinoCodigo = 'ENVIADA' AND RolPermitido = 'CoordinadorFormacion' AND Activo = 1)
    PRINT '✅ EN_REVISION → ENVIADA: CoordinadorFormacion puede devolver'
ELSE
    PRINT '❌ EN_REVISION → ENVIADA: CoordinadorFormacion NO puede devolver'

PRINT ''
PRINT '=== CORRECCIÓN COORDINADOR COMPLETADA ==='

-- Script para corregir transiciones del Rol Técnico
USE UB_Formacion;
GO

PRINT '=== CORRIGIENDO TRANSICIONES DEL ROL TÉCNICO ==='

-- 1. Verificar estado actual
PRINT '1. VERIFICANDO ESTADO ACTUAL DE TRANSICIONES TÉCNICO:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido = 'TecnicoFormacion' 
AND t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 2. Añadir transición BORRADOR → VALIDACION_UNIDAD para TecnicoFormacion
PRINT ''
PRINT '2. AÑADIENDO TRANSICIÓN BORRADOR → VALIDACION_UNIDAD para TecnicoFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'BORRADOR' 
    AND EstadoDestinoCodigo = 'VALIDACION_UNIDAD' 
    AND RolPermitido = 'TecnicoFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('BORRADOR', 'VALIDACION_UNIDAD', 'TecnicoFormacion', 'enviar', 1)
    PRINT '✅ Transición BORRADOR → VALIDACION_UNIDAD añadida para TecnicoFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición BORRADOR → VALIDACION_UNIDAD ya existe para TecnicoFormacion'
END

-- 3. Añadir transición EN_REVISION → RECHAZADA para TecnicoFormacion
PRINT ''
PRINT '3. AÑADIENDO TRANSICIÓN EN_REVISION → RECHAZADA para TecnicoFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'EN_REVISION' 
    AND EstadoDestinoCodigo = 'RECHAZADA' 
    AND RolPermitido = 'TecnicoFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('EN_REVISION', 'RECHAZADA', 'TecnicoFormacion', 'rechazar', 1)
    PRINT '✅ Transición EN_REVISION → RECHAZADA añadida para TecnicoFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición EN_REVISION → RECHAZADA ya existe para TecnicoFormacion'
END

-- 4. Añadir transición EN_REVISION → VALIDACION_UNIDAD para TecnicoFormacion
PRINT ''
PRINT '4. AÑADIENDO TRANSICIÓN EN_REVISION → VALIDACION_UNIDAD para TecnicoFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'EN_REVISION' 
    AND EstadoDestinoCodigo = 'VALIDACION_UNIDAD' 
    AND RolPermitido = 'TecnicoFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('EN_REVISION', 'VALIDACION_UNIDAD', 'TecnicoFormacion', 'aprobar', 1)
    PRINT '✅ Transición EN_REVISION → VALIDACION_UNIDAD añadida para TecnicoFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición EN_REVISION → VALIDACION_UNIDAD ya existe para TecnicoFormacion'
END

-- 5. Añadir transición CANCELADA → BORRADOR para TecnicoFormacion
PRINT ''
PRINT '5. AÑADIENDO TRANSICIÓN CANCELADA → BORRADOR para TecnicoFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'CANCELADA' 
    AND EstadoDestinoCodigo = 'BORRADOR' 
    AND RolPermitido = 'TecnicoFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('CANCELADA', 'BORRADOR', 'TecnicoFormacion', 'reabrir', 1)
    PRINT '✅ Transición CANCELADA → BORRADOR añadida para TecnicoFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición CANCELADA → BORRADOR ya existe para TecnicoFormacion'
END

-- 6. Añadir transición RECHAZADA → BORRADOR para TecnicoFormacion
PRINT ''
PRINT '6. AÑADIENDO TRANSICIÓN RECHAZADA → BORRADOR para TecnicoFormacion...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'RECHAZADA' 
    AND EstadoDestinoCodigo = 'BORRADOR' 
    AND RolPermitido = 'TecnicoFormacion' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('RECHAZADA', 'BORRADOR', 'TecnicoFormacion', 'reabrir', 1)
    PRINT '✅ Transición RECHAZADA → BORRADOR añadida para TecnicoFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ Transición RECHAZADA → BORRADOR ya existe para TecnicoFormacion'
END

-- 7. Verificar resultado final
PRINT ''
PRINT '7. VERIFICANDO RESULTADO FINAL:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido = 'TecnicoFormacion' 
AND t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 8. Verificar transiciones específicas que se añadieron
PRINT ''
PRINT '8. VERIFICANDO TRANSICIONES ESPECÍFICAS AÑADIDAS:'

-- BORRADOR → VALIDACION_UNIDAD
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'BORRADOR' AND EstadoDestinoCodigo = 'VALIDACION_UNIDAD' AND RolPermitido = 'TecnicoFormacion' AND Activo = 1)
    PRINT '✅ BORRADOR → VALIDACION_UNIDAD: TecnicoFormacion puede enviar directo'
ELSE
    PRINT '❌ BORRADOR → VALIDACION_UNIDAD: TecnicoFormacion NO puede enviar directo'

-- EN_REVISION → RECHAZADA
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'EN_REVISION' AND EstadoDestinoCodigo = 'RECHAZADA' AND RolPermitido = 'TecnicoFormacion' AND Activo = 1)
    PRINT '✅ EN_REVISION → RECHAZADA: TecnicoFormacion puede rechazar'
ELSE
    PRINT '❌ EN_REVISION → RECHAZADA: TecnicoFormacion NO puede rechazar'

-- EN_REVISION → VALIDACION_UNIDAD
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'EN_REVISION' AND EstadoDestinoCodigo = 'VALIDACION_UNIDAD' AND RolPermitido = 'TecnicoFormacion' AND Activo = 1)
    PRINT '✅ EN_REVISION → VALIDACION_UNIDAD: TecnicoFormacion puede aprobar'
ELSE
    PRINT '❌ EN_REVISION → VALIDACION_UNIDAD: TecnicoFormacion NO puede aprobar'

-- CANCELADA → BORRADOR
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'CANCELADA' AND EstadoDestinoCodigo = 'BORRADOR' AND RolPermitido = 'TecnicoFormacion' AND Activo = 1)
    PRINT '✅ CANCELADA → BORRADOR: TecnicoFormacion puede reabrir'
ELSE
    PRINT '❌ CANCELADA → BORRADOR: TecnicoFormacion NO puede reabrir'

-- RECHAZADA → BORRADOR
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'RECHAZADA' AND EstadoDestinoCodigo = 'BORRADOR' AND RolPermitido = 'TecnicoFormacion' AND Activo = 1)
    PRINT '✅ RECHAZADA → BORRADOR: TecnicoFormacion puede reabrir'
ELSE
    PRINT '❌ RECHAZADA → BORRADOR: TecnicoFormacion NO puede reabrir'

-- 9. Contar total de transiciones por rol
PRINT ''
PRINT '9. TOTAL DE TRANSICIONES POR ROL:'
SELECT 
    t.RolPermitido,
    COUNT(*) as TotalTransiciones
FROM TransicionesEstado t 
WHERE t.Activo = 1
GROUP BY t.RolPermitido
ORDER BY t.RolPermitido

PRINT ''
PRINT '=== CORRECCIÓN TÉCNICO COMPLETADA ==='

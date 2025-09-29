-- Script para corregir transiciones del Rol Responsable
USE UB_Formacion;
GO

PRINT '=== CORRIGIENDO TRANSICIONES DEL ROL RESPONSABLE ==='

-- 1. Verificar estado actual
PRINT '1. VERIFICANDO ESTADO ACTUAL DE TRANSICIONES RESPONSABLE:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido = 'ResponsableUnidad' 
AND t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 2. Añadir transición VALIDACION_UNIDAD → RECHAZADA para ResponsableUnidad
PRINT ''
PRINT '2. AÑADIENDO TRANSICIÓN VALIDACION_UNIDAD → RECHAZADA para ResponsableUnidad...'

IF NOT EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'VALIDACION_UNIDAD' 
    AND EstadoDestinoCodigo = 'RECHAZADA' 
    AND RolPermitido = 'ResponsableUnidad' 
    AND Activo = 1
)
BEGIN
    INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
    VALUES ('VALIDACION_UNIDAD', 'RECHAZADA', 'ResponsableUnidad', 'rechazar', 1)
    PRINT '✅ Transición VALIDACION_UNIDAD → RECHAZADA añadida para ResponsableUnidad'
END
ELSE
BEGIN
    PRINT '⚠️ Transición VALIDACION_UNIDAD → RECHAZADA ya existe para ResponsableUnidad'
END

-- 3. Verificar resultado final
PRINT ''
PRINT '3. VERIFICANDO RESULTADO FINAL:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido = 'ResponsableUnidad' 
AND t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 4. Verificar transición específica que se añadió
PRINT ''
PRINT '4. VERIFICANDO TRANSICIÓN ESPECÍFICA AÑADIDA:'

-- VALIDACION_UNIDAD → RECHAZADA
IF EXISTS (SELECT 1 FROM TransicionesEstado WHERE EstadoOrigenCodigo = 'VALIDACION_UNIDAD' AND EstadoDestinoCodigo = 'RECHAZADA' AND RolPermitido = 'ResponsableUnidad' AND Activo = 1)
    PRINT '✅ VALIDACION_UNIDAD → RECHAZADA: ResponsableUnidad puede rechazar'
ELSE
    PRINT '❌ VALIDACION_UNIDAD → RECHAZADA: ResponsableUnidad NO puede rechazar'

-- 5. Contar total de transiciones por rol
PRINT ''
PRINT '5. TOTAL DE TRANSICIONES POR ROL:'
SELECT 
    t.RolPermitido,
    COUNT(*) as TotalTransiciones
FROM TransicionesEstado t 
WHERE t.Activo = 1
GROUP BY t.RolPermitido
ORDER BY t.RolPermitido

-- 6. Verificar todas las transiciones desde VALIDACION_UNIDAD
PRINT ''
PRINT '6. TODAS LAS TRANSICIONES DESDE VALIDACION_UNIDAD:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.EstadoOrigenCodigo = 'VALIDACION_UNIDAD' 
AND t.Activo = 1
ORDER BY t.RolPermitido, t.EstadoDestinoCodigo

PRINT ''
PRINT '=== CORRECCIÓN RESPONSABLE COMPLETADA ==='

-- Script para diagnosticar y corregir problemas del CoordinadorFormacion
USE UB_Formacion;
GO

PRINT '=== DIAGNÓSTICO Y CORRECCIÓN COORDINADORFORMACION ==='

-- 1. Verificar si existe el rol CoordinadorFormacion
PRINT '1. VERIFICANDO ROL COORDINADORFORMACION:'
SELECT 
    Id, 
    Codigo, 
    Nombre, 
    Descripcion, 
    Activo
FROM RolesNormalizados 
WHERE Codigo = 'COORDINADOR' OR Nombre LIKE '%Coordinador%'

-- 2. Verificar mapeo de roles
PRINT ''
PRINT '2. VERIFICANDO MAPEO DE ROLES:'
SELECT 
    mr.RolOriginal,
    rn.Codigo as RolNormalizado,
    rn.Nombre as NombreNormalizado,
    mr.Activo
FROM MapeoRoles mr
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id
WHERE mr.RolOriginal LIKE '%Coordinador%' OR rn.Codigo = 'COORDINADOR'

-- 3. Verificar transiciones actuales del CoordinadorFormacion
PRINT ''
PRINT '3. TRANSICIONES ACTUALES DEL COORDINADORFORMACION:'
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

-- 4. Verificar si las transiciones ya existen pero con otro nombre
PRINT ''
PRINT '4. VERIFICANDO TRANSICIONES CON NOMBRES SIMILARES:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    t.RolPermitido,
    t.Accion,
    t.Activo
FROM TransicionesEstado t 
WHERE t.RolPermitido LIKE '%Coordinador%' 
AND t.Activo = 1
ORDER BY t.RolPermitido, t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 5. Añadir transiciones faltantes (forzando la inserción)
PRINT ''
PRINT '5. AÑADIENDO TRANSICIONES FALTANTES:'

-- BORRADOR → ENVIADA
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
    PRINT '✅ AÑADIDA: BORRADOR → ENVIADA para CoordinadorFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ YA EXISTE: BORRADOR → ENVIADA para CoordinadorFormacion'
END

-- EN_REVISION → RECHAZADA
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
    PRINT '✅ AÑADIDA: EN_REVISION → RECHAZADA para CoordinadorFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ YA EXISTE: EN_REVISION → RECHAZADA para CoordinadorFormacion'
END

-- EN_REVISION → ENVIADA
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
    PRINT '✅ AÑADIDA: EN_REVISION → ENVIADA para CoordinadorFormacion'
END
ELSE
BEGIN
    PRINT '⚠️ YA EXISTE: EN_REVISION → ENVIADA para CoordinadorFormacion'
END

-- 6. Verificar resultado final
PRINT ''
PRINT '6. RESULTADO FINAL - TRANSICIONES DEL COORDINADORFORMACION:'
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

-- 7. Contar total de transiciones
PRINT ''
PRINT '7. TOTAL DE TRANSICIONES POR ROL:'
SELECT 
    t.RolPermitido,
    COUNT(*) as TotalTransiciones
FROM TransicionesEstado t 
WHERE t.Activo = 1
GROUP BY t.RolPermitido
ORDER BY t.RolPermitido

PRINT ''
PRINT '=== DIAGNÓSTICO COMPLETADO ==='

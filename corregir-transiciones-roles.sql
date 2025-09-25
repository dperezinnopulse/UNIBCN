-- Script para corregir las transiciones y mapear roles correctamente
USE UB_Formacion;
GO

PRINT '=== CORRIGIENDO TRANSICIONES Y ROLES ==='

-- 1. Verificar el problema actual
PRINT '1. VERIFICANDO PROBLEMA ACTUAL:'
SELECT 
    COUNT(*) as TotalTransiciones,
    COUNT(CASE WHEN RolPermitido IS NOT NULL AND RolPermitido != '' THEN 1 END) as ConRolPermitido,
    COUNT(CASE WHEN RolPermitidoId IS NOT NULL THEN 1 END) as ConRolPermitidoId
FROM TransicionesEstado 
WHERE Activo = 1

-- 2. Actualizar RolPermitidoId basado en RolPermitido
PRINT '2. ACTUALIZANDO RolPermitidoId...'

-- Mapear Docente
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE')
WHERE RolPermitido = 'Docente' AND Activo = 1

-- Mapear TecnicoFormacion
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'TECNICO')
WHERE RolPermitido = 'TecnicoFormacion' AND Activo = 1

-- Mapear CoordinadorFormacion
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORDINADOR')
WHERE RolPermitido = 'CoordinadorFormacion' AND Activo = 1

-- Mapear ResponsableUnidad
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'RESPONSABLE')
WHERE RolPermitido = 'ResponsableUnidad' AND Activo = 1

-- Mapear SoporteAdmin
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'SOPORTE')
WHERE RolPermitido = 'SoporteAdmin' AND Activo = 1

-- Mapear Admin
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'ADMIN')
WHERE RolPermitido = 'Admin' AND Activo = 1

-- 3. Verificar el resultado
PRINT '3. VERIFICANDO RESULTADO:'
SELECT 
    COUNT(*) as TotalTransiciones,
    COUNT(CASE WHEN RolPermitido IS NOT NULL AND RolPermitido != '' THEN 1 END) as ConRolPermitido,
    COUNT(CASE WHEN RolPermitidoId IS NOT NULL THEN 1 END) as ConRolPermitidoId
FROM TransicionesEstado 
WHERE Activo = 1

-- 4. Verificar transiciones con JOIN a RolesNormalizados
PRINT '4. TRANSICIONES CON JOIN A RolesNormalizados:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1
ORDER BY t.EstadoOrigenCodigo, rn.Codigo, t.EstadoDestinoCodigo

-- 5. Verificar transiciones sin mapeo
PRINT '5. TRANSICIONES SIN MAPEO (debería estar vacío):'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, t.RolPermitido
FROM TransicionesEstado t 
WHERE t.Activo = 1 
AND (t.RolPermitidoId IS NULL OR t.RolPermitido IS NULL OR t.RolPermitido = '')

PRINT '=== CORRECCIÓN COMPLETADA ==='

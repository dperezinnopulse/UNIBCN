-- Verificar transiciones para técnico IDP de DEFINICION a REVISION_ADMINISTRATIVA
USE UB_Formacion;
GO

PRINT '=== VERIFICANDO TRANSICION DEFINICION -> REVISION_ADMINISTRATIVA ==='

-- 1. Verificar si existe la transición para TECNICO
PRINT '1. TRANSICIONES ACTUALES PARA DEFINICION -> REVISION_ADMINISTRATIVA:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    rn.Codigo as RolNormalizado, 
    rn.Nombre as RolNombre,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND t.EstadoOrigenCodigo = 'DEFINICION' 
AND t.EstadoDestinoCodigo = 'REVISION_ADMINISTRATIVA'
ORDER BY rn.Codigo

-- 2. Verificar todas las transiciones desde DEFINICION
PRINT ''
PRINT '2. TODAS LAS TRANSICIONES DESDE DEFINICION:'
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    rn.Codigo as RolNormalizado, 
    rn.Nombre as RolNombre,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND t.EstadoOrigenCodigo = 'DEFINICION'
ORDER BY rn.Codigo, t.EstadoDestinoCodigo

-- 3. Verificar que existe el rol TECNICO
PRINT ''
PRINT '3. ROL TECNICO EN RolesNormalizados:'
SELECT Id, Codigo, Nombre FROM RolesNormalizados WHERE Codigo = 'TECNICO'

PRINT '=== FIN DE VERIFICACION ==='

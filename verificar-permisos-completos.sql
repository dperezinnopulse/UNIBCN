-- Script para verificar todos los permisos de edición del sistema
USE UB_Formacion;
GO

PRINT '=== ESTADOS ACTIVOS ==='
SELECT Id, Codigo, Nombre, Activo FROM EstadosActividad WHERE Activo = 1 ORDER BY Id

PRINT ''
PRINT '=== ROLES NORMALIZADOS ==='
SELECT Id, Codigo, Nombre FROM RolesNormalizados ORDER BY Id

PRINT ''
PRINT '=== TRANSICIONES POR ROL ==='
SELECT 
    t.EstadoOrigenCodigo,
    t.EstadoDestinoCodigo,
    rn.Codigo as RolNormalizado,
    rn.Nombre as RolNombre,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
ORDER BY t.EstadoOrigenCodigo, rn.Codigo, t.EstadoDestinoCodigo

PRINT ''
PRINT '=== RESUMEN DE PERMISOS POR ROL ==='
SELECT 
    rn.Codigo as RolNormalizado,
    rn.Nombre as RolNombre,
    COUNT(*) as TotalTransiciones,
    STRING_AGG(t.EstadoOrigenCodigo + '→' + t.EstadoDestinoCodigo, ', ') as Transiciones
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
GROUP BY rn.Codigo, rn.Nombre
ORDER BY rn.Codigo

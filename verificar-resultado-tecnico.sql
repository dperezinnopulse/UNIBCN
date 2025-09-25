-- Verificar que la transición se agregó correctamente
USE UB_Formacion;
GO

PRINT '=== VERIFICANDO TRANSICIONES PARA TECNICO ==='

-- Verificar todas las transiciones del TECNICO
SELECT 
    t.EstadoOrigenCodigo, 
    t.EstadoDestinoCodigo, 
    rn.Codigo as RolNormalizado, 
    rn.Nombre as RolNombre,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND rn.Codigo = 'TECNICO'
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

PRINT '=== FIN ==='

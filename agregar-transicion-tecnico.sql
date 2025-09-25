-- Agregar transición para técnico IDP de DEFINICION a REVISION_ADMINISTRATIVA
USE UB_Formacion;
GO

PRINT '=== AGREGANDO TRANSICION TECNICO: DEFINICION -> REVISION_ADMINISTRATIVA ==='

-- 1. Verificar que existe el rol TECNICO
DECLARE @TecnicoId INT = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'TECNICO');

IF @TecnicoId IS NULL
BEGIN
    PRINT 'ERROR: No se encontró el rol TECNICO en RolesNormalizados'
    RETURN
END

PRINT 'Rol TECNICO encontrado con ID: ' + CAST(@TecnicoId AS VARCHAR(10))

-- 2. Verificar si ya existe la transición
IF EXISTS (
    SELECT 1 FROM TransicionesEstado 
    WHERE EstadoOrigenCodigo = 'DEFINICION' 
    AND EstadoDestinoCodigo = 'REVISION_ADMINISTRATIVA' 
    AND RolPermitidoId = @TecnicoId 
    AND Activo = 1
)
BEGIN
    PRINT 'La transición ya existe para TECNICO: DEFINICION -> REVISION_ADMINISTRATIVA'
END
ELSE
BEGIN
    -- 3. Insertar la transición
    INSERT INTO TransicionesEstado (
        EstadoOrigenCodigo, 
        EstadoDestinoCodigo, 
        RolPermitidoId, 
        Accion, 
        Activo
    )
    VALUES (
        'DEFINICION', 
        'REVISION_ADMINISTRATIVA', 
        @TecnicoId, 
        'enviar', 
        1
    )
    
    PRINT 'Transición agregada exitosamente: TECNICO puede cambiar DEFINICION -> REVISION_ADMINISTRATIVA'
END

-- 4. Verificar el resultado
PRINT ''
PRINT 'TRANSICIONES FINALES DESDE DEFINICION:'
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

PRINT '=== TRANSICION AGREGADA ==='

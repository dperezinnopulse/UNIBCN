-- =====================================================
-- SCRIPT: Actualizar Transiciones de Workflow v2
-- Fecha: 2025-10-08
-- Descripción: Aplica las transiciones según la tabla proporcionada
-- NOTA: ELIMINA transiciones antiguas en lugar de desactivarlas
-- =====================================================

USE UB_Formacion;
GO

-- PASO 1: ELIMINAR todas las transiciones actuales
PRINT '1. Eliminando transiciones actuales...';
DELETE FROM TransicionesEstado;
GO

-- PASO 2: Resetear contador de identidad
DBCC CHECKIDENT ('TransicionesEstado', RESEED, 0);
GO

-- PASO 3: Crear nuevas transiciones según la tabla
PRINT '2. Creando transiciones según nueva configuración...';

-- ========== BORRADOR ==========
PRINT '  - Transiciones desde BORRADOR...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('BORRADOR', 'ENVIADA', 'Docente', 1),
    ('BORRADOR', 'ENVIADA', 'CoordinadorFormacion', 1),
    ('BORRADOR', 'ENVIADA', 'TecnicoFormacion', 1),
    ('BORRADOR', 'ENVIADA', 'Admin', 1),
    ('BORRADOR', 'EN_REVISION', 'Admin', 1),
    ('BORRADOR', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('BORRADOR', 'DEFINICION', 'Admin', 1),
    ('BORRADOR', 'REVISION_ADMIN', 'Admin', 1),
    ('BORRADOR', 'PUBLICADA', 'Admin', 1),
    ('BORRADOR', 'CANCELADA', 'Admin', 1),
    ('BORRADOR', 'RECHAZADA', 'Admin', 1);

-- ========== ENVIADA ==========
PRINT '  - Transiciones desde ENVIADA...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('ENVIADA', 'EN_REVISION', 'CoordinadorFormacion', 1),
    ('ENVIADA', 'RECHAZADA', 'CoordinadorFormacion', 1),
    ('ENVIADA', 'BORRADOR', 'Admin', 1),
    ('ENVIADA', 'EN_REVISION', 'Admin', 1),
    ('ENVIADA', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('ENVIADA', 'DEFINICION', 'Admin', 1),
    ('ENVIADA', 'REVISION_ADMIN', 'Admin', 1),
    ('ENVIADA', 'PUBLICADA', 'Admin', 1),
    ('ENVIADA', 'CANCELADA', 'Admin', 1),
    ('ENVIADA', 'RECHAZADA', 'Admin', 1);

-- ========== EN_REVISION ==========
PRINT '  - Transiciones desde EN_REVISION...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('EN_REVISION', 'RECHAZADA', 'CoordinadorFormacion', 1),
    ('EN_REVISION', 'ENVIADA', 'CoordinadorFormacion', 1),
    ('EN_REVISION', 'VALIDACION_UNIDAD', 'TecnicoFormacion', 1),
    ('EN_REVISION', 'RECHAZADA', 'TecnicoFormacion', 1),
    ('EN_REVISION', 'BORRADOR', 'Admin', 1),
    ('EN_REVISION', 'ENVIADA', 'Admin', 1),
    ('EN_REVISION', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('EN_REVISION', 'DEFINICION', 'Admin', 1),
    ('EN_REVISION', 'REVISION_ADMIN', 'Admin', 1),
    ('EN_REVISION', 'PUBLICADA', 'Admin', 1),
    ('EN_REVISION', 'CANCELADA', 'Admin', 1),
    ('EN_REVISION', 'RECHAZADA', 'Admin', 1);

-- ========== VALIDACION_UNIDAD ==========
PRINT '  - Transiciones desde VALIDACION_UNIDAD...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('VALIDACION_UNIDAD', 'DEFINICION', 'ResponsableUnidad', 1),
    ('VALIDACION_UNIDAD', 'EN_REVISION', 'ResponsableUnidad', 1),
    ('VALIDACION_UNIDAD', 'RECHAZADA', 'ResponsableUnidad', 1),
    ('VALIDACION_UNIDAD', 'BORRADOR', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'ENVIADA', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'EN_REVISION', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'DEFINICION', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'REVISION_ADMIN', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'PUBLICADA', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'CANCELADA', 'Admin', 1),
    ('VALIDACION_UNIDAD', 'RECHAZADA', 'Admin', 1);

-- ========== DEFINICION ==========
PRINT '  - Transiciones desde DEFINICION...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('DEFINICION', 'RECHAZADA', 'TecnicoFormacion', 1),
    ('DEFINICION', 'REVISION_ADMIN', 'TecnicoFormacion', 1),
    ('DEFINICION', 'BORRADOR', 'Admin', 1),
    ('DEFINICION', 'ENVIADA', 'Admin', 1),
    ('DEFINICION', 'EN_REVISION', 'Admin', 1),
    ('DEFINICION', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('DEFINICION', 'REVISION_ADMIN', 'Admin', 1),
    ('DEFINICION', 'PUBLICADA', 'Admin', 1),
    ('DEFINICION', 'CANCELADA', 'Admin', 1),
    ('DEFINICION', 'RECHAZADA', 'Admin', 1);

-- ========== REVISION_ADMIN ==========
PRINT '  - Transiciones desde REVISION_ADMIN...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('REVISION_ADMIN', 'PUBLICADA', 'SoporteAdmin', 1),
    ('REVISION_ADMIN', 'RECHAZADA', 'SoporteAdmin', 1),
    ('REVISION_ADMIN', 'DEFINICION', 'SoporteAdmin', 1),
    ('REVISION_ADMIN', 'BORRADOR', 'Admin', 1),
    ('REVISION_ADMIN', 'ENVIADA', 'Admin', 1),
    ('REVISION_ADMIN', 'EN_REVISION', 'Admin', 1),
    ('REVISION_ADMIN', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('REVISION_ADMIN', 'DEFINICION', 'Admin', 1),
    ('REVISION_ADMIN', 'PUBLICADA', 'Admin', 1),
    ('REVISION_ADMIN', 'CANCELADA', 'Admin', 1),
    ('REVISION_ADMIN', 'RECHAZADA', 'Admin', 1);

-- ========== PUBLICADA ==========
PRINT '  - Transiciones desde PUBLICADA...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('PUBLICADA', 'REVISION_ADMIN', 'SoporteAdmin', 1),
    ('PUBLICADA', 'DEFINICION', 'SoporteAdmin', 1),
    ('PUBLICADA', 'BORRADOR', 'Admin', 1),
    ('PUBLICADA', 'ENVIADA', 'Admin', 1),
    ('PUBLICADA', 'EN_REVISION', 'Admin', 1),
    ('PUBLICADA', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('PUBLICADA', 'DEFINICION', 'Admin', 1),
    ('PUBLICADA', 'REVISION_ADMIN', 'Admin', 1),
    ('PUBLICADA', 'CANCELADA', 'Admin', 1),
    ('PUBLICADA', 'RECHAZADA', 'Admin', 1);

-- ========== CANCELADA ==========
PRINT '  - Transiciones desde CANCELADA...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('CANCELADA', 'BORRADOR', 'Docente', 1),
    ('CANCELADA', 'BORRADOR', 'Admin', 1),
    ('CANCELADA', 'ENVIADA', 'Admin', 1),
    ('CANCELADA', 'EN_REVISION', 'Admin', 1),
    ('CANCELADA', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('CANCELADA', 'DEFINICION', 'Admin', 1),
    ('CANCELADA', 'REVISION_ADMIN', 'Admin', 1),
    ('CANCELADA', 'PUBLICADA', 'Admin', 1),
    ('CANCELADA', 'RECHAZADA', 'Admin', 1);

-- ========== RECHAZADA ==========
PRINT '  - Transiciones desde RECHAZADA...';

INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) VALUES 
    ('RECHAZADA', 'BORRADOR', 'Docente', 1),
    ('RECHAZADA', 'BORRADOR', 'Admin', 1),
    ('RECHAZADA', 'ENVIADA', 'Admin', 1),
    ('RECHAZADA', 'EN_REVISION', 'Admin', 1),
    ('RECHAZADA', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('RECHAZADA', 'DEFINICION', 'Admin', 1),
    ('RECHAZADA', 'REVISION_ADMIN', 'Admin', 1),
    ('RECHAZADA', 'PUBLICADA', 'Admin', 1),
    ('RECHAZADA', 'CANCELADA', 'Admin', 1);

GO

-- PASO 4: Verificar resultados
PRINT '';
PRINT '=== VERIFICACIÓN DE TRANSICIONES ===';
PRINT '';

PRINT 'Total de transiciones activas:';
SELECT COUNT(*) AS Total FROM TransicionesEstado WHERE Activo = 1;

PRINT '';
PRINT 'Transiciones por rol:';
SELECT RolPermitido, COUNT(*) AS Total 
FROM TransicionesEstado 
WHERE Activo = 1 
GROUP BY RolPermitido 
ORDER BY Total DESC;

PRINT '';
PRINT 'Transiciones por estado origen:';
SELECT EstadoOrigenCodigo, COUNT(*) AS Total 
FROM TransicionesEstado 
WHERE Activo = 1 
GROUP BY EstadoOrigenCodigo 
ORDER BY Total DESC;

PRINT '';
PRINT 'DETALLE: Transiciones específicas por rol (muestra de verificación):';
SELECT EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido
FROM TransicionesEstado 
WHERE Activo = 1
ORDER BY RolPermitido, EstadoOrigenCodigo, EstadoDestinoCodigo;

PRINT '';
PRINT '✅ SCRIPT COMPLETADO EXITOSAMENTE';
PRINT 'Total de transiciones creadas: Se mostrará arriba';
GO

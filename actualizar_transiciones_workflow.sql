-- =====================================================
-- SCRIPT: Actualizar Transiciones de Workflow
-- Fecha: 2025-10-08
-- Descripción: Aplica las transiciones según la tabla proporcionada
-- =====================================================

USE UB_Formacion;
GO

-- PASO 1: Desactivar todas las transiciones actuales (mantenemos histórico)
PRINT '1. Desactivando transiciones actuales...';
UPDATE TransicionesEstado SET Activo = 0;
GO

-- PASO 2: Crear nuevas transiciones según la tabla
PRINT '2. Creando transiciones según nueva configuración...';

-- ========== BORRADOR ==========
PRINT '  - Transiciones desde BORRADOR...';

-- Docente: BORRADOR → ENVIADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES ('BORRADOR', 'ENVIADA', 'Docente', 1);

-- Coordinador: BORRADOR → ENVIADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES ('BORRADOR', 'ENVIADA', 'CoordinadorFormacion', 1);

-- Técnico: BORRADOR → ENVIADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES ('BORRADOR', 'ENVIADA', 'TecnicoFormacion', 1);

-- Admin: BORRADOR → TODAS (ENVIADA, EN_REVISION, VALIDACION_UNIDAD, DEFINICION, REVISION_ADMIN, PUBLICADA, CANCELADA, RECHAZADA)
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Coordinador: ENVIADA → EN_REVISION, RECHAZADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('ENVIADA', 'EN_REVISION', 'CoordinadorFormacion', 1),
    ('ENVIADA', 'RECHAZADA', 'CoordinadorFormacion', 1);

-- Admin: ENVIADA → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Coordinador: EN_REVISION → RECHAZADA, ENVIADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('EN_REVISION', 'RECHAZADA', 'CoordinadorFormacion', 1),
    ('EN_REVISION', 'ENVIADA', 'CoordinadorFormacion', 1);

-- Técnico: EN_REVISION → VALIDACION_UNIDAD, RECHAZADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('EN_REVISION', 'VALIDACION_UNIDAD', 'TecnicoFormacion', 1),
    ('EN_REVISION', 'RECHAZADA', 'TecnicoFormacion', 1);

-- Admin: EN_REVISION → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Responsable: VALIDACION_UNIDAD → DEFINICION, EN_REVISION, RECHAZADA
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('VALIDACION_UNIDAD', 'DEFINICION', 'ResponsableUnidad', 1),
    ('VALIDACION_UNIDAD', 'EN_REVISION', 'ResponsableUnidad', 1),
    ('VALIDACION_UNIDAD', 'RECHAZADA', 'ResponsableUnidad', 1);

-- Admin: VALIDACION_UNIDAD → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Técnico: DEFINICION → RECHAZADA, REVISION_ADMIN
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('DEFINICION', 'RECHAZADA', 'TecnicoFormacion', 1),
    ('DEFINICION', 'REVISION_ADMIN', 'TecnicoFormacion', 1);

-- Admin: DEFINICION → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Soporte: REVISION_ADMIN → PUBLICADA, RECHAZADA, DEFINICION
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('REVISION_ADMIN', 'PUBLICADA', 'SoporteAdmin', 1),
    ('REVISION_ADMIN', 'RECHAZADA', 'SoporteAdmin', 1),
    ('REVISION_ADMIN', 'DEFINICION', 'SoporteAdmin', 1);

-- Admin: REVISION_ADMIN → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Soporte: PUBLICADA → REVISION_ADMIN, DEFINICION
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('PUBLICADA', 'REVISION_ADMIN', 'SoporteAdmin', 1),
    ('PUBLICADA', 'DEFINICION', 'SoporteAdmin', 1);

-- Admin: PUBLICADA → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Docente: CANCELADA → BORRADOR
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES ('CANCELADA', 'BORRADOR', 'Docente', 1);

-- Admin: CANCELADA → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
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

-- Docente: RECHAZADA → BORRADOR
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES ('RECHAZADA', 'BORRADOR', 'Docente', 1);

-- Admin: RECHAZADA → TODAS
INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Activo) 
VALUES 
    ('RECHAZADA', 'BORRADOR', 'Admin', 1),
    ('RECHAZADA', 'ENVIADA', 'Admin', 1),
    ('RECHAZADA', 'EN_REVISION', 'Admin', 1),
    ('RECHAZADA', 'VALIDACION_UNIDAD', 'Admin', 1),
    ('RECHAZADA', 'DEFINICION', 'Admin', 1),
    ('RECHAZADA', 'REVISION_ADMIN', 'Admin', 1),
    ('RECHAZADA', 'PUBLICADA', 'Admin', 1),
    ('RECHAZADA', 'CANCELADA', 'Admin', 1);

GO

-- PASO 3: Verificar resultados
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
PRINT '✅ SCRIPT COMPLETADO EXITOSAMENTE';
GO

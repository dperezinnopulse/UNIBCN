-- =====================================================
-- SCRIPT: Crear Tabla de Permisos de Edición
-- Fecha: 2025-10-08
-- Descripción: Crea tabla PermisosEdicion y la puebla con la matriz de permisos
-- =====================================================

USE UB_Formacion;
GO

-- PASO 1: Crear tabla si no existe
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PermisosEdicion')
BEGIN
    PRINT '1. Creando tabla PermisosEdicion...';
    
    CREATE TABLE PermisosEdicion (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        EstadoCodigo NVARCHAR(50) NOT NULL,
        RolOriginal NVARCHAR(100) NOT NULL,
        PuedeEditar BIT NOT NULL DEFAULT 0,
        Activo BIT NOT NULL DEFAULT 1,
        FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT UQ_Permiso_Estado_Rol UNIQUE (EstadoCodigo, RolOriginal)
    );
    
    PRINT '   ✅ Tabla creada exitosamente';
END
ELSE
BEGIN
    PRINT '   ℹ️ Tabla ya existe, limpiando datos antiguos...';
    DELETE FROM PermisosEdicion;
    DBCC CHECKIDENT ('PermisosEdicion', RESEED, 0);
END
GO

-- PASO 2: Insertar permisos según la matriz
PRINT '2. Insertando permisos de edición...';

INSERT INTO PermisosEdicion (EstadoCodigo, RolOriginal, PuedeEditar, Activo) VALUES
-- BORRADOR: Docente, Coordinador, Técnico, Admin
('BORRADOR', 'Docente', 1, 1),
('BORRADOR', 'CoordinadorFormacion', 1, 1),
('BORRADOR', 'TecnicoFormacion', 1, 1),
('BORRADOR', 'ResponsableUnidad', 0, 1),
('BORRADOR', 'SoporteAdmin', 0, 1),
('BORRADOR', 'Admin', 1, 1),

-- ENVIADA: Coordinador, Técnico, Admin
('ENVIADA', 'Docente', 0, 1),
('ENVIADA', 'CoordinadorFormacion', 1, 1),
('ENVIADA', 'TecnicoFormacion', 1, 1),
('ENVIADA', 'ResponsableUnidad', 0, 1),
('ENVIADA', 'SoporteAdmin', 0, 1),
('ENVIADA', 'Admin', 1, 1),

-- EN_REVISION: Coordinador, Técnico, Admin
('EN_REVISION', 'Docente', 0, 1),
('EN_REVISION', 'CoordinadorFormacion', 1, 1),
('EN_REVISION', 'TecnicoFormacion', 1, 1),
('EN_REVISION', 'ResponsableUnidad', 0, 1),
('EN_REVISION', 'SoporteAdmin', 0, 1),
('EN_REVISION', 'Admin', 1, 1),

-- VALIDACION_UNIDAD: Responsable, Admin
('VALIDACION_UNIDAD', 'Docente', 0, 1),
('VALIDACION_UNIDAD', 'CoordinadorFormacion', 0, 1),
('VALIDACION_UNIDAD', 'TecnicoFormacion', 0, 1),
('VALIDACION_UNIDAD', 'ResponsableUnidad', 1, 1),
('VALIDACION_UNIDAD', 'SoporteAdmin', 0, 1),
('VALIDACION_UNIDAD', 'Admin', 1, 1),

-- DEFINICION: Técnico, Admin
('DEFINICION', 'Docente', 0, 1),
('DEFINICION', 'CoordinadorFormacion', 0, 1),
('DEFINICION', 'TecnicoFormacion', 1, 1),
('DEFINICION', 'ResponsableUnidad', 0, 1),
('DEFINICION', 'SoporteAdmin', 0, 1),
('DEFINICION', 'Admin', 1, 1),

-- REVISION_ADMIN: Soporte, Admin
('REVISION_ADMIN', 'Docente', 0, 1),
('REVISION_ADMIN', 'CoordinadorFormacion', 0, 1),
('REVISION_ADMIN', 'TecnicoFormacion', 0, 1),
('REVISION_ADMIN', 'ResponsableUnidad', 0, 1),
('REVISION_ADMIN', 'SoporteAdmin', 1, 1),
('REVISION_ADMIN', 'Admin', 1, 1),

-- PUBLICADA: Soporte, Admin
('PUBLICADA', 'Docente', 0, 1),
('PUBLICADA', 'CoordinadorFormacion', 0, 1),
('PUBLICADA', 'TecnicoFormacion', 0, 1),
('PUBLICADA', 'ResponsableUnidad', 0, 1),
('PUBLICADA', 'SoporteAdmin', 1, 1),
('PUBLICADA', 'Admin', 1, 1),

-- CANCELADA: Solo Admin
('CANCELADA', 'Docente', 0, 1),
('CANCELADA', 'CoordinadorFormacion', 0, 1),
('CANCELADA', 'TecnicoFormacion', 0, 1),
('CANCELADA', 'ResponsableUnidad', 0, 1),
('CANCELADA', 'SoporteAdmin', 0, 1),
('CANCELADA', 'Admin', 1, 1),

-- RECHAZADA: Solo Admin
('RECHAZADA', 'Docente', 0, 1),
('RECHAZADA', 'CoordinadorFormacion', 0, 1),
('RECHAZADA', 'TecnicoFormacion', 0, 1),
('RECHAZADA', 'ResponsableUnidad', 0, 1),
('RECHAZADA', 'SoporteAdmin', 0, 1),
('RECHAZADA', 'Admin', 1, 1);

GO

-- PASO 3: Verificar
PRINT '';
PRINT '=== VERIFICACIÓN DE PERMISOS ===';
PRINT '';

PRINT 'Total de permisos creados:';
SELECT COUNT(*) AS Total FROM PermisosEdicion;

PRINT '';
PRINT 'Permisos de edición por rol (solo los que SÍ pueden editar):';
SELECT RolOriginal, COUNT(*) AS Estados_Puede_Editar
FROM PermisosEdicion 
WHERE PuedeEditar = 1 AND Activo = 1
GROUP BY RolOriginal
ORDER BY Estados_Puede_Editar DESC;

PRINT '';
PRINT 'Permisos de edición por estado (cuántos roles pueden editar cada estado):';
SELECT EstadoCodigo, COUNT(*) AS Roles_Pueden_Editar
FROM PermisosEdicion 
WHERE PuedeEditar = 1 AND Activo = 1
GROUP BY EstadoCodigo
ORDER BY Roles_Pueden_Editar DESC;

PRINT '';
PRINT '✅ TABLA DE PERMISOS CREADA Y POBLADA EXITOSAMENTE';
GO

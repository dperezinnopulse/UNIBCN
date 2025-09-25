USE [UB_Formacion];
GO

-- Script para añadir nuevos campos a la tabla Actividades
-- Basado en la tabla de campos proporcionada

PRINT 'Iniciando script para añadir campos de actividad...';

-- 1. Crear tabla Dominios si no existe
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Dominios]') AND type in (N'U'))
BEGIN
    PRINT 'Creando tabla [dbo].[Dominios]...';
    CREATE TABLE [dbo].[Dominios] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Nombre] NVARCHAR(255) NOT NULL UNIQUE,
        [Descripcion] NVARCHAR(500) NULL,
        [Activo] BIT NOT NULL DEFAULT 1,
        [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] DATETIME2 NULL
    );
    PRINT 'Tabla [dbo].[Dominios] creada.';
END
ELSE
BEGIN
    PRINT 'Tabla [dbo].[Dominios] ya existe.';
END;
GO

-- 2. Crear tabla ValoresDominio si no existe
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ValoresDominio]') AND type in (N'U'))
BEGIN
    PRINT 'Creando tabla [dbo].[ValoresDominio]...';
    CREATE TABLE [dbo].[ValoresDominio] (
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [DominioId] INT NOT NULL,
        [Valor] NVARCHAR(255) NOT NULL,
        [Descripcion] NVARCHAR(500) NULL,
        [Orden] INT NULL,
        [Activo] BIT NOT NULL DEFAULT 1,
        [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [FechaModificacion] DATETIME2 NULL,
        CONSTRAINT FK_ValoresDominio_Dominios FOREIGN KEY ([DominioId]) REFERENCES [dbo].[Dominios]([Id])
    );
    PRINT 'Tabla [dbo].[ValoresDominio] creada.';
END
ELSE
BEGIN
    PRINT 'Tabla [dbo].[ValoresDominio] ya existe.';
END;
GO

-- 3. Añadir columnas a la tabla Actividades
PRINT 'Añadiendo columnas a la tabla [dbo].[Actividades]...';

-- INFORMACIÓN GENERAL
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Preinscripcion')
    ALTER TABLE [dbo].[Actividades] ADD [Preinscripcion] BIT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EstadoActividad')
    ALTER TABLE [dbo].[Actividades] ADD [EstadoActividad] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'AsignaturaId')
    ALTER TABLE [dbo].[Actividades] ADD [AsignaturaId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'GrupoAsignatura')
    ALTER TABLE [dbo].[Actividades] ADD [GrupoAsignatura] NVARCHAR(150) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'DisciplinaRelacionadaId')
    ALTER TABLE [dbo].[Actividades] ADD [DisciplinaRelacionadaId] INT NULL;

-- PROGRAMA
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Metodologia')
    ALTER TABLE [dbo].[Actividades] ADD [Metodologia] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'SistemaEvaluacion')
    ALTER TABLE [dbo].[Actividades] ADD [SistemaEvaluacion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'HorarioYCalendario')
    ALTER TABLE [dbo].[Actividades] ADD [HorarioYCalendario] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'IdiomaImparticionId')
    ALTER TABLE [dbo].[Actividades] ADD [IdiomaImparticionId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TiposCertificacionId')
    ALTER TABLE [dbo].[Actividades] ADD [TiposCertificacionId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Observaciones')
    ALTER TABLE [dbo].[Actividades] ADD [Observaciones] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'MateriaDisciplinaId')
    ALTER TABLE [dbo].[Actividades] ADD [MateriaDisciplinaId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EspacioImparticion')
    ALTER TABLE [dbo].[Actividades] ADD [EspacioImparticion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'LugarImparticion')
    ALTER TABLE [dbo].[Actividades] ADD [LugarImparticion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'OtrasUbicaciones')
    ALTER TABLE [dbo].[Actividades] ADD [OtrasUbicaciones] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'UrlPlataformaVirtual')
    ALTER TABLE [dbo].[Actividades] ADD [UrlPlataformaVirtual] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'UrlCuestionarioSatisfaccion')
    ALTER TABLE [dbo].[Actividades] ADD [UrlCuestionarioSatisfaccion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'AmbitoFormacionId')
    ALTER TABLE [dbo].[Actividades] ADD [AmbitoFormacionId] INT NULL;

-- IMPORTE Y DESCUENTOS
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'CosteEstimadoActividad')
    ALTER TABLE [dbo].[Actividades] ADD [CosteEstimadoActividad] DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TiposFinanciacionId')
    ALTER TABLE [dbo].[Actividades] ADD [TiposFinanciacionId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'AnoInicialFinanciacion')
    ALTER TABLE [dbo].[Actividades] ADD [AnoInicialFinanciacion] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'AnoFinalFinanciacion')
    ALTER TABLE [dbo].[Actividades] ADD [AnoFinalFinanciacion] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'PlazasAfectadasDescuento')
    ALTER TABLE [dbo].[Actividades] ADD [PlazasAfectadasDescuento] INT NULL;

-- INSCRIPCION
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'FechaLimitePago')
    ALTER TABLE [dbo].[Actividades] ADD [FechaLimitePago] DATE NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TPV')
    ALTER TABLE [dbo].[Actividades] ADD [TPV] BIT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Remesa')
    ALTER TABLE [dbo].[Actividades] ADD [Remesa] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TiposInscripcionId')
    ALTER TABLE [dbo].[Actividades] ADD [TiposInscripcionId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'FechaAdjudicacionPreinscripcion')
    ALTER TABLE [dbo].[Actividades] ADD [FechaAdjudicacionPreinscripcion] DATE NULL;

PRINT 'Columnas añadidas a la tabla [dbo].[Actividades].';
GO

-- 4. Crear tabla de unión para Denominación del Descuento (selección múltiple)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ActividadDenominacionDescuento]') AND type in (N'U'))
BEGIN
    PRINT 'Creando tabla [dbo].[ActividadDenominacionDescuento]...';
    CREATE TABLE [dbo].[ActividadDenominacionDescuento] (
        [ActividadId] INT NOT NULL,
        [DenominacionDescuentoId] INT NOT NULL,
        [FechaCreacion] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        PRIMARY KEY ([ActividadId], [DenominacionDescuentoId]),
        CONSTRAINT FK_ActividadDenominacionDescuento_Actividad FOREIGN KEY ([ActividadId]) REFERENCES [dbo].[Actividades]([Id]) ON DELETE CASCADE,
        CONSTRAINT FK_ActividadDenominacionDescuento_DenominacionDescuento FOREIGN KEY ([DenominacionDescuentoId]) REFERENCES [dbo].[ValoresDominio]([Id])
    );
    PRINT 'Tabla [dbo].[ActividadDenominacionDescuento] creada.';
END
ELSE
BEGIN
    PRINT 'Tabla [dbo].[ActividadDenominacionDescuento] ya existe.';
END;
GO

-- 5. Añadir claves foráneas
PRINT 'Añadiendo claves foráneas...';

-- Claves foráneas para campos de dominio
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_Asignatura')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_Asignatura FOREIGN KEY ([AsignaturaId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_DisciplinaRelacionada')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_DisciplinaRelacionada FOREIGN KEY ([DisciplinaRelacionadaId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_IdiomaImparticion')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_IdiomaImparticion FOREIGN KEY ([IdiomaImparticionId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_TiposCertificacion')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_TiposCertificacion FOREIGN KEY ([TiposCertificacionId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_MateriaDisciplina')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_MateriaDisciplina FOREIGN KEY ([MateriaDisciplinaId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_AmbitoFormacion')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_AmbitoFormacion FOREIGN KEY ([AmbitoFormacionId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_TiposFinanciacion')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_TiposFinanciacion FOREIGN KEY ([TiposFinanciacionId]) REFERENCES [dbo].[ValoresDominio]([Id]);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_TiposInscripcion')
    ALTER TABLE [dbo].[Actividades] ADD CONSTRAINT FK_Actividades_TiposInscripcion FOREIGN KEY ([TiposInscripcionId]) REFERENCES [dbo].[ValoresDominio]([Id]);

PRINT 'Claves foráneas añadidas.';
GO

-- 6. Insertar dominios y valores iniciales
PRINT 'Insertando dominios y valores iniciales...';

DECLARE @DominioId INT;

-- Asignatura (tabla 28)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'Asignatura')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('Asignatura', 'Dominio para asignaturas CRAI');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'Asignatura', 'Valor inicial para asignaturas', 1);
    PRINT 'Dominio "Asignatura" creado.';
END;

-- DisciplinaRelacionada (tabla 24)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'DisciplinaRelacionada')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('DisciplinaRelacionada', 'Dominio para disciplinas relacionadas');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'DisciplinaRelacionada', 'Valor inicial para disciplinas relacionadas', 1);
    PRINT 'Dominio "DisciplinaRelacionada" creado.';
END;

-- IdiomaImparticion (tabla 19)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'IdiomaImparticion')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('IdiomaImparticion', 'Dominio para idiomas de impartición');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'IdiomaImparticion', 'Valor inicial para idiomas de impartición', 1);
    PRINT 'Dominio "IdiomaImparticion" creado.';
END;

-- TiposCertificacion (tabla 12)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'TiposCertificacion')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('TiposCertificacion', 'Dominio para tipos de certificación');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'TiposCertificacion', 'Valor inicial para tipos de certificación', 1);
    PRINT 'Dominio "TiposCertificacion" creado.';
END;

-- MateriaDisciplina (tabla 24)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'MateriaDisciplina')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('MateriaDisciplina', 'Dominio para materias y disciplinas');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'MateriaDisciplina', 'Valor inicial para materias y disciplinas', 1);
    PRINT 'Dominio "MateriaDisciplina" creado.';
END;

-- AmbitoFormacion (tabla 14)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'AmbitoFormacion')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('AmbitoFormacion', 'Dominio para ámbitos de formación IDP');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'AmbitoFormacion', 'Valor inicial para ámbitos de formación', 1);
    PRINT 'Dominio "AmbitoFormacion" creado.';
END;

-- TiposFinanciacion (tabla 13)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'TiposFinanciacion')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('TiposFinanciacion', 'Dominio para tipos de financiación');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'TiposFinanciacion', 'Valor inicial para tipos de financiación', 1);
    PRINT 'Dominio "TiposFinanciacion" creado.';
END;

-- DenominacionDescuento (tabla 20)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'DenominacionDescuento')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('DenominacionDescuento', 'Dominio para denominaciones de descuento');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'DenominacionDescuento', 'Valor inicial para denominaciones de descuento', 1);
    PRINT 'Dominio "DenominacionDescuento" creado.';
END;

-- TiposInscripcion (tabla 16)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'TiposInscripcion')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('TiposInscripcion', 'Dominio para tipos de inscripción');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES (@DominioId, 'TiposInscripcion', 'Valor inicial para tipos de inscripción', 1);
    PRINT 'Dominio "TiposInscripcion" creado.';
END;

PRINT 'Dominios y valores iniciales insertados.';
GO

-- 7. Insertar valores para Remesa (lista fija)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'Remesa')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('Remesa', 'Dominio para tipos de remesa');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES 
        (@DominioId, 'Remesa1', 'Primera remesa', 1),
        (@DominioId, 'Remesa2', 'Segunda remesa', 2),
        (@DominioId, 'Remesa3', 'Tercera remesa', 3);
    PRINT 'Dominio "Remesa" con valores creado.';
END;

-- 8. Insertar valores para EstadoActividad (lista fija)
IF NOT EXISTS (SELECT 1 FROM [dbo].[Dominios] WHERE [Nombre] = 'EstadoActividad')
BEGIN
    INSERT INTO [dbo].[Dominios] ([Nombre], [Descripcion]) VALUES ('EstadoActividad', 'Dominio para estados de actividad');
    SET @DominioId = SCOPE_IDENTITY();
    INSERT INTO [dbo].[ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden]) VALUES 
        (@DominioId, 'Abierta', 'Actividad abierta', 1),
        (@DominioId, 'Cerrada', 'Actividad cerrada', 2);
    PRINT 'Dominio "EstadoActividad" con valores creado.';
END;

PRINT 'Script completado exitosamente.';
GO

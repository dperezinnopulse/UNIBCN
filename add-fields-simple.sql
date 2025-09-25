USE [UB_Formacion];
GO

-- Agregar campos nuevos a la tabla Actividades
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Metodologia')
    ALTER TABLE [dbo].[Actividades] ADD [Metodologia] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'SistemaEvaluacion')
    ALTER TABLE [dbo].[Actividades] ADD [SistemaEvaluacion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'HorarioYCalendario')
    ALTER TABLE [dbo].[Actividades] ADD [HorarioYCalendario] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Observaciones')
    ALTER TABLE [dbo].[Actividades] ADD [Observaciones] NVARCHAR(MAX) NULL;

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

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'CosteEstimadoActividad')
    ALTER TABLE [dbo].[Actividades] ADD [CosteEstimadoActividad] DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EstadoActividad')
    ALTER TABLE [dbo].[Actividades] ADD [EstadoActividad] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Remesa')
    ALTER TABLE [dbo].[Actividades] ADD [Remesa] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TiposInscripcionId')
    ALTER TABLE [dbo].[Actividades] ADD [TiposInscripcionId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'FechaAdjudicacionPreinscripcion')
    ALTER TABLE [dbo].[Actividades] ADD [FechaAdjudicacionPreinscripcion] DATE NULL;

PRINT 'Campos agregados exitosamente a la tabla Actividades';
GO

-- Script para crear la tabla faltante ActividadDenominacionDescuento
USE UB_Formacion;
GO

-- Crear tabla de unión para Denominación del Descuento (selección múltiple)
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

-- Verificar que la tabla se creó correctamente
SELECT COUNT(*) as TablaExiste FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ActividadDenominacionDescuento';
GO

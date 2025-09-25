USE [UB_Formacion];
GO

-- Script para corregir los errores de variables @DominioId
-- Ejecutar solo las partes que fallaron

PRINT 'Corrigiendo errores de variables @DominioId...';

-- 7. Insertar valores para Remesa (lista fija)
DECLARE @DominioId INT;

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

PRINT 'Corrección completada exitosamente.';
GO

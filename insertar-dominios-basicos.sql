-- Script para insertar dominios básicos necesarios
USE [UB_Actividad1];

-- Insertar dominios
INSERT INTO [Dominios] ([Nombre], [Descripcion], [Activo], [FechaCreacion], [FechaModificacion]) VALUES
('UNIDADES_GESTION', 'Unidades de gestión de la UB', 1, GETDATE(), GETDATE()),
('CENTROS_UB', 'Centros y unidades de la UB', 1, GETDATE(), GETDATE()),
('TIPUS_ESTUDI_SAE', 'Tipos de estudio SAE', 1, GETDATE(), GETDATE()),
('CATEGORIA_SAE', 'Categorías SAE', 1, GETDATE(), GETDATE()),
('CENTRO_TRABAJO_REQUERIDO', 'Centros de trabajo requeridos', 1, GETDATE(), GETDATE());

-- Obtener los IDs de los dominios insertados
DECLARE @UNIDADES_GESTION_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'UNIDADES_GESTION');
DECLARE @CENTROS_UB_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'CENTROS_UB');
DECLARE @TIPUS_ESTUDI_SAE_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPUS_ESTUDI_SAE');
DECLARE @CATEGORIA_SAE_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'CATEGORIA_SAE');
DECLARE @CENTRO_TRABAJO_REQUERIDO_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'CENTRO_TRABAJO_REQUERIDO');

-- UNIDADES_GESTION
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@UNIDADES_GESTION_ID, 'IDP', 'Institut de Desenvolupament Professional', 1, 1),
(@UNIDADES_GESTION_ID, 'CRAI', 'Centre de Recursos per a l''Aprenentatge i la Investigació', 2, 1),
(@UNIDADES_GESTION_ID, 'SAE', 'Servei d''Activitats Extraordinàries', 3, 1);

-- CENTROS_UB
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@CENTROS_UB_ID, 'Facultat d''Informàtica', 'Facultad de Informática', 1, 1),
(@CENTROS_UB_ID, 'Facultat de Matemàtiques', 'Facultad de Matemáticas', 2, 1),
(@CENTROS_UB_ID, 'Facultat de Física', 'Facultad de Física', 3, 1);

-- TIPUS_ESTUDI_SAE
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@TIPUS_ESTUDI_SAE_ID, 'Grau', 'Grado', 1, 1),
(@TIPUS_ESTUDI_SAE_ID, 'Master', 'Máster', 2, 1),
(@TIPUS_ESTUDI_SAE_ID, 'Doctorat', 'Doctorado', 3, 1);

-- CATEGORIA_SAE
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@CATEGORIA_SAE_ID, 'Bàsic', 'Básico', 1, 1),
(@CATEGORIA_SAE_ID, 'Avancat', 'Avanzado', 2, 1),
(@CATEGORIA_SAE_ID, 'Especialitzat', 'Especializado', 3, 1);

-- CENTRO_TRABAJO_REQUERIDO
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@CENTRO_TRABAJO_REQUERIDO_ID, 'Si', 'Sí', 1, 1),
(@CENTRO_TRABAJO_REQUERIDO_ID, 'No', 'No', 2, 1);

-- Verificar los datos insertados
SELECT 'Dominios insertados:' as Info;
SELECT * FROM Dominios WHERE Nombre IN ('UNIDADES_GESTION', 'CENTROS_UB', 'TIPUS_ESTUDI_SAE', 'CATEGORIA_SAE', 'CENTRO_TRABAJO_REQUERIDO');

SELECT 'Valores de dominio insertados:' as Info;
SELECT d.Nombre as Dominio, v.Valor, v.Descripcion 
FROM ValoresDominio v 
JOIN Dominios d ON v.DominioId = d.Id 
WHERE d.Nombre IN ('UNIDADES_GESTION', 'CENTROS_UB', 'TIPUS_ESTUDI_SAE', 'CATEGORIA_SAE', 'CENTRO_TRABAJO_REQUERIDO')
ORDER BY d.Nombre, v.Orden;

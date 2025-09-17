-- Script para reinsertar dominios con codificación UTF-8 correcta
-- Primero borrar todos los datos existentes
USE [UB_Formacion];

-- Borrar todos los valores de dominio
DELETE FROM [ValoresDominio];
DELETE FROM [Dominios];

-- Resetear los contadores de identidad
DBCC CHECKIDENT ('Dominios', RESEED, 0);
DBCC CHECKIDENT ('ValoresDominio', RESEED, 0);

-- Insertar dominios
INSERT INTO [Dominios] ([Nombre], [Descripcion], [Activo], [FechaCreacion], [FechaModificacion]) VALUES
('TIPOS_ACTIVIDAD', 'Tipos de actividades disponibles', 1, GETDATE(), GETDATE()),
('LINEAS_ESTRATEGICAS', 'Líneas estratégicas de la universidad', 1, GETDATE(), GETDATE()),
('ACTIVIDADES_RESERVADAS', 'Tipos de actividades reservadas', 1, GETDATE(), GETDATE()),
('MODALIDADES_GESTION', 'Modalidades de gestión de actividades', 1, GETDATE(), GETDATE()),
('CENTROS_UB', 'Centros y unidades de la UB', 1, GETDATE(), GETDATE()),
('TIPOS_IMPUESTO', 'Tipos de impuestos aplicables', 1, GETDATE(), GETDATE());

-- Obtener los IDs de los dominios
DECLARE @TIPOS_ACTIVIDAD_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_ACTIVIDAD');
DECLARE @LINEAS_ESTRATEGICAS_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'LINEAS_ESTRATEGICAS');
DECLARE @ACTIVIDADES_RESERVADAS_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'ACTIVIDADES_RESERVADAS');
DECLARE @MODALIDADES_GESTION_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'MODALIDADES_GESTION');
DECLARE @CENTROS_UB_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'CENTROS_UB');
DECLARE @TIPOS_IMPUESTO_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_IMPUESTO');

-- Insertar valores de dominio con codificación UTF-8 correcta
-- TIPOS_ACTIVIDAD
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@TIPOS_ACTIVIDAD_ID, N'Jornada', N'Jornada de trabajo o presentación', 1, 1),
(@TIPOS_ACTIVIDAD_ID, N'Curso', N'Curso de formación', 2, 1),
(@TIPOS_ACTIVIDAD_ID, N'Seminario', N'Seminario especializado', 3, 1),
(@TIPOS_ACTIVIDAD_ID, N'Conferencia', N'Conferencia académica', 4, 1),
(@TIPOS_ACTIVIDAD_ID, N'Taller', N'Taller práctico', 5, 1),
(@TIPOS_ACTIVIDAD_ID, N'Congreso', N'Congreso científico', 6, 1),
(@TIPOS_ACTIVIDAD_ID, N'Máster', N'Programa de máster', 7, 1),
(@TIPOS_ACTIVIDAD_ID, N'Posgrado', N'Programa de posgrado', 8, 1);

-- LINEAS_ESTRATEGICAS
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@LINEAS_ESTRATEGICAS_ID, N'Línea 1', N'Innovación y desarrollo tecnológico', 1, 1),
(@LINEAS_ESTRATEGICAS_ID, N'Línea 2', N'Investigación aplicada', 2, 1),
(@LINEAS_ESTRATEGICAS_ID, N'Línea 3', N'Formación continua', 3, 1),
(@LINEAS_ESTRATEGICAS_ID, N'Línea 4', N'Cooperación internacional', 4, 1),
(@LINEAS_ESTRATEGICAS_ID, N'Línea 5', N'Transferencia de conocimiento', 5, 1);

-- ACTIVIDADES_RESERVADAS
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@ACTIVIDADES_RESERVADAS_ID, N'PDI', N'Personal Docente e Investigador', 1, 1),
(@ACTIVIDADES_RESERVADAS_ID, N'PAS', N'Personal de Administración y Servicios', 2, 1),
(@ACTIVIDADES_RESERVADAS_ID, N'Estudiantes', N'Estudiantes de la UB', 3, 1),
(@ACTIVIDADES_RESERVADAS_ID, N'Público', N'Público general', 4, 1);

-- MODALIDADES_GESTION
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@MODALIDADES_GESTION_ID, N'Acreditada UB', N'Actividad acreditada por la UB', 1, 1),
(@MODALIDADES_GESTION_ID, N'Externa', N'Actividad gestionada externamente', 2, 1),
(@MODALIDADES_GESTION_ID, N'Mixta', N'Gestión mixta UB-Externa', 3, 1);

-- CENTROS_UB
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@CENTROS_UB_ID, N'Facultad de Informática', N'Facultad de Informática de Barcelona', 1, 1),
(@CENTROS_UB_ID, N'Facultad de Matemáticas', N'Facultad de Matemáticas', 2, 1),
(@CENTROS_UB_ID, N'Facultad de Física', N'Facultad de Física', 3, 1),
(@CENTROS_UB_ID, N'Facultad de Química', N'Facultad de Química', 4, 1),
(@CENTROS_UB_ID, N'Facultad de Biología', N'Facultad de Biología', 5, 1),
(@CENTROS_UB_ID, N'Facultad de Medicina', N'Facultad de Medicina', 6, 1),
(@CENTROS_UB_ID, N'Facultad de Derecho', N'Facultad de Derecho', 7, 1),
(@CENTROS_UB_ID, N'Facultad de Economía', N'Facultad de Economía y Empresa', 8, 1),
(@CENTROS_UB_ID, N'Facultad de Filología', N'Facultad de Filología', 9, 1),
(@CENTROS_UB_ID, N'Facultad de Historia', N'Facultad de Geografía e Historia', 10, 1);

-- TIPOS_IMPUESTO
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@TIPOS_IMPUESTO_ID, N'Exento', N'Actividad exenta de impuestos', 1, 1),
(@TIPOS_IMPUESTO_ID, N'IVA 21%', N'Impuesto sobre el Valor Añadido 21%', 2, 1),
(@TIPOS_IMPUESTO_ID, N'IVA 10%', N'Impuesto sobre el Valor Añadido 10%', 3, 1),
(@TIPOS_IMPUESTO_ID, N'IVA 4%', N'Impuesto sobre el Valor Añadido 4%', 4, 1);

-- Verificar los datos insertados
SELECT 'Dominios insertados:' as Info;
SELECT * FROM Dominios;

SELECT 'Valores de dominio insertados:' as Info;
SELECT d.Nombre as Dominio, v.Valor, v.Descripcion 
FROM ValoresDominio v 
JOIN Dominios d ON v.DominioId = d.Id 
ORDER BY d.Nombre, v.Orden;

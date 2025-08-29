-- Script para reinsertar dominios SIN acentos para evitar problemas de codificación
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
('LINEAS_ESTRATEGICAS', 'Lineas estrategicas de la universidad', 1, GETDATE(), GETDATE()),
('ACTIVIDADES_RESERVADAS', 'Tipos de actividades reservadas', 1, GETDATE(), GETDATE()),
('MODALIDADES_GESTION', 'Modalidades de gestion de actividades', 1, GETDATE(), GETDATE()),
('CENTROS_UB', 'Centros y unidades de la UB', 1, GETDATE(), GETDATE()),
('TIPOS_IMPUESTO', 'Tipos de impuestos aplicables', 1, GETDATE(), GETDATE());

-- Obtener los IDs de los dominios
DECLARE @TIPOS_ACTIVIDAD_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_ACTIVIDAD');
DECLARE @LINEAS_ESTRATEGICAS_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'LINEAS_ESTRATEGICAS');
DECLARE @ACTIVIDADES_RESERVADAS_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'ACTIVIDADES_RESERVADAS');
DECLARE @MODALIDADES_GESTION_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'MODALIDADES_GESTION');
DECLARE @CENTROS_UB_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'CENTROS_UB');
DECLARE @TIPOS_IMPUESTO_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_IMPUESTO');

-- Insertar valores de dominio SIN acentos
-- TIPOS_ACTIVIDAD
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@TIPOS_ACTIVIDAD_ID, 'Jornada', 'Jornada de trabajo o presentacion', 1, 1),
(@TIPOS_ACTIVIDAD_ID, 'Curso', 'Curso de formacion', 2, 1),
(@TIPOS_ACTIVIDAD_ID, 'Seminario', 'Seminario especializado', 3, 1),
(@TIPOS_ACTIVIDAD_ID, 'Conferencia', 'Conferencia academica', 4, 1),
(@TIPOS_ACTIVIDAD_ID, 'Taller', 'Taller practico', 5, 1),
(@TIPOS_ACTIVIDAD_ID, 'Congreso', 'Congreso cientifico', 6, 1),
(@TIPOS_ACTIVIDAD_ID, 'Master', 'Programa de master', 7, 1),
(@TIPOS_ACTIVIDAD_ID, 'Posgrado', 'Programa de posgrado', 8, 1);

-- LINEAS_ESTRATEGICAS
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@LINEAS_ESTRATEGICAS_ID, 'Linea 1', 'Innovacion y desarrollo tecnologico', 1, 1),
(@LINEAS_ESTRATEGICAS_ID, 'Linea 2', 'Investigacion aplicada', 2, 1),
(@LINEAS_ESTRATEGICAS_ID, 'Linea 3', 'Formacion continua', 3, 1),
(@LINEAS_ESTRATEGICAS_ID, 'Linea 4', 'Cooperacion internacional', 4, 1),
(@LINEAS_ESTRATEGICAS_ID, 'Linea 5', 'Transferencia de conocimiento', 5, 1);

-- ACTIVIDADES_RESERVADAS
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@ACTIVIDADES_RESERVADAS_ID, 'PDI', 'Personal Docente e Investigador', 1, 1),
(@ACTIVIDADES_RESERVADAS_ID, 'PAS', 'Personal de Administracion y Servicios', 2, 1),
(@ACTIVIDADES_RESERVADAS_ID, 'Estudiantes', 'Estudiantes de la UB', 3, 1),
(@ACTIVIDADES_RESERVADAS_ID, 'Publico', 'Publico general', 4, 1);

-- MODALIDADES_GESTION
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@MODALIDADES_GESTION_ID, 'Acreditada UB', 'Actividad acreditada por la UB', 1, 1),
(@MODALIDADES_GESTION_ID, 'Externa', 'Actividad gestionada externamente', 2, 1),
(@MODALIDADES_GESTION_ID, 'Mixta', 'Gestion mixta UB-Externa', 3, 1);

-- CENTROS_UB
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@CENTROS_UB_ID, 'Facultad de Informatica', 'Facultad de Informatica de Barcelona', 1, 1),
(@CENTROS_UB_ID, 'Facultad de Matematicas', 'Facultad de Matematicas', 2, 1),
(@CENTROS_UB_ID, 'Facultad de Fisica', 'Facultad de Fisica', 3, 1),
(@CENTROS_UB_ID, 'Facultad de Quimica', 'Facultad de Quimica', 4, 1),
(@CENTROS_UB_ID, 'Facultad de Biologia', 'Facultad de Biologia', 5, 1),
(@CENTROS_UB_ID, 'Facultad de Medicina', 'Facultad de Medicina', 6, 1),
(@CENTROS_UB_ID, 'Facultad de Derecho', 'Facultad de Derecho', 7, 1),
(@CENTROS_UB_ID, 'Facultad de Economia', 'Facultad de Economia y Empresa', 8, 1),
(@CENTROS_UB_ID, 'Facultad de Filologia', 'Facultad de Filologia', 9, 1),
(@CENTROS_UB_ID, 'Facultad de Historia', 'Facultad de Geografia e Historia', 10, 1);

-- TIPOS_IMPUESTO
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@TIPOS_IMPUESTO_ID, 'Exento', 'Actividad exenta de impuestos', 1, 1),
(@TIPOS_IMPUESTO_ID, 'IVA 21%', 'Impuesto sobre el Valor Anadido 21%', 2, 1),
(@TIPOS_IMPUESTO_ID, 'IVA 10%', 'Impuesto sobre el Valor Anadido 10%', 3, 1),
(@TIPOS_IMPUESTO_ID, 'IVA 4%', 'Impuesto sobre el Valor Anadido 4%', 4, 1);

-- Verificar los datos insertados
SELECT 'Dominios insertados:' as Info;
SELECT * FROM Dominios;

SELECT 'Valores de dominio insertados:' as Info;
SELECT d.Nombre as Dominio, v.Valor, v.Descripcion 
FROM ValoresDominio v 
JOIN Dominios d ON v.DominioId = d.Id 
ORDER BY d.Nombre, v.Orden;

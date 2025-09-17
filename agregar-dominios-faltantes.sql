-- Script para agregar dominios faltantes al formulario principal
USE [UB_Formacion];

-- Insertar nuevos dominios
INSERT INTO [Dominios] ([Nombre], [Descripcion], [Activo], [FechaCreacion], [FechaModificacion]) VALUES
('UNIDADES_GESTION', 'Unidades de gestion de la UB', 1, GETDATE(), GETDATE()),
('OBJETIVOS_ESTRATEGICOS', 'Objetivos estrategicos de la universidad', 1, GETDATE(), GETDATE()),
('OPCIONES_SI_NO', 'Opciones Si/No para campos booleanos', 1, GETDATE(), GETDATE());

-- Obtener los IDs de los nuevos dominios
DECLARE @UNIDADES_GESTION_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'UNIDADES_GESTION');
DECLARE @OBJETIVOS_ESTRATEGICOS_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'OBJETIVOS_ESTRATEGICOS');
DECLARE @OPCIONES_SI_NO_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'OPCIONES_SI_NO');

-- UNIDADES_GESTION
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@UNIDADES_GESTION_ID, 'IDP', 'Institut de Desenvolupament Professional', 1, 1),
(@UNIDADES_GESTION_ID, 'CRAI', 'Centre de Recursos per a lAprenentatge i la Investigacio', 2, 1),
(@UNIDADES_GESTION_ID, 'SAE', 'Servei dActivitats Extraordinaries', 3, 1);

-- OBJETIVOS_ESTRATEGICOS (usar las mismas lineas estrategicas)
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@OBJETIVOS_ESTRATEGICOS_ID, 'Linea 1', 'Innovacion y desarrollo tecnologico', 1, 1),
(@OBJETIVOS_ESTRATEGICOS_ID, 'Linea 2', 'Investigacion aplicada', 2, 1),
(@OBJETIVOS_ESTRATEGICOS_ID, 'Linea 3', 'Formacion continua', 3, 1),
(@OBJETIVOS_ESTRATEGICOS_ID, 'Linea 4', 'Cooperacion internacional', 4, 1),
(@OBJETIVOS_ESTRATEGICOS_ID, 'Linea 5', 'Transferencia de conocimiento', 5, 1);

-- OPCIONES_SI_NO
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo]) VALUES
(@OPCIONES_SI_NO_ID, 'Si', 'Opcion afirmativa', 1, 1),
(@OPCIONES_SI_NO_ID, 'No', 'Opcion negativa', 2, 1);

-- Verificar los datos insertados
SELECT 'Nuevos dominios insertados:' as Info;
SELECT * FROM Dominios WHERE Nombre IN ('UNIDADES_GESTION', 'OBJETIVOS_ESTRATEGICOS', 'OPCIONES_SI_NO');

SELECT 'Nuevos valores de dominio insertados:' as Info;
SELECT d.Nombre as Dominio, v.Valor, v.Descripcion 
FROM ValoresDominio v 
JOIN Dominios d ON v.DominioId = d.Id 
WHERE d.Nombre IN ('UNIDADES_GESTION', 'OBJETIVOS_ESTRATEGICOS', 'OPCIONES_SI_NO')
ORDER BY d.Nombre, v.Orden;

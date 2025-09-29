-- Script para crear el dominio COMPETENCIAS_SAE y sus valores
USE [UB_Formacion];

-- Crear el dominio COMPETENCIAS_SAE
PRINT '=== CREANDO DOMINIO COMPETENCIAS_SAE ===';

-- Verificar si el dominio ya existe
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'COMPETENCIAS_SAE')
BEGIN
    PRINT 'El dominio COMPETENCIAS_SAE ya existe. Eliminando valores existentes...';
    DECLARE @DominioId INT = (SELECT Id FROM Dominios WHERE Nombre = 'COMPETENCIAS_SAE');
    DELETE FROM ValoresDominio WHERE DominioId = @DominioId;
END
ELSE
BEGIN
    -- Insertar el nuevo dominio
    INSERT INTO [Dominios] ([Nombre], [Descripcion], [Activo], [FechaCreacion], [FechaModificacion]) 
    VALUES ('COMPETENCIAS_SAE', 'Competencias SAE para actividades formativas', 1, GETDATE(), GETDATE());
    PRINT 'Dominio COMPETENCIAS_SAE creado exitosamente';
END

-- Obtener el ID del dominio
DECLARE @COMPETENCIAS_SAE_ID INT = (SELECT Id FROM Dominios WHERE Nombre = 'COMPETENCIAS_SAE');

-- Insertar los valores del dominio COMPETENCIAS_SAE
PRINT '=== INSERTANDO VALORES DEL DOMINIO COMPETENCIAS_SAE ===';

INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo], [FechaCreacion], [FechaModificacion]) VALUES
(@COMPETENCIAS_SAE_ID, 'Perspectiva de gènere', 'Perspectiva de gènere', 1, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Sostenibilitat', 'Sostenibilitat', 2, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Coneixements tecnològics (programari, aplicacions, llenguatges i maquinari)', 'Coneixements tecnològics (programari, aplicacions, llenguatges i maquinari)', 3, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Ús de xarxes socials', 'Ús de xarxes socials', 4, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Gestió de la informació', 'Gestió de la informació', 5, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Marc regulatori de la informació en l''àmbit TIC', 'Marc regulatori de la informació en l''àmbit TIC', 6, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Emprenedoria', 'Emprenedoria', 7, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Coneixement de llengües (amb acreditació)', 'Coneixement de llengües (amb acreditació)', 8, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Altra formació de coneixement de llengües (sense acreditació)', 'Altra formació de coneixement de llengües (sense acreditació)', 9, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Altra formació sobre competència oral, escrita o altres', 'Altra formació sobre competència oral, escrita o altres', 10, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Planificació i organització', 'Planificació i organització', 11, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Gestió del temps', 'Gestió del temps', 12, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Iniciativa', 'Iniciativa', 13, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Autoconeixement', 'Autoconeixement', 14, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Creativitat', 'Creativitat', 15, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Gestió emocional', 'Gestió emocional', 16, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Pensament crític', 'Pensament crític', 17, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Presa de decisions', 'Presa de decisions', 18, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Resolució de conflictes', 'Resolució de conflictes', 19, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Coneixement d''eines i canals per a la recerca de feina o pràctiques', 'Coneixement d''eines i canals per a la recerca de feina o pràctiques', 20, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Gestió per a cerca de feina', 'Gestió per a cerca de feina', 21, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Cerca informació sobre sortides professionals', 'Cerca informació sobre sortides professionals', 22, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Identificació de l''objectiu professional', 'Identificació de l''objectiu professional', 23, 1, GETDATE(), GETDATE()),
(@COMPETENCIAS_SAE_ID, 'Treball en xarxa', 'Treball en xarxa', 24, 1, GETDATE(), GETDATE());

-- Mostrar los valores insertados
PRINT '=== VALORES INSERTADOS EN COMPETENCIAS_SAE ===';
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = @COMPETENCIAS_SAE_ID 
ORDER BY v.Orden;

PRINT '=== DOMINIO COMPETENCIAS_SAE CREADO EXITOSAMENTE ===';
PRINT 'Total de valores insertados: ' + CAST(@@ROWCOUNT AS VARCHAR(10));

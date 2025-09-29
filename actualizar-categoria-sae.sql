-- Script para actualizar los valores del dominio "Categoría (SAE)" ID = 11
USE [UB_Formacion];

-- Verificar que el dominio existe
IF NOT EXISTS (SELECT 1 FROM Dominios WHERE Id = 11 AND Nombre = 'CATEGORIAS_SAE')
BEGIN
    PRINT 'ERROR: El dominio CATEGORIAS_SAE con ID 11 no existe';
    RETURN;
END

-- Mostrar valores actuales antes de la actualización
PRINT '=== VALORES ACTUALES DEL DOMINIO CATEGORIAS_SAE (ID=11) ===';
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 11 
ORDER BY v.Orden;

-- Eliminar todos los valores actuales del dominio CATEGORIAS_SAE (ID = 11)
PRINT '=== ELIMINANDO VALORES ACTUALES ===';
DELETE FROM ValoresDominio WHERE DominioId = 11;

-- Insertar los nuevos valores para el dominio CATEGORIAS_SAE (ID = 11)
PRINT '=== INSERTANDO NUEVOS VALORES ===';
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo], [FechaCreacion], [FechaModificacion]) VALUES
(11, 'De perspectiva de gènere', 'De perspectiva de gènere', 1, 1, GETDATE(), GETDATE()),
(11, 'De sostenibilitat', 'De sostenibilitat', 2, 1, GETDATE(), GETDATE()),
(11, 'Digitals', 'Digitals', 3, 1, GETDATE(), GETDATE()),
(11, 'Emprenedores', 'Emprenedores', 4, 1, GETDATE(), GETDATE()),
(11, 'Idiomes', 'Idiomes', 5, 1, GETDATE(), GETDATE()),
(11, 'Organitzatives', 'Organitzatives', 6, 1, GETDATE(), GETDATE()),
(11, 'Personals', 'Personals', 7, 1, GETDATE(), GETDATE()),
(11, 'Professionals', 'Professionals', 8, 1, GETDATE(), GETDATE()),
(11, 'Socials o interpersonals', 'Socials o interpersonals', 9, 1, GETDATE(), GETDATE());

-- Mostrar los nuevos valores insertados
PRINT '=== NUEVOS VALORES INSERTADOS ===';
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 11 
ORDER BY v.Orden;

PRINT '=== ACTUALIZACIÓN COMPLETADA ===';
PRINT 'Se han actualizado ' + CAST(@@ROWCOUNT AS VARCHAR(10)) + ' valores para el dominio CATEGORIAS_SAE (ID=11)';

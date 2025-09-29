-- Verificación final de los valores del dominio CATEGORIAS_SAE
USE [UB_Formacion];

PRINT '=== VERIFICACIÓN FINAL - DOMINIO CATEGORIAS_SAE (ID=11) ===';

-- Mostrar información del dominio
SELECT Id, Nombre, Descripcion, Activo 
FROM Dominios 
WHERE Id = 11 AND Nombre = 'CATEGORIAS_SAE';

-- Mostrar todos los valores del dominio
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo, v.FechaCreacion
FROM ValoresDominio v 
WHERE v.DominioId = 11 
ORDER BY v.Orden;

-- Contar total de valores
SELECT COUNT(*) as TotalValores
FROM ValoresDominio v 
WHERE v.DominioId = 11 AND v.Activo = 1;

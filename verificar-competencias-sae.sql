-- Script para verificar que el dominio COMPETENCIAS_SAE funciona correctamente
USE [UB_Formacion];

PRINT '=== VERIFICACIÓN DEL DOMINIO COMPETENCIAS_SAE ===';

-- Verificar que el dominio existe
SELECT Id, Nombre, Descripcion, Activo 
FROM Dominios 
WHERE Nombre = 'COMPETENCIAS_SAE';

-- Mostrar todos los valores del dominio
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
INNER JOIN Dominios d ON v.DominioId = d.Id
WHERE d.Nombre = 'COMPETENCIAS_SAE'
ORDER BY v.Orden;

-- Contar total de valores
SELECT COUNT(*) as TotalValores
FROM ValoresDominio v 
INNER JOIN Dominios d ON v.DominioId = d.Id
WHERE d.Nombre = 'COMPETENCIAS_SAE' AND v.Activo = 1;

-- Verificar que los valores están ordenados correctamente
SELECT v.Orden, v.Valor, v.Id as ValorId
FROM ValoresDominio v 
INNER JOIN Dominios d ON v.DominioId = d.Id
WHERE d.Nombre = 'COMPETENCIAS_SAE' AND v.Activo = 1
ORDER BY v.Orden;

PRINT '=== VERIFICACIÓN COMPLETADA ===';

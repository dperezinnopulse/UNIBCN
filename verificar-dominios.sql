-- Script para verificar los dominios existentes
USE [UB_Formacion];

-- Mostrar todos los dominios
PRINT '=== TODOS LOS DOMINIOS EXISTENTES ===';
SELECT Id, Nombre, Descripcion, Activo 
FROM Dominios 
ORDER BY Id;

-- Buscar dominios que contengan 'CATEGORIA' o 'SAE'
PRINT '=== DOMINIOS RELACIONADOS CON CATEGORIA O SAE ===';
SELECT Id, Nombre, Descripcion, Activo 
FROM Dominios 
WHERE Nombre LIKE '%CATEGORIA%' OR Nombre LIKE '%SAE%' OR Descripcion LIKE '%Categoría%' OR Descripcion LIKE '%SAE%'
ORDER BY Id;

-- Mostrar valores de dominios relacionados con SAE
PRINT '=== VALORES DE DOMINIOS RELACIONADOS CON SAE ===';
SELECT d.Id as DominioId, d.Nombre as DominioNombre, v.Id as ValorId, v.Valor, v.Descripcion, v.Orden
FROM Dominios d
LEFT JOIN ValoresDominio v ON d.Id = v.DominioId
WHERE d.Nombre LIKE '%SAE%' OR d.Descripcion LIKE '%SAE%'
ORDER BY d.Id, v.Orden;

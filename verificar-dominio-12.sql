-- Script para verificar el dominio ID=12
USE [UB_Formacion];

PRINT '=== VERIFICACIÓN DEL DOMINIO ID=12 ===';

-- Mostrar información del dominio
SELECT Id, Nombre, Descripcion, Activo 
FROM Dominios 
WHERE Id = 12;

-- Mostrar valores actuales del dominio
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 12 
ORDER BY v.Orden;

-- Contar total de valores actuales
SELECT COUNT(*) as TotalValoresActuales
FROM ValoresDominio v 
WHERE v.DominioId = 12 AND v.Activo = 1;

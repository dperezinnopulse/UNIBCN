-- Script para verificar el estado final del dominio Asignatura ID=12
USE [UB_Formacion];

PRINT '=== VERIFICACIÓN FINAL DEL DOMINIO ASIGNATURA (ID=12) ===';

-- Mostrar información del dominio
SELECT Id, Nombre, Descripcion, Activo 
FROM Dominios 
WHERE Id = 12;

-- Mostrar todos los valores del dominio (activos e inactivos)
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 12 
ORDER BY v.Activo DESC, v.Orden;

-- Contar valores activos e inactivos
SELECT 
    SUM(CASE WHEN v.Activo = 1 THEN 1 ELSE 0 END) as ValoresActivos,
    SUM(CASE WHEN v.Activo = 0 THEN 1 ELSE 0 END) as ValoresInactivos,
    COUNT(*) as TotalValores
FROM ValoresDominio v 
WHERE v.DominioId = 12;

-- Verificar actividades que usan estos valores
SELECT COUNT(*) as ActividadesConAsignatura
FROM Actividades 
WHERE AsignaturaId IS NOT NULL;

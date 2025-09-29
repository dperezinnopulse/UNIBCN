USE [UB_Formacion];

-- Verificar el estado actual del dominio Asignatura (ID=12)
SELECT '=== DOMINIO ASIGNATURA ===' as Info;
SELECT d.Id, d.Nombre, d.Descripcion, d.Activo 
FROM Dominios d 
WHERE d.Id = 12;

SELECT '=== VALORES ACTUALES ===' as Info;
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 12 
ORDER BY v.Orden;

SELECT '=== ACTIVIDADES QUE REFERENCIAN ESTOS VALORES ===' as Info;
SELECT a.Id as ActividadId, a.Titulo, a.AsignaturaId 
FROM Actividades a 
WHERE a.AsignaturaId IS NOT NULL;

SELECT '=== CONTEO DE VALORES ===' as Info;
SELECT COUNT(*) as TotalValores 
FROM ValoresDominio 
WHERE DominioId = 12;

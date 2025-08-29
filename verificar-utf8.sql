-- Script para verificar y corregir codificación UTF-8 en dominios
USE UB_Formacion;

-- Verificar datos actuales
SELECT 'Dominios actuales:' as Info;
SELECT Id, Nombre, Descripcion FROM Dominios;

SELECT 'Valores de dominio actuales:' as Info;
SELECT vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion 
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
ORDER BY d.Nombre, vd.Orden, vd.Valor;

-- Verificar si hay caracteres especiales mal codificados
SELECT 'Verificando caracteres especiales:' as Info;
SELECT vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion,
       CASE 
           WHEN vd.Valor LIKE '%Ã¡%' OR vd.Valor LIKE '%Ã©%' OR vd.Valor LIKE '%Ã­%' OR vd.Valor LIKE '%Ã³%' OR vd.Valor LIKE '%Ãº%' OR vd.Valor LIKE '%Ã±%'
           THEN 'POSIBLE PROBLEMA DE CODIFICACIÓN'
           ELSE 'OK'
       END as Estado
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
WHERE vd.Valor LIKE '%Ã¡%' OR vd.Valor LIKE '%Ã©%' OR vd.Valor LIKE '%Ã­%' OR vd.Valor LIKE '%Ã³%' OR vd.Valor LIKE '%Ãº%' OR vd.Valor LIKE '%Ã±%'
   OR vd.Descripcion LIKE '%Ã¡%' OR vd.Descripcion LIKE '%Ã©%' OR vd.Descripcion LIKE '%Ã­%' OR vd.Descripcion LIKE '%Ã³%' OR vd.Descripcion LIKE '%Ãº%' OR vd.Descripcion LIKE '%Ã±%';

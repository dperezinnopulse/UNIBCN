-- Script simple para corregir codificación UTF-8
USE UB_Formacion;

-- Corregir caracteres básicos
UPDATE ValoresDominio SET Valor = REPLACE(Valor, 'Ã¡', 'á') WHERE Valor LIKE '%Ã¡%';
UPDATE ValoresDominio SET Valor = REPLACE(Valor, 'Ã©', 'é') WHERE Valor LIKE '%Ã©%';
UPDATE ValoresDominio SET Valor = REPLACE(Valor, 'Ã­', 'í') WHERE Valor LIKE '%Ã­%';
UPDATE ValoresDominio SET Valor = REPLACE(Valor, 'Ã³', 'ó') WHERE Valor LIKE '%Ã³%';
UPDATE ValoresDominio SET Valor = REPLACE(Valor, 'Ãº', 'ú') WHERE Valor LIKE '%Ãº%';
UPDATE ValoresDominio SET Valor = REPLACE(Valor, 'Ã±', 'ñ') WHERE Valor LIKE '%Ã±%';

UPDATE ValoresDominio SET Descripcion = REPLACE(Descripcion, 'Ã¡', 'á') WHERE Descripcion LIKE '%Ã¡%';
UPDATE ValoresDominio SET Descripcion = REPLACE(Descripcion, 'Ã©', 'é') WHERE Descripcion LIKE '%Ã©%';
UPDATE ValoresDominio SET Descripcion = REPLACE(Descripcion, 'Ã­', 'í') WHERE Descripcion LIKE '%Ã­%';
UPDATE ValoresDominio SET Descripcion = REPLACE(Descripcion, 'Ã³', 'ó') WHERE Descripcion LIKE '%Ã³%';
UPDATE ValoresDominio SET Descripcion = REPLACE(Descripcion, 'Ãº', 'ú') WHERE Descripcion LIKE '%Ãº%';
UPDATE ValoresDominio SET Descripcion = REPLACE(Descripcion, 'Ã±', 'ñ') WHERE Descripcion LIKE '%Ã±%';

-- Verificar resultado
SELECT 'Verificando corrección:' as Info;
SELECT TOP 5 vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion 
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
WHERE vd.Valor LIKE '%á%' OR vd.Valor LIKE '%é%' OR vd.Valor LIKE '%í%' OR vd.Valor LIKE '%ó%' OR vd.Valor LIKE '%ú%' OR vd.Valor LIKE '%ñ%'
ORDER BY d.Nombre, vd.Orden, vd.Valor;

-- Script para corregir caracteres especiales mal codificados
USE UB_Formacion;

-- Corregir caracteres en ValoresDominio
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

-- Corregir caracteres en Dominios
UPDATE Dominios SET Nombre = REPLACE(Nombre, 'Ã¡', 'á') WHERE Nombre LIKE '%Ã¡%';
UPDATE Dominios SET Nombre = REPLACE(Nombre, 'Ã©', 'é') WHERE Nombre LIKE '%Ã©%';
UPDATE Dominios SET Nombre = REPLACE(Nombre, 'Ã­', 'í') WHERE Nombre LIKE '%Ã­%';
UPDATE Dominios SET Nombre = REPLACE(Nombre, 'Ã³', 'ó') WHERE Nombre LIKE '%Ã³%';
UPDATE Dominios SET Nombre = REPLACE(Nombre, 'Ãº', 'ú') WHERE Nombre LIKE '%Ãº%';
UPDATE Dominios SET Nombre = REPLACE(Nombre, 'Ã±', 'ñ') WHERE Nombre LIKE '%Ã±%';

UPDATE Dominios SET Descripcion = REPLACE(Descripcion, 'Ã¡', 'á') WHERE Descripcion LIKE '%Ã¡%';
UPDATE Dominios SET Descripcion = REPLACE(Descripcion, 'Ã©', 'é') WHERE Descripcion LIKE '%Ã©%';
UPDATE Dominios SET Descripcion = REPLACE(Descripcion, 'Ã­', 'í') WHERE Descripcion LIKE '%Ã­%';
UPDATE Dominios SET Descripcion = REPLACE(Descripcion, 'Ã³', 'ó') WHERE Descripcion LIKE '%Ã³%';
UPDATE Dominios SET Descripcion = REPLACE(Descripcion, 'Ãº', 'ú') WHERE Descripcion LIKE '%Ãº%';
UPDATE Dominios SET Descripcion = REPLACE(Descripcion, 'Ã±', 'ñ') WHERE Descripcion LIKE '%Ã±%';

-- Verificar corrección
SELECT 'Verificando corrección:' as Info;
SELECT TOP 5 Id, Valor, Descripcion 
FROM ValoresDominio 
WHERE Valor LIKE '%á%' OR Valor LIKE '%é%' OR Valor LIKE '%í%' OR Valor LIKE '%ó%' OR Valor LIKE '%ú%' OR Valor LIKE '%ñ%'
ORDER BY Id;

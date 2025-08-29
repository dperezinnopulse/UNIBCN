-- Script para corregir codificación UTF-8 en dominios
USE UB_Formacion;

-- Corregir caracteres especiales en ValoresDominio
UPDATE ValoresDominio 
SET Valor = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    Valor,
    'Ã¡', 'á'), 'Ã©', 'é'), 'Ã­', 'í'), 'Ã³', 'ó'), 'Ãº', 'ú'), 'Ã±', 'ñ'),
    'Ã€', 'À'), 'Ãˆ', 'È'), 'ÃŒ', 'Ì'), 'Ã', 'Ò'), 'Ã™', 'Ù'), 'Ãƒ', 'Ã')
WHERE Valor LIKE '%Ã¡%' OR Valor LIKE '%Ã©%' OR Valor LIKE '%Ã­%' OR Valor LIKE '%Ã³%' OR Valor LIKE '%Ãº%' OR Valor LIKE '%Ã±%';

UPDATE ValoresDominio 
SET Descripcion = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    Descripcion,
    'Ã¡', 'á'), 'Ã©', 'é'), 'Ã­', 'í'), 'Ã³', 'ó'), 'Ãº', 'ú'), 'Ã±', 'ñ'),
    'Ã€', 'À'), 'Ãˆ', 'È'), 'ÃŒ', 'Ì'), 'Ã', 'Ò'), 'Ã™', 'Ù'), 'Ãƒ', 'Ã')
WHERE Descripcion LIKE '%Ã¡%' OR Descripcion LIKE '%Ã©%' OR Descripcion LIKE '%Ã­%' OR Descripcion LIKE '%Ã³%' OR Descripcion LIKE '%Ãº%' OR Descripcion LIKE '%Ã±%';

-- Corregir caracteres especiales en Dominios
UPDATE Dominios 
SET Nombre = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    Nombre,
    'Ã¡', 'á'), 'Ã©', 'é'), 'Ã­', 'í'), 'Ã³', 'ó'), 'Ãº', 'ú'), 'Ã±', 'ñ'),
    'Ã€', 'À'), 'Ãˆ', 'È'), 'ÃŒ', 'Ì'), 'Ã', 'Ò'), 'Ã™', 'Ù'), 'Ãƒ', 'Ã')
WHERE Nombre LIKE '%Ã¡%' OR Nombre LIKE '%Ã©%' OR Nombre LIKE '%Ã­%' OR Nombre LIKE '%Ã³%' OR Nombre LIKE '%Ãº%' OR Nombre LIKE '%Ã±%';

UPDATE Dominios 
SET Descripcion = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    Descripcion,
    'Ã¡', 'á'), 'Ã©', 'é'), 'Ã­', 'í'), 'Ã³', 'ó'), 'Ãº', 'ú'), 'Ã±', 'ñ'),
    'Ã€', 'À'), 'Ãˆ', 'È'), 'ÃŒ', 'Ì'), 'Ã', 'Ò'), 'Ã™', 'Ù'), 'Ãƒ', 'Ã')
WHERE Descripcion LIKE '%Ã¡%' OR Descripcion LIKE '%Ã©%' OR Descripcion LIKE '%Ã­%' OR Descripcion LIKE '%Ã³%' OR Descripcion LIKE '%Ãº%' OR Descripcion LIKE '%Ã±%';

-- Verificar corrección
SELECT 'Datos corregidos:' as Info;
SELECT vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion 
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
WHERE vd.Valor LIKE '%á%' OR vd.Valor LIKE '%é%' OR vd.Valor LIKE '%í%' OR vd.Valor LIKE '%ó%' OR vd.Valor LIKE '%ú%' OR vd.Valor LIKE '%ñ%'
ORDER BY d.Nombre, vd.Orden, vd.Valor;

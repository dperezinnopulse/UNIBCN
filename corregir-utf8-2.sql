-- Script para corregir codificación UTF-8 específica
USE UB_Formacion;

-- Corregir caracteres específicos que aún están mal codificados
UPDATE ValoresDominio 
SET Valor = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    Valor,
    'Ã¡', 'á'), 'Ã©', 'é'), 'Ã­', 'í'), 'Ã³', 'ó'), 'Ãº', 'ú'), 'Ã±', 'ñ'),
    'Ã€', 'À'), 'Ãˆ', 'È'), 'ÃŒ', 'Ì'), 'Ã', 'Ò'), 'Ã™', 'Ù'), 'Ãƒ', 'Ã'),
    'Ã¨', 'è'), 'Ã¬', 'ì'), 'Ã²', 'ò'), 'Ã¹', 'ù'), 'Ã ', 'à'), 'Ã§', 'ç')
WHERE Valor LIKE '%Ã¡%' OR Valor LIKE '%Ã©%' OR Valor LIKE '%Ã­%' OR Valor LIKE '%Ã³%' OR Valor LIKE '%Ãº%' OR Valor LIKE '%Ã±%'
   OR Valor LIKE '%Ã¨%' OR Valor LIKE '%Ã¬%' OR Valor LIKE '%Ã²%' OR Valor LIKE '%Ã¹%' OR Valor LIKE '%Ã %' OR Valor LIKE '%Ã§%';

UPDATE ValoresDominio 
SET Descripcion = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    Descripcion,
    'Ã¡', 'á'), 'Ã©', 'é'), 'Ã­', 'í'), 'Ã³', 'ó'), 'Ãº', 'ú'), 'Ã±', 'ñ'),
    'Ã€', 'À'), 'Ãˆ', 'È'), 'ÃŒ', 'Ì'), 'Ã', 'Ò'), 'Ã™', 'Ù'), 'Ãƒ', 'Ã'),
    'Ã¨', 'è'), 'Ã¬', 'ì'), 'Ã²', 'ò'), 'Ã¹', 'ù'), 'Ã ', 'à'), 'Ã§', 'ç')
WHERE Descripcion LIKE '%Ã¡%' OR Descripcion LIKE '%Ã©%' OR Descripcion LIKE '%Ã­%' OR Descripcion LIKE '%Ã³%' OR Descripcion LIKE '%Ãº%' OR Descripcion LIKE '%Ã±%'
   OR Descripcion LIKE '%Ã¨%' OR Descripcion LIKE '%Ã¬%' OR Descripcion LIKE '%Ã²%' OR Descripcion LIKE '%Ã¹%' OR Descripcion LIKE '%Ã %' OR Descripcion LIKE '%Ã§%';

-- Verificar resultado
SELECT 'Verificando corrección:' as Info;
SELECT TOP 10 vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion 
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
WHERE vd.Valor LIKE '%á%' OR vd.Valor LIKE '%é%' OR vd.Valor LIKE '%í%' OR vd.Valor LIKE '%ó%' OR vd.Valor LIKE '%ú%' OR vd.Valor LIKE '%ñ%'
   OR vd.Valor LIKE '%à%' OR vd.Valor LIKE '%è%' OR vd.Valor LIKE '%ì%' OR vd.Valor LIKE '%ò%' OR vd.Valor LIKE '%ù%' OR vd.Valor LIKE '%ç%'
ORDER BY d.Nombre, vd.Orden, vd.Valor;

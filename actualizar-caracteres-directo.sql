-- Script para actualizar caracteres directamente
USE UB_Formacion;

-- Actualizar valores específicos con caracteres correctos
UPDATE ValoresDominio SET Valor = 'Máster' WHERE Id = 107;
UPDATE ValoresDominio SET Descripcion = 'Programa de máster' WHERE Id = 107;

UPDATE ValoresDominio SET Valor = 'Línea 1' WHERE Id = 109;
UPDATE ValoresDominio SET Descripcion = 'Innovación y desarrollo tecnológico' WHERE Id = 109;

UPDATE ValoresDominio SET Valor = 'Línea 2' WHERE Id = 110;
UPDATE ValoresDominio SET Descripcion = 'Sostenibilidad y medio ambiente' WHERE Id = 110;

UPDATE ValoresDominio SET Valor = 'Línea 3' WHERE Id = 111;
UPDATE ValoresDominio SET Descripcion = 'Salud y bienestar' WHERE Id = 111;

UPDATE ValoresDominio SET Valor = 'Línea 4' WHERE Id = 112;
UPDATE ValoresDominio SET Descripcion = 'Educación y formación' WHERE Id = 112;

UPDATE ValoresDominio SET Valor = 'Línea 5' WHERE Id = 113;
UPDATE ValoresDominio SET Descripcion = 'Cultura y sociedad' WHERE Id = 113;

UPDATE ValoresDominio SET Valor = 'Público general' WHERE Id = 117;
UPDATE ValoresDominio SET Descripcion = 'Público general' WHERE Id = 117;

UPDATE ValoresDominio SET Valor = 'Colaboración externa' WHERE Id = 119;
UPDATE ValoresDominio SET Descripcion = 'Colaboración con entidades externas' WHERE Id = 119;

UPDATE ValoresDominio SET Valor = 'Híbrida' WHERE Id = 98;
UPDATE ValoresDominio SET Descripcion = 'Actividad híbrida (presencial + online)' WHERE Id = 98;

-- Verificar actualización
SELECT 'Verificando actualización:' as Info;
SELECT TOP 10 Id, Valor, Descripcion 
FROM ValoresDominio 
WHERE Valor LIKE '%á%' OR Valor LIKE '%é%' OR Valor LIKE '%í%' OR Valor LIKE '%ó%' OR Valor LIKE '%ú%' OR Valor LIKE '%ñ%'
ORDER BY Id;

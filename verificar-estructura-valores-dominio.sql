USE [UB_Formacion];

-- Verificar la estructura de la tabla ValoresDominio
SELECT '=== ESTRUCTURA TABLA ValoresDominio ===' as Info;
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'ValoresDominio' 
ORDER BY ORDINAL_POSITION;

-- Verificar algunos registros existentes para ver los nombres de columnas
SELECT '=== MUESTRA DE REGISTROS EXISTENTES ===' as Info;
SELECT TOP 3 * FROM ValoresDominio;

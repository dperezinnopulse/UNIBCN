# Script para agregar manualmente los campos requeridos
Write-Host "Agregando campos requeridos manualmente..." -ForegroundColor Yellow

$fixManual = @"
USE UB_Formacion;

-- Agregar columnas si no existen
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Codigo')
BEGIN
    ALTER TABLE Actividades ADD Codigo NVARCHAR(20);
    UPDATE Actividades SET Codigo = CONCAT('ACT-', FORMAT(Id, '000'));
    ALTER TABLE Actividades ALTER COLUMN Codigo NVARCHAR(20) NOT NULL;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'AnioAcademico')
BEGIN
    ALTER TABLE Actividades ADD AnioAcademico NVARCHAR(10);
    UPDATE Actividades SET AnioAcademico = '2024-25';
    ALTER TABLE Actividades ALTER COLUMN AnioAcademico NVARCHAR(10) NOT NULL;
END

-- Verificar resultado
SELECT Id, Codigo, AnioAcademico, Titulo FROM Actividades;
"@

$fixManual | sqlcmd -S localhost

Write-Host "Campos agregados manualmente" -ForegroundColor Green

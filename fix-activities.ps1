# Script para arreglar las actividades existentes
Write-Host "Arreglando actividades existentes..." -ForegroundColor Yellow

$fixActivities = @"
USE UB_Formacion;

-- Agregar campos requeridos si no existen
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Codigo')
ALTER TABLE Actividades ADD Codigo NVARCHAR(20) NOT NULL DEFAULT 'ACT-001';

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'AnioAcademico')
ALTER TABLE Actividades ADD AnioAcademico NVARCHAR(10) NOT NULL DEFAULT '2024-25';

-- Actualizar actividades existentes con códigos únicos
UPDATE Actividades 
SET Codigo = CONCAT('ACT-', FORMAT(Id, '000'))
WHERE Codigo = 'ACT-001';

UPDATE Actividades 
SET AnioAcademico = '2024-25'
WHERE AnioAcademico = '2024-25' OR AnioAcademico IS NULL;

-- Verificar que todas las actividades tengan los campos requeridos
SELECT Id, Codigo, AnioAcademico, Titulo FROM Actividades;
"@

$fixActivities | sqlcmd -S localhost

Write-Host "Actividades arregladas correctamente" -ForegroundColor Green

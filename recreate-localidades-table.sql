-- Borrar y recrear tabla de localidades con todos los datos
USE UB_Formacion;

-- Borrar todos los registros existentes
DELETE FROM Localidades;

-- Recrear la tabla desde cero
DROP TABLE IF EXISTS Localidades;

CREATE TABLE Localidades (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CodigoPostal NVARCHAR(5) NOT NULL,
    NombreLocalidad NVARCHAR(100) NOT NULL,
    Provincia NVARCHAR(50),
    INDEX IX_Localidades_CodigoPostal (CodigoPostal)
);

-- Script SQL simple para añadir campos a la tabla Usuarios
-- Campos: Nombre, Apellido1, Apellido2, Email

ALTER TABLE Usuarios ADD Nombre NVARCHAR(100) NULL;
ALTER TABLE Usuarios ADD Apellido1 NVARCHAR(100) NULL;
ALTER TABLE Usuarios ADD Apellido2 NVARCHAR(100) NULL;
ALTER TABLE Usuarios ADD Email NVARCHAR(255) NULL;

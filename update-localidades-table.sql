-- Actualizar tabla de localidades para cambiar el nombre de la columna
USE UB_Formacion;

-- Renombrar la columna Localidad a NombreLocalidad
EXEC sp_rename 'Localidades.Localidad', 'NombreLocalidad', 'COLUMN';

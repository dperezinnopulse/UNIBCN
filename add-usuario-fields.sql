-- Script SQL para añadir campos a la tabla Usuarios
-- Campos a añadir: Nombre, Apellido1, Apellido2, Email

-- Verificar si la tabla Usuarios existe
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Usuarios')
BEGIN
    PRINT 'Tabla Usuarios encontrada. Añadiendo campos...'
    
    -- Añadir campo Nombre
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios' AND COLUMN_NAME = 'Nombre')
    BEGIN
        ALTER TABLE Usuarios ADD Nombre NVARCHAR(100) NULL;
        PRINT 'Campo Nombre añadido correctamente.'
    END
    ELSE
    BEGIN
        PRINT 'Campo Nombre ya existe.'
    END
    
    -- Añadir campo Apellido1
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios' AND COLUMN_NAME = 'Apellido1')
    BEGIN
        ALTER TABLE Usuarios ADD Apellido1 NVARCHAR(100) NULL;
        PRINT 'Campo Apellido1 añadido correctamente.'
    END
    ELSE
    BEGIN
        PRINT 'Campo Apellido1 ya existe.'
    END
    
    -- Añadir campo Apellido2
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios' AND COLUMN_NAME = 'Apellido2')
    BEGIN
        ALTER TABLE Usuarios ADD Apellido2 NVARCHAR(100) NULL;
        PRINT 'Campo Apellido2 añadido correctamente.'
    END
    ELSE
    BEGIN
        PRINT 'Campo Apellido2 ya existe.'
    END
    
    -- Añadir campo Email
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Usuarios' AND COLUMN_NAME = 'Email')
    BEGIN
        ALTER TABLE Usuarios ADD Email NVARCHAR(255) NULL;
        PRINT 'Campo Email añadido correctamente.'
    END
    ELSE
    BEGIN
        PRINT 'Campo Email ya existe.'
    END
    
    -- Mostrar estructura actualizada de la tabla
    PRINT 'Estructura actualizada de la tabla Usuarios:'
    SELECT 
        COLUMN_NAME as 'Campo',
        DATA_TYPE as 'Tipo',
        IS_NULLABLE as 'Permite NULL',
        CHARACTER_MAXIMUM_LENGTH as 'Longitud Máxima'
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Usuarios'
    ORDER BY ORDINAL_POSITION;
    
END
ELSE
BEGIN
    PRINT 'ERROR: La tabla Usuarios no existe.'
END

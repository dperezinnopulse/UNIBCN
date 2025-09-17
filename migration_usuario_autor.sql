-- Migración para agregar campo UsuarioAutorId a la tabla Actividades
-- Ejecutar este script en la base de datos UB_Formacion

USE [UB_Formacion]
GO

-- Agregar la columna UsuarioAutorId
ALTER TABLE [dbo].[Actividades]
ADD [UsuarioAutorId] int NULL
GO

-- Crear la foreign key hacia la tabla Usuarios
ALTER TABLE [dbo].[Actividades]
ADD CONSTRAINT [FK_Actividades_Usuarios_UsuarioAutorId] 
FOREIGN KEY ([UsuarioAutorId]) REFERENCES [dbo].[Usuarios] ([Id])
GO

-- Crear índice para mejorar el rendimiento
CREATE INDEX [IX_Actividades_UsuarioAutorId] 
ON [dbo].[Actividades] ([UsuarioAutorId])
GO

-- Actualizar actividades existentes con el usuario Admin (ID = 1) como autor por defecto
UPDATE [dbo].[Actividades] 
SET [UsuarioAutorId] = 1 
WHERE [UsuarioAutorId] IS NULL
GO

PRINT 'Migración completada: Campo UsuarioAutorId agregado a la tabla Actividades'

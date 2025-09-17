-- Crear actividades de prueba en estado PUBLICADA
INSERT INTO Actividades (Titulo, Descripcion, EstadoId, UnidadGestionId, UsuarioAutorId, FechaCreacion, FechaModificacion)
VALUES 
('Seminario de Innovación IDP', 'Seminario sobre innovación tecnológica', 19, 1, 1, GETDATE(), GETDATE()),
('Taller CRAI Digital', 'Taller de gestión de información digital', 19, 2, 1, GETDATE(), GETDATE()),
('Congreso SAE Estudiantil', 'Congreso de actividades estudiantiles', 19, 3, 1, GETDATE(), GETDATE());


-- Script para insertar datos corregidos con UTF-8
USE UB_Formacion;

-- Limpiar datos existentes
DELETE FROM ValoresDominio;
DELETE FROM Dominios;

-- Insertar dominios corregidos
INSERT INTO Dominios (Nombre, Descripcion, Activo) VALUES
('TIPOS_ACTIVIDAD', 'Tipos de actividades disponibles', 1),
('LINEAS_ESTRATEGICAS', 'Líneas estratégicas de la UB', 1),
('ACTIVIDADES_RESERVADAS', 'Tipos de actividades reservadas', 1),
('MODALIDADES_GESTION', 'Modalidades de gestión', 1),
('CENTROS_UB', 'Centros y unidades de la UB', 1),
('TIPOS_IMPUESTO', 'Tipos de impuestos aplicables', 1);

-- Insertar valores corregidos
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo) VALUES
-- TIPOS_ACTIVIDAD
(1, 'Jornada', 'Jornada de trabajo o presentación', 1, 1),
(1, 'Curso', 'Curso de formación', 2, 1),
(1, 'Seminario', 'Seminario especializado', 3, 1),
(1, 'Conferencia', 'Conferencia o charla', 4, 1),
(1, 'Taller', 'Taller práctico', 5, 1),
(1, 'Congreso', 'Congreso o simposio', 6, 1),
(1, 'Máster', 'Programa de máster', 7, 1),
(1, 'Posgrado', 'Programa de posgrado', 8, 1),

-- LINEAS_ESTRATEGICAS
(2, 'Línea 1', 'Innovación y desarrollo tecnológico', 1, 1),
(2, 'Línea 2', 'Sostenibilidad y medio ambiente', 2, 1),
(2, 'Línea 3', 'Salud y bienestar', 3, 1),
(2, 'Línea 4', 'Educación y formación', 4, 1),
(2, 'Línea 5', 'Cultura y sociedad', 5, 1),

-- ACTIVIDADES_RESERVADAS
(3, 'PDI', 'Personal Docente e Investigador', 1, 1),
(3, 'PAS', 'Personal de Administración y Servicios', 2, 1),
(3, 'Estudiantes', 'Estudiantes de la UB', 3, 1),
(3, 'Público general', 'Público general', 4, 1),

-- MODALIDADES_GESTION
(4, 'Acreditada UB', 'Actividad acreditada por la UB', 1, 1),
(4, 'Colaboración externa', 'Colaboración con entidades externas', 2, 1),
(4, 'Interna', 'Actividad interna de la UB', 3, 1),

-- CENTROS_UB
(5, 'Facultat de Dret', 'Facultad de Derecho', 1, 1),
(5, 'Facultat d''Economia i Empresa', 'Facultad de Economía y Empresa', 2, 1),
(5, 'Facultat de Medicina', 'Facultad de Medicina', 3, 1),
(5, 'Facultat de Farmàcia', 'Facultad de Farmacia', 4, 1),
(5, 'Facultat de Biologia', 'Facultad de Biología', 5, 1),
(5, 'Facultat de Física', 'Facultad de Física', 6, 1),
(5, 'Facultat de Química', 'Facultad de Química', 7, 1),
(5, 'Facultat de Geologia', 'Facultad de Geología', 8, 1),
(5, 'Facultat de Matemàtiques', 'Facultad de Matemáticas', 9, 1),
(5, 'Facultat d''Informàtica', 'Facultad de Informática', 10, 1),

-- TIPOS_IMPUESTO
(6, 'IVA 21%', 'IVA general del 21%', 1, 1),
(6, 'IVA 10%', 'IVA reducido del 10%', 2, 1),
(6, 'IVA 4%', 'IVA superreducido del 4%', 3, 1),
(6, 'Exento', 'Exento de IVA', 4, 1);

-- Verificar inserción
SELECT 'Datos insertados:' as Info;
SELECT vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion 
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
ORDER BY d.Nombre, vd.Orden, vd.Valor;

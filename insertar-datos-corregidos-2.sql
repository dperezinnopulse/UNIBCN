-- Script para insertar datos corregidos con UTF-8 (versión corregida)
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

-- Obtener IDs de dominios
DECLARE @tipos_actividad_id INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_ACTIVIDAD');
DECLARE @lineas_estrategicas_id INT = (SELECT Id FROM Dominios WHERE Nombre = 'LINEAS_ESTRATEGICAS');
DECLARE @actividades_reservadas_id INT = (SELECT Id FROM Dominios WHERE Nombre = 'ACTIVIDADES_RESERVADAS');
DECLARE @modalidades_gestion_id INT = (SELECT Id FROM Dominios WHERE Nombre = 'MODALIDADES_GESTION');
DECLARE @centros_ub_id INT = (SELECT Id FROM Dominios WHERE Nombre = 'CENTROS_UB');
DECLARE @tipos_impuesto_id INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_IMPUESTO');

-- Insertar valores corregidos
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo) VALUES
-- TIPOS_ACTIVIDAD
(@tipos_actividad_id, 'Jornada', 'Jornada de trabajo o presentación', 1, 1),
(@tipos_actividad_id, 'Curso', 'Curso de formación', 2, 1),
(@tipos_actividad_id, 'Seminario', 'Seminario especializado', 3, 1),
(@tipos_actividad_id, 'Conferencia', 'Conferencia o charla', 4, 1),
(@tipos_actividad_id, 'Taller', 'Taller práctico', 5, 1),
(@tipos_actividad_id, 'Congreso', 'Congreso o simposio', 6, 1),
(@tipos_actividad_id, 'Máster', 'Programa de máster', 7, 1),
(@tipos_actividad_id, 'Posgrado', 'Programa de posgrado', 8, 1),

-- LINEAS_ESTRATEGICAS
(@lineas_estrategicas_id, 'Línea 1', 'Innovación y desarrollo tecnológico', 1, 1),
(@lineas_estrategicas_id, 'Línea 2', 'Sostenibilidad y medio ambiente', 2, 1),
(@lineas_estrategicas_id, 'Línea 3', 'Salud y bienestar', 3, 1),
(@lineas_estrategicas_id, 'Línea 4', 'Educación y formación', 4, 1),
(@lineas_estrategicas_id, 'Línea 5', 'Cultura y sociedad', 5, 1),

-- ACTIVIDADES_RESERVADAS
(@actividades_reservadas_id, 'PDI', 'Personal Docente e Investigador', 1, 1),
(@actividades_reservadas_id, 'PAS', 'Personal de Administración y Servicios', 2, 1),
(@actividades_reservadas_id, 'Estudiantes', 'Estudiantes de la UB', 3, 1),
(@actividades_reservadas_id, 'Público general', 'Público general', 4, 1),

-- MODALIDADES_GESTION
(@modalidades_gestion_id, 'Acreditada UB', 'Actividad acreditada por la UB', 1, 1),
(@modalidades_gestion_id, 'Colaboración externa', 'Colaboración con entidades externas', 2, 1),
(@modalidades_gestion_id, 'Interna', 'Actividad interna de la UB', 3, 1),

-- CENTROS_UB
(@centros_ub_id, 'Facultat de Dret', 'Facultad de Derecho', 1, 1),
(@centros_ub_id, 'Facultat d''Economia i Empresa', 'Facultad de Economía y Empresa', 2, 1),
(@centros_ub_id, 'Facultat de Medicina', 'Facultad de Medicina', 3, 1),
(@centros_ub_id, 'Facultat de Farmàcia', 'Facultad de Farmacia', 4, 1),
(@centros_ub_id, 'Facultat de Biologia', 'Facultad de Biología', 5, 1),
(@centros_ub_id, 'Facultat de Física', 'Facultad de Física', 6, 1),
(@centros_ub_id, 'Facultat de Química', 'Facultad de Química', 7, 1),
(@centros_ub_id, 'Facultat de Geologia', 'Facultad de Geología', 8, 1),
(@centros_ub_id, 'Facultat de Matemàtiques', 'Facultad de Matemáticas', 9, 1),
(@centros_ub_id, 'Facultat d''Informàtica', 'Facultad de Informática', 10, 1),

-- TIPOS_IMPUESTO
(@tipos_impuesto_id, 'IVA 21%', 'IVA general del 21%', 1, 1),
(@tipos_impuesto_id, 'IVA 10%', 'IVA reducido del 10%', 2, 1),
(@tipos_impuesto_id, 'IVA 4%', 'IVA superreducido del 4%', 3, 1),
(@tipos_impuesto_id, 'Exento', 'Exento de IVA', 4, 1);

-- Verificar inserción
SELECT 'Datos insertados:' as Info;
SELECT vd.Id, d.Nombre as Dominio, vd.Valor, vd.Descripcion 
FROM ValoresDominio vd 
INNER JOIN Dominios d ON vd.DominioId = d.Id
ORDER BY d.Nombre, vd.Orden, vd.Valor;

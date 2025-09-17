-- Script para insertar dominios iniciales
-- Ejecutar después de crear las tablas Dominios y ValoresDominio

-- Insertar dominios
INSERT INTO Dominios (Nombre, Descripcion, Activo, FechaCreacion, FechaModificacion) VALUES
('UNIDADES_GESTION', 'Unidades de gestión de la UB', 1, GETDATE(), GETDATE()),
('CENTROS_UB', 'Centros y unidades de la UB', 1, GETDATE(), GETDATE()),
('TIPOS_ACTIVIDAD', 'Tipos de actividad', 1, GETDATE(), GETDATE()),
('LINEAS_ESTRATEGICAS', 'Líneas estratégicas', 1, GETDATE(), GETDATE()),
('OBJETIVOS_ESTRATEGICOS', 'Objetivos estratégicos', 1, GETDATE(), GETDATE()),
('ACTIVIDADES_RESERVADAS', 'Tipos de actividad reservada', 1, GETDATE(), GETDATE()),
('MODALIDADES_GESTION', 'Modalidades de gestión', 1, GETDATE(), GETDATE()),
('TIPOS_IMPUESTO', 'Tipos de impuesto', 1, GETDATE(), GETDATE()),
('FACULTADES', 'Facultades de la UB', 1, GETDATE(), GETDATE()),
('DEPARTAMENTOS', 'Departamentos de la UB', 1, GETDATE(), GETDATE()),
('IDIOMAS', 'Idiomas disponibles', 1, GETDATE(), GETDATE()),
('MODALIDADES_ACTIVIDAD', 'Modalidades de actividad', 1, GETDATE(), GETDATE());

-- Insertar valores para UNIDADES_GESTION
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(1, 'IDP', 'Institut de Desenvolupament Professional', 1, 1, GETDATE(), GETDATE()),
(1, 'CRAI', 'Centre de Recursos per a l''Aprenentatge i la Investigació', 2, 1, GETDATE(), GETDATE()),
(1, 'SAE', 'Servei d''Activitats Extraordinàries', 3, 1, GETDATE(), GETDATE());

-- Insertar valores para CENTROS_UB
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(2, 'Facultat de Dret', 'Facultat de Dret', 1, 1, GETDATE(), GETDATE()),
(2, 'Facultat d''Economia i Empresa', 'Facultat d''Economia i Empresa', 2, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Medicina i Ciències de la Salut', 'Facultat de Medicina i Ciències de la Salut', 3, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Farmàcia i Ciències de l''Alimentació', 'Facultat de Farmàcia i Ciències de l''Alimentació', 4, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Biologia', 'Facultat de Biologia', 5, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Física', 'Facultat de Física', 6, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Química', 'Facultat de Química', 7, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Geologia', 'Facultat de Geologia', 8, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Matemàtiques', 'Facultat de Matemàtiques', 9, 1, GETDATE(), GETDATE()),
(2, 'Facultat d''Informàtica', 'Facultat d''Informàtica', 10, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Filosofia', 'Facultat de Filosofia', 11, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Geografia i Història', 'Facultat de Geografia i Història', 12, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Filologia', 'Facultat de Filologia', 13, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Psicologia', 'Facultat de Psicologia', 14, 1, GETDATE(), GETDATE()),
(2, 'Facultat d''Educació', 'Facultat d''Educació', 15, 1, GETDATE(), GETDATE()),
(2, 'Facultat de Belles Arts', 'Facultat de Belles Arts', 16, 1, GETDATE(), GETDATE()),
(2, 'Escola d''Infermeria', 'Escola d''Infermeria', 17, 1, GETDATE(), GETDATE()),
(2, 'Escola d''Optometria', 'Escola d''Optometria', 18, 1, GETDATE(), GETDATE()),
(2, 'Escola de Biblioteconomia i Documentació', 'Escola de Biblioteconomia i Documentació', 19, 1, GETDATE(), GETDATE()),
(2, 'Escola de Prevenció i Seguretat Integral', 'Escola de Prevenció i Seguretat Integral', 20, 1, GETDATE(), GETDATE());

-- Insertar valores para TIPOS_ACTIVIDAD
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(3, 'Jornada', 'Jornada de trabajo o presentación', 1, 1, GETDATE(), GETDATE()),
(3, 'Curso', 'Curso de formación', 2, 1, GETDATE(), GETDATE()),
(3, 'Seminario', 'Seminario especializado', 3, 1, GETDATE(), GETDATE()),
(3, 'Conferencia', 'Conferencia o charla', 4, 1, GETDATE(), GETDATE()),
(3, 'Taller', 'Taller práctico', 5, 1, GETDATE(), GETDATE()),
(3, 'Congreso', 'Congreso o simposio', 6, 1, GETDATE(), GETDATE()),
(3, 'Máster', 'Programa de máster', 7, 1, GETDATE(), GETDATE()),
(3, 'Posgrado', 'Programa de posgrado', 8, 1, GETDATE(), GETDATE());

-- Insertar valores para LINEAS_ESTRATEGICAS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(4, 'Línea 1', 'Innovación y desarrollo tecnológico', 1, 1, GETDATE(), GETDATE()),
(4, 'Línea 2', 'Sostenibilidad y medio ambiente', 2, 1, GETDATE(), GETDATE()),
(4, 'Línea 3', 'Salud y bienestar', 3, 1, GETDATE(), GETDATE()),
(4, 'Línea 4', 'Educación y formación', 4, 1, GETDATE(), GETDATE()),
(4, 'Línea 5', 'Cultura y sociedad', 5, 1, GETDATE(), GETDATE());

-- Insertar valores para OBJETIVOS_ESTRATEGICOS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(5, 'Objetivo 1', 'Fomentar la innovación tecnológica', 1, 1, GETDATE(), GETDATE()),
(5, 'Objetivo 2', 'Promover la sostenibilidad', 2, 1, GETDATE(), GETDATE()),
(5, 'Objetivo 3', 'Mejorar la salud pública', 3, 1, GETDATE(), GETDATE()),
(5, 'Objetivo 4', 'Excelencia en la educación', 4, 1, GETDATE(), GETDATE()),
(5, 'Objetivo 5', 'Preservar el patrimonio cultural', 5, 1, GETDATE(), GETDATE());

-- Insertar valores para ACTIVIDADES_RESERVADAS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(6, 'PDI', 'Personal Docente e Investigador', 1, 1, GETDATE(), GETDATE()),
(6, 'PAS', 'Personal de Administración y Servicios', 2, 1, GETDATE(), GETDATE()),
(6, 'Estudiantes', 'Estudiantes de la UB', 3, 1, GETDATE(), GETDATE()),
(6, 'Público general', 'Público general', 4, 1, GETDATE(), GETDATE());

-- Insertar valores para MODALIDADES_GESTION
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(7, 'Acreditada UB', 'Actividad acreditada por la UB', 1, 1, GETDATE(), GETDATE()),
(7, 'Colaboración externa', 'Colaboración con entidades externas', 2, 1, GETDATE(), GETDATE()),
(7, 'Interna', 'Actividad interna de la UB', 3, 1, GETDATE(), GETDATE());

-- Insertar valores para TIPOS_IMPUESTO
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(8, 'IVA 21%', 'IVA general del 21%', 1, 1, GETDATE(), GETDATE()),
(8, 'IVA 10%', 'IVA reducido del 10%', 2, 1, GETDATE(), GETDATE()),
(8, 'IVA 4%', 'IVA superreducido del 4%', 3, 1, GETDATE(), GETDATE()),
(8, 'Exento', 'Exento de IVA', 4, 1, GETDATE(), GETDATE());

-- Insertar valores para FACULTADES
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(9, 'Facultat de Dret', 'Facultat de Dret', 1, 1, GETDATE(), GETDATE()),
(9, 'Facultat d''Economia i Empresa', 'Facultat d''Economia i Empresa', 2, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Medicina i Ciències de la Salut', 'Facultat de Medicina i Ciències de la Salut', 3, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Farmàcia i Ciències de l''Alimentació', 'Facultat de Farmàcia i Ciències de l''Alimentació', 4, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Biologia', 'Facultat de Biologia', 5, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Física', 'Facultat de Física', 6, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Química', 'Facultat de Química', 7, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Geologia', 'Facultat de Geologia', 8, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Matemàtiques', 'Facultat de Matemàtiques', 9, 1, GETDATE(), GETDATE()),
(9, 'Facultat d''Informàtica', 'Facultat d''Informàtica', 10, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Filosofia', 'Facultat de Filosofia', 11, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Geografia i Història', 'Facultat de Geografia i Història', 12, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Filologia', 'Facultat de Filologia', 13, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Psicologia', 'Facultat de Psicologia', 14, 1, GETDATE(), GETDATE()),
(9, 'Facultat d''Educació', 'Facultat d''Educació', 15, 1, GETDATE(), GETDATE()),
(9, 'Facultat de Belles Arts', 'Facultat de Belles Arts', 16, 1, GETDATE(), GETDATE());

-- Insertar valores para DEPARTAMENTOS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(10, 'Departamento de Derecho Civil', 'Departamento de Derecho Civil', 1, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Derecho Penal', 'Departamento de Derecho Penal', 2, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Derecho Público', 'Departamento de Derecho Público', 3, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Economía', 'Departamento de Economía', 4, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Empresa', 'Departamento de Empresa', 5, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Medicina', 'Departamento de Medicina', 6, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Cirugía', 'Departamento de Cirugía', 7, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Farmacia', 'Departamento de Farmacia', 8, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Biología', 'Departamento de Biología', 9, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Física', 'Departamento de Física', 10, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Química', 'Departamento de Química', 11, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Geología', 'Departamento de Geología', 12, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Matemáticas', 'Departamento de Matemáticas', 13, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Ingeniería Informática', 'Departamento de Ingeniería Informática', 14, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Filosofía', 'Departamento de Filosofía', 15, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Historia', 'Departamento de Historia', 16, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Filología', 'Departamento de Filología', 17, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Psicología', 'Departamento de Psicología', 18, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Educación', 'Departamento de Educación', 19, 1, GETDATE(), GETDATE()),
(10, 'Departamento de Bellas Artes', 'Departamento de Bellas Artes', 20, 1, GETDATE(), GETDATE());

-- Insertar valores para IDIOMAS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(11, 'Catalan', 'Català', 1, 1, GETDATE(), GETDATE()),
(11, 'Spanish', 'Español', 2, 1, GETDATE(), GETDATE()),
(11, 'English', 'English', 3, 1, GETDATE(), GETDATE()),
(11, 'French', 'Français', 4, 1, GETDATE(), GETDATE()),
(11, 'German', 'Deutsch', 5, 1, GETDATE(), GETDATE()),
(11, 'Italian', 'Italiano', 6, 1, GETDATE(), GETDATE()),
(11, 'Portuguese', 'Português', 7, 1, GETDATE(), GETDATE());

-- Insertar valores para MODALIDADES_ACTIVIDAD
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(12, 'Presencial', 'Actividad presencial', 1, 1, GETDATE(), GETDATE()),
(12, 'Online', 'Actividad online', 2, 1, GETDATE(), GETDATE()),
(12, 'Híbrida', 'Actividad híbrida (presencial + online)', 3, 1, GETDATE(), GETDATE()),
(12, 'Semipresencial', 'Actividad semipresencial', 4, 1, GETDATE(), GETDATE());

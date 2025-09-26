-- Script SQL para crear los nuevos dominios y sus valores
-- Campos a convertir: Jefe/a unidad gestora, Gestor actividad, Facultad destinataria, Departamento destinatario, Coordinador centre/unitat IDP

-- 1. Dominio: JEFES_UNIDAD_GESTORA
INSERT INTO Dominios (Codigo, Nombre, Descripcion, Activo) 
VALUES ('JEFES_UNIDAD_GESTORA', 'Jefes de Unidad Gestora', 'Lista de jefes de unidad gestora', 1);

-- Obtener el ID del dominio creado
DECLARE @JefesUnidadId INT = SCOPE_IDENTITY();

-- Valores para JEFES_UNIDAD_GESTORA
INSERT INTO ValoresDominio (DominioId, Codigo, Nombre, Descripcion, Activo, Orden) 
VALUES 
(@JefesUnidadId, 'JEFE_001', 'Dr. María García López', 'Jefa de Unidad Gestora - IDP', 1, 1),
(@JefesUnidadId, 'JEFE_002', 'Prof. Carlos Rodríguez Martín', 'Jefe de Unidad Gestora - CRAI', 1, 2);

-- 2. Dominio: GESTORES_ACTIVIDAD
INSERT INTO Dominios (Codigo, Nombre, Descripcion, Activo) 
VALUES ('GESTORES_ACTIVIDAD', 'Gestores de Actividad', 'Lista de gestores de actividad', 1);

DECLARE @GestoresActividadId INT = SCOPE_IDENTITY();

-- Valores para GESTORES_ACTIVIDAD
INSERT INTO ValoresDominio (DominioId, Codigo, Nombre, Descripcion, Activo, Orden) 
VALUES 
(@GestoresActividadId, 'GEST_001', 'Dra. Ana Martínez Sánchez', 'Gestora de Actividad - Formación', 1, 1),
(@GestoresActividadId, 'GEST_002', 'Dr. José Fernández Ruiz', 'Gestor de Actividad - Investigación', 1, 2);

-- 3. Dominio: FACULTADES_DESTINATARIAS
INSERT INTO Dominios (Codigo, Nombre, Descripcion, Activo) 
VALUES ('FACULTADES_DESTINATARIAS', 'Facultades Destinatarias', 'Lista de facultades destinatarias', 1);

DECLARE @FacultadesDestinatariasId INT = SCOPE_IDENTITY();

-- Valores para FACULTADES_DESTINATARIAS
INSERT INTO ValoresDominio (DominioId, Codigo, Nombre, Descripcion, Activo, Orden) 
VALUES 
(@FacultadesDestinatariasId, 'FAC_001', 'Facultad de Informática de Barcelona', 'Facultad de Informática', 1, 1),
(@FacultadesDestinatariasId, 'FAC_002', 'Facultad de Matemáticas', 'Facultad de Matemáticas', 1, 2);

-- 4. Dominio: DEPARTAMENTOS_DESTINATARIOS
INSERT INTO Dominios (Codigo, Nombre, Descripcion, Activo) 
VALUES ('DEPARTAMENTOS_DESTINATARIOS', 'Departamentos Destinatarios', 'Lista de departamentos destinatarios', 1);

DECLARE @DepartamentosDestinatariosId INT = SCOPE_IDENTITY();

-- Valores para DEPARTAMENTOS_DESTINATARIOS
INSERT INTO ValoresDominio (DominioId, Codigo, Nombre, Descripcion, Activo, Orden) 
VALUES 
(@DepartamentosDestinatariosId, 'DEP_001', 'Departamento de Ingeniería Informática', 'Dept. Ingeniería Informática', 1, 1),
(@DepartamentosDestinatariosId, 'DEP_002', 'Departamento de Matemáticas Aplicadas', 'Dept. Matemáticas Aplicadas', 1, 2);

-- 5. Dominio: COORDINADORES_CENTRE_UNITAT_IDP
INSERT INTO Dominios (Codigo, Nombre, Descripcion, Activo) 
VALUES ('COORDINADORES_CENTRE_UNITAT_IDP', 'Coordinadores Centre/Unitat IDP', 'Lista de coordinadores de centre/unitat para IDP', 1);

DECLARE @CoordinadoresCentreUnitatIdpId INT = SCOPE_IDENTITY();

-- Valores para COORDINADORES_CENTRE_UNITAT_IDP
INSERT INTO ValoresDominio (DominioId, Codigo, Nombre, Descripcion, Activo, Orden) 
VALUES 
(@CoordinadoresCentreUnitatIdpId, 'COORD_001', 'Dra. Laura Pérez González', 'Coordinadora Centre/Unitat - Campus Nord', 1, 1),
(@CoordinadoresCentreUnitatIdpId, 'COORD_002', 'Dr. Miguel Torres Herrera', 'Coordinador Centre/Unitat - Campus Sur', 1, 2);

-- Mostrar los dominios creados
SELECT 
    d.Id as 'ID Dominio',
    d.Codigo as 'Código',
    d.Nombre as 'Nombre',
    COUNT(vd.Id) as 'Número de Valores'
FROM Dominios d
LEFT JOIN ValoresDominio vd ON d.Id = vd.DominioId
WHERE d.Codigo IN ('JEFES_UNIDAD_GESTORA', 'GESTORES_ACTIVIDAD', 'FACULTADES_DESTINATARIAS', 'DEPARTAMENTOS_DESTINATARIOS', 'COORDINADORES_CENTRE_UNITAT_IDP')
GROUP BY d.Id, d.Codigo, d.Nombre
ORDER BY d.Id;

-- Mostrar todos los valores creados
SELECT 
    d.Codigo as 'Dominio',
    vd.Id as 'ID Valor',
    vd.Codigo as 'Código Valor',
    vd.Nombre as 'Nombre Valor'
FROM Dominios d
INNER JOIN ValoresDominio vd ON d.Id = vd.DominioId
WHERE d.Codigo IN ('JEFES_UNIDAD_GESTORA', 'GESTORES_ACTIVIDAD', 'FACULTADES_DESTINATARIAS', 'DEPARTAMENTOS_DESTINATARIOS', 'COORDINADORES_CENTRE_UNITAT_IDP')
ORDER BY d.Id, vd.Orden;

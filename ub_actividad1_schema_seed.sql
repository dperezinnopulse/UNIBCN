-- =========================================================
-- Proyecto UB – Actividad 1
-- Script de creación de base de datos + carga mínima de datos
-- SQL Server (2019/2022)
-- =========================================================
IF DB_ID(N'UB_Formacion') IS NULL BEGIN CREATE DATABASE UB_Formacion; END
GO
USE UB_Formacion;
GO
SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; GO

-- Drop en orden seguro (si existen)
IF OBJECT_ID(N'dbo.Mensajes', N'U') IS NOT NULL DROP TABLE dbo.Mensajes;
IF OBJECT_ID(N'dbo.Adjuntos', N'U') IS NOT NULL DROP TABLE dbo.Adjuntos;
IF OBJECT_ID(N'dbo.Participantes', N'U') IS NOT NULL DROP TABLE dbo.Participantes;
IF OBJECT_ID(N'dbo.Subactividades', N'U') IS NOT NULL DROP TABLE dbo.Subactividades;
IF OBJECT_ID(N'dbo.EntidadesColaboradoras', N'U') IS NOT NULL DROP TABLE dbo.EntidadesColaboradoras;
IF OBJECT_ID(N'dbo.EntidadesOrganizadoras', N'U') IS NOT NULL DROP TABLE dbo.EntidadesOrganizadoras;
IF OBJECT_ID(N'dbo.Actividades_Inscripcion', N'U') IS NOT NULL DROP TABLE dbo.Actividades_Inscripcion;
IF OBJECT_ID(N'dbo.Actividades_Economico', N'U') IS NOT NULL DROP TABLE dbo.Actividades_Economico;
IF OBJECT_ID(N'dbo.Actividades_I18N', N'U') IS NOT NULL DROP TABLE dbo.Actividades_I18N;
IF OBJECT_ID(N'dbo.Actividades', N'U') IS NOT NULL DROP TABLE dbo.Actividades;
IF OBJECT_ID(N'dbo.UsuarioUG', N'U') IS NOT NULL DROP TABLE dbo.UsuarioUG;
IF OBJECT_ID(N'dbo.UsuarioRoles', N'U') IS NOT NULL DROP TABLE dbo.UsuarioRoles;
IF OBJECT_ID(N'dbo.Usuarios', N'U') IS NOT NULL DROP TABLE dbo.Usuarios;
IF OBJECT_ID(N'dbo.Roles', N'U') IS NOT NULL DROP TABLE dbo.Roles;
IF OBJECT_ID(N'dbo.UnidadesGestoras', N'U') IS NOT NULL DROP TABLE dbo.UnidadesGestoras;
IF OBJECT_ID(N'dbo.TiposActividad', N'U') IS NOT NULL DROP TABLE dbo.TiposActividad;
IF OBJECT_ID(N'dbo.LineasEstrategicas', N'U') IS NOT NULL DROP TABLE dbo.LineasEstrategicas;
IF OBJECT_ID(N'dbo.ObjetivosEstrategicos', N'U') IS NOT NULL DROP TABLE dbo.ObjetivosEstrategicos;
IF OBJECT_ID(N'dbo.CategoriasSAE', N'U') IS NOT NULL DROP TABLE dbo.CategoriasSAE;
IF OBJECT_ID(N'dbo.TiposEstudioSAE', N'U') IS NOT NULL DROP TABLE dbo.TiposEstudioSAE;
IF OBJECT_ID(N'dbo.Auditoria', N'U') IS NOT NULL DROP TABLE dbo.Auditoria;

-- Roles, UGs y usuarios
CREATE TABLE dbo.Roles (RoleId INT IDENTITY(1,1) PRIMARY KEY, Nombre NVARCHAR(50) NOT NULL UNIQUE);
CREATE TABLE dbo.UnidadesGestoras (Codigo NVARCHAR(10) NOT NULL PRIMARY KEY, Nombre NVARCHAR(100) NOT NULL);
CREATE TABLE dbo.Usuarios (
  UsuarioId INT IDENTITY(1,1) PRIMARY KEY,
  UserName NVARCHAR(100) NOT NULL UNIQUE,
  Email NVARCHAR(255) NOT NULL UNIQUE,
  Nombre NVARCHAR(100) NOT NULL,
  Apellidos NVARCHAR(150) NULL,
  PasswordHash NVARCHAR(255) NULL,
  Activo BIT NOT NULL DEFAULT(1),
  FechaAlta DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE TABLE dbo.UsuarioRoles (
  UsuarioId INT NOT NULL, RoleId INT NOT NULL,
  PRIMARY KEY (UsuarioId, RoleId),
  CONSTRAINT FK_UsuarioRoles_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuarios(UsuarioId) ON DELETE CASCADE,
  CONSTRAINT FK_UsuarioRoles_Role FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId) ON DELETE CASCADE
);
CREATE TABLE dbo.UsuarioUG (
  UsuarioId INT NOT NULL, UGCodigo NVARCHAR(10) NOT NULL,
  PRIMARY KEY (UsuarioId, UGCodigo),
  CONSTRAINT FK_UsuarioUG_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuarios(UsuarioId) ON DELETE CASCADE,
  CONSTRAINT FK_UsuarioUG_UG FOREIGN KEY (UGCodigo) REFERENCES dbo.UnidadesGestoras(Codigo) ON DELETE CASCADE
);

-- Catálogos
CREATE TABLE dbo.TiposActividad (TipoActividadId INT IDENTITY(1,1) PRIMARY KEY, Nombre NVARCHAR(100) NOT NULL UNIQUE);
CREATE TABLE dbo.LineasEstrategicas (LineaEstrategicaId INT IDENTITY(1,1) PRIMARY KEY, Nombre NVARCHAR(150) NOT NULL UNIQUE);
CREATE TABLE dbo.ObjetivosEstrategicos (ObjetivoEstrategicoId INT IDENTITY(1,1) PRIMARY KEY, Nombre NVARCHAR(150) NOT NULL UNIQUE);
CREATE TABLE dbo.CategoriasSAE (CategoriaSAEId INT IDENTITY(1,1) PRIMARY KEY, Nombre NVARCHAR(100) NOT NULL UNIQUE);
CREATE TABLE dbo.TiposEstudioSAE (TipoEstudioSAEId INT IDENTITY(1,1) PRIMARY KEY, Nombre NVARCHAR(100) NOT NULL UNIQUE);

-- Actividades núcleo
CREATE TABLE dbo.Actividades (
  ActividadId INT IDENTITY(1,1) PRIMARY KEY,
  Codigo NVARCHAR(50) NOT NULL UNIQUE,
  AnioAcademico NVARCHAR(9) NOT NULL,
  TipoActividadId INT NULL,
  UGFiltro NVARCHAR(10) NOT NULL,
  UnidadGestora NVARCHAR(50) NOT NULL,
  LineaEstrategicaId INT NULL,
  ObjetivoEstrategicoId INT NULL,
  CodigoRelacionado NVARCHAR(50) NULL,
  Reservada BIT NOT NULL DEFAULT(0),
  FechaActividad DATE NULL,
  MotivoCierre NVARCHAR(255) NULL,
  CondicionesEconomicas NVARCHAR(500) NULL,
  Requisitos NVARCHAR(500) NULL,
  DuracionHoras DECIMAL(6,2) NULL,
  FechaInicio DATETIME2 NULL,
  FechaFin DATETIME2 NULL,
  CategoriaSAEId INT NULL,
  TipoEstudioSAEId INT NULL,
  CreditosMinSAE DECIMAL(5,2) NULL,
  CreditosMaxSAE DECIMAL(5,2) NULL,
  Estado NVARCHAR(20) NOT NULL CONSTRAINT DF_Actividades_Estado DEFAULT(N'borrador'),
  FechaCreacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  FechaActualizacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT CK_Actividades_Estado CHECK (Estado IN (N'borrador', N'publicada', N'cerrada')),
  CONSTRAINT FK_Actividades_Tipo FOREIGN KEY (TipoActividadId) REFERENCES dbo.TiposActividad(TipoActividadId),
  CONSTRAINT FK_Actividades_UG FOREIGN KEY (UGFiltro) REFERENCES dbo.UnidadesGestoras(Codigo),
  CONSTRAINT FK_Actividades_Linea FOREIGN KEY (LineaEstrategicaId) REFERENCES dbo.LineasEstrategicas(LineaEstrategicaId),
  CONSTRAINT FK_Actividades_Objetivo FOREIGN KEY (ObjetivoEstrategicoId) REFERENCES dbo.ObjetivosEstrategicos(ObjetivoEstrategicoId),
  CONSTRAINT FK_Actividades_CategoriaSAE FOREIGN KEY (CategoriaSAEId) REFERENCES dbo.CategoriasSAE(CategoriaSAEId),
  CONSTRAINT FK_Actividades_TipoEstudio FOREIGN KEY (TipoEstudioSAEId) REFERENCES dbo.TiposEstudioSAE(TipoEstudioSAEId)
);
CREATE INDEX IX_Actividades_UG ON dbo.Actividades(UGFiltro);
CREATE INDEX IX_Actividades_Estado ON dbo.Actividades(Estado);
CREATE INDEX IX_Actividades_Fechas ON dbo.Actividades(FechaInicio, FechaFin);

-- I18N
CREATE TABLE dbo.Actividades_I18N (
  ActividadI18NId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NOT NULL,
  Idioma CHAR(3) NOT NULL,
  Titulo NVARCHAR(255) NOT NULL,
  Descripcion NVARCHAR(MAX) NULL,
  Contenidos NVARCHAR(MAX) NULL,
  Objetivos NVARCHAR(MAX) NULL,
  Competencias NVARCHAR(MAX) NULL,
  Condiciones NVARCHAR(MAX) NULL,
  CONSTRAINT UQ_Actividades_I18N UNIQUE (ActividadId, Idioma),
  CONSTRAINT FK_ActI18N_Actividades FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);

-- Económico
CREATE TABLE dbo.Actividades_Economico (
  ActividadId INT NOT NULL PRIMARY KEY,
  ImporteBase DECIMAL(10,2) NOT NULL CONSTRAINT DF_Eco_Importe DEFAULT(0),
  ImpuestoPct DECIMAL(5,2) NOT NULL CONSTRAINT DF_Eco_Impuesto DEFAULT(0),
  DescuentoPct DECIMAL(5,2) NOT NULL CONSTRAINT DF_Eco_Descuento DEFAULT(0),
  CodigoPromocional NVARCHAR(50) NULL,
  Condiciones NVARCHAR(MAX) NULL,
  CONSTRAINT CK_Eco_Impuesto CHECK (ImpuestoPct BETWEEN 0 AND 100),
  CONSTRAINT CK_Eco_Descuento CHECK (DescuentoPct BETWEEN 0 AND 100),
  CONSTRAINT FK_Eco_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);

-- Inscripción
CREATE TABLE dbo.Actividades_Inscripcion (
  ActividadId INT NOT NULL PRIMARY KEY,
  Plazas INT NULL,
  Requisitos NVARCHAR(MAX) NULL,
  FechaInicioInscripcion DATETIME2 NULL,
  FechaFinInscripcion DATETIME2 NULL,
  UrlInscripcion NVARCHAR(255) NULL,
  CONSTRAINT FK_Ins_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);

-- Entidades
CREATE TABLE dbo.EntidadesOrganizadoras (
  EntidadOrgId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NOT NULL,
  Nombre NVARCHAR(255) NOT NULL,
  NifCif NVARCHAR(20) NULL,
  Web NVARCHAR(255) NULL,
  PersonaContacto NVARCHAR(255) NULL,
  Email NVARCHAR(255) NULL,
  Telefono NVARCHAR(50) NULL,
  Principal BIT NOT NULL DEFAULT(0),
  CONSTRAINT FK_EntOrg_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);
CREATE TABLE dbo.EntidadesColaboradoras (
  EntidadColId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NOT NULL,
  Nombre NVARCHAR(255) NOT NULL,
  Aportacion NVARCHAR(255) NULL,
  CONSTRAINT FK_EntCol_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);

-- Subactividades y Participantes
CREATE TABLE dbo.Subactividades (
  SubactividadId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NOT NULL,
  Orden INT NULL,
  Nombre NVARCHAR(255) NOT NULL,
  FechaInicio DATETIME2 NULL,
  FechaFin DATETIME2 NULL,
  DuracionHoras DECIMAL(6,2) NULL,
  Modalidad NVARCHAR(50) NULL,
  Ubicacion NVARCHAR(255) NULL,
  CONSTRAINT FK_Sub_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);
CREATE INDEX IX_Sub_Actividad_Fecha ON dbo.Subactividades(ActividadId, FechaInicio);

CREATE TABLE dbo.Participantes (
  ParticipanteId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NOT NULL,
  Rol NVARCHAR(50) NOT NULL,
  Nombre NVARCHAR(255) NOT NULL,
  Email NVARCHAR(255) NULL,
  Telefono NVARCHAR(50) NULL,
  CentroUnidad NVARCHAR(255) NULL,
  CONSTRAINT FK_Part_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);
CREATE INDEX IX_Part_Actividad_Rol ON dbo.Participantes(ActividadId, Rol);

-- Adjuntos
CREATE TABLE dbo.Adjuntos (
  AdjuntoId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NOT NULL,
  Tipo NVARCHAR(50) NULL,
  NombreArchivo NVARCHAR(255) NOT NULL,
  Ruta NVARCHAR(500) NOT NULL,
  FechaSubida DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Adj_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE
);

-- Mensajes
CREATE TABLE dbo.Mensajes (
  MensajeId INT IDENTITY(1,1) PRIMARY KEY,
  ActividadId INT NULL,
  UGFiltro NVARCHAR(10) NULL,
  Titulo NVARCHAR(200) NOT NULL,
  Cuerpo NVARCHAR(MAX) NOT NULL,
  FechaPublicacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  Vigente BIT NOT NULL DEFAULT(1),
  CONSTRAINT FK_Msg_Actividad FOREIGN KEY (ActividadId) REFERENCES dbo.Actividades(ActividadId) ON DELETE CASCADE,
  CONSTRAINT FK_Msg_UG FOREIGN KEY (UGFiltro) REFERENCES dbo.UnidadesGestoras(Codigo)
);

-- Auditoría
CREATE TABLE dbo.Auditoria (
  AuditoriaId INT IDENTITY(1,1) PRIMARY KEY,
  Entidad NVARCHAR(50) NOT NULL,
  EntidadId INT NOT NULL,
  Accion NVARCHAR(20) NOT NULL,
  Usuario NVARCHAR(255) NULL,
  Fecha DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  DatosAntes NVARCHAR(MAX) NULL,
  DatosDespues NVARCHAR(MAX) NULL
);

-- Semillas
INSERT INTO dbo.Roles (Nombre) VALUES (N'Admin'), (N'Editor'), (N'Lector');
INSERT INTO dbo.UnidadesGestoras (Codigo, Nombre) VALUES
(N'IDP', N'Institut de Formació Permanent'),
(N'CRAI', N'Centre de Recursos per a l’Aprenentatge i la Investigació'),
(N'SAE', N'Servei d’Atenció a l’Estudiant');

INSERT INTO dbo.Usuarios (UserName, Email, Nombre, Apellidos, PasswordHash) VALUES
(N'admin', N'admin@ub.edu', N'Admin', N'Sistema', N'HASHED:demo'),
(N'editor.idp', N'editor.idp@ub.edu', N'Elena', N'Editor', N'HASHED:demo'),
(N'coord.crai', N'coord.crai@ub.edu', N'Carles', N'Coordin', N'HASHED:demo');

INSERT INTO dbo.UsuarioRoles (UsuarioId, RoleId)
SELECT u.UsuarioId, r.RoleId FROM dbo.Usuarios u JOIN dbo.Roles r ON r.Nombre=N'Admin' WHERE u.UserName=N'admin';

INSERT INTO dbo.UsuarioRoles (UsuarioId, RoleId)
SELECT u.UsuarioId, r.RoleId FROM dbo.Usuarios u JOIN dbo.Roles r ON r.Nombre=N'Editor' WHERE u.UserName IN (N'editor.idp', N'coord.crai');

INSERT INTO dbo.UsuarioUG (UsuarioId, UGCodigo)
SELECT u.UsuarioId, N'IDP' FROM dbo.Usuarios u WHERE u.UserName=N'editor.idp';
INSERT INTO dbo.UsuarioUG (UsuarioId, UGCodigo)
SELECT u.UsuarioId, N'CRAI' FROM dbo.Usuarios u WHERE u.UserName=N'coord.crai';

INSERT INTO dbo.TiposActividad (Nombre) VALUES (N'Curso'), (N'Seminario'), (N'Taller');
INSERT INTO dbo.LineasEstrategicas (Nombre) VALUES (N'Calidad Docente'), (N'Innovación'), (N'Internacionalización');
INSERT INTO dbo.ObjetivosEstrategicos (Nombre) VALUES (N'Mejorar competencias'), (N'Fomentar investigación'), (N'Aumentar empleabilidad');
INSERT INTO dbo.CategoriasSAE (Nombre) VALUES (N'Formación Continua'), (N'Especialización');
INSERT INTO dbo.TiposEstudioSAE (Nombre) VALUES (N'Certificado UB'), (N'Diploma UB');

-- Actividades demo (2)
INSERT INTO dbo.Actividades (Codigo, AnioAcademico, TipoActividadId, UGFiltro, UnidadGestora, LineaEstrategicaId, ObjetivoEstrategicoId,
 Reservada, FechaActividad, DuracionHoras, FechaInicio, FechaFin, CategoriaSAEId, TipoEstudioSAEId, CreditosMinSAE, CreditosMaxSAE, Estado)
SELECT N'ACT-2025-001', N'2025-2026', ta.TipoActividadId, N'IDP', N'Institut de Formació Permanent',
 le.LineaEstrategicaId, oe.ObjetivoEstrategicoId, 0, CAST(N'2025-10-15' AS DATE), 6.0,
 CAST(N'2025-10-15T09:00:00' AS DATETIME2), CAST(N'2025-10-15T15:00:00' AS DATETIME2),
 cs.CategoriaSAEId, ts.TipoEstudioSAEId, 1.0, 3.0, N'borrador'
FROM dbo.TiposActividad ta
JOIN dbo.LineasEstrategicas le ON le.Nombre=N'Calidad Docente'
JOIN dbo.ObjetivosEstrategicos oe ON oe.Nombre=N'Mejorar competencias'
JOIN dbo.CategoriasSAE cs ON cs.Nombre=N'Formación Continua'
JOIN dbo.TiposEstudioSAE ts ON ts.Nombre=N'Certificado UB'
WHERE ta.Nombre=N'Curso';

INSERT INTO dbo.Actividades (Codigo, AnioAcademico, TipoActividadId, UGFiltro, UnidadGestora, LineaEstrategicaId, ObjetivoEstrategicoId,
 Reservada, FechaActividad, DuracionHoras, FechaInicio, FechaFin, CategoriaSAEId, TipoEstudioSAEId, CreditosMinSAE, CreditosMaxSAE, Estado)
SELECT N'ACT-2025-002', N'2025-2026', ta.TipoActividadId, N'CRAI', N'CRAI',
 le.LineaEstrategicaId, oe.ObjetivoEstrategicoId, 0, CAST(N'2025-11-10' AS DATE), 9.0,
 CAST(N'2025-11-10T10:00:00' AS DATETIME2), CAST(N'2025-11-10T19:00:00' AS DATETIME2),
 cs.CategoriaSAEId, ts.TipoEstudioSAEId, 2.0, 4.0, N'publicada'
FROM dbo.TiposActividad ta
JOIN dbo.LineasEstrategicas le ON le.Nombre=N'Innovación'
JOIN dbo.ObjetivosEstrategicos oe ON oe.Nombre=N'Fomentar investigación'
JOIN dbo.CategoriasSAE cs ON cs.Nombre=N'Especialización'
JOIN dbo.TiposEstudioSAE ts ON ts.Nombre=N'Diploma UB'
WHERE ta.Nombre=N'Seminario';

-- I18N, Económico, Inscripción
INSERT INTO dbo.Actividades_I18N (ActividadId, Idioma, Titulo, Descripcion)
SELECT ActividadId, 'CAS', N'Introducción a la Docencia Activa', N'Curso práctico de metodologías activas.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Actividades_I18N (ActividadId, Idioma, Titulo, Descripcion)
SELECT ActividadId, 'CAT', N'Introducció a la Docència Activa', N'Curs pràctic de metodologies actives.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Actividades_I18N (ActividadId, Idioma, Titulo, Descripcion)
SELECT ActividadId, 'ENG', N'Introduction to Active Teaching', N'Hands-on course on active methodologies.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';

INSERT INTO dbo.Actividades_I18N (ActividadId, Idioma, Titulo, Descripcion)
SELECT ActividadId, 'CAS', N'Gestión de Recursos CRAI', N'Seminario sobre recursos y herramientas CRAI.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';
INSERT INTO dbo.Actividades_I18N (ActividadId, Idioma, Titulo, Descripcion)
SELECT ActividadId, 'CAT', N'Gestió de Recursos CRAI', N'Seminari sobre recursos i eines CRAI.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';
INSERT INTO dbo.Actividades_I18N (ActividadId, Idioma, Titulo, Descripcion)
SELECT ActividadId, 'ENG', N'CRAI Resources Management', N'Seminar on CRAI resources and tools.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';

-- Económico
INSERT INTO dbo.Actividades_Economico (ActividadId, ImporteBase, ImpuestoPct, DescuentoPct, CodigoPromocional)
SELECT ActividadId, 100.00, 21.00, 10.00, N'PROMO10' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Actividades_Economico (ActividadId, ImporteBase, ImpuestoPct, DescuentoPct)
SELECT ActividadId, 0.00, 0.00, 0.00 FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';

-- Inscripción
INSERT INTO dbo.Actividades_Inscripcion (ActividadId, Plazas, Requisitos, FechaInicioInscripcion, FechaFinInscripcion, UrlInscripcion)
SELECT ActividadId, 30, N'Interés en docencia activa', '2025-09-01T00:00:00', '2025-10-10T23:59:59', N'https://ub.edu/inscripcion/act-2025-001' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Actividades_Inscripcion (ActividadId, Plazas, Requisitos, FechaInicioInscripcion, FechaFinInscripcion, UrlInscripcion)
SELECT ActividadId, 50, N'Personal CRAI', '2025-10-01T00:00:00', '2025-11-09T23:59:59', N'https://ub.edu/inscripcion/act-2025-002' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';

-- Entidades
INSERT INTO dbo.EntidadesOrganizadoras (ActividadId, Nombre, Principal, Email)
SELECT ActividadId, N'Universitat de Barcelona', 1, N'info@ub.edu' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.EntidadesColaboradoras (ActividadId, Nombre, Aportacion)
SELECT ActividadId, N'Fundació Bosch i Gimpera', N'Patrocinio material' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';

-- Subactividades y Participantes
INSERT INTO dbo.Subactividades (ActividadId, Orden, Nombre, FechaInicio, FechaFin, DuracionHoras, Modalidad, Ubicacion)
SELECT ActividadId, 1, N'Sesión 1: Teoría', '2025-10-15T09:00:00', '2025-10-15T11:00:00', 2.0, N'Presencial', N'Aula 1' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Subactividades (ActividadId, Orden, Nombre, FechaInicio, FechaFin, DuracionHoras, Modalidad, Ubicacion)
SELECT ActividadId, 2, N'Sesión 2: Taller', '2025-10-15T11:30:00', '2025-10-15T15:00:00', 3.5, N'Presencial', N'Aula 2' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';

INSERT INTO dbo.Subactividades (ActividadId, Orden, Nombre, FechaInicio, FechaFin, DuracionHoras, Modalidad, Ubicacion)
SELECT ActividadId, 1, N'Bloque Único', '2025-11-10T10:00:00', '2025-11-10T19:00:00', 9.0, N'Online', N'Teams' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';

INSERT INTO dbo.Participantes (ActividadId, Rol, Nombre, Email)
SELECT ActividadId, N'Docente', N'Laura Martínez', N'laura.martinez@ub.edu' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Participantes (ActividadId, Rol, Nombre, Email)
SELECT ActividadId, N'Coordinador', N'Jordi Pérez', N'jordi.perez@ub.edu' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Participantes (ActividadId, Rol, Nombre, Email)
SELECT ActividadId, N'Docente', N'Anna Rovira', N'anna.rovira@ub.edu' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-002';

-- Mensajes y Adjuntos
INSERT INTO dbo.Mensajes (ActividadId, Titulo, Cuerpo)
SELECT ActividadId, N'Recordatorio de inscripción', N'La inscripción cierra el 10/10/2025.' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';
INSERT INTO dbo.Mensajes (UGFiltro, Titulo, Cuerpo)
VALUES (N'CRAI', N'Nueva guía CRAI', N'Disponible nueva guía de recursos en el portal CRAI.');

INSERT INTO dbo.Adjuntos (ActividadId, Tipo, NombreArchivo, Ruta)
SELECT ActividadId, N'Programa', N'programa_act_2025_001.pdf', N'/files/act_2025_001/programa.pdf' FROM dbo.Actividades WHERE Codigo=N'ACT-2025-001';

-- Fin
UPDATE dbo.Actividades SET FechaActualizacion = SYSUTCDATETIME();
CREATE UNIQUE INDEX UQ_Act_Codigo ON dbo.Actividades(Codigo) WHERE Codigo IS NOT NULL;
PRINT '>>> Script completado.';

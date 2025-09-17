USE UB_Formacion;
GO

BEGIN TRY
  BEGIN TRAN;

  -- Limpieza catálogos de workflow
  DELETE FROM TransicionesEstado;
  DELETE FROM MapeoRoles;
  DELETE FROM RolesNormalizados;
  DELETE FROM EstadosActividad;

  DBCC CHECKIDENT ('TransicionesEstado', RESEED, 0);
  DBCC CHECKIDENT ('MapeoRoles', RESEED, 0);
  DBCC CHECKIDENT ('RolesNormalizados', RESEED, 0);
  DBCC CHECKIDENT ('EstadosActividad', RESEED, 0);

  -- Estados (IDs empezarán en 1)
  INSERT INTO EstadosActividad (Codigo, Nombre, Descripcion, Color, Orden, Activo)
  VALUES
    ('BORRADOR', 'Borrador', 'Edición por proponente; no enviado.', '#6c757d', 1, 1),
    ('ENVIADA', 'Enviada', 'Registrada para revisión inicial.', '#0dcaf0', 2, 1),
    ('EN_REVISION', 'En revisión', 'Revisión por Coordinador de Formación.', '#6f42c1', 3, 1),
    ('VALIDACION_UNIDAD', 'Validación de unidad', 'Revisión por Responsable de Unidad.', '#20c997', 4, 1),
    ('DEFINICION', 'Definición', 'Definición académico-docente y subactividades.', '#17a2b8', 5, 1),
    ('REVISION_ADMIN', 'Revisión administrativa', 'Control final por Soporte Administrativo.', '#fd7e14', 6, 1),
    ('PUBLICADA', 'Publicada', 'Visible en catálogo.', '#28a745', 7, 1),
    ('CANCELADA', 'Cancelada', 'Cierre anticipado con motivo.', '#343a40', 8, 1),
    ('RECHAZADA', 'Rechazada', 'Denegada, con comentario.', '#dc3545', 9, 1);

  -- Roles normalizados
  INSERT INTO RolesNormalizados (Codigo, Nombre, Descripcion, Activo)
  VALUES
    ('DOCENTE', 'Docente/Dinamizador', 'Crea/edita y envía propuestas', 1),
    ('TECNICO', 'Técnico de Formación', 'Completa definición y logística', 1),
    ('COORDINADOR', 'Coordinador de Formación', 'Primer validador', 1),
    ('RESPONSABLE', 'Responsable de Unidad', 'Validador final previo a definición', 1),
    ('SOPORTE', 'Soporte Administrativo', 'Revisión administrativa y publicación', 1),
    ('ADMIN', 'Administrador', 'Poderes globales', 1);

  -- Mapeo desde los nombres de usuario.Rol a roles normalizados
  INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
  SELECT 'Docente', r.Id, 1 FROM RolesNormalizados r WHERE r.Codigo='DOCENTE';
  INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
  SELECT 'TecnicoFormacion', r.Id, 1 FROM RolesNormalizados r WHERE r.Codigo='TECNICO';
  INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
  SELECT 'CoordinadorFormacion', r.Id, 1 FROM RolesNormalizados r WHERE r.Codigo='COORDINADOR';
  INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
  SELECT 'ResponsableUnidad', r.Id, 1 FROM RolesNormalizados r WHERE r.Codigo='RESPONSABLE';
  INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
  SELECT 'SoporteAdmin', r.Id, 1 FROM RolesNormalizados r WHERE r.Codigo='SOPORTE';
  INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId, Activo)
  SELECT 'Admin', r.Id, 1 FROM RolesNormalizados r WHERE r.Codigo='ADMIN';

  -- Transiciones (por rol permitido)
  DECLARE @BOR NVARCHAR(50)='BORRADOR', @ENV NVARCHAR(50)='ENVIADA', @ENR NVARCHAR(50)='EN_REVISION',
          @VUN NVARCHAR(50)='VALIDACION_UNIDAD', @DEF NVARCHAR(50)='DEFINICION', @RAD NVARCHAR(50)='REVISION_ADMIN',
          @PUB NVARCHAR(50)='PUBLICADA', @CAN NVARCHAR(50)='CANCELADA', @REJ NVARCHAR(50)='RECHAZADA';

  -- Envío
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@BOR, @ENV, 'Docente', 'enviar', 1),
         (@BOR, @ENV, 'TecnicoFormacion', 'enviar', 1);

  -- Revisión inicial
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@ENV, @ENR, 'CoordinadorFormacion', 'recibir', 1);

  -- Aprobación/devolución por Coordinador
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@ENR, @VUN, 'CoordinadorFormacion', 'aprobar', 1),
         (@ENR, @BOR, 'CoordinadorFormacion', 'devolver', 1);

  -- Validación de unidad
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@VUN, @DEF, 'ResponsableUnidad', 'aprobar', 1),
         (@VUN, @ENR, 'ResponsableUnidad', 'devolver', 1);

  -- Definición → Revisión adm.
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@DEF, @RAD, 'TecnicoFormacion', 'enviar', 1);

  -- Revisión administrativa: publicar o devolver a definición
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@RAD, @PUB, 'SoporteAdmin', 'publicar', 1),
         (@RAD, @DEF, 'SoporteAdmin', 'devolver', 1);

  -- Cancelar/Rechazar (solo Admin, desde cualquier estado no final)
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  SELECT e.Codigo, @CAN, 'Admin', 'cancelar', 1 FROM EstadosActividad e WHERE e.Codigo NOT IN (@CAN, @REJ);
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  SELECT e.Codigo, @REJ, 'Admin', 'rechazar', 1 FROM EstadosActividad e WHERE e.Codigo NOT IN (@CAN, @REJ);

  -- Reabrir desde finales
  INSERT INTO TransicionesEstado (EstadoOrigenCodigo, EstadoDestinoCodigo, RolPermitido, Accion, Activo)
  VALUES (@CAN, @BOR, 'Admin', 'reabrir', 1),
         (@REJ, @BOR, 'Admin', 'reabrir', 1),
         (@CAN, @BOR, 'Docente', 'reabrir', 1),
         (@REJ, @BOR, 'Docente', 'reabrir', 1);

  -- Usuarios de prueba por UG (password plano '1234')
  DECLARE @UG_IDP INT = (SELECT TOP 1 Id FROM UnidadesGestion WHERE Codigo='IDP');
  DECLARE @UG_CRAI INT = (SELECT TOP 1 Id FROM UnidadesGestion WHERE Codigo='CRAI');
  DECLARE @UG_SAE INT = (SELECT TOP 1 Id FROM UnidadesGestion WHERE Codigo='SAE');

  -- Helper: inserta si no existe
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='docente.idp')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('docente.idp', '1234', 'Docente', @UG_IDP, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='docente.crai')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('docente.crai', '1234', 'Docente', @UG_CRAI, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='docente.sae')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('docente.sae', '1234', 'Docente', @UG_SAE, 1, SYSUTCDATETIME());

  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='tecnico.idp')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('tecnico.idp', '1234', 'TecnicoFormacion', @UG_IDP, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='tecnico.crai')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('tecnico.crai', '1234', 'TecnicoFormacion', @UG_CRAI, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='tecnico.sae')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('tecnico.sae', '1234', 'TecnicoFormacion', @UG_SAE, 1, SYSUTCDATETIME());

  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='coord.idp')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('coord.idp', '1234', 'CoordinadorFormacion', @UG_IDP, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='coord.crai')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('coord.crai', '1234', 'CoordinadorFormacion', @UG_CRAI, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='coord.sae')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('coord.sae', '1234', 'CoordinadorFormacion', @UG_SAE, 1, SYSUTCDATETIME());

  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='resp.idp')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('resp.idp', '1234', 'ResponsableUnidad', @UG_IDP, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='resp.crai')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('resp.crai', '1234', 'ResponsableUnidad', @UG_CRAI, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='resp.sae')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('resp.sae', '1234', 'ResponsableUnidad', @UG_SAE, 1, SYSUTCDATETIME());

  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='soporte.idp')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('soporte.idp', '1234', 'SoporteAdmin', @UG_IDP, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='soporte.crai')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('soporte.crai', '1234', 'SoporteAdmin', @UG_CRAI, 1, SYSUTCDATETIME());
  IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE Username='soporte.sae')
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('soporte.sae', '1234', 'SoporteAdmin', @UG_SAE, 1, SYSUTCDATETIME());

  COMMIT;
  PRINT '>>> Workflow sembrado y usuarios de prueba creados.';
END TRY
BEGIN CATCH
  IF @@TRANCOUNT > 0 ROLLBACK;
  DECLARE @Err NVARCHAR(4000)=ERROR_MESSAGE();
  RAISERROR('Error en seed-workflow.sql: %s', 16, 1, @Err);
END CATCH;



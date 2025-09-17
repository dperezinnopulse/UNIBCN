USE UB_Formacion;
GO

BEGIN TRY
    BEGIN TRAN;

    -- Borrado de datos (conservando UnidadesGestion, Dominios y ValoresDominio)
    DELETE FROM MensajesUsuarios;
    DELETE FROM Adjuntos;
    DELETE FROM Mensajes;
    DELETE FROM HilosMensajes;

    DELETE FROM ActividadAdjuntos;
    DELETE FROM CambiosEstadoActividad;
    DELETE FROM ActividadEstadoHistorial;

    DELETE FROM Participantes;
    DELETE FROM Subactividades;
    DELETE FROM ImportesDescuentos;
    DELETE FROM Internacionalizaciones;
    DELETE FROM EntidadesOrganizadoras;

    DELETE FROM Actividades;

    DELETE FROM TransicionesEstado;
    DELETE FROM MapeoRoles;
    DELETE FROM RolesNormalizados;
    DELETE FROM EstadosActividad;

    DELETE FROM Usuarios;

    -- Reseed identidades a 1 (RESEED 0 -> siguiente será 1)
    DBCC CHECKIDENT ('Actividades', RESEED, 0);
    DBCC CHECKIDENT ('ActividadAdjuntos', RESEED, 0);
    DBCC CHECKIDENT ('ActividadEstadoHistorial', RESEED, 0);
    DBCC CHECKIDENT ('Adjuntos', RESEED, 0);
    DBCC CHECKIDENT ('CambiosEstadoActividad', RESEED, 0);
    DBCC CHECKIDENT ('EntidadesOrganizadoras', RESEED, 0);
    DBCC CHECKIDENT ('EstadosActividad', RESEED, 0);
    DBCC CHECKIDENT ('HilosMensajes', RESEED, 0);
    DBCC CHECKIDENT ('ImportesDescuentos', RESEED, 0);
    DBCC CHECKIDENT ('Internacionalizaciones', RESEED, 0);
    DBCC CHECKIDENT ('MapeoRoles', RESEED, 0);
    DBCC CHECKIDENT ('Mensajes', RESEED, 0);
    DBCC CHECKIDENT ('MensajesUsuarios', RESEED, 0);
    DBCC CHECKIDENT ('Participantes', RESEED, 0);
    DBCC CHECKIDENT ('RolesNormalizados', RESEED, 0);
    DBCC CHECKIDENT ('Subactividades', RESEED, 0);
    DBCC CHECKIDENT ('TransicionesEstado', RESEED, 0);
    DBCC CHECKIDENT ('Usuarios', RESEED, 0);

    -- Insertar Admin inicial (sin UG), password en texto plano para entorno dev
    INSERT INTO Usuarios (Username, PasswordHash, Rol, UnidadGestionId, Activo, FechaCreacion)
    VALUES ('Admin', 'Admin', 'Admin', NULL, 1, SYSUTCDATETIME());

    COMMIT;
    PRINT '>>> Limpieza completada. Admin creado (Admin/Admin).';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
    DECLARE @Err NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR('Error en wipe-app-data.sql: %s', 16, 1, @Err);
END CATCH;



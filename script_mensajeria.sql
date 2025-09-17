-- =========================================================
-- Script para crear las tablas del módulo de mensajería
-- UB Formación - Sistema de Actividades
-- =========================================================

USE UB_Formacion;
GO

-- Tabla de hilos de mensajes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'HilosMensajes')
CREATE TABLE HilosMensajes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ActividadId INT NOT NULL,
    Titulo NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(1000) NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_HilosMensajes_Actividad FOREIGN KEY (ActividadId) REFERENCES Actividades(Id) ON DELETE CASCADE
);

-- Tabla de mensajes individuales
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Mensajes')
CREATE TABLE Mensajes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    HiloMensajeId INT NOT NULL,
    UsuarioId INT NOT NULL,
    Contenido NVARCHAR(2000) NOT NULL,
    Asunto NVARCHAR(200) NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME2 NULL,
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Mensajes_HiloMensaje FOREIGN KEY (HiloMensajeId) REFERENCES HilosMensajes(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Mensajes_Usuario FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE NO ACTION
);

-- Tabla de adjuntos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Adjuntos')
CREATE TABLE Adjuntos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MensajeId INT NOT NULL,
    NombreArchivo NVARCHAR(255) NOT NULL,
    RutaArchivo NVARCHAR(500) NOT NULL,
    TipoMime NVARCHAR(100) NULL,
    TamañoBytes BIGINT NOT NULL DEFAULT 0,
    FechaSubida DATETIME2 NOT NULL DEFAULT GETDATE(),
    Activo BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Adjuntos_Mensaje FOREIGN KEY (MensajeId) REFERENCES Mensajes(Id) ON DELETE CASCADE
);

-- Tabla de control de mensajes leídos/no leídos por usuario
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MensajesUsuarios')
CREATE TABLE MensajesUsuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    MensajeId INT NOT NULL,
    UsuarioId INT NOT NULL,
    Leido BIT NOT NULL DEFAULT 0,
    FechaLectura DATETIME2 NULL,
    FechaCreacion DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_MensajesUsuarios_Mensaje FOREIGN KEY (MensajeId) REFERENCES Mensajes(Id) ON DELETE CASCADE,
    CONSTRAINT FK_MensajesUsuarios_Usuario FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id) ON DELETE CASCADE,
    CONSTRAINT UK_MensajesUsuarios_Mensaje_Usuario UNIQUE (MensajeId, UsuarioId)
);

-- Índices para mejorar el rendimiento
CREATE NONCLUSTERED INDEX IX_HilosMensajes_ActividadId ON HilosMensajes(ActividadId);
CREATE NONCLUSTERED INDEX IX_Mensajes_HiloMensajeId ON Mensajes(HiloMensajeId);
CREATE NONCLUSTERED INDEX IX_Mensajes_UsuarioId ON Mensajes(UsuarioId);
CREATE NONCLUSTERED INDEX IX_Adjuntos_MensajeId ON Adjuntos(MensajeId);
CREATE NONCLUSTERED INDEX IX_MensajesUsuarios_UsuarioId ON MensajesUsuarios(UsuarioId);
CREATE NONCLUSTERED INDEX IX_MensajesUsuarios_Leido ON MensajesUsuarios(Leido);

-- Datos de prueba
-- Crear un hilo de mensajes para la actividad 60
IF NOT EXISTS (SELECT * FROM HilosMensajes WHERE ActividadId = 60)
INSERT INTO HilosMensajes (ActividadId, Titulo, Descripcion, FechaCreacion, FechaModificacion)
VALUES (60, 'Mensajes - TÍTULO DE PRUEBA MODIFICADO', 'Hilo de mensajes para la actividad de prueba', GETDATE(), GETDATE());

-- Crear algunos mensajes de prueba
DECLARE @HiloId INT = (SELECT TOP 1 Id FROM HilosMensajes WHERE ActividadId = 60);
DECLARE @UsuarioId INT = (SELECT TOP 1 Id FROM Usuarios WHERE Username = 'Admin');

IF @HiloId IS NOT NULL AND @UsuarioId IS NOT NULL
BEGIN
    INSERT INTO Mensajes (HiloMensajeId, UsuarioId, Contenido, Asunto, FechaCreacion)
    VALUES 
    (@HiloId, @UsuarioId, 'Este es el primer mensaje del hilo de la actividad de prueba.', 'Mensaje inicial', DATEADD(hour, -2, GETDATE())),
    (@HiloId, @UsuarioId, 'Necesito revisar algunos detalles de la actividad antes de aprobarla.', 'Revisión pendiente', DATEADD(hour, -1, GETDATE())),
    (@HiloId, @UsuarioId, 'La actividad ha sido revisada y está lista para su aprobación.', 'Lista para aprobación', GETDATE());
    
    -- Marcar algunos mensajes como leídos
    INSERT INTO MensajesUsuarios (MensajeId, UsuarioId, Leido, FechaLectura)
    SELECT Id, @UsuarioId, 1, GETDATE()
    FROM Mensajes 
    WHERE HiloMensajeId = @HiloId AND Id IN (
        SELECT TOP 2 Id FROM Mensajes WHERE HiloMensajeId = @HiloId ORDER BY FechaCreacion
    );
END

PRINT 'Tablas de mensajería creadas correctamente';
GO

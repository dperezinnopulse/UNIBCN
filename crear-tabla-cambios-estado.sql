-- Crear tabla para cambios de estado de actividades
CREATE TABLE [dbo].[CambioEstadoActividad] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ActividadId] int NOT NULL,
    [EstadoAnteriorId] int NOT NULL,
    [EstadoNuevoId] int NOT NULL,
    [DescripcionMotivos] nvarchar(1000) NULL,
    [FechaCambio] datetime2 NOT NULL,
    [UsuarioCambioId] int NOT NULL,
    [Activo] bit NOT NULL DEFAULT 1,
    CONSTRAINT [PK_CambioEstadoActividad] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CambioEstadoActividad_Actividades_ActividadId] FOREIGN KEY ([ActividadId]) REFERENCES [Actividades] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CambioEstadoActividad_EstadosActividad_EstadoAnteriorId] FOREIGN KEY ([EstadoAnteriorId]) REFERENCES [EstadosActividad] ([Id]),
    CONSTRAINT [FK_CambioEstadoActividad_EstadosActividad_EstadoNuevoId] FOREIGN KEY ([EstadoNuevoId]) REFERENCES [EstadosActividad] ([Id]),
    CONSTRAINT [FK_CambioEstadoActividad_Usuarios_UsuarioCambioId] FOREIGN KEY ([UsuarioCambioId]) REFERENCES [Usuarios] ([Id])
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX [IX_CambioEstadoActividad_ActividadId] ON [CambioEstadoActividad] ([ActividadId]);
CREATE INDEX [IX_CambioEstadoActividad_FechaCambio] ON [CambioEstadoActividad] ([FechaCambio]);
CREATE INDEX [IX_CambioEstadoActividad_UsuarioCambioId] ON [CambioEstadoActividad] ([UsuarioCambioId]);

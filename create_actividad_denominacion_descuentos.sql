CREATE TABLE IF NOT EXISTS ActividadDenominacionDescuentos (
    Id int IDENTITY(1,1) PRIMARY KEY,
    ActividadId int NOT NULL,
    DenominacionDescuentoId int NOT NULL,
    Activo bit NOT NULL DEFAULT 1,
    FechaCreacion datetime2 NOT NULL DEFAULT GETDATE(),
    FechaModificacion datetime2 NULL,
    FOREIGN KEY (ActividadId) REFERENCES Actividades(Id),
    FOREIGN KEY (DenominacionDescuentoId) REFERENCES ValoresDominio(Id)
);

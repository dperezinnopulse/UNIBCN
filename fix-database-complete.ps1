# Script para completar la base de datos
Write-Host "Completando la base de datos..." -ForegroundColor Yellow

$completeDatabase = @"
USE UB_Formacion;

-- Tabla de subactividades
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Subactividades')
CREATE TABLE Subactividades (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ActividadId INT NOT NULL,
    Titulo NVARCHAR(200) NOT NULL,
    Descripcion NVARCHAR(MAX),
    FechaInicio DATE,
    FechaFin DATE,
    Lugar NVARCHAR(200),
    Responsable NVARCHAR(100),
    Orden INT DEFAULT 0,
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (ActividadId) REFERENCES Actividades(Id)
);

-- Tabla de participantes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Participantes')
CREATE TABLE Participantes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ActividadId INT NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Apellidos NVARCHAR(100) NOT NULL,
    Email NVARCHAR(200),
    Telefono NVARCHAR(20),
    DNI NVARCHAR(20),
    TipoParticipante NVARCHAR(50),
    FechaInscripcion DATETIME2 DEFAULT GETDATE(),
    Estado NVARCHAR(20) DEFAULT 'Inscrito',
    FOREIGN KEY (ActividadId) REFERENCES Actividades(Id)
);

-- Tabla de internacionalizaciones
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Internacionalizaciones')
CREATE TABLE Internacionalizaciones (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ActividadId INT NOT NULL,
    Idioma NVARCHAR(10) NOT NULL,
    Titulo NVARCHAR(200),
    Descripcion NVARCHAR(MAX),
    FOREIGN KEY (ActividadId) REFERENCES Actividades(Id)
);

-- Agregar foreign keys si no existen
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_EstadosActividad')
ALTER TABLE Actividades ADD CONSTRAINT FK_Actividades_EstadosActividad 
FOREIGN KEY (EstadoId) REFERENCES EstadosActividad(Id);

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Actividades_UnidadesGestion')
ALTER TABLE Actividades ADD CONSTRAINT FK_Actividades_UnidadesGestion 
FOREIGN KEY (UnidadGestionId) REFERENCES UnidadesGestion(Id);
"@

$completeDatabase | sqlcmd -S localhost

Write-Host "Base de datos completada correctamente" -ForegroundColor Green

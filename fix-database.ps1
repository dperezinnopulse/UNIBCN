# Script para configurar la base de datos
Write-Host "Configurando base de datos..." -ForegroundColor Yellow

# Crear la base de datos si no existe
Write-Host "Creando base de datos UB_Formacion..." -ForegroundColor Cyan
sqlcmd -S localhost -Q "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'UB_Formacion') CREATE DATABASE UB_Formacion"

# Crear tablas básicas
Write-Host "Creando tablas..." -ForegroundColor Cyan
$createTables = @"
USE UB_Formacion;

-- Tabla de estados
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EstadosActividad')
CREATE TABLE EstadosActividad (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Codigo NVARCHAR(10) NOT NULL,
    Nombre NVARCHAR(100) NOT NULL,
    Activo BIT DEFAULT 1,
    Orden INT DEFAULT 0
);

-- Tabla de unidades de gestión
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UnidadesGestion')
CREATE TABLE UnidadesGestion (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Codigo NVARCHAR(10) NOT NULL,
    Nombre NVARCHAR(200) NOT NULL,
    Activo BIT DEFAULT 1
);

-- Tabla de actividades
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Actividades')
CREATE TABLE Actividades (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Codigo NVARCHAR(50),
    AnioAcademico NVARCHAR(20),
    Titulo NVARCHAR(500) NOT NULL,
    Descripcion NVARCHAR(MAX),
    FechaInicio DATE,
    FechaFin DATE,
    Lugar NVARCHAR(200),
    UnidadGestionId INT,
    EstadoId INT DEFAULT 1,
    FechaCreacion DATETIME2 DEFAULT GETDATE(),
    FechaModificacion DATETIME2 DEFAULT GETDATE()
);

-- Insertar datos de prueba
IF NOT EXISTS (SELECT * FROM EstadosActividad)
INSERT INTO EstadosActividad (Codigo, Nombre, Orden) VALUES 
('BORRADOR', 'Borrador', 1),
('REVISION', 'En Revisión', 2),
('APROBADO', 'Aprobado', 3),
('RECHAZADO', 'Rechazado', 4),
('CANCELADO', 'Cancelado', 5);

IF NOT EXISTS (SELECT * FROM UnidadesGestion)
INSERT INTO UnidadesGestion (Codigo, Nombre) VALUES 
('IDP', 'IDP - Institut de Desenvolupament Professional'),
('CRAI', 'CRAI - Centre de Recursos per a l''Aprenentatge i la Investigació'),
('SAE', 'SAE - Servei d''Activitats Extraordinàries');
"@

$createTables | sqlcmd -S localhost

Write-Host "Base de datos configurada correctamente" -ForegroundColor Green

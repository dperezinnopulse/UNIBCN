-- Script para corregir el error "RolNormalizadoId no es válido" en transiciones
USE UB_Formacion;
GO

PRINT '=== CORRIGIENDO ERROR RolNormalizadoId ==='

-- 1. Verificar estructura actual de TransicionesEstado
PRINT '1. ESTRUCTURA ACTUAL DE TransicionesEstado:'
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'TransicionesEstado'
ORDER BY ORDINAL_POSITION

-- 2. Verificar si existe la columna RolPermitidoId
PRINT '2. VERIFICANDO COLUMNA RolPermitidoId:'
SELECT COUNT(*) as ExisteRolPermitidoId
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'TransicionesEstado' AND COLUMN_NAME = 'RolPermitidoId'

-- 3. Si no existe, agregarla
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'TransicionesEstado' AND COLUMN_NAME = 'RolPermitidoId')
BEGIN
    PRINT '3. AGREGANDO COLUMNA RolPermitidoId...'
    ALTER TABLE TransicionesEstado ADD RolPermitidoId INT NULL
    PRINT 'Columna RolPermitidoId agregada exitosamente'
END
ELSE
BEGIN
    PRINT '3. La columna RolPermitidoId ya existe'
END

-- 4. Verificar si existe la tabla RolesNormalizados
PRINT '4. VERIFICANDO TABLA RolesNormalizados:'
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'RolesNormalizados')
BEGIN
    PRINT 'Tabla RolesNormalizados existe'
    SELECT COUNT(*) as TotalRoles FROM RolesNormalizados WHERE Activo = 1
END
ELSE
BEGIN
    PRINT 'ERROR: Tabla RolesNormalizados NO existe'
END

-- 5. Crear tabla RolesNormalizados si no existe
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'RolesNormalizados')
BEGIN
    PRINT '5. CREANDO TABLA RolesNormalizados...'
    CREATE TABLE RolesNormalizados (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Codigo NVARCHAR(50) NOT NULL UNIQUE,
        Nombre NVARCHAR(100) NOT NULL,
        Descripcion NVARCHAR(255) NULL,
        Activo BIT NOT NULL DEFAULT 1
    )
    
    -- Insertar roles básicos
    INSERT INTO RolesNormalizados (Codigo, Nombre, Descripcion) VALUES
    ('DOCENTE', 'Docente', 'Usuario docente que crea actividades'),
    ('TECNICO', 'Técnico de Formación', 'Técnico que revisa actividades'),
    ('COORDINADOR', 'Coordinador de Formación', 'Coordinador que aprueba actividades'),
    ('RESPONSABLE', 'Responsable de Unidad', 'Responsable que valida actividades'),
    ('SOPORTE', 'Soporte Administrativo', 'Soporte administrativo'),
    ('ADMIN', 'Administrador', 'Administrador del sistema')
    
    PRINT 'Tabla RolesNormalizados creada con roles básicos'
END

-- 6. Actualizar RolPermitidoId basado en RolPermitido
PRINT '6. ACTUALIZANDO RolPermitidoId...'

-- Mapear Docente
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE')
WHERE RolPermitido = 'Docente' AND Activo = 1

-- Mapear TecnicoFormacion
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'TECNICO')
WHERE RolPermitido = 'TecnicoFormacion' AND Activo = 1

-- Mapear CoordinadorFormacion
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'COORDINADOR')
WHERE RolPermitido = 'CoordinadorFormacion' AND Activo = 1

-- Mapear ResponsableUnidad
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'RESPONSABLE')
WHERE RolPermitido = 'ResponsableUnidad' AND Activo = 1

-- Mapear SoporteAdmin
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'SOPORTE')
WHERE RolPermitido = 'SoporteAdmin' AND Activo = 1

-- Mapear Admin
UPDATE TransicionesEstado 
SET RolPermitidoId = (SELECT Id FROM RolesNormalizados WHERE Codigo = 'ADMIN')
WHERE RolPermitido = 'Admin' AND Activo = 1

-- 7. Verificar el resultado
PRINT '7. VERIFICANDO RESULTADO:'
SELECT 
    COUNT(*) as TotalTransiciones,
    COUNT(CASE WHEN RolPermitido IS NOT NULL AND RolPermitido != '' THEN 1 END) as ConRolPermitido,
    COUNT(CASE WHEN RolPermitidoId IS NOT NULL THEN 1 END) as ConRolPermitidoId
FROM TransicionesEstado 
WHERE Activo = 1

-- 8. Mostrar transiciones con JOIN exitoso
PRINT '8. TRANSICIONES CON JOIN EXITOSO:'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1

PRINT '=== CORRECCIÓN COMPLETADA ==='

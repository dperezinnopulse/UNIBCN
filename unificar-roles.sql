-- Script para unificar todos los roles en la base de datos
-- Este script estandariza los roles y actualiza el mapeo

PRINT '=== UNIFICANDO ROLES EN LA BASE DE DATOS ==='

-- 1. Actualizar roles en la tabla Usuarios para que sean consistentes
PRINT '1. Actualizando roles en tabla Usuarios...'

-- Coordinador Tecnico (unificar todas las variantes)
UPDATE Usuarios 
SET Rol = 'Coordinador Tecnico' 
WHERE Rol IN ('Coordinador/Técnico', 'Gestor') 
AND Activo = 1

-- Docente/Dinamizador (unificar)
UPDATE Usuarios 
SET Rol = 'Docente/Dinamizador' 
WHERE Rol = 'Usuario' 
AND Activo = 1

-- Coordinador de Formación (mantener)
UPDATE Usuarios 
SET Rol = 'Coordinador de Formación' 
WHERE Rol = 'Coordinador de Formación' 
AND Activo = 1

-- Admin (mantener)
UPDATE Usuarios 
SET Rol = 'Admin' 
WHERE Rol = 'Admin' 
AND Activo = 1

-- Responsable de Unidad (mantener)
UPDATE Usuarios 
SET Rol = 'Responsable de Unidad' 
WHERE Rol = 'Responsable de Unidad' 
AND Activo = 1

-- Soporte Administrativo (mantener)
UPDATE Usuarios 
SET Rol = 'Soporte Administrativo' 
WHERE Rol = 'Soporte Administrativo' 
AND Activo = 1

PRINT '2. Roles actualizados en tabla Usuarios'

-- 2. Limpiar mapeos existentes y crear nuevos mapeos consistentes
PRINT '3. Limpiando mapeos existentes...'
DELETE FROM MapeoRoles

PRINT '4. Creando nuevos mapeos consistentes...'

-- Mapeos para Admin
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Admin', Id FROM RolesNormalizados WHERE Codigo = 'ADMIN'

-- Mapeos para Coordinador Tecnico (todas las variantes)
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Coordinador Tecnico', Id FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO'

INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Coordinador/Técnico', Id FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO'

INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Gestor', Id FROM RolesNormalizados WHERE Codigo = 'COORD_TECNICO'

-- Mapeos para Coordinador de Formación
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Coordinador de Formación', Id FROM RolesNormalizados WHERE Codigo = 'COORD_FORMACION'

-- Mapeos para Docente/Dinamizador
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Docente/Dinamizador', Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE_DINAMIZADOR'

INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Usuario', Id FROM RolesNormalizados WHERE Codigo = 'DOCENTE_DINAMIZADOR'

-- Mapeos para Responsable de Unidad
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Responsable de Unidad', Id FROM RolesNormalizados WHERE Codigo = 'RESPONSABLE_UNIDAD'

-- Mapeos para Soporte Administrativo
INSERT INTO MapeoRoles (RolOriginal, RolNormalizadoId) 
SELECT 'Soporte Administrativo', Id FROM RolesNormalizados WHERE Codigo = 'SOPORTE_ADMIN'

PRINT '5. Mapeos creados correctamente'

-- 3. Verificar resultados
PRINT '6. Verificando resultados...'

PRINT 'Roles únicos en Usuarios:'
SELECT DISTINCT Rol, COUNT(*) as Cantidad 
FROM Usuarios 
WHERE Activo = 1 
GROUP BY Rol 
ORDER BY Rol

PRINT 'Mapeos creados:'
SELECT mr.RolOriginal, rn.Codigo, rn.Nombre 
FROM MapeoRoles mr 
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id 
WHERE mr.Activo = 1 
ORDER BY mr.RolOriginal

PRINT '=== UNIFICACIÓN COMPLETADA ==='


-- Script para verificar y corregir los permisos de transiciones
USE UB_Formacion;
GO

PRINT '=== VERIFICANDO TRANSICIONES ACTUALES ==='

-- 1. Verificar transiciones actuales
SELECT 
    t.EstadoOrigenCodigo,
    t.EstadoDestinoCodigo, 
    rn.Codigo as RolNormalizado,
    rn.Nombre as RolNombre,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
ORDER BY t.EstadoOrigenCodigo, rn.Codigo, t.EstadoDestinoCodigo

PRINT ''
PRINT '=== VERIFICANDO MAPEO DE ROLES ==='

-- 2. Verificar mapeo de roles
SELECT 
    mr.RolOriginal,
    rn.Codigo as RolNormalizado,
    rn.Nombre as RolNombre
FROM MapeoRoles mr
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id
WHERE mr.Activo = 1

PRINT ''
PRINT '=== VERIFICANDO USUARIOS IDP ==='

-- 3. Verificar usuarios de IDP
SELECT 
    u.Username,
    u.Rol,
    ug.Nombre as UnidadGestion
FROM Usuarios u
LEFT JOIN UnidadesGestion ug ON u.UnidadGestionId = ug.Id
WHERE u.Username LIKE '%idp' OR u.Username = 'Admin'
ORDER BY u.Username

PRINT ''
PRINT '=== VERIFICANDO TRANSICIONES ESPECÍFICAS PARA DOCENTE ==='

-- 4. Verificar transiciones específicas para Docente
SELECT 
    t.EstadoOrigenCodigo,
    t.EstadoDestinoCodigo,
    rn.Codigo as RolNormalizado,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND rn.Codigo = 'DOCENTE'
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

PRINT ''
PRINT '=== VERIFICANDO TRANSICIONES ESPECÍFICAS PARA TÉCNICO ==='

-- 5. Verificar transiciones específicas para Técnico
SELECT 
    t.EstadoOrigenCodigo,
    t.EstadoDestinoCodigo,
    rn.Codigo as RolNormalizado,
    t.Accion
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND rn.Codigo = 'TECNICO'
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

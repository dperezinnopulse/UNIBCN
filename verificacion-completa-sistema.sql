-- Script de verificación completa del sistema
-- Revisión exhaustiva de estados, transiciones, roles y mapeos

PRINT '=== VERIFICACIÓN COMPLETA DEL SISTEMA ==='

-- 1. ESTADOS ACTIVOS
PRINT '1. ESTADOS ACTIVOS:'
SELECT ea.Id, ea.Codigo, ea.Nombre, COUNT(a.Id) as Actividades 
FROM EstadosActividad ea 
LEFT JOIN Actividades a ON ea.Id = a.EstadoId 
WHERE ea.Activo = 1 
GROUP BY ea.Id, ea.Codigo, ea.Nombre 
ORDER BY Actividades DESC, ea.Codigo

-- 2. ROLES NORMALIZADOS
PRINT '2. ROLES NORMALIZADOS:'
SELECT rn.Id, rn.Codigo, rn.Nombre, COUNT(mr.Id) as Mapeos 
FROM RolesNormalizados rn 
LEFT JOIN MapeoRoles mr ON rn.Id = mr.RolNormalizadoId 
WHERE rn.Activo = 1 
GROUP BY rn.Id, rn.Codigo, rn.Nombre 
ORDER BY rn.Codigo

-- 3. ROLES EN USUARIOS
PRINT '3. ROLES EN USUARIOS:'
SELECT Rol, COUNT(*) as Usuarios 
FROM Usuarios 
WHERE Activo = 1 
GROUP BY Rol 
ORDER BY Rol

-- 4. MAPEO DE ROLES
PRINT '4. MAPEO DE ROLES:'
SELECT mr.RolOriginal, rn.Codigo, rn.Nombre 
FROM MapeoRoles mr 
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id 
WHERE mr.Activo = 1 
ORDER BY mr.RolOriginal

-- 5. TRANSICIONES POR ESTADO ORIGEN
PRINT '5. TRANSICIONES POR ESTADO ORIGEN:'
SELECT t.EstadoOrigenCodigo, COUNT(*) as Transiciones 
FROM TransicionesEstado t 
WHERE t.Activo = 1 
GROUP BY t.EstadoOrigenCodigo 
ORDER BY t.EstadoOrigenCodigo

-- 6. TRANSICIONES POR ESTADO DESTINO
PRINT '6. TRANSICIONES POR ESTADO DESTINO:'
SELECT t.EstadoDestinoCodigo, COUNT(*) as Referencias 
FROM TransicionesEstado t 
WHERE t.Activo = 1 
GROUP BY t.EstadoDestinoCodigo 
ORDER BY t.EstadoDestinoCodigo

-- 7. VERIFICAR TRANSICIONES VÁLIDAS (origen y destino existen)
PRINT '7. TRANSICIONES VÁLIDAS (origen y destino existen):'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado, rn.Nombre as RolNombre
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND EXISTS (SELECT 1 FROM EstadosActividad ea1 WHERE ea1.Codigo = t.EstadoOrigenCodigo AND ea1.Activo = 1)
AND EXISTS (SELECT 1 FROM EstadosActividad ea2 WHERE ea2.Codigo = t.EstadoDestinoCodigo AND ea2.Activo = 1)
ORDER BY t.EstadoOrigenCodigo, rn.Codigo, t.EstadoDestinoCodigo

-- 8. VERIFICAR TRANSICIONES INVÁLIDAS (origen o destino no existen)
PRINT '8. TRANSICIONES INVÁLIDAS (origen o destino no existen):'
SELECT t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, rn.Codigo as RolNormalizado
FROM TransicionesEstado t 
INNER JOIN RolesNormalizados rn ON t.RolPermitidoId = rn.Id 
WHERE t.Activo = 1 
AND (
    NOT EXISTS (SELECT 1 FROM EstadosActividad ea1 WHERE ea1.Codigo = t.EstadoOrigenCodigo AND ea1.Activo = 1)
    OR NOT EXISTS (SELECT 1 FROM EstadosActividad ea2 WHERE ea2.Codigo = t.EstadoDestinoCodigo AND ea2.Activo = 1)
)
ORDER BY t.EstadoOrigenCodigo, t.EstadoDestinoCodigo

-- 9. VERIFICAR ROLES SIN MAPEO
PRINT '9. ROLES EN USUARIOS SIN MAPEO:'
SELECT DISTINCT u.Rol, COUNT(*) as Usuarios
FROM Usuarios u
WHERE u.Activo = 1 
AND NOT EXISTS (SELECT 1 FROM MapeoRoles mr WHERE mr.RolOriginal = u.Rol AND mr.Activo = 1)
GROUP BY u.Rol
ORDER BY u.Rol

-- 10. VERIFICAR MAPEOS SIN USO
PRINT '10. MAPEOS SIN USO:'
SELECT mr.RolOriginal, rn.Codigo, rn.Nombre
FROM MapeoRoles mr
INNER JOIN RolesNormalizados rn ON mr.RolNormalizadoId = rn.Id
WHERE mr.Activo = 1 
AND NOT EXISTS (SELECT 1 FROM Usuarios u WHERE u.Rol = mr.RolOriginal AND u.Activo = 1)
ORDER BY mr.RolOriginal

PRINT '=== VERIFICACIÓN COMPLETADA ==='









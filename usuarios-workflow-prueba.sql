-- Script para crear usuarios de prueba del workflow
-- Ejecutar después de haber creado las UnidadesGestion y EstadosActividad

USE [UB_Formacion];

-- Actualizar usuario Admin existente
UPDATE [Usuarios] 
SET [Email] = 'dperez@innopulse.es', [Activo] = 1
WHERE [Username] = 'Admin';

-- Insertar usuarios de prueba para el workflow (excluyendo Admin)
INSERT INTO [Usuarios] ([Username], [PasswordHash], [Rol], [UnidadGestionId], [Email], [Activo], [FechaCreacion]) VALUES
-- === IDP (UnidadGestionId = 1) ===
-- 1. Docente/Dinamizador - IDP
('docente.idp', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Usuario', 1, 'dperez@innopulse.es', 1, GETDATE()),

-- 2. Coordinador/Técnico - IDP  
('tecnico.idp', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Gestor', 1, 'dperez@innopulse.es', 1, GETDATE()),

-- 3. Coordinador de Formación - IDP
('coord.idp', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Coordinador de Formación', 1, 'dperez@innopulse.es', 1, GETDATE()),

-- 4. Responsable de Unidad - IDP
('resp.idp', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Responsable de Unidad', 1, 'dperez@innopulse.es', 1, GETDATE()),

-- 5. Soporte Administrativo - IDP
('soporte.idp', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Soporte Administrativo', 1, 'dperez@innopulse.es', 1, GETDATE()),

-- === CRAI (UnidadGestionId = 2) ===
-- 6. Docente/Dinamizador - CRAI
('docente.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Usuario', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 7. Coordinador/Técnico - CRAI  
('tecnico.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Gestor', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 8. Coordinador de Formación - CRAI
('coord.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Coordinador de Formación', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 9. Responsable de Unidad - CRAI
('resp.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Responsable de Unidad', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 10. Soporte Administrativo - CRAI
('soporte.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Soporte Administrativo', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- === SAE (UnidadGestionId = 3) ===
-- 11. Docente/Dinamizador - SAE
('docente.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Usuario', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 12. Coordinador/Técnico - SAE  
('tecnico.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Gestor', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 13. Coordinador de Formación - SAE
('coord.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Coordinador de Formación', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 14. Responsable de Unidad - SAE
('resp.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Responsable de Unidad', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 15. Soporte Administrativo - SAE
('soporte.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Soporte Administrativo', 3, 'dperez@innopulse.es', 1, GETDATE());

-- Verificar que se insertaron correctamente
SELECT 
    u.Id,
    u.Username,
    u.Rol,
    u.UnidadGestionId,
    ug.Nombre as UnidadGestionNombre,
    u.Email,
    u.Activo
FROM [Usuarios] u
LEFT JOIN [UnidadesGestion] ug ON u.UnidadGestionId = ug.Id
WHERE u.Username IN ('Admin', 'docente.idp', 'tecnico.idp', 'coord.idp', 'resp.idp', 'soporte.idp', 
                     'docente.crai', 'tecnico.crai', 'coord.crai', 'resp.crai', 'soporte.crai',
                     'docente.sae', 'tecnico.sae', 'coord.sae', 'resp.sae', 'soporte.sae')
ORDER BY u.Username;

PRINT 'Usuarios de prueba del workflow creados correctamente.';
PRINT 'Contraseña para todos: demo123';
PRINT '';
PRINT '=== USUARIOS CREADOS ===';
PRINT 'IDP (UnidadGestionId = 1):';
PRINT '  - docente.idp (Usuario)';
PRINT '  - tecnico.idp (Gestor)';
PRINT '  - coord.idp (Coordinador de Formación)';
PRINT '  - resp.idp (Responsable de Unidad)';
PRINT '  - soporte.idp (Soporte Administrativo)';
PRINT '';
PRINT 'CRAI (UnidadGestionId = 2):';
PRINT '  - docente.crai (Usuario)';
PRINT '  - tecnico.crai (Gestor)';
PRINT '  - coord.crai (Coordinador de Formación)';
PRINT '  - resp.crai (Responsable de Unidad)';
PRINT '  - soporte.crai (Soporte Administrativo)';
PRINT '';
PRINT 'SAE (UnidadGestionId = 3):';
PRINT '  - docente.sae (Usuario)';
PRINT '  - tecnico.sae (Gestor)';
PRINT '  - coord.sae (Coordinador de Formación)';
PRINT '  - resp.sae (Responsable de Unidad)';
PRINT '  - soporte.sae (Soporte Administrativo)';
PRINT '';
PRINT '=== FLUJO DE PRUEBA SUGERIDO (para cualquier UG) ===';
PRINT '1. docente.{ug} -> Crear actividad (BORRADOR)';
PRINT '2. docente.{ug} -> Enviar actividad (ENVIADA)';
PRINT '3. coord.{ug} -> Revisar y aprobar (EN_REVISION -> VALIDACION_UNIDAD)';
PRINT '4. resp.{ug} -> Validar (VALIDACION_UNIDAD -> DEFINICION)';
PRINT '5. tecnico.{ug} -> Completa definición (DEFINICION -> REVISION_ADMINISTRATIVA)';
PRINT '6. soporte.{ug} -> Publicar (REVISION_ADMINISTRATIVA -> PUBLICADA)';

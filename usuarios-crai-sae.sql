-- Script para añadir usuarios de prueba de CRAI y SAE
-- Ejecutar después de haber creado los usuarios de IDP

USE [UB_Formacion];

-- Insertar usuarios de prueba para CRAI y SAE
INSERT INTO [Usuarios] ([Username], [PasswordHash], [Rol], [UnidadGestionId], [Email], [Activo], [FechaCreacion]) VALUES
-- === CRAI (UnidadGestionId = 2) ===
-- 1. Docente/Dinamizador - CRAI
('docente.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Usuario', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 2. Coordinador/Técnico - CRAI  
('tecnico.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Gestor', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 3. Coordinador de Formación - CRAI
('coord.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Coordinador de Formación', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 4. Responsable de Unidad - CRAI
('resp.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Responsable de Unidad', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- 5. Soporte Administrativo - CRAI
('soporte.crai', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Soporte Administrativo', 2, 'dperez@innopulse.es', 1, GETDATE()),

-- === SAE (UnidadGestionId = 3) ===
-- 6. Docente/Dinamizador - SAE
('docente.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Usuario', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 7. Coordinador/Técnico - SAE  
('tecnico.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Gestor', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 8. Coordinador de Formación - SAE
('coord.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Coordinador de Formación', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 9. Responsable de Unidad - SAE
('resp.sae', '$2a$11$N9qo8uLOickgx2ZMRZoMye.IjdQjOqL3zVj8K2pPc8F7aB9dE6fGh', 'Responsable de Unidad', 3, 'dperez@innopulse.es', 1, GETDATE()),

-- 10. Soporte Administrativo - SAE
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
WHERE u.Username IN ('docente.crai', 'tecnico.crai', 'coord.crai', 'resp.crai', 'soporte.crai',
                     'docente.sae', 'tecnico.sae', 'coord.sae', 'resp.sae', 'soporte.sae')
ORDER BY u.UnidadGestionId, u.Username;

PRINT 'Usuarios de CRAI y SAE creados correctamente.';
PRINT 'Contraseña para todos: demo123';
PRINT '';
PRINT '=== USUARIOS AÑADIDOS ===';
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
PRINT '=== FLUJO DE PRUEBA SUGERIDO ===';
PRINT 'Para CRAI: docente.crai -> coord.crai -> resp.crai -> tecnico.crai -> soporte.crai';
PRINT 'Para SAE: docente.sae -> coord.sae -> resp.sae -> tecnico.sae -> soporte.sae';

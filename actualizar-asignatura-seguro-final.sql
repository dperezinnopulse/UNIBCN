USE [UB_Formacion];

PRINT 'Iniciando actualizacion segura del dominio Asignatura (ID=12)...';

-- Verificar que el dominio existe
IF NOT EXISTS (SELECT 1 FROM Dominios WHERE Id = 12)
BEGIN
    PRINT 'ERROR: El dominio Asignatura (ID=12) no existe.';
    RETURN;
END

-- PASO 1: Actualizar registros en Actividades para evitar conflictos de clave externa
PRINT 'Paso 1: Actualizando registros en Actividades para evitar conflictos de clave externa...';
UPDATE Actividades SET AsignaturaId = NULL WHERE AsignaturaId IN (SELECT Id FROM ValoresDominio WHERE DominioId = 12);
PRINT 'Registros en Actividades actualizados.';

-- PASO 2: Eliminar valores existentes
PRINT 'Paso 2: Eliminando valores existentes del dominio Asignatura...';
DELETE FROM ValoresDominio WHERE DominioId = 12;
PRINT 'Valores existentes eliminados del dominio Asignatura.';

-- PASO 3: Insertar los nuevos valores
PRINT 'Paso 3: Insertando nuevos valores...';
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden, Activo, FechaCreacion, FechaModificacion) VALUES
(12, '851052-Suficiencia 1', '851052-Suficiencia 1', 52, 1, GETDATE(), GETDATE()),
(12, '851053-Intermedi semiprese.', '851053-Intermedi semiprese.', 53, 1, GETDATE(), GETDATE()),
(12, '851054-Suficiencia semipre.', '851054-Suficiencia semipre.', 54, 1, GETDATE(), GETDATE()),
(12, '851055-Elemental semiprese.', '851055-Elemental semiprese.', 55, 1, GETDATE(), GETDATE()),
(12, '851056-Lleng.juridic catala', '851056-Lleng.juridic catala', 56, 1, GETDATE(), GETDATE()),
(12, '851057-Intro.catala-espanyo', '851057-Intro.catala-espanyo', 57, 1, GETDATE(), GETDATE()),
(12, '851058-Superior semipresen.', '851058-Superior semipresen.', 58, 1, GETDATE(), GETDATE()),
(12, '851059-Rose.Stone Fundat.se', '851059-Rose.Stone Fundat.se', 59, 1, GETDATE(), GETDATE()),
(12, '851060-Rose.Stone Fundat.an', '851060-Rose.Stone Fundat.an', 60, 1, GETDATE(), GETDATE()),
(12, '851061-Rose.Stone Advant.se', '851061-Rose.Stone Advant.se', 61, 1, GETDATE(), GETDATE()),
(12, '851062-Rose.Stone Advant.an', '851062-Rose.Stone Advant.an', 62, 1, GETDATE(), GETDATE()),
(12, '851063-Rose.Ston.Adva.Pro.s', '851063-Rose.Ston.Adva.Pro.s', 63, 1, GETDATE(), GETDATE()),
(12, '851064-Rose.Ston.Adva.Pro.a', '851064-Rose.Ston.Adva.Pro.a', 64, 1, GETDATE(), GETDATE()),
(12, '851065-Elem.semipre.(60+20)', '851065-Elem.semipre.(60+20)', 65, 1, GETDATE(), GETDATE()),
(12, '851066-Inter.semipr.(60+20)', '851066-Inter.semipr.(60+20)', 66, 1, GETDATE(), GETDATE()),
(12, '851067-Conv.Sufici.Educacio', '851067-Conv.Sufici.Educacio', 67, 1, GETDATE(), GETDATE()),
(12, '851068-Convocatoria A2', '851068-Convocatoria A2', 68, 1, GETDATE(), GETDATE()),
(12, '851069-Convocatoria B1', '851069-Convocatoria B1', 69, 1, GETDATE(), GETDATE()),
(12, '851070-Convocatoria B2', '851070-Convocatoria B2', 70, 1, GETDATE(), GETDATE()),
(12, '851071-Convocatoria C1', '851071-Convocatoria C1', 71, 1, GETDATE(), GETDATE()),
(12, '851072-Convocatoria C2', '851072-Convocatoria C2', 72, 1, GETDATE(), GETDATE()),
(12, '851073-Intro.lleng.catalana', '851073-Intro.lleng.catalana', 73, 1, GETDATE(), GETDATE()),
(12, '851074-Multilinguitzat', '851074-Multilinguitzat', 74, 1, GETDATE(), GETDATE()),
(12, '851075-Examen lliure C1', '851075-Examen lliure C1', 75, 1, GETDATE(), GETDATE()),
(12, '851076-Examen lliure C2', '851076-Examen lliure C2', 76, 1, GETDATE(), GETDATE()),
(12, '851077-Prov.lleng.jurid.cat', '851077-Prov.lleng.jurid.cat', 77, 1, GETDATE(), GETDATE()),
(12, '851078-A1 virtual', '851078-A1 virtual', 78, 1, GETDATE(), GETDATE()),
(12, '851079-A2 virtual', '851079-A2 virtual', 79, 1, GETDATE(), GETDATE()),
(12, '851080-B1 virtual', '851080-B1 virtual', 80, 1, GETDATE(), GETDATE()),
(12, '851081-B2 virtual', '851081-B2 virtual', 81, 1, GETDATE(), GETDATE()),
(12, '851082-C1 virtual', '851082-C1 virtual', 82, 1, GETDATE(), GETDATE()),
(12, '851083-C2 virtual', '851083-C2 virtual', 83, 1, GETDATE(), GETDATE()),
(12, '851084-A2 semipresencial', '851084-A2 semipresencial', 84, 1, GETDATE(), GETDATE()),
(12, '851085-B1 semipresencial', '851085-B1 semipresencial', 85, 1, GETDATE(), GETDATE()),
(12, '851086-B2 semipresencial', '851086-B2 semipresencial', 86, 1, GETDATE(), GETDATE()),
(12, '851087-C1 semipresencial', '851087-C1 semipresencial', 87, 1, GETDATE(), GETDATE()),
(12, '851088-C2 semipresencial', '851088-C2 semipresencial', 88, 1, GETDATE(), GETDATE()),
(12, '851089-Aranes A1', '851089-Aranes A1', 89, 1, GETDATE(), GETDATE()),
(12, '851090-Aranes A2', '851090-Aranes A2', 90, 1, GETDATE(), GETDATE()),
(12, '851091-Taller dexpr.escri.', '851091-Taller dexpr.escri.', 91, 1, GETDATE(), GETDATE()),
(12, '851092-Simulacre examen C2', '851092-Simulacre examen C2', 92, 1, GETDATE(), GETDATE()),
(12, '851093-P.suf.lle.cat.docent', '851093-P.suf.lle.cat.docent', 93, 1, GETDATE(), GETDATE()),
(12, '851094-B2 per a docents', '851094-B2 per a docents', 94, 1, GETDATE(), GETDATE()),
(12, '851095-Examen lliure B2', '851095-Examen lliure B2', 95, 1, GETDATE(), GETDATE()),
(12, '851096-A2 lleng.catalana 50', '851096-A2 lleng.catalana 50', 96, 1, GETDATE(), GETDATE()),
(12, '851097-Examen CIFALC', '851097-Examen CIFALC', 97, 1, GETDATE(), GETDATE()),
(12, '851098-Aranes B1', '851098-Aranes B1', 98, 1, GETDATE(), GETDATE()),
(12, '851099-Segona conv.examen', '851099-Segona conv.examen', 99, 1, GETDATE(), GETDATE()),
(12, '851100-Taxes emis.duplicats', '851100-Taxes emis.duplicats', 100, 1, GETDATE(), GETDATE()),
(12, '851101-Prova oral C1 PDI', '851101-Prova oral C1 PDI', 101, 1, GETDATE(), GETDATE()),
(12, '851102-Aranes A1+A2', '851102-Aranes A1+A2', 102, 1, GETDATE(), GETDATE()),
(12, '851103-Aranes Taller oral', '851103-Aranes Taller oral', 103, 1, GETDATE(), GETDATE());

PRINT 'Nuevos valores insertados en el dominio Asignatura.';

-- PASO 4: Mostrar los nuevos valores insertados
SELECT Id as ValorId, Valor, Descripcion, Orden, Activo 
FROM ValoresDominio 
WHERE DominioId = 12 
ORDER BY Orden;

PRINT '=== ACTUALIZACION COMPLETADA ===';
PRINT 'Se han insertado ' + CAST(@@ROWCOUNT AS VARCHAR(10)) + ' valores para el dominio Asignatura (ID=12)';

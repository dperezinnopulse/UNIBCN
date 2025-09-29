-- Script para actualizar los valores del dominio "Asignatura" ID = 12 de forma segura
USE [UB_Formacion];

-- Verificar que el dominio existe
IF NOT EXISTS (SELECT 1 FROM Dominios WHERE Id = 12 AND Nombre = 'Asignatura')
BEGIN
    PRINT 'ERROR: El dominio Asignatura con ID 12 no existe';
    RETURN;
END

-- Mostrar valores actuales antes de la actualización
PRINT '=== VALORES ACTUALES DEL DOMINIO ASIGNATURA (ID=12) ===';
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 12 
ORDER BY v.Orden;

-- Verificar si hay actividades que usan estos valores
PRINT '=== VERIFICANDO ACTIVIDADES QUE USAN ESTOS VALORES ===';
SELECT COUNT(*) as ActividadesConAsignatura
FROM Actividades 
WHERE AsignaturaId IS NOT NULL;

-- Mostrar las actividades que usan estos valores
SELECT a.Id as ActividadId, a.Titulo, a.AsignaturaId, v.Valor as AsignaturaValor
FROM Actividades a
LEFT JOIN ValoresDominio v ON a.AsignaturaId = v.Id
WHERE a.AsignaturaId IS NOT NULL;

-- Desactivar valores existentes en lugar de eliminarlos (para mantener referencias)
PRINT '=== DESACTIVANDO VALORES ACTUALES ===';
UPDATE ValoresDominio 
SET Activo = 0, FechaModificacion = GETDATE()
WHERE DominioId = 12;

-- Insertar los nuevos valores para el dominio Asignatura (ID = 12)
PRINT '=== INSERTANDO NUEVOS VALORES ===';
INSERT INTO [ValoresDominio] ([DominioId], [Valor], [Descripcion], [Orden], [Activo], [FechaCreacion], [FechaModificacion]) VALUES
(12, '851001-Català ini.universi.', '851001-Català ini.universi.', 1, 1, GETDATE(), GETDATE()),
(12, '851002-Comprensió ini.oral', '851002-Comprensió ini.oral', 2, 1, GETDATE(), GETDATE()),
(12, '851003-Comprens.ini.oral m1', '851003-Comprens.ini.oral m1', 3, 1, GETDATE(), GETDATE()),
(12, '851004-Comprens.ini.oral m2', '851004-Comprens.ini.oral m2', 4, 1, GETDATE(), GETDATE()),
(12, '851005-Agilitació oral', '851005-Agilitació oral', 5, 1, GETDATE(), GETDATE()),
(12, '851006-Agilitació oral mòd1', '851006-Agilitació oral mòd1', 6, 1, GETDATE(), GETDATE()),
(12, '851007-Agilitació oral mòd2', '851007-Agilitació oral mòd2', 7, 1, GETDATE(), GETDATE()),
(12, '851008-Fluïdesa correc.oral', '851008-Fluïdesa correc.oral', 8, 1, GETDATE(), GETDATE()),
(12, '851009-Fluïd.correc.oral m1', '851009-Fluïd.correc.oral m1', 9, 1, GETDATE(), GETDATE()),
(12, '851010-Fluïd.correc.oral m2', '851010-Fluïd.correc.oral m2', 10, 1, GETDATE(), GETDATE()),
(12, '851011-Intermedi', '851011-Intermedi', 11, 1, GETDATE(), GETDATE()),
(12, '851012-Suficiència', '851012-Suficiència', 12, 1, GETDATE(), GETDATE()),
(12, '851013-Superior', '851013-Superior', 13, 1, GETDATE(), GETDATE()),
(12, '851014-Intermedi(con.lliure', '851014-Intermedi(con.lliure', 14, 1, GETDATE(), GETDATE()),
(12, '851015-Suficiència(c.lliure', '851015-Suficiència(c.lliure', 15, 1, GETDATE(), GETDATE()),
(12, '851016-Superior(con.lliure', '851016-Superior(con.lliure', 16, 1, GETDATE(), GETDATE()),
(12, '851017-Conversa correc.fonè', '851017-Conversa correc.fonè', 17, 1, GETDATE(), GETDATE()),
(12, '851018-Redacció de textos', '851018-Redacció de textos', 18, 1, GETDATE(), GETDATE()),
(12, '851019-Apre.sim.lleng.romàn', '851019-Apre.sim.lleng.romàn', 19, 1, GETDATE(), GETDATE()),
(12, '851020-La lleng.cat.les TIC', '851020-La lleng.cat.les TIC', 20, 1, GETDATE(), GETDATE()),
(12, '851021-Taller esp.lin.pers.', '851021-Taller esp.lin.pers.', 21, 1, GETDATE(), GETDATE()),
(12, '851022-Ses.cultura catalana', '851022-Ses.cultura catalana', 22, 1, GETDATE(), GETDATE()),
(12, '851023-C.form.aco.ling.cult', '851023-C.form.aco.ling.cult', 23, 1, GETDATE(), GETDATE()),
(12, '851024-Tutories suport cult', '851024-Tutories suport cult', 24, 1, GETDATE(), GETDATE()),
(12, '851025-Tutories suport ling', '851025-Tutories suport ling', 25, 1, GETDATE(), GETDATE()),
(12, '851026-C.pre.ob.cer.suf.lle', '851026-C.pre.ob.cer.suf.lle', 26, 1, GETDATE(), GETDATE()),
(12, '851027-Cer.suf.llen.cat.doc', '851027-Cer.suf.llen.cat.doc', 27, 1, GETDATE(), GETDATE()),
(12, '851028-Sor.prof.amb.lleng', '851028-Sor.prof.amb.lleng', 28, 1, GETDATE(), GETDATE()),
(12, '851029-Tall.expressió oral', '851029-Tall.expressió oral', 29, 1, GETDATE(), GETDATE()),
(12, '851030-Cu.suport Ll.Cata.I', '851030-Cu.suport Ll.Cata.I', 30, 1, GETDATE(), GETDATE()),
(12, '851031-Bàsic 1', '851031-Bàsic 1', 31, 1, GETDATE(), GETDATE()),
(12, '851032-Bàsic 2', '851032-Bàsic 2', 32, 1, GETDATE(), GETDATE()),
(12, '851033-Bàsic', '851033-Bàsic', 33, 1, GETDATE(), GETDATE()),
(12, '851034-Bàsic 1 en línia', '851034-Bàsic 1 en línia', 34, 1, GETDATE(), GETDATE()),
(12, '851035-Elemental 1', '851035-Elemental 1', 35, 1, GETDATE(), GETDATE()),
(12, '851036-Elemental 2', '851036-Elemental 2', 36, 1, GETDATE(), GETDATE()),
(12, '851037-Elemental 3', '851037-Elemental 3', 37, 1, GETDATE(), GETDATE()),
(12, '851038-Elemental', '851038-Elemental', 38, 1, GETDATE(), GETDATE()),
(12, '851039-Bàsic 2 en línia', '851039-Bàsic 2 en línia', 39, 1, GETDATE(), GETDATE()),
(12, '851040-Rosetta Stone (S1)', '851040-Rosetta Stone (S1)', 40, 1, GETDATE(), GETDATE()),
(12, '851041-Rosetta Stone (S2)', '851041-Rosetta Stone (S2)', 41, 1, GETDATE(), GETDATE()),
(12, '851042-Rosetta Stone (A)', '851042-Rosetta Stone (A)', 42, 1, GETDATE(), GETDATE()),
(12, '851043-Rosetta Stone Tot(S)', '851043-Rosetta Stone Tot(S)', 43, 1, GETDATE(), GETDATE()),
(12, '851044-Rosetta Stone Tot(A)', '851044-Rosetta Stone Tot(A)', 44, 1, GETDATE(), GETDATE()),
(12, '851045-Intermedi 2', '851045-Intermedi 2', 45, 1, GETDATE(), GETDATE()),
(12, '851046-Elemental 2 a distà.', '851046-Elemental 2 a distà.', 46, 1, GETDATE(), GETDATE()),
(12, '851047-Intermedi 2 a distà.', '851047-Intermedi 2 a distà.', 47, 1, GETDATE(), GETDATE()),
(12, '851048-Rosetta Stone (T)', '851048-Rosetta Stone (T)', 48, 1, GETDATE(), GETDATE()),
(12, '851049-Bàsic 1 (40h)', '851049-Bàsic 1 (40h)', 49, 1, GETDATE(), GETDATE()),
(12, '851050-Redacció textos(15h)', '851050-Redacció textos(15h)', 50, 1, GETDATE(), GETDATE()),
(12, '851051-Intermedi 1', '851051-Intermedi 1', 51, 1, GETDATE(), GETDATE()),
(12, '851052-Suficiència 1', '851052-Suficiència 1', 52, 1, GETDATE(), GETDATE()),
(12, '851053-Intermedi semiprese.', '851053-Intermedi semiprese.', 53, 1, GETDATE(), GETDATE()),
(12, '851054-Suficiència semipre.', '851054-Suficiència semipre.', 54, 1, GETDATE(), GETDATE()),
(12, '851055-Elemental semiprese.', '851055-Elemental semiprese.', 55, 1, GETDATE(), GETDATE()),
(12, '851056-Lleng.jurídic català', '851056-Lleng.jurídic català', 56, 1, GETDATE(), GETDATE()),
(12, '851057-Intro.català-espanyo', '851057-Intro.català-espanyo', 57, 1, GETDATE(), GETDATE()),
(12, '851058-Superior semipresen.', '851058-Superior semipresen.', 58, 1, GETDATE(), GETDATE()),
(12, '851059-Rose.Stone Fundat.se', '851059-Rose.Stone Fundat.se', 59, 1, GETDATE(), GETDATE()),
(12, '851060-Rose.Stone Fundat.an', '851060-Rose.Stone Fundat.an', 60, 1, GETDATE(), GETDATE()),
(12, '851061-Rose.Stone Advant.se', '851061-Rose.Stone Advant.se', 61, 1, GETDATE(), GETDATE()),
(12, '851062-Rose.Stone Advant.an', '851062-Rose.Stone Advant.an', 62, 1, GETDATE(), GETDATE()),
(12, '851063-Rose.Ston.Adva.Pro.s', '851063-Rose.Ston.Adva.Pro.s', 63, 1, GETDATE(), GETDATE()),
(12, '851064-Rose.Ston.Adva.Pro.a', '851064-Rose.Ston.Adva.Pro.a', 64, 1, GETDATE(), GETDATE()),
(12, '851065-Elem.semipre.(60+20)', '851065-Elem.semipre.(60+20)', 65, 1, GETDATE(), GETDATE()),
(12, '851066-Inter.semipr.(60+20)', '851066-Inter.semipr.(60+20)', 66, 1, GETDATE(), GETDATE()),
(12, '851067-Conv.Sufici.Educació', '851067-Conv.Sufici.Educació', 67, 1, GETDATE(), GETDATE()),
(12, '851068-Convocatòria A2', '851068-Convocatòria A2', 68, 1, GETDATE(), GETDATE()),
(12, '851069-Convocatòria B1', '851069-Convocatòria B1', 69, 1, GETDATE(), GETDATE()),
(12, '851070-Convocatòria B2', '851070-Convocatòria B2', 70, 1, GETDATE(), GETDATE()),
(12, '851071-Convocatòria C1', '851071-Convocatòria C1', 71, 1, GETDATE(), GETDATE()),
(12, '851072-Convocatòria C2', '851072-Convocatòria C2', 72, 1, GETDATE(), GETDATE()),
(12, '851073-Intro.lleng.catalana', '851073-Intro.lleng.catalana', 73, 1, GETDATE(), GETDATE()),
(12, '851074-Multilingüitza''t', '851074-Multilingüitza''t', 74, 1, GETDATE(), GETDATE()),
(12, '851075-Examen lliure C1', '851075-Examen lliure C1', 75, 1, GETDATE(), GETDATE()),
(12, '851076-Examen lliure C2', '851076-Examen lliure C2', 76, 1, GETDATE(), GETDATE()),
(12, '851077-Prov.lleng.juríd.cat', '851077-Prov.lleng.juríd.cat', 77, 1, GETDATE(), GETDATE()),
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
(12, '851089-Aranès A1', '851089-Aranès A1', 89, 1, GETDATE(), GETDATE()),
(12, '851090-Aranès A2', '851090-Aranès A2', 90, 1, GETDATE(), GETDATE()),
(12, '851091-Taller d''expr.escri.', '851091-Taller d''expr.escri.', 91, 1, GETDATE(), GETDATE()),
(12, '851092-Simulacre examen C2', '851092-Simulacre examen C2', 92, 1, GETDATE(), GETDATE()),
(12, '851093-P.suf.lle.cat.docent', '851093-P.suf.lle.cat.docent', 93, 1, GETDATE(), GETDATE()),
(12, '851094-B2 per a docents', '851094-B2 per a docents', 94, 1, GETDATE(), GETDATE()),
(12, '851095-Examen lliure B2', '851095-Examen lliure B2', 95, 1, GETDATE(), GETDATE()),
(12, '851096-A2 lleng.catalana 50', '851096-A2 lleng.catalana 50', 96, 1, GETDATE(), GETDATE()),
(12, '851097-Examen CIFALC', '851097-Examen CIFALC', 97, 1, GETDATE(), GETDATE()),
(12, '851098-Aranès B1', '851098-Aranès B1', 98, 1, GETDATE(), GETDATE()),
(12, '851099-Segona conv.examen', '851099-Segona conv.examen', 99, 1, GETDATE(), GETDATE()),
(12, '851100-Taxes emis.duplicats', '851100-Taxes emis.duplicats', 100, 1, GETDATE(), GETDATE()),
(12, '851101-Prova oral C1 PDI', '851101-Prova oral C1 PDI', 101, 1, GETDATE(), GETDATE()),
(12, '851102-Aranès A1+A2', '851102-Aranès A1+A2', 102, 1, GETDATE(), GETDATE()),
(12, '851103-Aranès Taller oral', '851103-Aranès Taller oral', 103, 1, GETDATE(), GETDATE());

-- Mostrar los nuevos valores insertados
PRINT '=== NUEVOS VALORES INSERTADOS ===';
SELECT v.Id as ValorId, v.Valor, v.Descripcion, v.Orden, v.Activo 
FROM ValoresDominio v 
WHERE v.DominioId = 12 AND v.Activo = 1
ORDER BY v.Orden;

PRINT '=== ACTUALIZACIÓN COMPLETADA ===';
PRINT 'Se han actualizado ' + CAST(@@ROWCOUNT AS VARCHAR(10)) + ' valores para el dominio Asignatura (ID=12)';

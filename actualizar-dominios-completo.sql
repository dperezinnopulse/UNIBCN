-- =====================================================
-- SCRIPT PARA ACTUALIZAR DOMINIOS Y CARGAR VALORES
-- =====================================================

-- 1. CREAR NUEVO DOMINIO: SubUnidadgGestora-T01
INSERT INTO Dominios (Nombre, Descripcion) 
VALUES ('SUBUNIDAD_GESTORA', 'Subunidades de gestión detalladas');

-- 2. CREAR NUEVO DOMINIO: TiposParticipanteRol-T17
INSERT INTO Dominios (Nombre, Descripcion) 
VALUES ('TIPOS_PARTICIPANTE_ROL', 'Tipos de roles de participantes');

-- 3. OBTENER IDs DE LOS DOMINIOS CREADOS
DECLARE @SubUnidadGestoraId INT = (SELECT Id FROM Dominios WHERE Nombre = 'SUBUNIDAD_GESTORA');
DECLARE @TiposParticipanteRolId INT = (SELECT Id FROM Dominios WHERE Nombre = 'TIPOS_PARTICIPANTE_ROL');

-- 4. LIMPIAR VALORES EXISTENTES DE DOMINIOS A ACTUALIZAR
DELETE FROM ValoresDominio WHERE DominioId IN (1, 2, 3, 4, 8, 23, 25, 27);

-- 5. CARGAR VALORES PARA TIPOS_ACTIVIDAD (ID: 1)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(1, 'T18.01', 'Cicle de conferències'),
(1, 'T18.02', 'Comunicació'),
(1, 'T18.03', 'Conferència'),
(1, 'T18.04', 'Congrés'),
(1, 'T18.05', 'CRAI-Curs/Visita fons patrimonial'),
(1, 'T18.06', 'CRAI-Formació a mida'),
(1, 'T18.07', 'CRAI-Formació programada'),
(1, 'T18.08', 'CRAI-Formació reglada'),
(1, 'T18.09', 'Curs'),
(1, 'T18.10', 'Fòrum'),
(1, 'T18.11', 'Intercanvi d''experiències'),
(1, 'T18.12', 'Jornada'),
(1, 'T18.13', 'Ponència'),
(1, 'T18.14', 'Pòster'),
(1, 'T18.15', 'SAE-Monogràfic'),
(1, 'T18.16', 'SAE-Xerrada'),
(1, 'T18.17', 'Seminari'),
(1, 'T18.18', 'Simposi'),
(1, 'T18.19', 'SL-Prova extraordinària'),
(1, 'T18.20', 'SL-Prova lliure'),
(1, 'T18.21', 'SL-Prova ordinària'),
(1, 'T18.22', 'SL-Taxes'),
(1, 'T18.23', 'Taller'),
(1, 'T18.24', 'Taula Rodona'),
(1, 'T18.25', 'Trobada');

-- 6. CARGAR VALORES PARA LINEAS_ESTRATEGICAS (ID: 2)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(2, 'T02.01', 'IDP-Línia 1. Productes i serveis (2024-2027)'),
(2, 'T02.02', 'IDP-Línia 2. Capital humà i talent (2024-2027)'),
(2, 'T02.03', 'IDP-Línia 3. Difusió i comunicació (2024-2027)'),
(2, 'T02.04', 'IDP-Línia 4. Gestió i comunicació interna (2024-2027)');

-- 7. CARGAR VALORES PARA ACTIVIDADES_RESERVADAS (ID: 3)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(3, 'T04.01', 'IDP-Oberta'),
(3, 'T04.02', 'IDP-PDI'),
(3, 'T04.03', 'IDP-PTGAS'),
(3, 'T04.04', 'IDP-PDI/PTGAS'),
(3, 'T04.05', 'IDP-Estudiantat'),
(3, 'T04.06', 'IDP-Alumni');

-- 8. CARGAR VALORES PARA MODALIDADES_GESTION (ID: 4) - ACTUALIZAR CON VALORES SIMPLIFICADOS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(4, 'Presencial', 'Presencial'),
(4, 'Online', 'Online'),
(4, 'Mixta', 'Mixta');

-- 9. CARGAR VALORES PARA OBJETIVOS_ESTRATEGICOS (ID: 8)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(8, 'T03.01', 'IDP-L1.Objectiu estratègic 1.1. Adequar l''oferta formativa als canvis socioprofessionals (2024-2027)'),
(8, 'T03.02', 'IDP-L1.Objectiu estratègic 1.2. Impulsar la recerca per al desenvolupament professional (2024-2027)'),
(8, 'T03.03', 'IDP-L1. Objectiu estratègic 1.3. Garantir la qualitat de productes i serveis (2024-2027)');

-- 10. CARGAR VALORES PARA JEFES_UNIDAD_GESTORA (ID: 23)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(23, 'T06.01', 'IDP-Aldámiz-Echevarría Iraurgui, María del Mar'),
(23, 'T06.02', 'IDP-Carmona Monferrer, Moisés'),
(23, 'T06.03', 'IDP-Serrano Plana, Núria');

-- 11. CARGAR VALORES PARA FACULTADES_DESTINATARIAS (ID: 25)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(25, 'T07.01', 'Facultat de Belles Arts'),
(25, 'T07.02', 'Facultat de Biologia'),
(25, 'T07.03', 'Facultat de Ciències de la Terra'),
(25, 'T07.04', 'Facultat de Dret'),
(25, 'T07.05', 'Facultat de Farmàcia i Ciències de l''Alimentació'),
(25, 'T07.06', 'Facultat de Filologia i Comunicació'),
(25, 'T07.07', 'Facultat de Filosofia'),
(25, 'T07.08', 'Facultat de Física'),
(25, 'T07.09', 'Facultat de Geografia i Història'),
(25, 'T07.10', 'Facultat de Matemàtiques i Informàtica'),
(25, 'T07.11', 'Facultat de Medicina i Ciències de la Salut'),
(25, 'T07.12', 'Facultat de Psicologia'),
(25, 'T07.13', 'Facultat de Química'),
(25, 'T07.14', 'Facultat d''Economia i Empresa'),
(25, 'T07.15', 'Facultat d''Educació'),
(25, 'T07.16', 'Facultat d''Infermeria'),
(25, 'T07.17', 'Facultat d''Informació i Mitjans Audiovisuals'),
(25, 'T07.18', 'Totes');

-- 12. CARGAR VALORES PARA COORDINADORES_CENTRE_UNITAT_IDP (ID: 27)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(27, 'T05.01', 'IDP-Alsina Masmitjà, Josep'),
(27, 'T05.02', 'IDP-Belaústegui Barahona, Zain'),
(27, 'T05.03', 'IDP-Boldú Montoro, Eugeni'),
(27, 'T05.04', 'IDP-Carbó Carreté, Maria de les Salines'),
(27, 'T05.05', 'IDP-Costa Abós, Silvia'),
(27, 'T05.06', 'IDP-de Planell Mas, Elena'),
(27, 'T05.07', 'IDP-Fargas Peñarocha, Maria Adela'),
(27, 'T05.08', 'IDP-Ibañes Miguez, Marta'),
(27, 'T05.09', 'IDP-Iborra Ortega, Elena'),
(27, 'T05.10', 'IDP-Marcio Cid, Ignacio'),
(27, 'T05.11', 'IDP-Pascual Sancho, Mireia'),
(27, 'T05.12', 'IDP-Pérez Clausell, Jeús Pérez'),
(27, 'T05.13', 'IDP-Pérez Muñoz, Elisenda'),
(27, 'T05.14', 'IDP-Puertas Prats, Eloi'),
(27, 'T05.15', 'IDP-Requena Pelegrí, Teresa'),
(27, 'T05.16', 'IDP-Simon Pallisé, Joan'),
(27, 'T05.17', 'IDP-Somoza Fernández, Marta'),
(27, 'T05.18', 'IDP-Subirats Vila, Xavier'),
(27, 'T05.19', 'IDP-Turmo Garuz, Joaquín');

-- 13. CARGAR VALORES PARA SUBUNIDAD_GESTORA (NUEVO)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(@SubUnidadGestoraId, 'T01.01', 'CRAI-Belles Arts'),
(@SubUnidadGestoraId, 'T01.02', 'CRAI-Biologia'),
(@SubUnidadGestoraId, 'T01.03', 'CRAI-Campus Bellvitge'),
(@SubUnidadGestoraId, 'T01.04', 'CRAI-Campus Clínic'),
(@SubUnidadGestoraId, 'T01.05', 'CRAI-Campus Mundet'),
(@SubUnidadGestoraId, 'T01.06', 'CRAI-Ciències de la Terra'),
(@SubUnidadGestoraId, 'T01.07', 'CRAI-Dret'),
(@SubUnidadGestoraId, 'T01.08', 'CRAI-Economia i Empresa'),
(@SubUnidadGestoraId, 'T01.09', 'CRAI-Farmàcia i Ciències de l''Alimentació. Campus Diagonal Sud'),
(@SubUnidadGestoraId, 'T01.10', 'CRAI-Farmàcia i Ciències de l''Alimentació. Campus Torribera'),
(@SubUnidadGestoraId, 'T01.11', 'CRAI-Filosofia, Geografia i Història'),
(@SubUnidadGestoraId, 'T01.12', 'CRAI-Física i Química'),
(@SubUnidadGestoraId, 'T01.13', 'CRAI-Fons Antic'),
(@SubUnidadGestoraId, 'T01.14', 'CRAI-Informació i Mitjans Audiovisuals'),
(@SubUnidadGestoraId, 'T01.15', 'CRAI-Lletres'),
(@SubUnidadGestoraId, 'T01.16', 'CRAI-Matemàtiques i Informàtica'),
(@SubUnidadGestoraId, 'T01.17', 'CRAI-Pavelló de la República'),
(@SubUnidadGestoraId, 'T01.18', 'CRAI-Unitat de Docència'),
(@SubUnidadGestoraId, 'T01.19', 'CRAI-Unitat de Gestió de la Col·lecció'),
(@SubUnidadGestoraId, 'T01.20', 'CRAI-Unitat de Procés Tècnic'),
(@SubUnidadGestoraId, 'T01.21', 'CRAI-Unitat de Projectes'),
(@SubUnidadGestoraId, 'T01.22', 'CRAI-Unitat de Recerca'),
(@SubUnidadGestoraId, 'T01.23', 'CRAI-Unitat de Serveis a Usuaris'),
(@SubUnidadGestoraId, 'T01.24', 'IDP-Secció de Comunitat i sostenibilitat'),
(@SubUnidadGestoraId, 'T01.25', 'IDP-Secció de Recerca'),
(@SubUnidadGestoraId, 'T01.26', 'IDP-Secció d''Educació infantil, primària, secundària i FP'),
(@SubUnidadGestoraId, 'T01.27', 'IDP-Secció d''Universitat'),
(@SubUnidadGestoraId, 'T01.28', 'Servei d''Atenció a l''Estudiant (SAE)'),
(@SubUnidadGestoraId, 'T01.29', 'Serveis Lingüístics (SL)');

-- 14. CARGAR VALORES PARA TIPOS_PARTICIPANTE_ROL (NUEVO) - VALORES SIMPLIFICADOS
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(@TiposParticipanteRolId, 'Ponente', 'Ponente'),
(@TiposParticipanteRolId, 'Coordinación', 'Coordinación'),
(@TiposParticipanteRolId, 'Invitado', 'Invitado');

-- 15. CREAR NUEVO CAMPO EN TABLA ACTIVIDADES
ALTER TABLE Actividades ADD UnidadGestoraDetalle NVARCHAR(50) NULL;

-- 16. CREAR ÍNDICE PARA EL NUEVO CAMPO
CREATE INDEX IX_Actividades_UnidadGestoraDetalle ON Actividades(UnidadGestoraDetalle);

PRINT 'Script ejecutado correctamente. Dominios actualizados y nuevos campos creados.';


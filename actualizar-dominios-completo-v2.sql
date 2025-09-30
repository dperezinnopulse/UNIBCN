-- =====================================================
-- SCRIPT PARA ACTUALIZAR DOMINIOS SEGÚN CSV
-- =====================================================

-- 1. ACTUALIZAR MODALIDAD GESTIÓN (ID=4) con valores de ModalidadGestion-T15
-- Primero eliminar valores existentes
DELETE FROM ValoresDominio WHERE DominioId = 4;

-- Insertar nuevos valores para ModalidadGestion (ID=4)
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(4, 'T15.01', 'IDP-Encàrrec'),
(4, 'T15.02', 'IDP-Pròpia o iniciativa IDP'),
(4, 'T15.03', 'IDP-Acreditada UB'),
(4, 'T15.04', 'IDP-Acreditada Externa'),
(4, 'T15.05', 'IDP-Coorganitzada interna UB'),
(4, 'T15.06', 'IDP-Coorganitzada externa UB'),
(4, 'T15.07', 'IDP-Coorganitzada externa UB amb conveni');

-- 2. CREAR NUEVO DOMINIO ModalidadImparticion-T11
INSERT INTO Dominios (Nombre, Descripcion) VALUES
('MODALIDAD_IMPARTICION', 'Modalidades de impartición de actividades');

-- Obtener el ID del dominio recién creado
DECLARE @ModalidadImparticionId INT = SCOPE_IDENTITY();

-- Insertar valores para ModalidadImparticion
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(@ModalidadImparticionId, 'T11.01', 'Presencial'),
(@ModalidadImparticionId, 'T11.02', 'Semipresencial'),
(@ModalidadImparticionId, 'T11.03', 'En línia síncrona'),
(@ModalidadImparticionId, 'T11.04', 'En línia asíncrona'),
(@ModalidadImparticionId, 'T11.05', 'Autoformació'),
(@ModalidadImparticionId, 'T11.06', 'Acompanyament personalitzat (mentoria)');

-- 3. ACTUALIZAR DOMINIO IDIOMA (ID=14) - Cambiar valor existente y añadir nuevos
-- Primero eliminar valores existentes
DELETE FROM ValoresDominio WHERE DominioId = 14;

-- Insertar nuevos valores para Idioma
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(14, 'ESP', 'Español'),
(14, 'CAT', 'Catalán'),
(14, 'ENG', 'Inglés');

-- 4. CREAR NUEVO DOMINIO TiposParticipanteRol-T17
INSERT INTO Dominios (Nombre, Descripcion) VALUES
('TIPOS_PARTICIPANTE_ROL', 'Tipos de roles de participantes en actividades');

-- Obtener el ID del dominio recién creado
DECLARE @TiposParticipanteRolId INT = SCOPE_IDENTITY();

-- Insertar valores para TiposParticipanteRol
INSERT INTO ValoresDominio (DominioId, Valor, Descripcion) VALUES
(@TiposParticipanteRolId, 'T17.01', 'Alumne'),
(@TiposParticipanteRolId, 'T17.02', 'Conferenciant'),
(@TiposParticipanteRolId, 'T17.03', 'Coordinador'),
(@TiposParticipanteRolId, 'T17.04', 'Dinamitzador'),
(@TiposParticipanteRolId, 'T17.05', 'Formador'),
(@TiposParticipanteRolId, 'T17.06', 'Membre'),
(@TiposParticipanteRolId, 'T17.07', 'Moderador'),
(@TiposParticipanteRolId, 'T17.08', 'Ponent'),
(@TiposParticipanteRolId, 'T17.09', 'Presentador'),
(@TiposParticipanteRolId, 'T17.10', 'SignadorActa'),
(@TiposParticipanteRolId, 'T17.11', 'Tallerista'),
(@TiposParticipanteRolId, 'T17.12', 'Tutor'),
(@TiposParticipanteRolId, 'T17.13', 'Administrador de proves escrites'),
(@TiposParticipanteRolId, 'T17.14', 'Administrador de proves orals'),
(@TiposParticipanteRolId, 'T17.15', 'Avaluador de proves de nivell'),
(@TiposParticipanteRolId, 'T17.16', 'Avaluador de proves orals'),
(@TiposParticipanteRolId, 'T17.17', 'Conductor de sessió informativa'),
(@TiposParticipanteRolId, 'T17.18', 'Corrector de proves escrites B2'),
(@TiposParticipanteRolId, 'T17.19', 'Corrector de proves escrites C1'),
(@TiposParticipanteRolId, 'T17.20', 'Corrector de proves escrites C1 PDI'),
(@TiposParticipanteRolId, 'T17.21', 'Corrector de proves escrites C2'),
(@TiposParticipanteRolId, 'T17.22', 'Corrector de proves escrites LJ'),
(@TiposParticipanteRolId, 'T17.23', 'Elaborador d''examen'),
(@TiposParticipanteRolId, 'T17.24', 'Elaborador de materials didàctics'),
(@TiposParticipanteRolId, 'T17.25', 'Elaborador de preguntes Àrea 4'),
(@TiposParticipanteRolId, 'T17.26', 'Elaborador de proves de nivell'),
(@TiposParticipanteRolId, 'T17.27', 'Elaborador de sessió informativa'),
(@TiposParticipanteRolId, 'T17.28', 'Elaborador d''informes de revisió'),
(@TiposParticipanteRolId, 'T17.29', 'Tasques de suport'),
(@TiposParticipanteRolId, 'T17.30', 'Tasques diverses'),
(@TiposParticipanteRolId, 'T17.31', 'Tutorització d''estudiants');

-- Mostrar resumen de cambios
SELECT 'RESUMEN DE CAMBIOS REALIZADOS' as Resumen;

SELECT '1. Modalidad Gestión (ID=4) actualizada con 7 valores' as Cambio
UNION ALL
SELECT '2. Nuevo dominio MODALIDAD_IMPARTICION creado con 6 valores' as Cambio
UNION ALL  
SELECT '3. Dominio Idioma (ID=14) actualizado con 3 valores' as Cambio
UNION ALL
SELECT '4. Nuevo dominio TIPOS_PARTICIPANTE_ROL creado con 31 valores' as Cambio;

-- Verificar dominios creados
SELECT d.Id, d.Nombre, d.Descripcion, COUNT(vd.Id) as TotalValores
FROM Dominios d
LEFT JOIN ValoresDominio vd ON d.Id = vd.DominioId
WHERE d.Nombre IN ('MODALIDAD_IMPARTICION', 'TIPOS_PARTICIPANTE_ROL')
GROUP BY d.Id, d.Nombre, d.Descripcion;




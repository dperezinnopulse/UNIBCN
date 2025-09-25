USE [UB_Formacion];
GO

-- Script para verificar y corregir dominios sin valores
PRINT 'Verificando dominios y sus valores...';

-- 1. Verificar qué dominios existen y cuántos valores tienen
SELECT 
    d.Nombre as Dominio,
    COUNT(v.Id) as ValoresCount
FROM Dominios d 
LEFT JOIN ValoresDominio v ON d.Id = v.DominioId AND v.Activo = 1
WHERE d.Activo = 1
GROUP BY d.Id, d.Nombre
ORDER BY d.Nombre;

-- 2. Insertar valores faltantes para los dominios nuevos
PRINT 'Insertando valores faltantes...';

-- Función para insertar valor si no existe
DECLARE @DominioId INT;

-- Asignatura
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'Asignatura')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'Asignatura');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'Asignatura')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'Asignatura', 'Valor por defecto para Asignatura', 1);
        PRINT 'Valor "Asignatura" insertado.';
    END
END

-- DisciplinaRelacionada
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'DisciplinaRelacionada')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'DisciplinaRelacionada');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'DisciplinaRelacionada')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'DisciplinaRelacionada', 'Valor por defecto para DisciplinaRelacionada', 1);
        PRINT 'Valor "DisciplinaRelacionada" insertado.';
    END
END

-- IdiomaImparticion
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'IdiomaImparticion')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'IdiomaImparticion');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'IdiomaImparticion')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'IdiomaImparticion', 'Valor por defecto para IdiomaImparticion', 1);
        PRINT 'Valor "IdiomaImparticion" insertado.';
    END
END

-- TiposCertificacion
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'TiposCertificacion')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'TiposCertificacion');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'TiposCertificacion')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'TiposCertificacion', 'Valor por defecto para TiposCertificacion', 1);
        PRINT 'Valor "TiposCertificacion" insertado.';
    END
END

-- MateriaDisciplina
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'MateriaDisciplina')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'MateriaDisciplina');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'MateriaDisciplina')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'MateriaDisciplina', 'Valor por defecto para MateriaDisciplina', 1);
        PRINT 'Valor "MateriaDisciplina" insertado.';
    END
END

-- AmbitoFormacion
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'AmbitoFormacion')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'AmbitoFormacion');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'AmbitoFormacion')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'AmbitoFormacion', 'Valor por defecto para AmbitoFormacion', 1);
        PRINT 'Valor "AmbitoFormacion" insertado.';
    END
END

-- TiposFinanciacion
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'TiposFinanciacion')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'TiposFinanciacion');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'TiposFinanciacion')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'TiposFinanciacion', 'Valor por defecto para TiposFinanciacion', 1);
        PRINT 'Valor "TiposFinanciacion" insertado.';
    END
END

-- DenominacionDescuento
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'DenominacionDescuento')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'DenominacionDescuento');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'DenominacionDescuento')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'DenominacionDescuento', 'Valor por defecto para DenominacionDescuento', 1);
        PRINT 'Valor "DenominacionDescuento" insertado.';
    END
END

-- TiposInscripcion
IF EXISTS (SELECT 1 FROM Dominios WHERE Nombre = 'TiposInscripcion')
BEGIN
    SET @DominioId = (SELECT Id FROM Dominios WHERE Nombre = 'TiposInscripcion');
    IF NOT EXISTS (SELECT 1 FROM ValoresDominio WHERE DominioId = @DominioId AND Valor = 'TiposInscripcion')
    BEGIN
        INSERT INTO ValoresDominio (DominioId, Valor, Descripcion, Orden) 
        VALUES (@DominioId, 'TiposInscripcion', 'Valor por defecto para TiposInscripcion', 1);
        PRINT 'Valor "TiposInscripcion" insertado.';
    END
END

-- 3. Verificar resultado final
PRINT 'Verificación final de dominios y valores:';
SELECT 
    d.Nombre as Dominio,
    COUNT(v.Id) as ValoresCount
FROM Dominios d 
LEFT JOIN ValoresDominio v ON d.Id = v.DominioId AND v.Activo = 1
WHERE d.Activo = 1
GROUP BY d.Id, d.Nombre
ORDER BY d.Nombre;

PRINT 'Verificación completada.';
GO

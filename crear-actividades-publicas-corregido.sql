-- Crear actividades de prueba en estado PUBLICADA para cada Unidad Gestora

-- Verificar que existe el estado PUBLICADA
SELECT Id, Codigo, Nombre FROM EstadosActividad WHERE Codigo = 'PUBLICADA';

-- Crear actividades de prueba para IDP (UnidadGestionId = 1)
INSERT INTO Actividades (
    Titulo, Descripcion, ProgramaDescripcionES, FechaInicio, FechaFin, HorasTotales,
    ActividadPago, LineaEstrategica, ObjetivoEstrategico, TipoActividad,
    CentroUnidadUBDestinataria, EstadoId, UnidadGestionId, UsuarioAutorId,
    FechaCreacion, FechaModificacion
) VALUES 
(
    'Seminario de Innovación Tecnológica',
    'Un seminario especializado en las últimas tendencias de innovación tecnológica aplicada al sector empresarial.',
    'El programa incluye módulos sobre inteligencia artificial, blockchain, y transformación digital.',
    '2025-10-15', '2025-10-17', 20,
    0, 'Linea 1 - Innovacion y desarrollo tecnologico', 'Linea 1 - Innovacion y desarrollo tecnologico', 'Seminario',
    'Facultad de Informatica', 19, 1, 1,
    GETDATE(), GETDATE()
),
(
    'Master en Desarrollo de Software',
    'Programa de master especializado en desarrollo de software moderno y arquitecturas escalables.',
    'Cubre tecnologías como microservicios, DevOps, y metodologías ágiles.',
    '2025-11-01', '2026-06-30', 600,
    1, 'Linea 2 - Investigacion aplicada', 'Linea 2 - Investigacion aplicada', 'Master',
    'Facultad de Informatica', 19, 1, 1,
    GETDATE(), GETDATE()
);

-- Crear actividades de prueba para CRAI (UnidadGestionId = 2)
INSERT INTO Actividades (
    Titulo, Descripcion, ProgramaDescripcionES, FechaInicio, FechaFin, HorasTotales,
    ActividadPago, LineaEstrategica, ObjetivoEstrategico, TipoActividad,
    CentroUnidadUBDestinataria, EstadoId, UnidadGestionId, UsuarioAutorId,
    FechaCreacion, FechaModificacion
) VALUES 
(
    'Taller de Gestión de Información Digital',
    'Taller práctico sobre herramientas y técnicas para la gestión eficiente de información digital.',
    'Incluye sesiones sobre bases de datos, sistemas de búsqueda y organización de contenidos.',
    '2025-10-20', '2025-10-22', 15,
    0, 'Linea 3 - Formacion continua', 'Linea 3 - Formacion continua', 'Taller',
    'Facultad de Filologia', 19, 2, 1,
    GETDATE(), GETDATE()
),
(
    'Conferencia sobre Recursos Educativos Abiertos',
    'Conferencia sobre el uso y creación de recursos educativos abiertos en la educación superior.',
    'Presentaciones de expertos internacionales y casos de estudio de implementación.',
    '2025-11-10', '2025-11-10', 8,
    0, 'Linea 4 - Cooperacion internacional', 'Linea 4 - Cooperacion internacional', 'Conferencia',
    'Facultad de Educacion', 19, 2, 1,
    GETDATE(), GETDATE()
);

-- Crear actividades de prueba para SAE (UnidadGestionId = 3)
INSERT INTO Actividades (
    Titulo, Descripcion, ProgramaDescripcionES, FechaInicio, FechaFin, HorasTotales,
    ActividadPago, LineaEstrategica, ObjetivoEstrategico, TipoActividad,
    CentroUnidadUBDestinataria, EstadoId, UnidadGestionId, UsuarioAutorId,
    FechaCreacion, FechaModificacion
) VALUES 
(
    'Congreso de Actividades Estudiantiles',
    'Congreso anual que reúne a estudiantes y profesionales para compartir experiencias y mejores prácticas.',
    'Incluye ponencias, talleres y networking entre participantes de diferentes universidades.',
    '2025-12-05', '2025-12-07', 24,
    0, 'Linea 5 - Transferencia de conocimiento', 'Linea 5 - Transferencia de conocimiento', 'Congreso',
    'Facultad de Psicologia', 19, 3, 1,
    GETDATE(), GETDATE()
),
(
    'Posgrado en Liderazgo Estudiantil',
    'Programa de posgrado especializado en desarrollo de habilidades de liderazgo para estudiantes.',
    'Módulos sobre comunicación, trabajo en equipo, y gestión de proyectos estudiantiles.',
    '2026-01-15', '2026-07-15', 300,
    1, 'Linea 1 - Innovacion y desarrollo tecnologico', 'Linea 1 - Innovacion y desarrollo tecnologico', 'Posgrado',
    'Facultad de Economia', 19, 3, 1,
    GETDATE(), GETDATE()
);

-- Verificar las actividades creadas
SELECT 
    a.Id, a.Titulo, a.TipoActividad, a.ActividadPago,
    ug.Nombre as UnidadGestora, e.Nombre as Estado
FROM Actividades a
INNER JOIN UnidadGestion ug ON a.UnidadGestionId = ug.Id
INNER JOIN EstadosActividad e ON a.EstadoId = e.Id
WHERE e.Codigo = 'PUBLICADA'
ORDER BY a.UnidadGestionId, a.Titulo;









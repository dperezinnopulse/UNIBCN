using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class UpdateActividadDto
{
    // Campos principales
    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Descripcion { get; set; }
    
    [MaxLength(50)]
    public string? Codigo { get; set; }
    
    [MaxLength(20)]
    public string? TipoActividad { get; set; }
    
    public int? UnidadGestionId { get; set; }
    
    [MaxLength(500)]
    public string? CondicionesEconomicas { get; set; }
    
    [MaxLength(10)]
    public string? AnioAcademico { get; set; }
    
    [MaxLength(100)]
    public string? LineaEstrategica { get; set; }
    
    [MaxLength(100)]
    public string? ObjetivoEstrategico { get; set; }
    
    [MaxLength(100)]
    public string? CodigoRelacionado { get; set; }
    
    public int? ActividadReservada { get; set; }
    
    public DateTime? FechaActividad { get; set; }
    
    [MaxLength(500)]
    public string? MotivoCierre { get; set; }
    
    [MaxLength(200)]
    public string? PersonaSolicitante { get; set; }
    
    [MaxLength(200)]
    public string? Coordinador { get; set; }
    
    [MaxLength(200)]
    public string? JefeUnidadGestora { get; set; }
    
    [MaxLength(200)]
    public string? UnidadGestoraDetalle { get; set; }
    
    [MaxLength(200)]
    public string? GestorActividad { get; set; }
    
    [MaxLength(200)]
    public string? FacultadDestinataria { get; set; }
    
    [MaxLength(200)]
    public string? DepartamentoDestinatario { get; set; }
    
    [MaxLength(200)]
    public string? CentroUnidadUBDestinataria { get; set; }
    
    [MaxLength(500)]
    public string? OtrosCentrosInstituciones { get; set; }
    
    public int? PlazasTotales { get; set; }
    
    public decimal? HorasTotales { get; set; }
    
    [MaxLength(10)]
    public string? CentroTrabajoRequerido { get; set; }
    
    [MaxLength(100)]
    public string? ModalidadGestion { get; set; }
    
    public DateTime? FechaInicioImparticion { get; set; }
    
    public DateTime? FechaFinImparticion { get; set; }
    
    public string? ActividadPago { get; set; }
    
    public DateTime? FechaInicio { get; set; }
    
    public DateTime? FechaFin { get; set; }
    
    [MaxLength(200)]
    public string? Lugar { get; set; }
    
    // Campos específicos por UG
    [MaxLength(200)]
    public string? CoordinadorCentreUnitat { get; set; }
    
    [MaxLength(200)]
    public string? CentreTreballeAlumne { get; set; }
    
    public decimal? CreditosTotalesCRAI { get; set; }
    
    public decimal? CreditosTotalesSAE { get; set; }
    
    public decimal? CreditosMinimosSAE { get; set; }
    
    public decimal? CreditosMaximosSAE { get; set; }
    
    public string? TipusEstudiSAE { get; set; }
    
    public string? CategoriaSAE { get; set; }
    
    [MaxLength(500)]
    public string? CompetenciesSAE { get; set; }
    
    // Campos de inscripción
    public DateTime? InscripcionInicio { get; set; }
    
    public DateTime? InscripcionFin { get; set; }
    
    public int? InscripcionPlazas { get; set; }
    
    public string? InscripcionListaEspera { get; set; }
    
    [MaxLength(100)]
    public string? InscripcionModalidad { get; set; }
    
    [MaxLength(1000)]
    public string? InscripcionRequisitosES { get; set; }
    
    [MaxLength(1000)]
    public string? InscripcionRequisitosCA { get; set; }
    
    [MaxLength(1000)]
    public string? InscripcionRequisitosEN { get; set; }
    
    // Campos de programa
    [MaxLength(1000)]
    public string? ProgramaDescripcionES { get; set; }
    
    [MaxLength(1000)]
    public string? ProgramaDescripcionCA { get; set; }
    
    [MaxLength(1000)]
    public string? ProgramaDescripcionEN { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaContenidosES { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaContenidosCA { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaContenidosEN { get; set; }
    
    [MaxLength(1000)]
    public string? ProgramaObjetivosES { get; set; }
    
    [MaxLength(1000)]
    public string? ProgramaObjetivosCA { get; set; }
    
    [MaxLength(1000)]
    public string? ProgramaObjetivosEN { get; set; }
    
    public decimal? ProgramaDuracion { get; set; }
    
    public DateTime? ProgramaInicio { get; set; }
    
    public DateTime? ProgramaFin { get; set; }
    
    // Campos de traducción del título
    [MaxLength(200)]
    public string? TituloCA { get; set; }
    
    [MaxLength(200)]
    public string? TituloES { get; set; }
    
    [MaxLength(200)]
    public string? TituloEN { get; set; }
    
    // Entidades relacionadas
    public List<UpdateSubactividadDto>? Subactividades { get; set; }
    
    public List<UpdateParticipanteDto>? Participantes { get; set; }
    
    public List<UpdateColaboradoraDto>? Colaboradoras { get; set; }
    
    public List<UpdateImporteDto>? Importes { get; set; }
    
    // NUEVOS CAMPOS - INFORMACIÓN GENERAL
    public bool? Preinscripcion { get; set; }
    
    [MaxLength(50)]
    public string? EstadoActividad { get; set; }
    
    public int? AsignaturaId { get; set; }
    
    [MaxLength(150)]
    public string? GrupoAsignatura { get; set; }
    
    public int? DisciplinaRelacionadaId { get; set; }

    // NUEVOS CAMPOS - PROGRAMA
    [MaxLength(2000)]
    public string? Metodologia { get; set; }
    
    [MaxLength(2000)]
    public string? SistemaEvaluacion { get; set; }
    
    [MaxLength(2000)]
    public string? HorarioYCalendario { get; set; }
    
    public int? IdiomaImparticionId { get; set; }
    
    public int? TiposCertificacionId { get; set; }
    
    [MaxLength(2000)]
    public string? Observaciones { get; set; }
    
    public int? MateriaDisciplinaId { get; set; }
    
    [MaxLength(2000)]
    public string? EspacioImparticion { get; set; }
    
    [MaxLength(2000)]
    public string? LugarImparticion { get; set; }
    
    [MaxLength(2000)]
    public string? OtrasUbicaciones { get; set; }
    
    [MaxLength(500)]
    public string? UrlPlataformaVirtual { get; set; }
    
    [MaxLength(500)]
    public string? UrlCuestionarioSatisfaccion { get; set; }
    
    public int? AmbitoFormacionId { get; set; }

    // NUEVOS CAMPOS - IMPORTE Y DESCUENTOS
    public decimal? CosteEstimadoActividad { get; set; }
    
    public int? TiposFinanciacionId { get; set; }
    
    public int? AnoInicialFinanciacion { get; set; }
    
    public int? AnoFinalFinanciacion { get; set; }
    
    public int? PlazasAfectadasDescuento { get; set; }
    
    public List<int>? DenominacionDescuentoIds { get; set; }

    // NUEVOS CAMPOS - INSCRIPCIÓN
    public DateTime? FechaLimitePago { get; set; }
    
    public bool? TPV { get; set; }
    
    [MaxLength(50)]
    public string? Remesa { get; set; }
    
    public int? TiposInscripcionId { get; set; }
    
    public DateTime? FechaAdjudicacionPreinscripcion { get; set; }
    
    // Campo para borrador
    public bool? EsBorrador { get; set; }
}

// DTOs para entidades relacionadas
public class UpdateSubactividadDto
{
    public int? Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Modalidad { get; set; }
    
    [MaxLength(200)]
    public string? Docente { get; set; }
    
    [MaxLength(1000)]
    public string? Descripcion { get; set; }
    
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    
    [MaxLength(10)]
    public string? HoraInicio { get; set; }
    
    [MaxLength(10)]
    public string? HoraFin { get; set; }
    
    public decimal? Duracion { get; set; }
    
    [MaxLength(200)]
    public string? Ubicacion { get; set; }
    
    public int? Aforo { get; set; }
    
    [MaxLength(50)]
    public string? Idioma { get; set; }
}

public class UpdateParticipanteDto
{
    public int? Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Rol { get; set; }
    
    [MaxLength(200)]
    public string? Email { get; set; }
}

public class UpdateColaboradoraDto
{
    public int? Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? NifCif { get; set; }
    
    [MaxLength(200)]
    public string? Web { get; set; }
    
    [MaxLength(200)]
    public string? PersonaContacto { get; set; }
    
    [MaxLength(200)]
    public string? Email { get; set; }
    
    [MaxLength(20)]
    public string? Telefono { get; set; }
}

public class UpdateImporteDto
{
    public int? Id { get; set; }
    
    public decimal? ImporteBase { get; set; }
    
    [MaxLength(100)]
    public string? TipoImpuesto { get; set; }
    
    public decimal? PorcentajeDescuento { get; set; }
    
    [MaxLength(100)]
    public string? CodigoPromocional { get; set; }
    
    [MaxLength(500)]
    public string? CondicionesES { get; set; }
    
    [MaxLength(500)]
    public string? CondicionesCA { get; set; }
    
    [MaxLength(500)]
    public string? CondicionesEN { get; set; }
} 
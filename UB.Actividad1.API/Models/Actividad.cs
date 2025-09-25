using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UB.Actividad1.API.Models;

public class Actividad
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Codigo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(10)]
    public string AnioAcademico { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Descripcion { get; set; }
    
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    
    [MaxLength(200)]
    public string? Lugar { get; set; }
    
    public int EstadoId { get; set; }
    public int? UnidadGestionId { get; set; }
    
    // Nuevos campos del formulario
    [MaxLength(50)]
    public string? TipoActividad { get; set; }
    
    [MaxLength(200)]
    public string? CondicionesEconomicas { get; set; }
    
    [MaxLength(100)]
    public string? LineaEstrategica { get; set; }
    
    [MaxLength(100)]
    public string? ObjetivoEstrategico { get; set; }
    
    [MaxLength(50)]
    public string? CodigoRelacionado { get; set; }
    
    public bool? ActividadReservada { get; set; }
    
    public DateTime? FechaActividad { get; set; }
    
    [MaxLength(200)]
    public string? MotivoCierre { get; set; }
    
    [MaxLength(200)]
    public string? PersonaSolicitante { get; set; }
    
    [MaxLength(200)]
    public string? Coordinador { get; set; }
    
    [MaxLength(200)]
    public string? JefeUnidadGestora { get; set; }
    
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
    
    public bool? ActividadPago { get; set; }
    
    // Campos específicos por unidad de gestión
    [MaxLength(200)]
    public string? CoordinadorCentreUnitat { get; set; }
    
    [MaxLength(200)]
    public string? CentreTreballeAlumne { get; set; }
    
    public decimal? CreditosTotalesCRAI { get; set; }
    public decimal? CreditosTotalesSAE { get; set; }
    public decimal? CreditosMinimosSAE { get; set; }
    public decimal? CreditosMaximosSAE { get; set; }
    
    // Campos de inscripción
    public DateTime? InscripcionInicio { get; set; }
    public DateTime? InscripcionFin { get; set; }
    public int? InscripcionPlazas { get; set; }
    public bool? InscripcionListaEspera { get; set; }
    
    [MaxLength(50)]
    public string? InscripcionModalidad { get; set; }
    
    [MaxLength(1000)]
    public string? InscripcionRequisitosES { get; set; }
    
    [MaxLength(1000)]
    public string? InscripcionRequisitosCA { get; set; }
    
    [MaxLength(1000)]
    public string? InscripcionRequisitosEN { get; set; }
    
    // Campos de programa
    [MaxLength(2000)]
    public string? ProgramaDescripcionES { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaDescripcionCA { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaDescripcionEN { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaContenidosES { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaContenidosCA { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaContenidosEN { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaObjetivosES { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaObjetivosCA { get; set; }
    
    [MaxLength(2000)]
    public string? ProgramaObjetivosEN { get; set; }
    
    public decimal? ProgramaDuracion { get; set; }
    public DateTime? ProgramaInicio { get; set; }
    public DateTime? ProgramaFin { get; set; }
    
    public string? TipusEstudiSAE { get; set; }
    
    public string? CategoriaSAE { get; set; }
    
    [MaxLength(500)]
    public string? CompetenciesSAE { get; set; }
    
    // NUEVOS CAMPOS - INFORMACIÓN GENERAL
    public bool? Preinscripcion { get; set; }
    
    [MaxLength(50)]
    public string? EstadoActividad { get; set; }
    
    public int? AsignaturaId { get; set; }
    
    [MaxLength(150)]
    public string? GrupoAsignatura { get; set; }
    
    public int? DisciplinaRelacionadaId { get; set; }
    
    // NUEVOS CAMPOS - PROGRAMA
    [MaxLength(4000)]
    public string? Metodologia { get; set; }
    
    [MaxLength(4000)]
    public string? SistemaEvaluacion { get; set; }
    
    [MaxLength(4000)]
    public string? HorarioYCalendario { get; set; }
    
    public int? IdiomaImparticionId { get; set; }
    
    public int? TiposCertificacionId { get; set; }
    
    [MaxLength(4000)]
    public string? Observaciones { get; set; }
    
    public int? MateriaDisciplinaId { get; set; }
    
    [MaxLength(4000)]
    public string? EspacioImparticion { get; set; }
    
    [MaxLength(4000)]
    public string? LugarImparticion { get; set; }
    
    [MaxLength(4000)]
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
    
    // NUEVOS CAMPOS - INSCRIPCIÓN
    public DateTime? FechaLimitePago { get; set; }
    
    public bool? TPV { get; set; }
    
    [MaxLength(50)]
    public string? Remesa { get; set; }
    
    public int? TiposInscripcionId { get; set; }
    
    public DateTime? FechaAdjudicacionPreinscripcion { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Usuario que creó la propuesta
    public int? UsuarioAutorId { get; set; }
    
    // Navigation properties
    public virtual EstadoActividad Estado { get; set; } = null!;
    public virtual UnidadGestion? UnidadGestion { get; set; }
    public virtual Usuario? UsuarioAutor { get; set; }
    public virtual ICollection<Subactividad> Subactividades { get; set; } = new List<Subactividad>();
    public virtual ICollection<Participante> Participantes { get; set; } = new List<Participante>();
    public virtual ICollection<Internacionalizacion> Internacionalizaciones { get; set; } = new List<Internacionalizacion>();
    public virtual ICollection<EntidadOrganizadora> EntidadesOrganizadoras { get; set; } = new List<EntidadOrganizadora>();
    public virtual ICollection<ImporteDescuento> ImportesDescuentos { get; set; } = new List<ImporteDescuento>();
    
    // NUEVAS NAVIGATION PROPERTIES PARA DOMINIOS
    public virtual ValorDominio? Asignatura { get; set; }
    public virtual ValorDominio? DisciplinaRelacionada { get; set; }
    public virtual ValorDominio? IdiomaImparticion { get; set; }
    public virtual ValorDominio? TiposCertificacion { get; set; }
    public virtual ValorDominio? MateriaDisciplina { get; set; }
    public virtual ValorDominio? AmbitoFormacion { get; set; }
    public virtual ValorDominio? TiposFinanciacion { get; set; }
    public virtual ValorDominio? TiposInscripcion { get; set; }
    
    // Navigation property para selección múltiple de denominaciones de descuento
    public virtual ICollection<ActividadDenominacionDescuento> DenominacionesDescuento { get; set; } = new List<ActividadDenominacionDescuento>();
} 
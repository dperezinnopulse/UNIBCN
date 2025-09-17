using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs
{
    public class CreateActividadDto
    {
        [Required(ErrorMessage = "El título es obligatorio")]
        public string Titulo { get; set; } = string.Empty;
        
        public string? Descripcion { get; set; }
        public string? Codigo { get; set; }
        public string? AnioAcademico { get; set; }
        
        public DateTime? FechaInicio { get; set; }
        
        public DateTime? FechaFin { get; set; }
        
        public string? Lugar { get; set; }
        public int UnidadGestionId { get; set; }
        public bool? ActividadPago { get; set; }
        
        // Campos adicionales para actividades formativas
        public string? TipoActividad { get; set; }
        public string? LineaEstrategica { get; set; }
        public string? ObjetivoEstrategico { get; set; }
        public string? CodigoRelacionado { get; set; }
        public DateTime? FechaActividad { get; set; }
        public string? MotivoCierre { get; set; }
        public string? PersonaSolicitante { get; set; }
        public string? Coordinador { get; set; }
        public string? JefeUnidadGestora { get; set; }
        public string? GestorActividad { get; set; }
        public string? FacultadDestinataria { get; set; }
        public string? DepartamentoDestinatario { get; set; }
        public string? CentroUnidadUBDestinataria { get; set; }
        public string? OtrosCentrosInstituciones { get; set; }
        public int? PlazasTotales { get; set; }
        public decimal? HorasTotales { get; set; }
        public string? CentroTrabajoRequerido { get; set; }
        public string? ModalidadGestion { get; set; }
        public DateTime? FechaInicioImparticion { get; set; }
        public DateTime? FechaFinImparticion { get; set; }
        public string? CondicionesEconomicas { get; set; }
        public string? AreaTematica { get; set; }
        public string? NivelFormacion { get; set; }
        public string? IdiomaImparticion { get; set; }
        public string? IdiomaMateriales { get; set; }
        public string? ModalidadPresencial { get; set; }
        public string? ModalidadVirtual { get; set; }
        public string? ModalidadHibrida { get; set; }
        public string? Horario { get; set; }
        public string? RequisitosPrevios { get; set; }
        public string? Objetivos { get; set; }
        public string? Metodologia { get; set; }
        public string? Evaluacion { get; set; }
        public string? Certificacion { get; set; }
        public string? Observaciones { get; set; }
        
        // Campos específicos por unidad de gestión
        public string? CoordinadorCentreUnitat { get; set; }
        public string? CentreTreballeAlumne { get; set; }
        public decimal? CreditosTotalesCRAI { get; set; }
        public decimal? CreditosTotalesSAE { get; set; }
        public decimal? CreditosMinimosSAE { get; set; }
        public decimal? CreditosMaximosSAE { get; set; }
        
        // Campos de inscripción
        public DateTime? InscripcionInicio { get; set; }
        public DateTime? InscripcionFin { get; set; }
        public int? InscripcionPlazas { get; set; }
        public bool InscripcionListaEspera { get; set; } = false;
        public string? InscripcionModalidad { get; set; }
        public string? InscripcionRequisitosES { get; set; }
        public string? InscripcionRequisitosCA { get; set; }
        public string? InscripcionRequisitosEN { get; set; }
        
        // Campos de programa
        public string? ProgramaDescripcionES { get; set; }
        public string? ProgramaDescripcionCA { get; set; }
        public string? ProgramaDescripcionEN { get; set; }
        public string? ProgramaContenidosES { get; set; }
        public string? ProgramaContenidosCA { get; set; }
        public string? ProgramaContenidosEN { get; set; }
        public string? ProgramaObjetivosES { get; set; }
        public string? ProgramaObjetivosCA { get; set; }
        public string? ProgramaObjetivosEN { get; set; }
        public decimal? ProgramaDuracion { get; set; }
        public DateTime? ProgramaInicio { get; set; }
        public DateTime? ProgramaFin { get; set; }
        public string? TipusEstudiSAE { get; set; }
        public string? CategoriaSAE { get; set; }
        public string? CompetenciesSAE { get; set; }
        
        // Entidades organizadoras
        public List<EntidadOrganizadoraDto>? EntidadesOrganizadoras { get; set; }
        
        // Importes y descuentos
        public List<ImporteDescuentoDto>? ImportesDescuentos { get; set; }
        
        // Participantes
        public List<ParticipanteDto>? Participantes { get; set; }
        
        // Subactividades
        public List<SubactividadDto>? Subactividades { get; set; }
    }
} 
using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class CreateActividadSimpleDto
{
    // Campos básicos
    public string? Codigo { get; set; }
    public string? AnioAcademico { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public string? Lugar { get; set; }
    public int EstadoId { get; set; } = 1;
    public int? UnidadGestionId { get; set; }
    
    // Nuevos campos del formulario
    public string? TipoActividad { get; set; }
    public string? CondicionesEconomicas { get; set; }
    public string? LineaEstrategica { get; set; }
    public string? ObjetivoEstrategico { get; set; }
    public string? CodigoRelacionado { get; set; }
    public bool? ActividadReservada { get; set; }
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
    public bool ActividadPago { get; set; } = false;
    
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
    
    // Campos de entidades organizadoras (campos individuales)
    public string? Org_principal { get; set; }
    public string? Org_nif { get; set; }
    public string? Org_web { get; set; }
    public string? Org_contacto { get; set; }
    public string? Org_email { get; set; }
    public string? Org_tel { get; set; }
    
    // Campos de importes (campos individuales)
    public decimal? Imp_base { get; set; }
    public string? Imp_tipo { get; set; }
    public decimal? Imp_descuento_pct { get; set; }
    public string? Imp_codigo { get; set; }
    public string? Imp_condiciones_es { get; set; }
    public string? Imp_condiciones_ca { get; set; }
    public string? Imp_condiciones_en { get; set; }
    
    // Participantes
    public List<ParticipanteDto>? Participantes { get; set; }
    
    // Subactividades
    public List<SubactividadDto>? Subactividades { get; set; }
}

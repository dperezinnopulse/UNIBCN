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
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual EstadoActividad Estado { get; set; } = null!;
    public virtual UnidadGestion? UnidadGestion { get; set; }
    public virtual ICollection<Subactividad> Subactividades { get; set; } = new List<Subactividad>();
    public virtual ICollection<Participante> Participantes { get; set; } = new List<Participante>();
    public virtual ICollection<Internacionalizacion> Internacionalizaciones { get; set; } = new List<Internacionalizacion>();
} 
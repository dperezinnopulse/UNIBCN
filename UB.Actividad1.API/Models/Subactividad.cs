using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class Subactividad
{
    [Key]
    public int Id { get; set; }
    
    public int ActividadId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Descripcion { get; set; }
    
    [MaxLength(100)]
    public string? Modalidad { get; set; }
    
    [MaxLength(200)]
    public string? Docente { get; set; }
    
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
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
} 
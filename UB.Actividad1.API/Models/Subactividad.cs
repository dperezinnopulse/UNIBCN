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
    
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    
    [MaxLength(200)]
    public string? Lugar { get; set; }
    
    [MaxLength(200)]
    public string? Responsable { get; set; }
    
    public int Orden { get; set; } = 0;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
} 
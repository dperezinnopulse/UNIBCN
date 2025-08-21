using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class CreateActividadDto
{
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
    
    public int? UnidadGestionId { get; set; }
} 
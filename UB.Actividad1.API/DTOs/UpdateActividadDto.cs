using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class UpdateActividadDto
{
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
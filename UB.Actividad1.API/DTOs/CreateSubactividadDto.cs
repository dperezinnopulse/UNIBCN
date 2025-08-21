using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class CreateSubactividadDto
{
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
} 
using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class Internacionalizacion
{
    [Key]
    public int Id { get; set; }
    
    public int ActividadId { get; set; }
    
    [Required]
    [MaxLength(5)]
    public string Idioma { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Campo { get; set; } = string.Empty;
    
    [Required]
    public string Valor { get; set; } = string.Empty;
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
} 
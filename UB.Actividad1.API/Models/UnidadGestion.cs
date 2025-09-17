using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class UnidadGestion
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Codigo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Descripcion { get; set; }
    
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<Actividad> Actividades { get; set; } = new List<Actividad>();
} 
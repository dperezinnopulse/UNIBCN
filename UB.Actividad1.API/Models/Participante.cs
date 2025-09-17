using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class Participante
{
    [Key]
    public int Id { get; set; }
    
    public int ActividadId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(50)]
    public string? Rol { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
} 
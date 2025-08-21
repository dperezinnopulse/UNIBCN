using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class EstadoActividad
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Codigo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Descripcion { get; set; }
    
    [MaxLength(7)]
    public string Color { get; set; } = "#007bff";
    
    public int Orden { get; set; } = 0;
    public bool Activo { get; set; } = true;
    
    // Navigation properties
    public virtual ICollection<Actividad> Actividades { get; set; } = new List<Actividad>();
} 
using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class Dominio
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Descripcion { get; set; }
    
    public bool Activo { get; set; } = true;
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual ICollection<ValorDominio> Valores { get; set; } = new List<ValorDominio>();
}

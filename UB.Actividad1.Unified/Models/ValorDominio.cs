using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class ValorDominio
{
    public int Id { get; set; }
    
    public int DominioId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Valor { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Descripcion { get; set; }
    
    public int Orden { get; set; } = 0;
    
    public bool Activo { get; set; } = true;
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual Dominio Dominio { get; set; } = null!;
}

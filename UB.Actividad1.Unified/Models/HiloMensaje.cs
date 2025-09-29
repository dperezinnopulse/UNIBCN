using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class HiloMensaje
{
    [Key]
    public int Id { get; set; }
    
    public int ActividadId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Titulo { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Descripcion { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    public bool Activo { get; set; } = true;
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
    public virtual ICollection<Mensaje> Mensajes { get; set; } = new List<Mensaje>();
}

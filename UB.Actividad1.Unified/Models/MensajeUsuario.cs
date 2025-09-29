using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class MensajeUsuario
{
    [Key]
    public int Id { get; set; }
    
    public int MensajeId { get; set; }
    public int UsuarioId { get; set; }
    
    public bool Leido { get; set; } = false;
    public DateTime? FechaLectura { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Mensaje Mensaje { get; set; } = null!;
    public virtual Usuario Usuario { get; set; } = null!;
}

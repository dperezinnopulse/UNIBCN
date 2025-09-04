using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class Mensaje
{
    [Key]
    public int Id { get; set; }
    
    public int HiloMensajeId { get; set; }
    public int UsuarioId { get; set; }
    
    [Required]
    [MaxLength(2000)]
    public string Contenido { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Asunto { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime? FechaModificacion { get; set; }
    public bool Activo { get; set; } = true;
    public bool Eliminado { get; set; } = false;
    public DateTime? FechaEliminacion { get; set; }
    
    // Navigation properties
    public virtual HiloMensaje HiloMensaje { get; set; } = null!;
    public virtual Usuario Usuario { get; set; } = null!;
    public virtual ICollection<Adjunto> Adjuntos { get; set; } = new List<Adjunto>();
    public virtual ICollection<MensajeUsuario> MensajesUsuarios { get; set; } = new List<MensajeUsuario>();
}

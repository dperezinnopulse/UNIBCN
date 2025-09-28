using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class Adjunto
{
    [Key]
    public int Id { get; set; }
    
    public int MensajeId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string NombreArchivo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(500)]
    public string RutaArchivo { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? TipoMime { get; set; }
    
    public long TamañoBytes { get; set; }
    
    public DateTime FechaSubida { get; set; } = DateTime.UtcNow;
    public bool Activo { get; set; } = true;
    
    // Navigation properties
    public virtual Mensaje Mensaje { get; set; } = null!;
}

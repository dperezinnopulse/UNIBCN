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
    
    [Required]
    [MaxLength(100)]
    public string Apellidos { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(20)]
    public string? Telefono { get; set; }
    
    [MaxLength(20)]
    public string? DNI { get; set; }
    
    [MaxLength(50)]
    public string TipoParticipante { get; set; } = "Estudiante";
    
    public DateTime FechaInscripcion { get; set; } = DateTime.UtcNow;
    
    [MaxLength(20)]
    public string Estado { get; set; } = "Inscrito";
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
} 
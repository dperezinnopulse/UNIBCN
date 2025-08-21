using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class CreateParticipanteDto
{
    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string Apellidos { get; set; } = string.Empty;
    
    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }
    
    [MaxLength(20)]
    public string? Telefono { get; set; }
    
    [MaxLength(20)]
    public string? DNI { get; set; }
    
    [MaxLength(50)]
    public string TipoParticipante { get; set; } = "Estudiante";
} 
using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class ParticipanteDto
{
    [Required]
    [MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? Email { get; set; }
    
    [MaxLength(100)]
    public string? Rol { get; set; }
}

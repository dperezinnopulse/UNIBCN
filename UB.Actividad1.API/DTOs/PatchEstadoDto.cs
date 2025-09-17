using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class PatchEstadoDto
{
    [Required]
    public int EstadoId { get; set; }
} 
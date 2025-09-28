using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class TransicionEstado
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string EstadoOrigenCodigo { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string EstadoDestinoCodigo { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Accion { get; set; }

    [Required]
    [MaxLength(100)]
    public string RolPermitido { get; set; } = string.Empty;

    public int? RolPermitidoId { get; set; }

    public bool Activo { get; set; } = true;
    
    // Navigation properties
    public virtual RolNormalizado? RolNormalizado { get; set; }
}



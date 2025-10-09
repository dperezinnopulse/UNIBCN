using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class PermisosEdicion
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string EstadoCodigo { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string RolOriginal { get; set; } = string.Empty;
    
    public bool PuedeEditar { get; set; }
    
    public bool Activo { get; set; } = true;
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UB.Actividad1.API.Models;

public class EntidadOrganizadora
{
    [Key]
    public int Id { get; set; }
    
    public int ActividadId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? NifCif { get; set; }
    
    [MaxLength(500)]
    public string? Web { get; set; }
    
    [MaxLength(200)]
    public string? PersonaContacto { get; set; }
    
    [MaxLength(200)]
    public string? Email { get; set; }
    
    [MaxLength(50)]
    public string? Telefono { get; set; }
    
    public bool EsPrincipal { get; set; } = false;
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual Actividad Actividad { get; set; } = null!;
}

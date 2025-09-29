using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class EntidadOrganizadoraDto
{
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
    
    [MaxLength(20)]
    public string? Telefono { get; set; }
    
    public bool EsPrincipal { get; set; } = false;
}

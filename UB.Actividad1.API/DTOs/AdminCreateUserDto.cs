using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class AdminCreateUserDto
{
    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Rol { get; set; } = "Gestor"; // Admin | Gestor | Usuario

    public int? UnidadGestionId { get; set; }

    [EmailAddress]
    [MaxLength(200)]
    public string? Email { get; set; }

    public bool Activo { get; set; } = true;
}



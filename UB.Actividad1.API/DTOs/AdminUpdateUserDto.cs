using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class AdminUpdateUserDto
{
    [MaxLength(100)]
    public string? Username { get; set; }

    [MaxLength(200)]
    public string? NewPassword { get; set; }

    [MaxLength(20)]
    public string? Rol { get; set; }

    public int? UnidadGestionId { get; set; }

    [EmailAddress]
    [MaxLength(200)]
    public string? Email { get; set; }

    public bool? Activo { get; set; }
}



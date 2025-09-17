using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class CreateUserDto
{
    [Required]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = "Usuario";
    public int? UnidadGestionId { get; set; }
}



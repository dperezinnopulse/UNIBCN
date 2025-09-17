using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class UpdateOwnProfileDto
{
    [MaxLength(100)]
    public string? Username { get; set; }

    [MaxLength(200)]
    public string? NewPassword { get; set; }

    [EmailAddress]
    [MaxLength(200)]
    public string? Email { get; set; }
}



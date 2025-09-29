using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UB.Actividad1.API.Models;

public class Localidad
{
    [Key]
    [Column("LocalidadId")]
    public int Id { get; set; }

    [Required]
    [StringLength(5)]
    public string CodigoPostal { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string NombreLocalidad { get; set; } = string.Empty;

    [StringLength(12)]
    public string? ProvinciaCod { get; set; }

    [StringLength(150)]
    public string? Municipio { get; set; }

    [StringLength(100)]
    public string? ComarcaId { get; set; }

    public int? ProvinciaId { get; set; }

    [StringLength(1)]
    public string? Activa { get; set; }

    [StringLength(1)]
    public string? Validada { get; set; }

    [StringLength(150)]
    public string? ValorExportacion { get; set; }

    public int? PaisId { get; set; }

    [StringLength(100)]
    public string? NumHabitantes { get; set; }
}

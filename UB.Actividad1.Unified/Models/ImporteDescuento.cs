using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UB.Actividad1.API.Models;

public class ImporteDescuento
{
    [Key]
    public int Id { get; set; }
    
    public int ActividadId { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? ImporteBase { get; set; }
    
    [MaxLength(50)]
    public string? TipoImpuesto { get; set; }
    
    public decimal? PorcentajeDescuento { get; set; }
    
    [MaxLength(50)]
    public string? CodigoPromocional { get; set; }
    
    [MaxLength(1000)]
    public string? CondicionesES { get; set; }
    
    [MaxLength(1000)]
    public string? CondicionesCA { get; set; }
    
    [MaxLength(1000)]
    public string? CondicionesEN { get; set; }
    
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public DateTime FechaModificacion { get; set; } = DateTime.UtcNow;
    
    // Navigation property
    public virtual Actividad Actividad { get; set; } = null!;
}

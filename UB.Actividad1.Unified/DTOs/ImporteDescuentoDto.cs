using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs;

public class ImporteDescuentoDto
{
    public decimal? ImporteBase { get; set; }
    
    [MaxLength(100)]
    public string? TipoImpuesto { get; set; }
    
    public decimal? PorcentajeDescuento { get; set; }
    
    [MaxLength(100)]
    public string? CodigoPromocional { get; set; }
    
    [MaxLength(1000)]
    public string? CondicionesES { get; set; }
    
    [MaxLength(1000)]
    public string? CondicionesCA { get; set; }
    
    [MaxLength(1000)]
    public string? CondicionesEN { get; set; }
}

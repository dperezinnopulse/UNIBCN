using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models;

public class ActividadDenominacionDescuento
{
    public int ActividadId { get; set; }
    public int DenominacionDescuentoId { get; set; }
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Actividad Actividad { get; set; } = null!;
    public virtual ValorDominio DenominacionDescuento { get; set; } = null!;
}

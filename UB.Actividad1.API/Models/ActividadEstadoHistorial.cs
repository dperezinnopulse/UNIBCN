using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UB.Actividad1.API.Models;

public class ActividadEstadoHistorial
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ActividadId { get; set; }

    [Required]
    public int EstadoId { get; set; }

    [Required]
    public DateTime FechaCambio { get; set; }

    // Navigation
    public virtual Actividad? Actividad { get; set; }
    public virtual EstadoActividad? Estado { get; set; }
}



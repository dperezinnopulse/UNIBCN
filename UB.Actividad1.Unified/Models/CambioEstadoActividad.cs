using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models
{
    public class CambioEstadoActividad
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ActividadId { get; set; }
        
        [Required]
        public int EstadoAnteriorId { get; set; }
        
        [Required]
        public int EstadoNuevoId { get; set; }
        
        [MaxLength(1000)]
        public string? DescripcionMotivos { get; set; }
        
        public DateTime FechaCambio { get; set; } = DateTime.UtcNow;
        
        [Required]
        public int UsuarioCambioId { get; set; }
        
        public bool Activo { get; set; } = true;
        
        // Navigation properties
        public virtual Actividad Actividad { get; set; } = null!;
        public virtual EstadoActividad EstadoAnterior { get; set; } = null!;
        public virtual EstadoActividad EstadoNuevo { get; set; } = null!;
        public virtual Usuario UsuarioCambio { get; set; } = null!;
    }
}

using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.Models
{
    public class ActividadAdjunto
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int ActividadId { get; set; }
        
        [Required]
        [MaxLength(255)]
        public string NombreArchivo { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string RutaArchivo { get; set; } = string.Empty;
        
        [MaxLength(100)]
        public string? TipoMime { get; set; }
        
        public long TamañoBytes { get; set; }
        
        [MaxLength(500)]
        public string? Descripcion { get; set; }
        
        public DateTime FechaSubida { get; set; } = DateTime.UtcNow;
        
        public int UsuarioSubidaId { get; set; }
        
        public bool Activo { get; set; } = true;
        
        // Navigation properties
        public virtual Actividad Actividad { get; set; } = null!;
        public virtual Usuario UsuarioSubida { get; set; } = null!;
    }
}

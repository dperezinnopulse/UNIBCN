using System.ComponentModel.DataAnnotations;

namespace UB.Actividad1.API.DTOs
{
    public class PreInscripcionDto
    {
        [Required(ErrorMessage = "El tipo de documento es obligatorio")]
        public string TipoDocumento { get; set; } = string.Empty;

        [Required(ErrorMessage = "El número de documento es obligatorio")]
        public string NumeroDocumento { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El primer apellido es obligatorio")]
        public string Apellido1 { get; set; } = string.Empty;

        [Required(ErrorMessage = "El segundo apellido es obligatorio")]
        public string Apellido2 { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono es obligatorio")]
        public string Telefono { get; set; } = string.Empty;

        public DateTime? FechaNacimiento { get; set; }

        public string? CodigoPostal { get; set; }

        public string? Localidad { get; set; }

        public string? Poblacion { get; set; }

        [EmailAddress(ErrorMessage = "Formato de email alternativo inválido")]
        public string? EmailAlternativo { get; set; }

        public string? OtroTelefono { get; set; }

        public string? Genero { get; set; }

        public string? Observaciones { get; set; }

        [Required(ErrorMessage = "El ID de actividad es obligatorio")]
        public int ActividadId { get; set; }
    }
}


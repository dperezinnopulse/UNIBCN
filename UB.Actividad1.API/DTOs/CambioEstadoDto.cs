namespace UB.Actividad1.API.DTOs
{
    public class CambioEstadoDto
    {
        public int Id { get; set; }
        public int ActividadId { get; set; }
        public int EstadoAnteriorId { get; set; }
        public string EstadoAnteriorNombre { get; set; } = string.Empty;
        public int EstadoNuevoId { get; set; }
        public string EstadoNuevoNombre { get; set; } = string.Empty;
        public string? DescripcionMotivos { get; set; }
        public DateTime FechaCambio { get; set; }
        public int UsuarioCambioId { get; set; }
        public string UsuarioCambioNombre { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class SolicitudCambioEstadoDto
    {
        public int ActividadId { get; set; }
        public int EstadoNuevoId { get; set; }
        public string? DescripcionMotivos { get; set; }
    }
}

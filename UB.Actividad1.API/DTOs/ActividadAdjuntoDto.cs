namespace UB.Actividad1.API.DTOs
{
    public class ActividadAdjuntoDto
    {
        public int Id { get; set; }
        public int ActividadId { get; set; }
        public string NombreArchivo { get; set; } = string.Empty;
        public string? TipoMime { get; set; }
        public long TamañoBytes { get; set; }
        public string? Descripcion { get; set; }
        public DateTime FechaSubida { get; set; }
        public int UsuarioSubidaId { get; set; }
        public string UsuarioSubidaNombre { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class SubirAdjuntoDto
    {
        public int ActividadId { get; set; }
        public string? Descripcion { get; set; }
    }
}

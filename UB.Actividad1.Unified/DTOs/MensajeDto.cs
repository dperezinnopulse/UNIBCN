namespace UB.Actividad1.API.DTOs;

public class HiloMensajeDto
{
    public int Id { get; set; }
    public int ActividadId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaModificacion { get; set; }
    public int TotalMensajes { get; set; }
    public int MensajesNoLeidos { get; set; }
    public MensajeDto? UltimoMensaje { get; set; }
}

public class MensajeDto
{
    public int Id { get; set; }
    public int HiloMensajeId { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;
    public string Contenido { get; set; } = string.Empty;
    public string? Asunto { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime? FechaModificacion { get; set; }
    public bool Leido { get; set; }
    public List<AdjuntoDto> Adjuntos { get; set; } = new List<AdjuntoDto>();
}

public class AdjuntoDto
{
    public int Id { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public string? TipoMime { get; set; }
    public long TamañoBytes { get; set; }
    public DateTime FechaSubida { get; set; }
}

public class CrearMensajeDto
{
    public int HiloMensajeId { get; set; }
    public string Contenido { get; set; } = string.Empty;
    public string? Asunto { get; set; }
    public List<IFormFile>? Adjuntos { get; set; }
}

public class CrearHiloMensajeDto
{
    public int ActividadId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public string ContenidoPrimerMensaje { get; set; } = string.Empty;
    public List<IFormFile>? Adjuntos { get; set; }
}

public class MarcarLeidoDto
{
    public int MensajeId { get; set; }
    public int UsuarioId { get; set; }
}

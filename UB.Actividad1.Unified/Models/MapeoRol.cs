namespace UB.Actividad1.API.Models;

public class MapeoRol
{
    public int Id { get; set; }
    public string RolOriginal { get; set; } = string.Empty;
    public int RolNormalizadoId { get; set; }
    public bool Activo { get; set; } = true;
    
    // Navigation properties
    public virtual RolNormalizado RolNormalizado { get; set; } = null!;
}


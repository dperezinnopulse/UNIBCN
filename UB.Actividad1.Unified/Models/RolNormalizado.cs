namespace UB.Actividad1.API.Models;

public class RolNormalizado
{
    public int Id { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public bool Activo { get; set; } = true;
    
    // Navigation properties
    public virtual ICollection<MapeoRol> MapeosRoles { get; set; } = new List<MapeoRol>();
}


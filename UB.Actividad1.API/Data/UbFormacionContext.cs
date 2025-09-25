using Microsoft.EntityFrameworkCore;
using UB.Actividad1.API.Models;

namespace UB.Actividad1.API.Data;

public class UbFormacionContext : DbContext
{
    public UbFormacionContext(DbContextOptions<UbFormacionContext> options) : base(options)
    {
    }

    public DbSet<Actividad> Actividades { get; set; }
    public DbSet<EstadoActividad> EstadosActividad { get; set; }
    public DbSet<UnidadGestion> UnidadesGestion { get; set; }
    public DbSet<Subactividad> Subactividades { get; set; }
    public DbSet<Participante> Participantes { get; set; }
    public DbSet<Internacionalizacion> Internacionalizaciones { get; set; }
    public DbSet<EntidadOrganizadora> EntidadesOrganizadoras { get; set; }
    public DbSet<ImporteDescuento> ImportesDescuentos { get; set; }
    public DbSet<Dominio> Dominios { get; set; }
    public DbSet<ValorDominio> ValoresDominio { get; set; }
    public DbSet<ActividadEstadoHistorial> ActividadEstadoHistorial { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<HiloMensaje> HilosMensajes { get; set; }
    public DbSet<Mensaje> Mensajes { get; set; }
    public DbSet<Adjunto> Adjuntos { get; set; }
    public DbSet<ActividadAdjunto> ActividadAdjuntos { get; set; }
    public DbSet<CambioEstadoActividad> CambiosEstadoActividad { get; set; }
    public DbSet<MensajeUsuario> MensajesUsuarios { get; set; }
    public DbSet<TransicionEstado> TransicionesEstado { get; set; }
    public DbSet<RolNormalizado> RolesNormalizados { get; set; }
    public DbSet<MapeoRol> MapeoRoles { get; set; }
    public DbSet<Localidad> Localidades { get; set; }
    public DbSet<ActividadDenominacionDescuento> ActividadDenominacionDescuentos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración simplificada sin relaciones bidireccionales
        modelBuilder.Entity<Actividad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(20);
            entity.Property(e => e.AnioAcademico).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(1000);
            entity.Property(e => e.Lugar).HasMaxLength(200);
        });

        modelBuilder.Entity<EstadoActividad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Descripcion).HasMaxLength(200);
            entity.Property(e => e.Color).HasMaxLength(7);
            entity.HasIndex(e => e.Codigo).IsUnique();
        });

        modelBuilder.Entity<UnidadGestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(500);
            entity.HasIndex(e => e.Codigo).IsUnique();
        });

        modelBuilder.Entity<Subactividad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(500);
            entity.Property(e => e.Modalidad).HasMaxLength(100);
            entity.Property(e => e.Docente).HasMaxLength(200);
            entity.Property(e => e.HoraInicio).HasMaxLength(10);
            entity.Property(e => e.HoraFin).HasMaxLength(10);
            entity.Property(e => e.Duracion).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Ubicacion).HasMaxLength(200);
            entity.Property(e => e.Idioma).HasMaxLength(50);
            entity.HasOne(e => e.Actividad)
                  .WithMany(a => a.Subactividades)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Participante>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Rol).HasMaxLength(50);
            entity.HasOne(e => e.Actividad)
                  .WithMany(a => a.Participantes)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Internacionalizacion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Idioma).IsRequired().HasMaxLength(5);
            entity.Property(e => e.Campo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Valor).IsRequired();
            entity.HasIndex(e => new { e.ActividadId, e.Idioma, e.Campo }).IsUnique();
        });

        modelBuilder.Entity<EntidadOrganizadora>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(200);
            entity.Property(e => e.NifCif).HasMaxLength(20);
            entity.Property(e => e.Web).HasMaxLength(500);
            entity.Property(e => e.PersonaContacto).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.Telefono).HasMaxLength(50);
            entity.HasOne(e => e.Actividad)
                  .WithMany(a => a.EntidadesOrganizadoras)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ImporteDescuento>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ImporteBase).HasColumnType("decimal(10,2)");
            entity.Property(e => e.TipoImpuesto).HasMaxLength(50);
            entity.Property(e => e.CodigoPromocional).HasMaxLength(50);
            entity.Property(e => e.CondicionesES).HasMaxLength(1000);
            entity.Property(e => e.CondicionesCA).HasMaxLength(1000);
            entity.Property(e => e.CondicionesEN).HasMaxLength(1000);
            entity.HasOne(e => e.Actividad)
                  .WithMany(a => a.ImportesDescuentos)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Dominio>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100).IsUnicode();
            entity.Property(e => e.Descripcion).HasMaxLength(500).IsUnicode();
            entity.HasIndex(e => e.Nombre).IsUnique();
        });

        modelBuilder.Entity<ValorDominio>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Valor).IsRequired().HasMaxLength(200).IsUnicode();
            entity.Property(e => e.Descripcion).HasMaxLength(500).IsUnicode();
            entity.HasOne(e => e.Dominio)
                  .WithMany(d => d.Valores)
                  .HasForeignKey(e => e.DominioId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.DominioId, e.Valor }).IsUnique();
        });

        modelBuilder.Entity<Dominio>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100).IsUnicode();
            entity.Property(e => e.Descripcion).HasMaxLength(500).IsUnicode();
            entity.HasIndex(e => e.Nombre).IsUnique();
        });

        // Historial de cambios de estado
        modelBuilder.Entity<ActividadEstadoHistorial>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FechaCambio).IsRequired();
            entity.HasOne(e => e.Actividad)
                  .WithMany()
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Estado)
                  .WithMany()
                  .HasForeignKey(e => e.EstadoId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Rol).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasOne(e => e.UnidadGestion)
                  .WithMany()
                  .HasForeignKey(e => e.UnidadGestionId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Configuración de mensajería
        modelBuilder.Entity<HiloMensaje>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(1000);
            entity.HasOne(e => e.Actividad)
                  .WithMany()
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Mensaje>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Contenido).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.Asunto).HasMaxLength(200);
            entity.HasOne(e => e.HiloMensaje)
                  .WithMany(h => h.Mensajes)
                  .HasForeignKey(e => e.HiloMensajeId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Usuario)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Adjunto>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.NombreArchivo).IsRequired().HasMaxLength(255);
            entity.Property(e => e.RutaArchivo).IsRequired().HasMaxLength(500);
            entity.Property(e => e.TipoMime).HasMaxLength(100);
            entity.HasOne(e => e.Mensaje)
                  .WithMany(m => m.Adjuntos)
                  .HasForeignKey(e => e.MensajeId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MensajeUsuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Mensaje)
                  .WithMany(m => m.MensajesUsuarios)
                  .HasForeignKey(e => e.MensajeId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Usuario)
                  .WithMany()
                  .HasForeignKey(e => e.UsuarioId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.MensajeId, e.UsuarioId }).IsUnique();
        });

        // Transiciones
        modelBuilder.Entity<TransicionEstado>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EstadoOrigenCodigo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EstadoDestinoCodigo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Accion).HasMaxLength(100);
            entity.Property(e => e.RolPermitido).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => new { e.EstadoOrigenCodigo, e.EstadoDestinoCodigo, e.RolPermitido }).IsUnique();
        });

        // Roles Normalizados
        modelBuilder.Entity<RolNormalizado>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(255);
            entity.HasIndex(e => e.Codigo).IsUnique();
        });

        // Mapeo de Roles
        modelBuilder.Entity<MapeoRol>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.RolOriginal).IsRequired().HasMaxLength(100);
            entity.HasOne(e => e.RolNormalizado)
                  .WithMany(r => r.MapeosRoles)
                  .HasForeignKey(e => e.RolNormalizadoId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.RolOriginal, e.RolNormalizadoId }).IsUnique();
        });

        modelBuilder.Entity<Localidad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.ToTable("Localidades");
            entity.Property(e => e.Id).HasColumnName("LocalidadId");
            entity.Property(e => e.CodigoPostal).IsRequired().HasMaxLength(5);
            entity.Property(e => e.NombreLocalidad).IsRequired().HasMaxLength(150).HasColumnName("Localidad");
            entity.Property(e => e.ProvinciaCod).HasMaxLength(12);
            entity.Property(e => e.Municipio).HasMaxLength(150);
            entity.Property(e => e.ComarcaId).HasMaxLength(100);
            entity.Property(e => e.Activa).HasMaxLength(1);
            entity.Property(e => e.Validada).HasMaxLength(1);
            entity.Property(e => e.ValorExportacion).HasMaxLength(150);
            entity.Property(e => e.NumHabitantes).HasMaxLength(100);
            entity.HasIndex(e => e.CodigoPostal);
        });

        // ActividadDenominacionDescuento (tabla de unión para selección múltiple)
        modelBuilder.Entity<ActividadDenominacionDescuento>(entity =>
        {
            entity.HasKey(e => new { e.ActividadId, e.DenominacionDescuentoId });
            entity.HasOne(e => e.Actividad)
                  .WithMany(a => a.DenominacionesDescuento)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.DenominacionDescuento)
                  .WithMany()
                  .HasForeignKey(e => e.DenominacionDescuentoId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de relaciones para los nuevos campos de dominio en Actividad
        modelBuilder.Entity<Actividad>(entity =>
        {
            entity.HasOne(a => a.Asignatura)
                  .WithMany()
                  .HasForeignKey(a => a.AsignaturaId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.DisciplinaRelacionada)
                  .WithMany()
                  .HasForeignKey(a => a.DisciplinaRelacionadaId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.IdiomaImparticion)
                  .WithMany()
                  .HasForeignKey(a => a.IdiomaImparticionId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.TiposCertificacion)
                  .WithMany()
                  .HasForeignKey(a => a.TiposCertificacionId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.MateriaDisciplina)
                  .WithMany()
                  .HasForeignKey(a => a.MateriaDisciplinaId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.AmbitoFormacion)
                  .WithMany()
                  .HasForeignKey(a => a.AmbitoFormacionId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.TiposFinanciacion)
                  .WithMany()
                  .HasForeignKey(a => a.TiposFinanciacionId)
                  .OnDelete(DeleteBehavior.Restrict);
            
            entity.HasOne(a => a.TiposInscripcion)
                  .WithMany()
                  .HasForeignKey(a => a.TiposInscripcionId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

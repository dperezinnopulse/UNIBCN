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
                  .WithMany()
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
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(500);
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
    }
}

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
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración de Actividad
        modelBuilder.Entity<Actividad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(20);
            entity.Property(e => e.AnioAcademico).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(1000);
            entity.Property(e => e.Lugar).HasMaxLength(200);
            
            entity.HasOne(e => e.Estado)
                  .WithMany(e => e.Actividades)
                  .HasForeignKey(e => e.EstadoId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasOne(e => e.UnidadGestion)
                  .WithMany(e => e.Actividades)
                  .HasForeignKey(e => e.UnidadGestionId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
        
        // Configuración de EstadoActividad
        modelBuilder.Entity<EstadoActividad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Descripcion).HasMaxLength(200);
            entity.Property(e => e.Color).HasMaxLength(7);
            
            entity.HasIndex(e => e.Codigo).IsUnique();
        });
        
        // Configuración de UnidadGestion
        modelBuilder.Entity<UnidadGestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasMaxLength(500);
            
            entity.HasIndex(e => e.Codigo).IsUnique();
        });
        
        // Configuración de Subactividad
        modelBuilder.Entity<Subactividad>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Titulo).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Descripcion).HasMaxLength(500);
            entity.Property(e => e.Lugar).HasMaxLength(200);
            entity.Property(e => e.Responsable).HasMaxLength(200);
            
            entity.HasOne(e => e.Actividad)
                  .WithMany(e => e.Subactividades)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        
        // Configuración de Participante
        modelBuilder.Entity<Participante>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Apellidos).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Telefono).HasMaxLength(20);
            entity.Property(e => e.DNI).HasMaxLength(20);
            entity.Property(e => e.TipoParticipante).HasMaxLength(50);
            entity.Property(e => e.Estado).HasMaxLength(20);
            
            entity.HasOne(e => e.Actividad)
                  .WithMany(e => e.Participantes)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
        
        // Configuración de Internacionalizacion
        modelBuilder.Entity<Internacionalizacion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Idioma).IsRequired().HasMaxLength(5);
            entity.Property(e => e.Campo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Valor).IsRequired();
            
            entity.HasOne(e => e.Actividad)
                  .WithMany(e => e.Internacionalizaciones)
                  .HasForeignKey(e => e.ActividadId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => new { e.ActividadId, e.Idioma, e.Campo }).IsUnique();
        });
    }
} 
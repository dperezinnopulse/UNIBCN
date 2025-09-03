using Microsoft.EntityFrameworkCore;
using UB.Actividad1.API.Data;
using UB.Actividad1.API.Models;
using UB.Actividad1.API.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddDbContext<UbFormacionContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

// Endpoints de la API
app.MapGet("/api/actividades", async (UbFormacionContext context, string? ug = null, string? estado = null, string? search = null, int page = 1, int pageSize = 20) =>
{
    try
    {
        var query = context.Actividades.AsQueryable();

        if (!string.IsNullOrEmpty(ug))
            query = query.Where(a => a.UnidadGestion.Codigo == ug);

        if (!string.IsNullOrEmpty(estado))
            query = query.Where(a => a.Estado.Codigo == estado);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(a => a.Titulo.Contains(search) || a.Codigo.Contains(search));

        var total = await query.CountAsync();

        var actividades = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Results.Ok(new
        {
            items = actividades,
            totalItems = total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling((double)total / pageSize)
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error interno: {ex.Message}");
    }
});

app.MapGet("/api/actividades/{id}", async (int id, UbFormacionContext context) =>
{
    var actividad = await context.Actividades
        .FirstOrDefaultAsync(a => a.Id == id);

    if (actividad == null)
        return Results.NotFound();

    return Results.Ok(actividad);
});

app.MapPost("/api/actividades", async (CreateActividadDto dto, UbFormacionContext context) =>
{
    var actividad = new Actividad
    {
        Codigo = dto.Codigo ?? $"ACT-{DateTime.Now:yyyyMMddHHmmss}",
        AnioAcademico = dto.AnioAcademico ?? "2024-25",
        Titulo = dto.Titulo,
        Descripcion = dto.Descripcion,
        FechaInicio = dto.FechaInicio,
        FechaFin = dto.FechaFin,
        Lugar = dto.Lugar,
        UnidadGestionId = dto.UnidadGestionId,
        EstadoId = 1, // Borrador por defecto
        FechaCreacion = DateTime.UtcNow,
        FechaModificacion = DateTime.UtcNow
    };

    context.Actividades.Add(actividad);
    await context.SaveChangesAsync();

    return Results.Created($"/api/actividades/{actividad.Id}", actividad);
});

app.MapPut("/api/actividades/{id}", async (int id, UpdateActividadDto dto, UbFormacionContext context) =>
{
    var actividad = await context.Actividades.FindAsync(id);

    if (actividad == null)
        return Results.NotFound();

    actividad.Titulo = dto.Titulo;
    actividad.Descripcion = dto.Descripcion;
    actividad.FechaInicio = dto.FechaInicio;
    actividad.FechaFin = dto.FechaFin;
    actividad.Lugar = dto.Lugar;
    actividad.UnidadGestionId = dto.UnidadGestionId;
    actividad.FechaModificacion = DateTime.UtcNow;

    await context.SaveChangesAsync();
    return Results.Ok(actividad);
});

app.MapPatch("/api/actividades/{id}/estado", async (int id, PatchEstadoDto dto, UbFormacionContext context) =>
{
    var actividad = await context.Actividades.FindAsync(id);

    if (actividad == null)
        return Results.NotFound();

    var estado = await context.EstadosActividad.FindAsync(dto.EstadoId);

    if (estado == null)
        return Results.BadRequest("Estado no válido");

    actividad.EstadoId = dto.EstadoId;
    actividad.FechaModificacion = DateTime.UtcNow;

    await context.SaveChangesAsync();
    return Results.Ok(actividad);
});

app.MapGet("/api/estados", async (UbFormacionContext context) =>
{
    try
    {
        var estados = await context.EstadosActividad 
            .Where(e => e.Activo)
            .OrderBy(e => e.Orden)
            .ToListAsync();
        return Results.Ok(estados);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo estados: {ex.Message}");
    }
});

app.MapGet("/api/unidades-gestion", async (UbFormacionContext context) =>
{
    try
    {
        var unidades = await context.UnidadesGestion 
            .Where(u => u.Activo)
            .OrderBy(u => u.Nombre)
            .ToListAsync();
        return Results.Ok(unidades);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo unidades: {ex.Message}");
    }
});

app.MapGet("/api/actividades/{actividadId}/subactividades", async (int actividadId, UbFormacionContext context) =>
{
    var subactividades = await context.Subactividades
        .Where(s => s.ActividadId == actividadId)
        .OrderBy(s => s.Orden)
        .ToListAsync();
    return Results.Ok(subactividades);
});

app.MapPost("/api/actividades/{actividadId}/subactividades", async (int actividadId, CreateSubactividadDto dto, UbFormacionContext context) =>
{
    var actividad = await context.Actividades.FindAsync(actividadId);

    if (actividad == null)
        return Results.NotFound("Actividad no encontrada");

    var subactividad = new Subactividad
    {
        ActividadId = actividadId,
        Titulo = dto.Titulo,
        Descripcion = dto.Descripcion,
        FechaInicio = dto.FechaInicio,
        FechaFin = dto.FechaFin,
        Lugar = dto.Lugar,
        Responsable = dto.Responsable,
        Orden = dto.Orden,
        FechaCreacion = DateTime.UtcNow
    };

    context.Subactividades.Add(subactividad);
    await context.SaveChangesAsync();

    return Results.Created($"/api/actividades/{actividadId}/subactividades/{subactividad.Id}", subactividad);
});

app.MapGet("/api/actividades/{actividadId}/participantes", async (int actividadId, UbFormacionContext context) =>
{
    var participantes = await context.Participantes
        .Where(p => p.ActividadId == actividadId)
        .OrderBy(p => p.Apellidos)
        .ThenBy(p => p.Nombre)
        .ToListAsync();
    return Results.Ok(participantes);
});

app.MapPost("/api/actividades/{actividadId}/participantes", async (int actividadId, CreateParticipanteDto dto, UbFormacionContext context) =>
{
    var actividad = await context.Actividades.FindAsync(actividadId);

    if (actividad == null)
        return Results.NotFound("Actividad no encontrada");

    var participante = new Participante
    {
        ActividadId = actividadId,
        Nombre = dto.Nombre,
        Apellidos = dto.Apellidos,
        Email = dto.Email,
        Telefono = dto.Telefono,
        DNI = dto.DNI,
        TipoParticipante = dto.TipoParticipante,
        FechaInscripcion = DateTime.UtcNow,
        Estado = "Inscrito"
    };

    context.Participantes.Add(participante);
    await context.SaveChangesAsync();

    return Results.Created($"/api/actividades/{actividadId}/participantes/{participante.Id}", participante);
});

app.Run();

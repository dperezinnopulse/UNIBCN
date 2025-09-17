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

// Endpoint verdaderamente público para actividades (sin autenticación)
app.MapGet("/api/actividades-publicas", async (UbFormacionContext context,
    string? ug = null, 
    string? search = null, 
    string? tipoActividad = null,
    string? fechaDesde = null,
    string? fechaHasta = null,
    bool? cursoGratuito = null,
    int page = 1, 
    int pageSize = 10) =>
{
    try
    {
        Console.WriteLine($"🌐 BÚSQUEDA PÚBLICA: search='{search}', tipo='{tipoActividad}', ug='{ug}'");

        var query = context.Actividades.AsNoTracking();

        // Aplicar filtros
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a => 
                a.Titulo.Contains(search) || 
                (a.Descripcion != null && a.Descripcion.Contains(search)) ||
                a.Codigo.Contains(search));
            Console.WriteLine($"🔍 Filtro search aplicado: '{search}'");
        }

        if (!string.IsNullOrWhiteSpace(tipoActividad))
        {
            query = query.Where(a => a.TipoActividad == tipoActividad);
            Console.WriteLine($"🔍 Filtro tipo aplicado: '{tipoActividad}'");
        }

        if (!string.IsNullOrWhiteSpace(ug) && int.TryParse(ug, out var ugId))
        {
            query = query.Where(a => a.UnidadGestionId == ugId);
            Console.WriteLine($"🔍 Filtro UG aplicado: {ugId}");
        }

        if (!string.IsNullOrWhiteSpace(fechaDesde) && DateTime.TryParse(fechaDesde, out var fDesde))
        {
            query = query.Where(a => a.FechaInicio >= fDesde);
        }

        if (!string.IsNullOrWhiteSpace(fechaHasta) && DateTime.TryParse(fechaHasta, out var fHasta))
        {
            query = query.Where(a => a.FechaInicio <= fHasta);
        }

        if (cursoGratuito.HasValue && cursoGratuito.Value)
        {
            query = query.Where(a => a.CondicionesEconomicas != null && 
                (a.CondicionesEconomicas.Contains("gratuito") || a.CondicionesEconomicas.Contains("gratis")));
        }

        // Ordenar por fecha de modificación
        query = query.OrderByDescending(a => a.FechaModificacion);

        // Obtener total después de filtros
        var total = await query.CountAsync();
        Console.WriteLine($"📊 Total después de filtros: {total}");

        // Aplicar paginación
        var actividades = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(a => a.Estado)
            .Include(a => a.UnidadGestion)
            .ToListAsync();

        Console.WriteLine($"📋 Devolviendo {actividades.Count} actividades");

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
        Console.WriteLine($"❌ ERROR PÚBLICO: {ex.Message}");
        return Results.Problem($"Error: {ex.Message}");
    }
}).AllowAnonymous();

// Endpoints públicos (sin autenticación)
// Endpoint público para búsqueda de actividades
app.MapGet("/api/actividades/buscar", async (UbFormacionContext context,
    string? ug = null, 
    string? search = null, 
    string? tipoActividad = null,
    string? fechaDesde = null,
    string? fechaHasta = null,
    bool? cursoGratuito = null,
    int page = 1, 
    int pageSize = 10) =>
{
    try
    {
        Console.WriteLine($"🔍 BÚSQUEDA PÚBLICA: search='{search}', tipo='{tipoActividad}', ug='{ug}'");

        var query = context.Actividades.AsNoTracking();

        // Aplicar filtros
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a => 
                a.Titulo.Contains(search) || 
                (a.Descripcion != null && a.Descripcion.Contains(search)) ||
                a.Codigo.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(tipoActividad))
        {
            query = query.Where(a => a.TipoActividad == tipoActividad);
        }

        if (!string.IsNullOrWhiteSpace(ug) && int.TryParse(ug, out var ugId))
        {
            query = query.Where(a => a.UnidadGestionId == ugId);
        }

        // Obtener total y aplicar paginación
        var total = await query.CountAsync();
        var actividades = await query
            .OrderByDescending(a => a.FechaModificacion)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(a => a.Estado)
            .Include(a => a.UnidadGestion)
            .ToListAsync();

        Console.WriteLine($"🔍 RESULTADO: {actividades.Count} de {total} actividades");

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
        Console.WriteLine($"❌ ERROR BÚSQUEDA: {ex.Message}");
        return Results.Problem($"Error: {ex.Message}");
    }
}).AllowAnonymous();

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

// Endpoint público para búsqueda de actividades (sin autenticación)
app.MapGet("/api/actividades/buscar", async (UbFormacionContext context,
    string? ug = null, 
    string? search = null, 
    string? tipoActividad = null,
    string? fechaDesde = null,
    string? fechaHasta = null,
    bool? cursoGratuito = null,
    int page = 1, 
    int pageSize = 10) =>
{
    try
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        Console.WriteLine($"🔍 DEBUG PÚBLICO: Filtros - search: '{search}', tipo: '{tipoActividad}', ug: '{ug}', gratuito: {cursoGratuito}");

        // Consulta base - solo actividades publicadas
        var estadoPublicadaId = await context.EstadosActividad
            .Where(e => e.Codigo == "PUBLICADA" && e.Activo)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();

        var query = context.Actividades
            .AsNoTracking()
            .Where(a => a.EstadoId == estadoPublicadaId || a.EstadoId == 7); // 7 = Enviada (visible públicamente)

        // Aplicar filtros
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a => 
                a.Titulo.Contains(search) || 
                (a.Descripcion != null && a.Descripcion.Contains(search)) ||
                a.Codigo.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(tipoActividad))
        {
            query = query.Where(a => a.TipoActividad == tipoActividad);
        }

        if (!string.IsNullOrWhiteSpace(ug) && int.TryParse(ug, out var ugId))
        {
            query = query.Where(a => a.UnidadGestionId == ugId);
        }

        if (!string.IsNullOrWhiteSpace(fechaDesde) && DateTime.TryParse(fechaDesde, out var fDesde))
        {
            query = query.Where(a => a.FechaInicio >= fDesde);
        }

        if (!string.IsNullOrWhiteSpace(fechaHasta) && DateTime.TryParse(fechaHasta, out var fHasta))
        {
            query = query.Where(a => a.FechaInicio <= fHasta);
        }

        // Filtro de curso gratuito (campo que debería existir en el modelo)
        if (cursoGratuito.HasValue)
        {
            // Asumiendo que existe un campo booleano para curso gratuito
            // Si no existe, se puede simular con condicionesEconomicas
            if (cursoGratuito.Value)
            {
                query = query.Where(a => a.CondicionesEconomicas != null && 
                    (a.CondicionesEconomicas.Contains("gratuito") || a.CondicionesEconomicas.Contains("gratis")));
            }
        }

        // Ordenar por fecha de modificación descendente
        query = query.OrderByDescending(a => a.FechaModificacion);

        // Obtener total después de filtros
        var total = await query.CountAsync();

        // Aplicar paginación y seleccionar campos
        var actividades = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(a => a.Estado)
            .Include(a => a.UnidadGestion)
            .Select(a => new
            {
                id = a.Id,
                codigo = a.Codigo ?? "",
                titulo = a.Titulo ?? "",
                descripcion = a.Descripcion ?? "",
                tipoActividad = a.TipoActividad ?? "",
                fechaInicio = a.FechaInicio,
                fechaFin = a.FechaFin,
                plazasTotales = a.PlazasTotales,
                horasTotales = a.HorasTotales,
                lineaEstrategica = a.LineaEstrategica,
                objetivoEstrategico = a.ObjetivoEstrategico,
                condicionesEconomicas = a.CondicionesEconomicas,
                actividadPago = a.ActividadPago,
                cursoGratuito = !a.ActividadPago, // true si NO es de pago (más claro)
                estado = new {
                    id = a.EstadoId,
                    nombre = a.Estado.Nombre ?? "Sin estado"
                },
                unidadGestion = new {
                    id = a.UnidadGestionId ?? 0,
                    nombre = a.UnidadGestion != null ? a.UnidadGestion.Nombre : "Sin unidad"
                }
            })
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
        Console.WriteLine($"❌ ERROR EN /api/actividades/buscar: {ex.Message}");
        return Results.Problem($"Error en búsqueda: {ex.Message}");
    }
});

// Endpoint público para obtener una actividad específica con todos los campos
app.MapGet("/api/actividades/{id}/publico", async (int id, UbFormacionContext context) =>
{
    try
    {
        var actividad = await context.Actividades
            .Include(a => a.Estado)
            .Include(a => a.UnidadGestion)
            .Include(a => a.UsuarioAutor)
            .Include(a => a.Subactividades)
            .Include(a => a.Participantes)
            .Include(a => a.EntidadesOrganizadoras)
            .Include(a => a.ImportesDescuentos)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id);

        if (actividad == null)
            return Results.NotFound("Actividad no encontrada");

        return Results.Ok(actividad);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR EN /api/actividades/{id}/publico: {ex.Message}");
        return Results.Problem($"Error interno: {ex.Message}");
    }
});

app.Run();

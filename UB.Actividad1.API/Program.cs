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

// app.UseHttpsRedirection(); // Comentado temporalmente para pruebas HTTP
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

// Endpoint para guardar borrador
app.MapPut("/api/actividades/{id}/borrador", async (int id, UpdateActividadDto dto, UbFormacionContext context) =>
{
    var actividad = await context.Actividades.FindAsync(id);

    if (actividad == null)
        return Results.NotFound();

    // Marcar como borrador
    dto.EsBorrador = true;
    
    // Actualizar solo campos básicos para borrador
    if (dto.Titulo != null) actividad.Titulo = dto.Titulo;
    if (dto.Descripcion != null) actividad.Descripcion = dto.Descripcion;
    if (dto.Codigo != null) actividad.Codigo = dto.Codigo;
    
    // Cambiar estado a borrador
    actividad.EstadoId = 1; // Estado borrador
    actividad.FechaModificacion = DateTime.UtcNow;

    await context.SaveChangesAsync();
    
    return Results.Ok(new { message = "Borrador guardado correctamente", actividad });
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

    // Actualizar campos principales
    if (dto.Titulo != null) actividad.Titulo = dto.Titulo;
    if (dto.Descripcion != null) actividad.Descripcion = dto.Descripcion;
    if (dto.Codigo != null) actividad.Codigo = dto.Codigo;
    if (dto.TipoActividad != null) actividad.TipoActividad = dto.TipoActividad;
    if (dto.UnidadGestionId != null) actividad.UnidadGestionId = dto.UnidadGestionId;
    if (dto.CondicionesEconomicas != null) actividad.CondicionesEconomicas = dto.CondicionesEconomicas;
    if (dto.AnioAcademico != null) actividad.AnioAcademico = dto.AnioAcademico;
    if (dto.LineaEstrategica != null) actividad.LineaEstrategica = dto.LineaEstrategica;
    if (dto.ObjetivoEstrategico != null) actividad.ObjetivoEstrategico = dto.ObjetivoEstrategico;
    if (dto.CodigoRelacionado != null) actividad.CodigoRelacionado = dto.CodigoRelacionado;
    if (dto.ActividadReservada != null) 
    {
        // Convertir "S"/"N" a boolean
        actividad.ActividadReservada = dto.ActividadReservada.ToUpper() == "S" || dto.ActividadReservada.ToUpper() == "SÍ" || dto.ActividadReservada.ToUpper() == "SI";
    }
    if (dto.FechaActividad != null) actividad.FechaActividad = dto.FechaActividad;
    if (dto.MotivoCierre != null) actividad.MotivoCierre = dto.MotivoCierre;
    if (dto.PersonaSolicitante != null) actividad.PersonaSolicitante = dto.PersonaSolicitante;
    if (dto.Coordinador != null) actividad.Coordinador = dto.Coordinador;
    if (dto.JefeUnidadGestora != null) actividad.JefeUnidadGestora = dto.JefeUnidadGestora;
    if (dto.GestorActividad != null) actividad.GestorActividad = dto.GestorActividad;
    if (dto.FacultadDestinataria != null) actividad.FacultadDestinataria = dto.FacultadDestinataria;
    if (dto.DepartamentoDestinatario != null) actividad.DepartamentoDestinatario = dto.DepartamentoDestinatario;
    if (dto.CentroUnidadUBDestinataria != null) actividad.CentroUnidadUBDestinataria = dto.CentroUnidadUBDestinataria;
    if (dto.OtrosCentrosInstituciones != null) actividad.OtrosCentrosInstituciones = dto.OtrosCentrosInstituciones;
    if (dto.PlazasTotales != null) actividad.PlazasTotales = dto.PlazasTotales;
    if (dto.HorasTotales != null) actividad.HorasTotales = dto.HorasTotales.Value;
    if (dto.CentroTrabajoRequerido != null) actividad.CentroTrabajoRequerido = dto.CentroTrabajoRequerido;
    if (dto.ModalidadGestion != null) actividad.ModalidadGestion = dto.ModalidadGestion;
    if (dto.FechaInicioImparticion != null) actividad.FechaInicioImparticion = dto.FechaInicioImparticion;
    if (dto.FechaFinImparticion != null) actividad.FechaFinImparticion = dto.FechaFinImparticion;
    if (dto.ActividadPago != null) 
    {
        // Convertir "S"/"N" a boolean
        actividad.ActividadPago = dto.ActividadPago.ToUpper() == "S" || dto.ActividadPago.ToUpper() == "SÍ" || dto.ActividadPago.ToUpper() == "SI";
    }
    if (dto.FechaInicio != null) actividad.FechaInicio = dto.FechaInicio;
    if (dto.FechaFin != null) actividad.FechaFin = dto.FechaFin;
    if (dto.Lugar != null) actividad.Lugar = dto.Lugar;
    
    // Campos específicos por UG
    if (dto.CoordinadorCentreUnitat != null) actividad.CoordinadorCentreUnitat = dto.CoordinadorCentreUnitat;
    if (dto.CentreTreballeAlumne != null) actividad.CentreTreballeAlumne = dto.CentreTreballeAlumne;
    if (dto.CreditosTotalesCRAI != null) actividad.CreditosTotalesCRAI = dto.CreditosTotalesCRAI;
    if (dto.CreditosTotalesSAE != null) actividad.CreditosTotalesSAE = dto.CreditosTotalesSAE;
    if (dto.CreditosMinimosSAE != null) actividad.CreditosMinimosSAE = dto.CreditosMinimosSAE;
    if (dto.CreditosMaximosSAE != null) actividad.CreditosMaximosSAE = dto.CreditosMaximosSAE;
    if (dto.TipusEstudiSAE != null) actividad.TipusEstudiSAE = dto.TipusEstudiSAE;
    if (dto.CategoriaSAE != null) actividad.CategoriaSAE = dto.CategoriaSAE;
    if (dto.CompetenciesSAE != null) actividad.CompetenciesSAE = dto.CompetenciesSAE;
    
    // Campos de inscripción
    if (dto.InscripcionInicio != null) actividad.InscripcionInicio = dto.InscripcionInicio;
    if (dto.InscripcionFin != null) actividad.InscripcionFin = dto.InscripcionFin;
    if (dto.InscripcionPlazas != null) actividad.InscripcionPlazas = dto.InscripcionPlazas;
    if (dto.InscripcionListaEspera != null) 
    {
        // Convertir "S"/"N" a boolean
        actividad.InscripcionListaEspera = dto.InscripcionListaEspera.ToUpper() == "S" || dto.InscripcionListaEspera.ToUpper() == "SÍ" || dto.InscripcionListaEspera.ToUpper() == "SI";
    }
    if (dto.InscripcionModalidad != null) actividad.InscripcionModalidad = dto.InscripcionModalidad;
    if (dto.InscripcionRequisitosES != null) actividad.InscripcionRequisitosES = dto.InscripcionRequisitosES;
    if (dto.InscripcionRequisitosCA != null) actividad.InscripcionRequisitosCA = dto.InscripcionRequisitosCA;
    if (dto.InscripcionRequisitosEN != null) actividad.InscripcionRequisitosEN = dto.InscripcionRequisitosEN;
    
    // Campos de programa
    if (dto.ProgramaDescripcionES != null) actividad.ProgramaDescripcionES = dto.ProgramaDescripcionES;
    if (dto.ProgramaDescripcionCA != null) actividad.ProgramaDescripcionCA = dto.ProgramaDescripcionCA;
    if (dto.ProgramaDescripcionEN != null) actividad.ProgramaDescripcionEN = dto.ProgramaDescripcionEN;
    if (dto.ProgramaContenidosES != null) actividad.ProgramaContenidosES = dto.ProgramaContenidosES;
    if (dto.ProgramaContenidosCA != null) actividad.ProgramaContenidosCA = dto.ProgramaContenidosCA;
    if (dto.ProgramaContenidosEN != null) actividad.ProgramaContenidosEN = dto.ProgramaContenidosEN;
    if (dto.ProgramaObjetivosES != null) actividad.ProgramaObjetivosES = dto.ProgramaObjetivosES;
    if (dto.ProgramaObjetivosCA != null) actividad.ProgramaObjetivosCA = dto.ProgramaObjetivosCA;
    if (dto.ProgramaObjetivosEN != null) actividad.ProgramaObjetivosEN = dto.ProgramaObjetivosEN;
    if (dto.ProgramaDuracion != null) actividad.ProgramaDuracion = dto.ProgramaDuracion;
    if (dto.ProgramaInicio != null) actividad.ProgramaInicio = dto.ProgramaInicio;
    if (dto.ProgramaFin != null) actividad.ProgramaFin = dto.ProgramaFin;
    
    // Campos de traducción del título se manejan en la tabla Internacionalizacion
    // TODO: Implementar actualización de internacionalización si es necesario
    
    // Actualizar estado si es borrador
    if (dto.EsBorrador == true)
    {
        actividad.EstadoId = 1; // Estado borrador
    }
    
    actividad.FechaModificacion = DateTime.UtcNow;

    await context.SaveChangesAsync();
    
    // Actualizar entidades relacionadas si se proporcionan
    if (dto.Subactividades != null)
    {
        // Eliminar subactividades existentes
        var subactividadesExistentes = await context.Subactividades.Where(s => s.ActividadId == id).ToListAsync();
        context.Subactividades.RemoveRange(subactividadesExistentes);
        
        // Agregar nuevas subactividades
        foreach (var subDto in dto.Subactividades)
        {
            var subactividad = new Subactividad
            {
                ActividadId = id,
                Titulo = subDto.Titulo,
                Modalidad = subDto.Modalidad,
                Docente = subDto.Docente,
                Descripcion = subDto.Descripcion
            };
            context.Subactividades.Add(subactividad);
        }
    }
    
    if (dto.Participantes != null)
    {
        // Eliminar participantes existentes
        var participantesExistentes = await context.Participantes.Where(p => p.ActividadId == id).ToListAsync();
        context.Participantes.RemoveRange(participantesExistentes);
        
        // Agregar nuevos participantes
        foreach (var partDto in dto.Participantes)
        {
            var participante = new Participante
            {
                ActividadId = id,
                Nombre = partDto.Nombre,
                Rol = partDto.Rol,
                Email = partDto.Email
            };
            context.Participantes.Add(participante);
        }
    }
    
    if (dto.Colaboradoras != null)
    {
        // Eliminar colaboradoras existentes
        var colaboradorasExistentes = await context.EntidadesOrganizadoras.Where(e => e.ActividadId == id).ToListAsync();
        context.EntidadesOrganizadoras.RemoveRange(colaboradorasExistentes);
        
        // Agregar nuevas colaboradoras
        foreach (var colDto in dto.Colaboradoras)
        {
            var colaboradora = new EntidadOrganizadora
            {
                ActividadId = id,
                Nombre = colDto.Nombre,
                NifCif = colDto.NifCif,
                Web = colDto.Web,
                PersonaContacto = colDto.PersonaContacto,
                Email = colDto.Email,
                Telefono = colDto.Telefono
            };
            context.EntidadesOrganizadoras.Add(colaboradora);
        }
    }
    
    if (dto.Importes != null && dto.Importes.Any())
    {
        // Eliminar importes existentes
        var importesExistentes = await context.ImportesDescuentos.Where(i => i.ActividadId == id).ToListAsync();
        context.ImportesDescuentos.RemoveRange(importesExistentes);
        
        // Agregar nuevos importes
        foreach (var impDto in dto.Importes)
        {
            var importe = new ImporteDescuento
            {
                ActividadId = id,
                ImporteBase = impDto.ImporteBase ?? 0m,
                TipoImpuesto = impDto.TipoImpuesto,
                PorcentajeDescuento = impDto.PorcentajeDescuento ?? 0m,
                CodigoPromocional = impDto.CodigoPromocional,
                CondicionesES = impDto.CondicionesES,
                CondicionesCA = impDto.CondicionesCA,
                CondicionesEN = impDto.CondicionesEN
            };
            context.ImportesDescuentos.Add(importe);
        }
    }
    
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
    var estados = await context.EstadosActividad 
        .Where(e => e.Activo)
        .OrderBy(e => e.Orden)
        .ToListAsync();
    return Results.Ok(estados);
});

app.MapGet("/api/unidades-gestion", async (UbFormacionContext context) =>
{
    var unidades = await context.UnidadesGestion 
        .Where(u => u.Activo)
        .OrderBy(u => u.Nombre)
        .ToListAsync();
    return Results.Ok(unidades);
});

// Endpoints para entidades relacionadas
app.MapGet("/api/actividades/{actividadId}/subactividades", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var subactividades = await context.Subactividades
            .Where(s => s.ActividadId == actividadId)
            .ToListAsync();
        return Results.Ok(subactividades);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo subactividades: {ex.Message}");
    }
});

app.MapGet("/api/actividades/{actividadId}/participantes", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var participantes = await context.Participantes
            .Where(p => p.ActividadId == actividadId)
            .OrderBy(p => p.Nombre)
            .ToListAsync();
        return Results.Ok(participantes);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo participantes: {ex.Message}");
    }
});

app.MapGet("/api/actividades/{actividadId}/colaboradoras", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var colaboradoras = await context.EntidadesOrganizadoras
            .Where(e => e.ActividadId == actividadId)
            .Select(e => new
            {
                e.Id,
                e.Nombre,
                e.NifCif,
                e.Web,
                e.PersonaContacto,
                e.Email,
                e.Telefono,
                e.EsPrincipal
            })
            .ToListAsync();
        return Results.Ok(colaboradoras);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo colaboradoras: {ex.Message}");
    }
});

app.MapGet("/api/actividades/{actividadId}/importes", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var importes = await context.ImportesDescuentos
            .Where(i => i.ActividadId == actividadId)
            .Select(i => new
            {
                i.Id,
                i.ImporteBase,
                i.TipoImpuesto,
                i.PorcentajeDescuento,
                i.CodigoPromocional,
                i.CondicionesES,
                i.CondicionesCA,
                i.CondicionesEN
            })
            .ToListAsync();
        return Results.Ok(importes);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo importes: {ex.Message}");
    }
});

// ===== ENDPOINTS DE DOMINIOS =====
app.MapGet("/api/dominios", async (UbFormacionContext context) =>
{
    try
    {
        var dominios = await context.Dominios
            .Where(d => d.Activo)
            .OrderBy(d => d.Nombre)
            .ToListAsync();
        return Results.Ok(dominios);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo dominios: {ex.Message}");
    }
});

app.MapGet("/api/dominios/{nombreDominio}/valores", async (string nombreDominio, UbFormacionContext context) =>
{
    try
    {
        var dominio = await context.Dominios
            .FirstOrDefaultAsync(d => d.Nombre == nombreDominio && d.Activo);

        if (dominio == null)
            return Results.NotFound($"Dominio '{nombreDominio}' no encontrado");

        var valores = await context.ValoresDominio
            .Where(v => v.DominioId == dominio.Id && v.Activo)
            .OrderBy(v => v.Orden)
            .Select(v => new { v.Valor, v.Descripcion })
            .ToListAsync();

        return Results.Ok(valores);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo valores del dominio: {ex.Message}");
    }
});

app.Run();

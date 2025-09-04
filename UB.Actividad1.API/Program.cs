using Microsoft.EntityFrameworkCore;
using UB.Actividad1.API.Data;
using UB.Actividad1.API.Models;
using UB.Actividad1.API.DTOs;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddDbContext<UbFormacionContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Configurar JSON para evitar ciclos de referencia en serialización (y ocultar nulls)
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAntiforgery();

// Configuración JWT simple (clave de desarrollo)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "DEV_SECRET_KEY_CHANGE_ME_IN_PRODUCTION_USE_AT_LEAST_32_CHARACTERS";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "UB.Actividad1";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateLifetime = true
    };
});

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
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

// Endpoints de la API

// Auth
app.MapPost("/api/auth/login", async (LoginDto dto, UbFormacionContext context) =>
{
    var user = await context.Usuarios.FirstOrDefaultAsync(u => u.Username == dto.Username && u.Activo);
    if (user == null) return Results.Unauthorized();
    // Comparación en texto plano (temporal, sin cifrado)
    if (!string.Equals(dto.Password, user.PasswordHash)) return Results.Unauthorized();
    var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
    var key = Encoding.UTF8.GetBytes(jwtKey);
    var descriptor = new SecurityTokenDescriptor
    {
        Subject = new System.Security.Claims.ClaimsIdentity(new[]
        {
            new System.Security.Claims.Claim("sub", user.Id.ToString()),
            new System.Security.Claims.Claim("username", user.Username),
            new System.Security.Claims.Claim("rol", user.Rol),
            new System.Security.Claims.Claim("ugId", user.UnidadGestionId?.ToString() ?? "")
        }),
        Expires = DateTime.UtcNow.AddHours(8),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = handler.CreateToken(descriptor);
    var jwt = handler.WriteToken(token);
    return Results.Ok(new { token = jwt, user = new { user.Id, user.Username, user.Rol, user.UnidadGestionId } });
});

// DEV: generar hash BCrypt para una contraseña dada
app.MapGet("/api/auth/hash", (string pwd) =>
{
    try
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(pwd);
        return Results.Ok(new { hash });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message);
    }
});

app.MapPost("/api/auth/register", async (CreateUserDto dto, UbFormacionContext context) =>
{
    if (await context.Usuarios.AnyAsync(u => u.Username == dto.Username))
        return Results.BadRequest("Usuario ya existe");
    // Guardar password en texto plano (temporal, sin cifrado)
    var hash = dto.Password;
    var u = new Usuario
    {
        Username = dto.Username,
        PasswordHash = hash,
        Rol = string.IsNullOrWhiteSpace(dto.Rol) ? "Usuario" : dto.Rol,
        UnidadGestionId = dto.Rol?.Equals("Admin", StringComparison.OrdinalIgnoreCase) == true ? null : dto.UnidadGestionId,
        Activo = true
    };
    context.Usuarios.Add(u);
    await context.SaveChangesAsync();
    return Results.Created($"/api/usuarios/{u.Id}", new { u.Id, u.Username, u.Rol, u.UnidadGestionId });
});

// DEV: actualizar contraseña de un usuario (rehash BCrypt)
app.MapPost("/api/auth/set-password", async (CreateUserDto dto, UbFormacionContext context) =>
{
    if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
        return Results.BadRequest("Username y Password requeridos");
    var u = await context.Usuarios.FirstOrDefaultAsync(x => x.Username == dto.Username);
    if (u == null) return Results.NotFound("Usuario no encontrado");
    // Guardar password en texto plano (temporal, sin cifrado)
    u.PasswordHash = dto.Password;
    await context.SaveChangesAsync();
    return Results.Ok(new { message = "Password actualizado" });
});
app.MapGet("/api/actividades", async (UbFormacionContext context, HttpContext httpContext,
    string? ug = null, 
    string? estado = null, 
    string? search = null, 
    string? tipoActividad = null,
    string? fechaDesde = null,
    string? fechaHasta = null,
    string? autor = null,
    string? ordenarPor = "fechaModificacion",
    string? orden = "desc",
    int page = 1, 
    int pageSize = 20) =>
{
    try
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;

        // Obtener información del usuario autenticado
        var userIdClaim = httpContext.User.FindFirst("sub") ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        var userRoleClaim = httpContext.User.FindFirst("rol");
        
        var currentUserId = userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
        var currentUserRole = userRoleClaim?.Value;

        Console.WriteLine($"🔍 DEBUG: Usuario autenticado - ID: {currentUserId}, Rol: {currentUserRole}");

        var baseQuery = context.Actividades
            .AsNoTracking()
            .AsQueryable();

        // Filtrar por actividades del usuario si no es Admin
        if (currentUserRole != "Admin" && currentUserId.HasValue)
        {
            Console.WriteLine($"🔒 DEBUG: Aplicando filtro para usuario no-Admin - Solo actividades del usuario {currentUserId}");
            baseQuery = baseQuery.Where(a => a.UsuarioAutorId == currentUserId.Value);
        }
        else
        {
            Console.WriteLine($"👑 DEBUG: Usuario Admin o sin autenticación - Mostrando todas las actividades");
        }

        // Filtros
        if (!string.IsNullOrWhiteSpace(ug))
            baseQuery = baseQuery.Where(a => a.UnidadGestionId.ToString() == ug);

        if (!string.IsNullOrWhiteSpace(estado))
            baseQuery = baseQuery.Where(a => a.EstadoId.ToString() == estado);

        if (!string.IsNullOrWhiteSpace(search))
            baseQuery = baseQuery.Where(a => a.Titulo.Contains(search) || a.Codigo.Contains(search));

        if (!string.IsNullOrWhiteSpace(tipoActividad))
            baseQuery = baseQuery.Where(a => a.TipoActividad == tipoActividad);

        if (!string.IsNullOrWhiteSpace(fechaDesde) && DateTime.TryParse(fechaDesde, out var fechaDesdeParsed))
            baseQuery = baseQuery.Where(a => a.FechaModificacion >= fechaDesdeParsed);

        if (!string.IsNullOrWhiteSpace(fechaHasta) && DateTime.TryParse(fechaHasta, out var fechaHastaParsed))
            baseQuery = baseQuery.Where(a => a.FechaModificacion <= fechaHastaParsed);

        if (!string.IsNullOrWhiteSpace(autor))
            baseQuery = baseQuery.Where(a => a.PersonaSolicitante.Contains(autor));

        var total = await baseQuery.CountAsync();

        // Ordenación
        var ordenadoQuery = ordenarPor?.ToLower() switch
        {
            "fechacreacion" => orden == "asc" ? baseQuery.OrderBy(a => a.FechaCreacion) : baseQuery.OrderByDescending(a => a.FechaCreacion),
            "titulo" => orden == "asc" ? baseQuery.OrderBy(a => a.Titulo) : baseQuery.OrderByDescending(a => a.Titulo),
            "estado" => orden == "asc" ? baseQuery.OrderBy(a => a.Estado.Nombre) : baseQuery.OrderByDescending(a => a.Estado.Nombre),
            "unidadgestion" => orden == "asc" ? baseQuery.OrderBy(a => a.UnidadGestion.Nombre) : baseQuery.OrderByDescending(a => a.UnidadGestion.Nombre),
            _ => orden == "asc" ? baseQuery.OrderBy(a => a.FechaModificacion) : baseQuery.OrderByDescending(a => a.FechaModificacion)
        };

        var actividades = await ordenadoQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                id = a.Id,
                codigo = a.Codigo,
                titulo = a.Titulo,
                descripcion = a.Descripcion,
                fechaInicio = a.FechaInicio,
                fechaFin = a.FechaFin,
                fechaModificacion = a.FechaModificacion,
                fechaCreacion = a.FechaCreacion,
                tipoActividad = a.TipoActividad,
                anioAcademico = a.AnioAcademico,
                plazasTotales = a.PlazasTotales,
                horasTotales = a.HorasTotales,
                personaSolicitante = a.PersonaSolicitante,
                usuarioAutorId = a.UsuarioAutorId,
                usuarioAutorNombre = a.UsuarioAutor != null ? a.UsuarioAutor.Username : null,
                estado = new { id = a.EstadoId, nombre = a.Estado != null ? a.Estado.Nombre : null },
                unidadGestion = new { id = a.UnidadGestionId, nombre = a.UnidadGestion != null ? a.UnidadGestion.Nombre : null }
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
        return Results.Problem($"Error interno: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/actividades/{id}", async (int id, UbFormacionContext context) =>
{
    var actividad = await context.Actividades
        .Include(a => a.UsuarioAutor)
        .FirstOrDefaultAsync(a => a.Id == id);

    if (actividad == null)
        return Results.NotFound();

    return Results.Ok(actividad);
}).RequireAuthorization();

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
}).RequireAuthorization();

app.MapPost("/api/actividades", async (CreateActividadDto dto, UbFormacionContext context, HttpContext httpContext) =>
{
    // Validar campos obligatorios
    if (string.IsNullOrWhiteSpace(dto.Titulo))
    {
        return Results.BadRequest("El título es obligatorio");
    }
    
    // Extraer UsuarioId del token JWT
    var usuarioIdClaim = httpContext.User.FindFirst("sub") ?? 
                       httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    
    int? usuarioAutorId = null;
    if (usuarioIdClaim != null && int.TryParse(usuarioIdClaim.Value, out var userId))
    {
        usuarioAutorId = userId;
    }

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
        EstadoId = 6, // Borrador por defecto
        UsuarioAutorId = usuarioAutorId,
        FechaCreacion = DateTime.UtcNow,
        FechaModificacion = DateTime.UtcNow
    };

    context.Actividades.Add(actividad);
    await context.SaveChangesAsync();

    return Results.Created($"/api/actividades/{actividad.Id}", actividad);
}).RequireAuthorization();

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
}).RequireAuthorization();

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

    // Registrar historial de cambio de estado
    context.ActividadEstadoHistorial.Add(new ActividadEstadoHistorial
    {
        ActividadId = actividad.Id,
        EstadoId = dto.EstadoId,
        FechaCambio = actividad.FechaModificacion
    });

    await context.SaveChangesAsync();
    return Results.Ok(actividad);
}).RequireAuthorization();

app.MapGet("/api/estados", async (UbFormacionContext context, HttpContext httpContext) =>
{
    // Obtener el rol del usuario
    var userRoleClaim = httpContext.User.FindFirst("rol");
    var userRole = userRoleClaim?.Value;

    var query = context.EstadosActividad.Where(e => e.Activo);

    // Filtrar estados según el rol
    if (userRole == "Gestor")
    {
        // Los gestores no pueden ver estados Aceptada (9) o Subsanar (8)
        query = query.Where(e => e.Id != 8 && e.Id != 9);
    }

    var estados = await query
        .OrderBy(e => e.Orden)
        .Select(e => new { e.Id, e.Codigo, e.Nombre, e.Color })
        .ToListAsync();
    
    return Results.Ok(estados);
}).RequireAuthorization();

// Último cambio de estado de una actividad
app.MapGet("/api/actividades/{id}/estado/historial/ultimo", async (int id, UbFormacionContext context) =>
{
    var ultimo = await context.ActividadEstadoHistorial
        .Where(h => h.ActividadId == id)
        .OrderByDescending(h => h.FechaCambio)
        .Select(h => new { h.EstadoId, h.FechaCambio })
        .FirstOrDefaultAsync();

    if (ultimo == null)
    {
        return Results.NotFound();
    }

    return Results.Ok(ultimo);
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

// ===== ENDPOINTS DE MENSAJERÍA =====
app.MapGet("/api/mensajes/hilos", async (UbFormacionContext context, HttpContext httpContext, int? actividadId = null, int? usuarioId = null) =>
{
    try
    {
        // Obtener información del usuario autenticado
        var userIdClaim = httpContext.User.FindFirst("sub") ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        var userRoleClaim = httpContext.User.FindFirst("rol");
        
        var currentUserId = userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
        var currentUserRole = userRoleClaim?.Value;

        Console.WriteLine($"🔍 DEBUG MENSAJES: Usuario autenticado - ID: {currentUserId}, Rol: {currentUserRole}");

        var query = context.HilosMensajes
            .Where(h => h.Activo)
            .AsQueryable();

        if (actividadId.HasValue)
            query = query.Where(h => h.ActividadId == actividadId.Value);

        // Filtrar por actividades del usuario si no es Admin
        if (currentUserRole != "Admin" && currentUserId.HasValue)
        {
            Console.WriteLine($"🔒 DEBUG MENSAJES: Aplicando filtro para usuario no-Admin - Solo mensajes de actividades del usuario {currentUserId}");
            query = query.Where(h => h.Actividad.UsuarioAutorId == currentUserId.Value);
        }
        else
        {
            Console.WriteLine($"👑 DEBUG MENSAJES: Usuario Admin o sin autenticación - Mostrando todos los mensajes");
        }

        var hilos = await query
            .OrderByDescending(h => h.FechaModificacion)
            .Select(h => new HiloMensajeDto
            {
                Id = h.Id,
                ActividadId = h.ActividadId,
                Titulo = h.Titulo,
                Descripcion = h.Descripcion,
                FechaCreacion = h.FechaCreacion,
                FechaModificacion = h.FechaModificacion,
                TotalMensajes = h.Mensajes.Count(m => m.Activo),
                MensajesNoLeidos = currentUserId.HasValue ? 
                    h.Mensajes.Count(m => m.Activo && !m.MensajesUsuarios.Any(mu => mu.UsuarioId == currentUserId.Value && mu.Leido)) : 0,
                UltimoMensaje = h.Mensajes
                    .Where(m => m.Activo)
                    .OrderByDescending(m => m.FechaCreacion)
                    .Select(m => new MensajeDto
                    {
                        Id = m.Id,
                        HiloMensajeId = m.HiloMensajeId,
                        UsuarioId = m.UsuarioId,
                        UsuarioNombre = m.Usuario.Username,
                        Contenido = m.Contenido,
                        Asunto = m.Asunto,
                        FechaCreacion = m.FechaCreacion,
                        FechaModificacion = m.FechaModificacion,
                        Leido = currentUserId.HasValue ? 
                            m.MensajesUsuarios.Any(mu => mu.UsuarioId == currentUserId.Value && mu.Leido) : false
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Results.Ok(hilos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo hilos de mensajes: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/mensajes/hilos/{id}", async (int id, UbFormacionContext context, int? usuarioId = null) =>
{
    try
    {
        var hilo = await context.HilosMensajes
            .Where(h => h.Id == id && h.Activo)
            .Select(h => new HiloMensajeDto
            {
                Id = h.Id,
                ActividadId = h.ActividadId,
                Titulo = h.Titulo,
                Descripcion = h.Descripcion,
                FechaCreacion = h.FechaCreacion,
                FechaModificacion = h.FechaModificacion,
                TotalMensajes = h.Mensajes.Count(m => m.Activo),
                MensajesNoLeidos = usuarioId.HasValue ? 
                    h.Mensajes.Count(m => m.Activo && !m.MensajesUsuarios.Any(mu => mu.UsuarioId == usuarioId.Value && mu.Leido)) : 0
            })
            .FirstOrDefaultAsync();

        if (hilo == null)
            return Results.NotFound();

        return Results.Ok(hilo);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo hilo de mensaje: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/mensajes/hilos/{id}/mensajes", async (int id, UbFormacionContext context, int? usuarioId = null) =>
{
    try
    {
        var mensajes = await context.Mensajes
            .Where(m => m.HiloMensajeId == id && m.Activo && !m.Eliminado)
            .OrderBy(m => m.FechaCreacion)
            .Select(m => new MensajeDto
            {
                Id = m.Id,
                HiloMensajeId = m.HiloMensajeId,
                UsuarioId = m.UsuarioId,
                UsuarioNombre = m.Usuario.Username,
                Contenido = m.Contenido,
                Asunto = m.Asunto,
                FechaCreacion = m.FechaCreacion,
                FechaModificacion = m.FechaModificacion,
                Leido = usuarioId.HasValue ? 
                    m.MensajesUsuarios.Any(mu => mu.UsuarioId == usuarioId.Value && mu.Leido) : false,
                Adjuntos = m.Adjuntos
                    .Where(a => a.Activo)
                    .Select(a => new AdjuntoDto
                    {
                        Id = a.Id,
                        NombreArchivo = a.NombreArchivo,
                        TipoMime = a.TipoMime,
                        TamañoBytes = a.TamañoBytes,
                        FechaSubida = a.FechaSubida
                    })
                    .ToList()
            })
            .ToListAsync();

        return Results.Ok(mensajes);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo mensajes: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/mensajes/hilos", async (CrearHiloMensajeDto dto, UbFormacionContext context, HttpContext httpContext) =>
{
    try
    {
        
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        var hilo = new HiloMensaje
        {
            ActividadId = dto.ActividadId,
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            FechaCreacion = DateTime.UtcNow,
            FechaModificacion = DateTime.UtcNow
        };

        context.HilosMensajes.Add(hilo);
        await context.SaveChangesAsync();

        // Crear el primer mensaje
        var mensaje = new Mensaje
        {
            HiloMensajeId = hilo.Id,
            UsuarioId = usuarioId,
            Contenido = dto.ContenidoPrimerMensaje,
            FechaCreacion = DateTime.UtcNow
        };

        context.Mensajes.Add(mensaje);
        await context.SaveChangesAsync();

        // Obtener el autor de la actividad
        var actividad = await context.Actividades.FindAsync(dto.ActividadId);
        var autorActividadId = actividad?.UsuarioAutorId;

        // Marcar mensaje para el creador del hilo (leído)
        var mensajeUsuarioCreador = new MensajeUsuario
        {
            MensajeId = mensaje.Id,
            UsuarioId = usuarioId,
            Leido = true,
            FechaLectura = DateTime.UtcNow
        };
        context.MensajesUsuarios.Add(mensajeUsuarioCreador);

        // Marcar mensaje para el autor de la actividad (no leído, si es diferente al creador)
        if (autorActividadId.HasValue && autorActividadId.Value != usuarioId)
        {
            var mensajeUsuarioAutor = new MensajeUsuario
            {
                MensajeId = mensaje.Id,
                UsuarioId = autorActividadId.Value,
                Leido = false,
                FechaLectura = null
            };
            context.MensajesUsuarios.Add(mensajeUsuarioAutor);
        }

        await context.SaveChangesAsync();

        return Results.Created($"/api/mensajes/hilos/{hilo.Id}", hilo);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error creando hilo de mensaje: {ex.Message}");
    }
}).RequireAuthorization();

// Endpoint para obtener conteo de mensajes no leídos por actividad
app.MapGet("/api/mensajes/actividad/{actividadId}/no-leidos", async (int actividadId, HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        // Contar mensajes no leídos para esta actividad
        var mensajesNoLeidos = await context.MensajesUsuarios
            .CountAsync(mu => mu.UsuarioId == usuarioId && 
                             !mu.Leido && 
                             context.Mensajes.Any(m => m.Id == mu.MensajeId && 
                                                      m.HiloMensaje.ActividadId == actividadId && 
                                                      m.Activo));

        return Results.Ok(new { mensajesNoLeidos });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo mensajes no leídos: {ex.Message}");
    }
}).RequireAuthorization();

// Endpoint para marcar mensajes como leídos
app.MapPost("/api/mensajes/{hiloId}/marcar-leido", async (int hiloId, HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        // Obtener todos los mensajes del hilo que no están marcados como leídos para este usuario
        var mensajesNoLeidos = await context.MensajesUsuarios
            .Where(mu => mu.UsuarioId == usuarioId && 
                        !mu.Leido && 
                        context.Mensajes.Any(m => m.Id == mu.MensajeId && m.HiloMensajeId == hiloId))
            .ToListAsync();

        // Marcar como leídos
        foreach (var mensajeUsuario in mensajesNoLeidos)
        {
            mensajeUsuario.Leido = true;
            mensajeUsuario.FechaLectura = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();

        return Results.Ok(new { mensajesMarcados = mensajesNoLeidos.Count });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error marcando mensajes como leídos: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/mensajes", async (HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Log para debugging
        Console.WriteLine($"🔍 DEBUG: Endpoint /api/mensajes llamado");
        Console.WriteLine($"🔍 DEBUG: User.Identity.IsAuthenticated = {httpContext.User.Identity?.IsAuthenticated}");
        Console.WriteLine($"🔍 DEBUG: User.Identity.Name = {httpContext.User.Identity?.Name}");
        Console.WriteLine($"🔍 DEBUG: Claims count = {httpContext.User.Claims.Count()}");
        
        foreach (var claim in httpContext.User.Claims)
        {
            Console.WriteLine($"🔍 DEBUG: Claim - {claim.Type}: {claim.Value}");
        }
        
        // Extraer UsuarioId del token JWT
        var usuarioIdClaim = httpContext.User.FindFirst("sub") ?? 
                           httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        Console.WriteLine($"🔍 DEBUG: usuarioIdClaim = {usuarioIdClaim?.Value}");
        
        if (usuarioIdClaim == null || !int.TryParse(usuarioIdClaim.Value, out var usuarioId))
        {
            Console.WriteLine($"🔍 DEBUG: Usuario no autenticado - usuarioIdClaim es null o no se puede parsear");
            return Results.Unauthorized();
        }
        
        Console.WriteLine($"🔍 DEBUG: UsuarioId extraído = {usuarioId}");

        // Extraer datos del FormData
        var form = await httpContext.Request.ReadFormAsync();
        var contenido = form["Contenido"].FirstOrDefault();
        var hiloMensajeIdStr = form["HiloMensajeId"].FirstOrDefault();
        
        if (string.IsNullOrEmpty(contenido) || !int.TryParse(hiloMensajeIdStr, out var hiloMensajeId))
        {
            return Results.BadRequest("Contenido y HiloMensajeId son requeridos");
        }

        var mensaje = new Mensaje
        {
            HiloMensajeId = hiloMensajeId,
            UsuarioId = usuarioId,
            Contenido = contenido,
            Asunto = "Mensaje", // Valor por defecto
            FechaCreacion = DateTime.UtcNow
        };

        context.Mensajes.Add(mensaje);
        await context.SaveChangesAsync();

        // Procesar adjuntos si los hay
        var archivos = form.Files.Where(f => f.Name == "Adjuntos").ToList();
        if (archivos.Count > 0)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "adjuntos");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            foreach (var archivo in archivos)
            {
                if (archivo.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{archivo.FileName}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await archivo.CopyToAsync(stream);
                    }

                    var adjunto = new Adjunto
                    {
                        MensajeId = mensaje.Id,
                        NombreArchivo = archivo.FileName,
                        RutaArchivo = filePath,
                        TipoMime = archivo.ContentType,
                        TamañoBytes = archivo.Length,
                        FechaSubida = DateTime.UtcNow,
                        Activo = true
                    };

                    context.Adjuntos.Add(adjunto);
                }
            }
            await context.SaveChangesAsync();
        }

        // Actualizar fecha de modificación del hilo
        var hilo = await context.HilosMensajes.FindAsync(hiloMensajeId);
        if (hilo != null)
        {
            hilo.FechaModificacion = DateTime.UtcNow;
            await context.SaveChangesAsync();
        }

        // Obtener todos los usuarios que han participado en este hilo
        var usuariosParticipantes = await context.MensajesUsuarios
            .Where(mu => context.Mensajes.Any(m => m.HiloMensajeId == hiloMensajeId && m.Id == mu.MensajeId))
            .Select(mu => mu.UsuarioId)
            .Distinct()
            .ToListAsync();

        // Agregar el autor de la actividad si no está en la lista
        var actividad = await context.Actividades.FindAsync(hilo.ActividadId);
        if (actividad != null && actividad.UsuarioAutorId.HasValue && !usuariosParticipantes.Contains(actividad.UsuarioAutorId.Value))
        {
            usuariosParticipantes.Add(actividad.UsuarioAutorId.Value);
        }

        // Marcar mensaje para todos los usuarios participantes
        foreach (var participanteId in usuariosParticipantes)
        {
            var mensajeUsuario = new MensajeUsuario
            {
                MensajeId = mensaje.Id,
                UsuarioId = participanteId,
                Leido = participanteId == usuarioId, // Solo leído para el que escribe
                FechaLectura = participanteId == usuarioId ? DateTime.UtcNow : null
            };

            context.MensajesUsuarios.Add(mensajeUsuario);
        }

        await context.SaveChangesAsync();

        return Results.Created($"/api/mensajes/{mensaje.Id}", mensaje);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error creando mensaje: {ex.Message}");
    }
}).RequireAuthorization();

app.MapPost("/api/mensajes/{id}/leer", async (int id, MarcarLeidoDto dto, UbFormacionContext context) =>
{
    try
    {
        var mensajeUsuario = await context.MensajesUsuarios
            .FirstOrDefaultAsync(mu => mu.MensajeId == id && mu.UsuarioId == dto.UsuarioId);

        if (mensajeUsuario == null)
        {
            mensajeUsuario = new MensajeUsuario
            {
                MensajeId = id,
                UsuarioId = dto.UsuarioId,
                Leido = true,
                FechaLectura = DateTime.UtcNow
            };
            context.MensajesUsuarios.Add(mensajeUsuario);
        }
        else
        {
            mensajeUsuario.Leido = true;
            mensajeUsuario.FechaLectura = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
        return Results.Ok(new { message = "Mensaje marcado como leído" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error marcando mensaje como leído: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/mensajes/actividad/{actividadId}/resumen", async (int actividadId, UbFormacionContext context, int? usuarioId = null) =>
{
    try
    {
        var resumen = await context.HilosMensajes
            .Where(h => h.ActividadId == actividadId && h.Activo)
            .Select(h => new
            {
                h.Id,
                h.Titulo,
                TotalMensajes = h.Mensajes.Count(m => m.Activo),
                MensajesNoLeidos = usuarioId.HasValue ? 
                    h.Mensajes.Count(m => m.Activo && !m.MensajesUsuarios.Any(mu => mu.UsuarioId == usuarioId.Value && mu.Leido)) : 0,
                UltimoMensaje = h.Mensajes
                    .Where(m => m.Activo)
                    .OrderByDescending(m => m.FechaCreacion)
                    .Select(m => new
                    {
                        m.Id,
                        m.Contenido,
                        m.FechaCreacion,
                        UsuarioNombre = m.Usuario.Username
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Results.Ok(resumen);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo resumen de mensajes: {ex.Message}");
    }
}).RequireAuthorization();

// Endpoint para descargar adjuntos
app.MapGet("/api/mensajes/adjuntos/{id}/descargar", async (int id, UbFormacionContext context) =>
{
    try
    {
        var adjunto = await context.Adjuntos
            .FirstOrDefaultAsync(a => a.Id == id && a.Activo);

        if (adjunto == null)
            return Results.NotFound("Adjunto no encontrado");

        if (!File.Exists(adjunto.RutaArchivo))
            return Results.NotFound("Archivo no encontrado en el servidor");

        var fileBytes = await File.ReadAllBytesAsync(adjunto.RutaArchivo);
        return Results.File(fileBytes, adjunto.TipoMime, adjunto.NombreArchivo);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error descargando adjunto: {ex.Message}");
    }
});

// Endpoints para adjuntos de actividades
app.MapGet("/api/actividades/{actividadId}/adjuntos", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var adjuntos = await context.ActividadAdjuntos
            .Where(a => a.ActividadId == actividadId && a.Activo)
            .Include(a => a.UsuarioSubida)
            .OrderByDescending(a => a.FechaSubida)
            .Select(a => new ActividadAdjuntoDto
            {
                Id = a.Id,
                ActividadId = a.ActividadId,
                NombreArchivo = a.NombreArchivo,
                TipoMime = a.TipoMime,
                TamañoBytes = a.TamañoBytes,
                Descripcion = a.Descripcion,
                FechaSubida = a.FechaSubida,
                UsuarioSubidaId = a.UsuarioSubidaId,
                UsuarioSubidaNombre = a.UsuarioSubida.Username,
                Activo = a.Activo
            })
            .ToListAsync();

        return Results.Ok(adjuntos);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo adjuntos: {ex.Message}");
    }
});

app.MapPost("/api/actividades/{actividadId}/adjuntos", async (int actividadId, HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        var form = await httpContext.Request.ReadFormAsync();
        var archivos = form.Files.Where(f => f.Name == "archivos").ToList();
        var descripciones = form["descripciones"].ToList();

        if (archivos.Count == 0)
            return Results.BadRequest("No se han enviado archivos");

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "actividades");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var adjuntosCreados = new List<ActividadAdjuntoDto>();

        for (int i = 0; i < archivos.Count; i++)
        {
            var archivo = archivos[i];
            var descripcion = i < descripciones.Count ? descripciones[i] : null;

            if (archivo.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{archivo.FileName}";
                var filePath = Path.Combine(uploadsPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await archivo.CopyToAsync(stream);
                }

                var adjunto = new ActividadAdjunto
                {
                    ActividadId = actividadId,
                    NombreArchivo = archivo.FileName,
                    RutaArchivo = filePath,
                    TipoMime = archivo.ContentType,
                    TamañoBytes = archivo.Length,
                    Descripcion = descripcion,
                    FechaSubida = DateTime.UtcNow,
                    UsuarioSubidaId = usuarioId,
                    Activo = true
                };

                context.ActividadAdjuntos.Add(adjunto);
                await context.SaveChangesAsync();

                // Obtener el usuario para el DTO
                var usuario = await context.Usuarios.FindAsync(usuarioId);

                adjuntosCreados.Add(new ActividadAdjuntoDto
                {
                    Id = adjunto.Id,
                    ActividadId = adjunto.ActividadId,
                    NombreArchivo = adjunto.NombreArchivo,
                    TipoMime = adjunto.TipoMime,
                    TamañoBytes = adjunto.TamañoBytes,
                    Descripcion = adjunto.Descripcion,
                    FechaSubida = adjunto.FechaSubida,
                    UsuarioSubidaId = adjunto.UsuarioSubidaId,
                    UsuarioSubidaNombre = usuario?.Username ?? "Usuario",
                    Activo = adjunto.Activo
                });
            }
        }

        return Results.Ok(adjuntosCreados);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error subiendo adjuntos: {ex.Message}");
    }
}).RequireAuthorization();

app.MapDelete("/api/actividades/adjuntos/{adjuntoId}", async (int adjuntoId, HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        var adjunto = await context.ActividadAdjuntos.FindAsync(adjuntoId);
        if (adjunto == null)
            return Results.NotFound();

        // Solo permitir eliminar si es el usuario que lo subió o es Admin
        var userRoleClaim = httpContext.User.FindFirst("rol");
        var isAdmin = userRoleClaim?.Value == "Admin";
        
        if (adjunto.UsuarioSubidaId != usuarioId && !isAdmin)
            return Results.Forbid();

        // Marcar como inactivo en lugar de eliminar físicamente
        adjunto.Activo = false;
        await context.SaveChangesAsync();

        return Results.Ok(new { message = "Adjunto eliminado correctamente" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error eliminando adjunto: {ex.Message}");
    }
}).RequireAuthorization();

app.MapGet("/api/actividades/adjuntos/{adjuntoId}/descargar", async (int adjuntoId, UbFormacionContext context) =>
{
    try
    {
        var adjunto = await context.ActividadAdjuntos.FindAsync(adjuntoId);
        if (adjunto == null || !adjunto.Activo)
            return Results.NotFound();

        if (!File.Exists(adjunto.RutaArchivo))
            return Results.NotFound("Archivo no encontrado en el servidor");

        var fileBytes = await File.ReadAllBytesAsync(adjunto.RutaArchivo);
        return Results.File(fileBytes, adjunto.TipoMime ?? "application/octet-stream", adjunto.NombreArchivo);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error descargando adjunto: {ex.Message}");
    }
});

// Endpoint para eliminar mensaje propio
app.MapDelete("/api/mensajes/{mensajeId}", async (int mensajeId, HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        var mensaje = await context.Mensajes.FindAsync(mensajeId);
        if (mensaje == null)
            return Results.NotFound("Mensaje no encontrado");

        // Solo permitir eliminar si es el usuario que lo escribió o es Admin
        var userRoleClaim = httpContext.User.FindFirst("rol");
        var isAdmin = userRoleClaim?.Value == "Admin";
        
        if (mensaje.UsuarioId != usuarioId && !isAdmin)
            return Results.Forbid();

        // Marcar como eliminado en lugar de eliminar físicamente
        mensaje.Eliminado = true;
        mensaje.FechaEliminacion = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return Results.Ok(new { message = "Mensaje eliminado correctamente" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error eliminando mensaje: {ex.Message}");
    }
}).RequireAuthorization();

// Endpoints para cambios de estado
app.MapGet("/api/actividades/{actividadId}/cambios-estado", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var cambios = await context.CambiosEstadoActividad
            .Where(c => c.ActividadId == actividadId && c.Activo)
            .Include(c => c.EstadoAnterior)
            .Include(c => c.EstadoNuevo)
            .Include(c => c.UsuarioCambio)
            .OrderByDescending(c => c.FechaCambio)
            .Select(c => new CambioEstadoDto
            {
                Id = c.Id,
                ActividadId = c.ActividadId,
                EstadoAnteriorId = c.EstadoAnteriorId,
                EstadoAnteriorNombre = c.EstadoAnterior.Nombre,
                EstadoNuevoId = c.EstadoNuevoId,
                EstadoNuevoNombre = c.EstadoNuevo.Nombre,
                DescripcionMotivos = c.DescripcionMotivos,
                FechaCambio = c.FechaCambio,
                UsuarioCambioId = c.UsuarioCambioId,
                UsuarioCambioNombre = c.UsuarioCambio.Username,
                Activo = c.Activo
            })
            .ToListAsync();

        return Results.Ok(cambios);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo cambios de estado: {ex.Message}");
    }
});

app.MapPost("/api/actividades/cambiar-estado", async (SolicitudCambioEstadoDto solicitud, HttpContext httpContext, UbFormacionContext context) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        // Obtener el rol del usuario
        var userRoleClaim = httpContext.User.FindFirst("rol");
        var userRole = userRoleClaim?.Value;

        // Verificar que la actividad existe
        var actividad = await context.Actividades.FindAsync(solicitud.ActividadId);
        if (actividad == null)
            return Results.NotFound("Actividad no encontrada");

        // Verificar que el nuevo estado existe
        var nuevoEstado = await context.EstadosActividad.FindAsync(solicitud.EstadoNuevoId);
        if (nuevoEstado == null)
            return Results.BadRequest("Estado no válido");

        // Verificar permisos según el rol
        if (userRole == "Gestor")
        {
            // Los gestores no pueden cambiar a estados Aceptada (9) o Subsanar (8)
            if (solicitud.EstadoNuevoId == 8 || solicitud.EstadoNuevoId == 9)
            {
                return Results.Forbid();
            }
        }

        // Obtener el estado anterior
        var estadoAnteriorId = actividad.EstadoId;

        // Crear el registro de cambio de estado
        var cambioEstado = new CambioEstadoActividad
        {
            ActividadId = solicitud.ActividadId,
            EstadoAnteriorId = estadoAnteriorId,
            EstadoNuevoId = solicitud.EstadoNuevoId,
            DescripcionMotivos = solicitud.DescripcionMotivos,
            FechaCambio = DateTime.UtcNow,
            UsuarioCambioId = usuarioId,
            Activo = true
        };

        // Actualizar el estado de la actividad
        actividad.EstadoId = solicitud.EstadoNuevoId;
        actividad.FechaModificacion = DateTime.UtcNow;

        // Guardar cambios
        context.CambiosEstadoActividad.Add(cambioEstado);
        await context.SaveChangesAsync();

        // Obtener el usuario para el DTO de respuesta
        var usuario = await context.Usuarios.FindAsync(usuarioId);
        var estadoAnterior = await context.EstadosActividad.FindAsync(estadoAnteriorId);

        var cambioDto = new CambioEstadoDto
        {
            Id = cambioEstado.Id,
            ActividadId = cambioEstado.ActividadId,
            EstadoAnteriorId = cambioEstado.EstadoAnteriorId,
            EstadoAnteriorNombre = estadoAnterior?.Nombre ?? "Desconocido",
            EstadoNuevoId = cambioEstado.EstadoNuevoId,
            EstadoNuevoNombre = nuevoEstado.Nombre,
            DescripcionMotivos = cambioEstado.DescripcionMotivos,
            FechaCambio = cambioEstado.FechaCambio,
            UsuarioCambioId = cambioEstado.UsuarioCambioId,
            UsuarioCambioNombre = usuario?.Username ?? "Usuario",
            Activo = cambioEstado.Activo
        };

        return Results.Ok(cambioDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error cambiando estado: {ex.Message}");
    }
}).RequireAuthorization();

app.Run();

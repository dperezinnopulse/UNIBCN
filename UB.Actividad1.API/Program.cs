using Microsoft.EntityFrameworkCore;
using UB.Actividad1.API.Data;
using UB.Actividad1.API.Models;
using UB.Actividad1.API.DTOs;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Configurar logging detallado para desarrollo
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug);

// Agregar servicios al contenedor
// Configurar Entity Framework - DESHABILITADO TEMPORALMENTE PARA PRUEBAS
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

// Configurar HttpClient para servicios externos
builder.Services.AddHttpClient<UB.Actividad1.API.Services.PreInscripcionService>();
builder.Services.AddScoped<UB.Actividad1.API.Services.PreInscripcionService>();

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

// SIEMPRE mostrar errores detallados para debugging
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();

// Logging detallado de excepciones (solo en producción)
if (!app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        try
        {
            await next();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"🚨 EXCEPTION: {ex.Message}");
            Console.WriteLine($"🚨 STACK TRACE: {ex.StackTrace}");
            throw;
        }
    });
}

// app.UseHttpsRedirection(); // Comentado temporalmente para pruebas HTTP
app.UseCors("AllowAll");

// Middleware para logging detallado de requests (solo en desarrollo)
if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        Console.WriteLine($"🔍 REQUEST: {context.Request.Method} {context.Request.Path}");
        Console.WriteLine($"🔍 Headers: {string.Join(", ", context.Request.Headers.Select(h => $"{h.Key}: {h.Value}"))}");
        
        if (context.Request.ContentLength > 0)
        {
            context.Request.EnableBuffering();
            var body = await new StreamReader(context.Request.Body).ReadToEndAsync();
            context.Request.Body.Position = 0;
            Console.WriteLine($"🔍 Body: {body}");
        }
        
        await next();
    });
}

// Middleware para capturar errores detallados
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"🚨 ERROR DETALLADO:");
        Console.WriteLine($"   Mensaje: {ex.Message}");
        Console.WriteLine($"   Stack Trace: {ex.StackTrace}");
        Console.WriteLine($"   Inner Exception: {ex.InnerException?.Message}");
        
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Error interno del servidor: {ex.Message}");
    }
});

app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

// Servir archivos estáticos del frontend integrado (wwwroot)
var webRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
if (!Directory.Exists(webRootPath))
{
    try { Directory.CreateDirectory(webRootPath); } catch {}
}
// Configurar archivos estáticos y archivo por defecto (priorizar index-publico.html)
var defaultFilesOptions = new DefaultFilesOptions();
defaultFilesOptions.DefaultFileNames.Clear();
defaultFilesOptions.DefaultFileNames.Add("index-publico.html");
defaultFilesOptions.DefaultFileNames.Add("index.html");
app.UseDefaultFiles(defaultFilesOptions);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath)
});

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

// Endpoint de prueba simple (sin base de datos)
app.MapGet("/api/test", () =>
{
    return Results.Ok(new { 
        message = "Backend funcionando correctamente", 
        timestamp = DateTime.Now,
        version = "1.6.0"
    });
});

// Endpoint de health check
app.MapGet("/api/health", () =>
{
    return Results.Ok(new { 
        status = "healthy", 
        timestamp = DateTime.Now,
        version = "1.6.0"
    });
});

// Endpoint de prueba para detalle público (sin base de datos)
app.MapGet("/api/actividades/publicas-test", () =>
{
    return Results.Ok(new { 
        message = "Endpoint público funcionando", 
        actividades = new[] {
            new { id = 6, titulo = "Actividad de prueba", estado = "Publicada" }
        }
    });
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

// ==========================
// DEBUG: detectar columnas nulas problemáticas
// ==========================
app.MapGet("/api/debug/nulls", async (UbFormacionContext context) =>
{
    try
    {
        var actividadCodigoNullIds = await context.Actividades
            .Where(a => a.Codigo == null)
            .Select(a => a.Id)
            .Take(50)
            .ToListAsync();

        var actividadTituloNullIds = await context.Actividades
            .Where(a => a.Titulo == null)
            .Select(a => a.Id)
            .Take(50)
            .ToListAsync();

        var actividadAnioNullIds = await context.Actividades
            .Where(a => a.AnioAcademico == null)
            .Select(a => a.Id)
            .Take(50)
            .ToListAsync();

        var estadoNombreNull = await context.Actividades
            .Join(context.EstadosActividad, a => a.EstadoId, e => e.Id, (a, e) => new { a, e })
            .Where(x => x.e.Nombre == null)
            .Select(x => new { actividadId = x.a.Id, estadoId = x.e.Id })
            .Take(50)
            .ToListAsync();

        var ugNombreNull = await context.Actividades
            .Where(a => a.UnidadGestionId != null)
            .Join(context.UnidadesGestion, a => a.UnidadGestionId, ug => ug.Id, (a, ug) => new { a, ug })
            .Where(x => x.ug.Nombre == null)
            .Select(x => new { actividadId = x.a.Id, unidadGestionId = x.ug.Id })
            .Take(50)
            .ToListAsync();

        var usuarioUsernameNull = await context.Actividades
            .Where(a => a.UsuarioAutorId != null)
            .Join(context.Usuarios, a => a.UsuarioAutorId, u => u.Id, (a, u) => new { a, u })
            .Where(x => x.u.Username == null)
            .Select(x => new { actividadId = x.a.Id, usuarioId = x.u.Id })
            .Take(50)
            .ToListAsync();

        return Results.Ok(new
        {
            counts = new
            {
                actividadesCodigoNull = actividadCodigoNullIds.Count,
                actividadesTituloNull = actividadTituloNullIds.Count,
                actividadesAnioNull = actividadAnioNullIds.Count,
                estadosNombreNull = estadoNombreNull.Count,
                ugNombreNull = ugNombreNull.Count,
                usuariosUsernameNull = usuarioUsernameNull.Count
            },
            samples = new
            {
                actividadesCodigoNull = actividadCodigoNullIds,
                actividadesTituloNull = actividadTituloNullIds,
                actividadesAnioNull = actividadAnioNullIds,
                estadosNombreNull = estadoNombreNull,
                ugNombreNull = ugNombreNull,
                usuariosUsernameNull = usuarioUsernameNull
            }
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error generando informe de nulos: {ex.Message}");
    }
}).RequireAuthorization();
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

        // Obtener la unidad gestora del usuario si no es Admin
        int? userUnidadGestionId = null;
        if (currentUserRole != "Admin" && currentUserId.HasValue)
        {
            var usuario = await context.Usuarios.FindAsync(currentUserId.Value);
            userUnidadGestionId = usuario?.UnidadGestionId;
            Console.WriteLine($"🔒 DEBUG: Usuario no-Admin - Unidad gestora: {userUnidadGestionId}");
        }

        // Consulta base con filtro por unidad gestora si no es Admin
        var query = context.Actividades.AsNoTracking();
        
        // Filtrar por unidad gestora del usuario si no es Admin
        if (currentUserRole != "Admin" && userUnidadGestionId.HasValue)
        {
            query = query.Where(a => a.UnidadGestionId == userUnidadGestionId.Value);
            Console.WriteLine($"🔒 DEBUG: Aplicando filtro de unidad gestora: {userUnidadGestionId}");
        }
        else if (currentUserRole != "Admin" && !userUnidadGestionId.HasValue)
        {
            // Si el usuario no tiene unidad gestora, solo ver sus propias actividades
            query = query.Where(a => a.UsuarioAutorId == currentUserId.Value);
            Console.WriteLine($"🔒 DEBUG: Usuario sin unidad gestora - Solo sus propias actividades");
        }
        else
        {
            Console.WriteLine($"👑 DEBUG: Usuario Admin - Mostrando todas las actividades");
        }

        var actividades = await query
            .OrderByDescending(a => a.FechaCreacion)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new
            {
                id = a.Id,
                codigo = (EF.Property<string?>(a, nameof(a.Codigo)) ?? ""),
                titulo = (EF.Property<string?>(a, nameof(a.Titulo)) ?? ""),
                estadoId = a.EstadoId,
                unidadGestionId = a.UnidadGestionId,
                fechaInicio = a.FechaInicio,
                fechaFin = a.FechaFin,
                fechaModificacion = a.FechaModificacion,
                fechaCreacion = a.FechaCreacion,
                plazasTotales = a.PlazasTotales,
                horasTotales = a.HorasTotales,
                tipoActividad = a.TipoActividad ?? "",
                descripcion = a.Descripcion ?? "",
                anioAcademico = a.AnioAcademico ?? "",
                personaSolicitante = a.PersonaSolicitante ?? "",
                usuarioAutorId = a.UsuarioAutorId,
                usuarioAutorNombre = context.Usuarios
                    .Where(u => u.Id == a.UsuarioAutorId)
                    .Select(u => (string?)u.Username)
                    .FirstOrDefault() ?? "Usuario",
                estado = new {
                    id = a.EstadoId,
                    nombre = context.EstadosActividad
                        .Where(e => e.Id == a.EstadoId)
                        .Select(e => (string?)e.Nombre)
                        .FirstOrDefault() ?? "Sin estado"
                },
                unidadGestion = new {
                    id = a.UnidadGestionId ?? 0,
                    nombre = context.UnidadesGestion
                        .Where(ug => ug.Id == a.UnidadGestionId)
                        .Select(ug => (string?)ug.Nombre)
                        .FirstOrDefault() ?? "Sin unidad"
                }
            })
            .ToListAsync();

        var total = await context.Actividades.CountAsync();

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
        Console.WriteLine($"❌ ERROR EN /api/actividades: {ex.Message}");
        Console.WriteLine($"❌ STACK TRACE: {ex.StackTrace}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"❌ INNER EXCEPTION: {ex.InnerException.Message}");
        }
        // En modo debug, devolver el error completo en lugar de 500
        return Results.Problem(
            title: "Error en /api/actividades",
            detail: $"Error: {ex.Message}\nStack: {ex.StackTrace}\nInner: {ex.InnerException?.Message}",
            statusCode: 500
        );
    }
}).RequireAuthorization();

// ==========================
// Endpoint público para actividades
// ==========================
app.MapGet("/api/actividades/publicas", async (UbFormacionContext context, [AsParameters] PublicActividadesQuery query) =>
{
    try
    {
        Console.WriteLine($"🔍 DEBUG: Consultando actividades públicas para UG: {query.UnidadGestionId}");
        // Resolver id del estado PUBLICADA por código
        var estadoPublicadaId = await context.EstadosActividad
            .Where(e => e.Codigo == "PUBLICADA" && e.Activo)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();
        if (estadoPublicadaId == 0)
        {
            Console.WriteLine("❌ No se encontró el estado PUBLICADA");
            return Results.Ok(new List<object>());
        }

        // Solo actividades en estado "PUBLICADA" - DEVOLVER TODOS LOS CAMPOS
        var actividades = await context.Actividades
            .AsNoTracking()
            .Include(a => a.UnidadGestion)
            .Where(a => a.EstadoId == estadoPublicadaId)
            .ToListAsync();
        
        Console.WriteLine($"✅ DEBUG: Encontradas {actividades.Count} actividades públicas");
        
        return Results.Ok(actividades);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR EN /api/actividades/publicas: {ex.Message}");
        return Results.Problem($"Error interno: {ex.Message}");
    }
});

// ==========================
// Gestión de usuarios (Admin) y perfil propio
// ==========================

app.MapGet("/api/usuarios", async (UbFormacionContext context, HttpContext http) =>
{
    var role = http.User.FindFirst("rol")?.Value ?? string.Empty;
    if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return Results.Forbid();

    var usuarios = await context.Usuarios
        .AsNoTracking()
        .Select(u => new { u.Id, u.Username, u.Rol, u.UnidadGestionId, u.Email, u.Activo, u.FechaCreacion })
        .ToListAsync();
    return Results.Ok(usuarios);
}).RequireAuthorization();

app.MapGet("/api/usuarios/{id}", async (int id, UbFormacionContext context, HttpContext http) =>
{
    var role = http.User.FindFirst("rol")?.Value ?? string.Empty;
    if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return Results.Forbid();

    var u = await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
    if (u == null) return Results.NotFound();
    return Results.Ok(new { u.Id, u.Username, u.Rol, u.UnidadGestionId, u.Email, u.Activo, u.FechaCreacion });
}).RequireAuthorization();

app.MapPost("/api/usuarios", async (AdminCreateUserDto dto, UbFormacionContext context, HttpContext http) =>
{
    var role = http.User.FindFirst("rol")?.Value ?? string.Empty;
    if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return Results.Forbid();

    if (await context.Usuarios.AnyAsync(u => u.Username == dto.Username))
        return Results.BadRequest("Usuario ya existe");

    // Nota: Por compatibilidad con el login actual, almacenamos la contraseña como texto plano
    // (el sistema ya incluye BCrypt, se podrá activar cuando migremos login)
    var u = new Usuario
    {
        Username = dto.Username.Trim(),
        PasswordHash = dto.Password,
        Rol = string.IsNullOrWhiteSpace(dto.Rol) ? "Gestor" : dto.Rol,
        UnidadGestionId = string.Equals(dto.Rol, "Admin", StringComparison.OrdinalIgnoreCase) ? null : dto.UnidadGestionId,
        Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email,
        Activo = dto.Activo
    };
    context.Usuarios.Add(u);
    await context.SaveChangesAsync();
    return Results.Created($"/api/usuarios/{u.Id}", new { u.Id, u.Username, u.Rol, u.UnidadGestionId, u.Email, u.Activo });
}).RequireAuthorization();

app.MapPut("/api/usuarios/{id}", async (int id, AdminUpdateUserDto dto, UbFormacionContext context, HttpContext http) =>
{
    var role = http.User.FindFirst("rol")?.Value ?? string.Empty;
    if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return Results.Forbid();

    var u = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
    if (u == null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(dto.Username)) u.Username = dto.Username.Trim();
    if (!string.IsNullOrWhiteSpace(dto.NewPassword)) u.PasswordHash = dto.NewPassword;
    if (!string.IsNullOrWhiteSpace(dto.Rol)) u.Rol = dto.Rol;
    if (string.Equals(u.Rol, "Admin", StringComparison.OrdinalIgnoreCase))
    {
        u.UnidadGestionId = null; // Admin sin UG
    }
    else if (dto.UnidadGestionId.HasValue)
    {
        u.UnidadGestionId = dto.UnidadGestionId;
    }
    if (!string.IsNullOrWhiteSpace(dto.Email)) u.Email = dto.Email;
    if (dto.Activo.HasValue) u.Activo = dto.Activo.Value;

    await context.SaveChangesAsync();
    return Results.Ok(new { u.Id, u.Username, u.Rol, u.UnidadGestionId, u.Email, u.Activo });
}).RequireAuthorization();

app.MapDelete("/api/usuarios/{id}", async (int id, UbFormacionContext context, HttpContext http) =>
{
    var role = http.User.FindFirst("rol")?.Value ?? string.Empty;
    if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase)) return Results.Forbid();

    var u = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
    if (u == null) return Results.NotFound();
    u.Activo = false;
    await context.SaveChangesAsync();
    return Results.Ok(new { message = "Usuario desactivado" });
}).RequireAuthorization();

app.MapGet("/api/usuarios/yo", async (UbFormacionContext context, HttpContext http) =>
{
    var userIdClaim = http.User.FindFirst("sub") ?? http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var id = int.Parse(userIdClaim.Value);
    var u = await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
    if (u == null) return Results.NotFound();
    return Results.Ok(new { u.Id, u.Username, u.Email, u.Rol, u.UnidadGestionId, u.Activo, u.FechaCreacion });
}).RequireAuthorization();

app.MapPut("/api/usuarios/yo", async (UpdateOwnProfileDto dto, UbFormacionContext context, HttpContext http) =>
{
    var userIdClaim = http.User.FindFirst("sub") ?? http.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();
    var id = int.Parse(userIdClaim.Value);
    var u = await context.Usuarios.FirstOrDefaultAsync(x => x.Id == id);
    if (u == null) return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(dto.Username)) u.Username = dto.Username.Trim();
    if (!string.IsNullOrWhiteSpace(dto.NewPassword)) u.PasswordHash = dto.NewPassword;
    if (!string.IsNullOrWhiteSpace(dto.Email)) u.Email = dto.Email;

    await context.SaveChangesAsync();
    return Results.Ok(new { u.Id, u.Username, u.Email });
}).RequireAuthorization();

// Listado de Unidades de Gestión (para selects) - REQUIERE AUTENTICACIÓN
app.MapGet("/api/unidades-gestion", async (UbFormacionContext context) =>
{
    var ugs = await context.UnidadesGestion.AsNoTracking()
        .Where(u => u.Activo)
        .OrderBy(u => u.Nombre)
        .Select(u => new { u.Id, u.Nombre, u.Codigo })
        .ToListAsync();
    return Results.Ok(ugs);
}).RequireAuthorization();

// Listado de Estados (para selects) - REQUIERE AUTENTICACIÓN
app.MapGet("/api/estados", async (UbFormacionContext context) =>
{
    var estados = await context.EstadosActividad.AsNoTracking()
        .Where(e => e.Activo)
        .OrderBy(e => e.Orden)
        .Select(e => new { e.Id, e.Nombre, e.Codigo, e.Color })
        .ToListAsync();
    return Results.Ok(estados);
}).RequireAuthorization();

// Endpoint público para obtener una actividad específica (solo si está publicada)
app.MapGet("/api/actividades/publicas/{id}", async (int id, UbFormacionContext context) =>
{
    try
    {
        // Resolver id del estado PUBLICADA por código
        var estadoPublicadaId = await context.EstadosActividad
            .Where(e => e.Codigo == "PUBLICADA" && e.Activo)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();
        
        if (estadoPublicadaId == 0)
        {
            return Results.NotFound("Estado 'Publicada' no encontrado");
        }

        var actividad = await context.Actividades
            .Include(a => a.Estado)
            .Include(a => a.UnidadGestion)
            .Include(a => a.UsuarioAutor)
            .Where(a => a.Id == id && a.EstadoId == estadoPublicadaId)
            .Select(a => new
            {
                a.Id,
                a.Codigo,
                a.Titulo,
                a.Descripcion,
                a.FechaActividad,
                a.PlazasTotales,
                a.HorasTotales,
                a.CondicionesEconomicas,
                a.AnioAcademico,
                a.FechaInicioImparticion,
                a.FechaFinImparticion,
                a.ActividadPago,
                a.FechaCreacion,
                Estado = new { a.Estado.Id, a.Estado.Nombre, a.Estado.Codigo, a.Estado.Color },
                UnidadGestion = new { a.UnidadGestion.Id, a.UnidadGestion.Nombre, a.UnidadGestion.Codigo },
                UsuarioAutor = new { a.UsuarioAutor.Id, a.UsuarioAutor.Username }
            })
            .FirstOrDefaultAsync();

        if (actividad == null)
        {
            return Results.NotFound("Actividad no encontrada o no está publicada");
        }

        return Results.Ok(actividad);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR EN /api/actividades/publicas/{id}: {ex.Message}");
        return Results.Problem($"Error interno: {ex.Message}");
    }
});

// Endpoint de prueba para verificar la tabla Localidades
app.MapGet("/api/localidades-test", async (UbFormacionContext context) =>
{
    try
    {
        Console.WriteLine("🔍 TEST: Verificando tabla Localidades...");
        
        // Verificar si la tabla existe
        var totalLocalidades = await context.Localidades.CountAsync();
        Console.WriteLine($"📊 Total de localidades en BD: {totalLocalidades}");
        
        // Obtener algunos registros de ejemplo
        var ejemplos = await context.Localidades
            .AsNoTracking()
            .Take(3)
            .Select(l => new { l.Id, l.CodigoPostal, Localidad = l.NombreLocalidad, Provincia = l.ProvinciaCod })
            .ToListAsync();
            
        Console.WriteLine($"✅ Ejemplos encontrados: {ejemplos.Count}");
        return Results.Ok(new { total = totalLocalidades, ejemplos });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR EN TEST: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return Results.Problem($"Error en test: {ex.Message}");
    }
});

// Endpoint público para obtener localidades por código postal
app.MapGet("/api/localidades", async (string codigoPostal, UbFormacionContext context) =>
{
    try
    {
        Console.WriteLine($"🔍 DEBUG /api/localidades - Código postal recibido: '{codigoPostal}'");
        
        if (string.IsNullOrEmpty(codigoPostal) || codigoPostal.Length != 5)
        {
            Console.WriteLine($"❌ Código postal inválido: '{codigoPostal}'");
            return Results.BadRequest("El código postal debe tener 5 dígitos");
        }

        Console.WriteLine($"🔍 Consultando localidades para CP: {codigoPostal}");
        
        // Primero verificar si hay registros en la tabla
        var totalLocalidades = await context.Localidades.CountAsync();
        Console.WriteLine($"📊 Total de localidades en BD: {totalLocalidades}");
        
        // Verificar si existe el código postal
        var existeCP = await context.Localidades.AnyAsync(l => l.CodigoPostal == codigoPostal);
        Console.WriteLine($"🔍 ¿Existe CP {codigoPostal}?: {existeCP}");
        
        var localidades = await context.Localidades
            .AsNoTracking()
            .Where(l => l.CodigoPostal == codigoPostal)
            .Select(l => new { l.Id, Localidad = l.NombreLocalidad, l.CodigoPostal, Provincia = l.ProvinciaCod })
            .OrderBy(l => l.Localidad)
            .ToListAsync();

        Console.WriteLine($"✅ Localidades encontradas: {localidades.Count}");
        return Results.Ok(localidades);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR EN /api/localidades: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return Results.Problem($"Error interno: {ex.Message}\nStack: {ex.StackTrace}");
    }
});

// Endpoint público para obtener actividades publicadas por Unidad Gestora
// Eliminado duplicado de /api/actividades/publicas

app.MapGet("/api/actividades/{id}", async (int id, UbFormacionContext context) =>
{
    try
    {
        Console.WriteLine($"🔍 DEBUG: Buscando actividad con ID: {id}");
        
        var actividad = await context.Actividades
            .Include(a => a.UsuarioAutor)
            .Include(a => a.Estado)
            .Include(a => a.UnidadGestion)
            .Include(a => a.DenominacionesDescuento)
                .ThenInclude(dd => dd.DenominacionDescuento)
            .FirstOrDefaultAsync(a => a.Id == id);

        Console.WriteLine($"🔍 DEBUG: Actividad encontrada: {(actividad != null ? "SÍ" : "NO")}");
        
        if (actividad == null)
        {
            Console.WriteLine($"❌ DEBUG: Actividad con ID {id} no encontrada");
            return Results.NotFound();
        }

        Console.WriteLine($"✅ DEBUG: Actividad encontrada - Título: {actividad.Titulo}");
        
        // Crear objeto de respuesta con denominacionDescuentoIds incluido
        var respuesta = new
        {
            actividad.Id,
            actividad.Codigo,
            actividad.Titulo,
            actividad.Descripcion,
            actividad.TipoActividad,
            actividad.UnidadGestionId,
            actividad.CondicionesEconomicas,
            actividad.AnioAcademico,
            actividad.LineaEstrategica,
            actividad.ObjetivoEstrategico,
            actividad.CodigoRelacionado,
            actividad.ActividadReservada,
            actividad.FechaActividad,
            actividad.MotivoCierre,
            actividad.PersonaSolicitante,
            actividad.Coordinador,
            actividad.JefeUnidadGestora,
            actividad.GestorActividad,
            actividad.FacultadDestinataria,
            actividad.DepartamentoDestinatario,
            actividad.CentroUnidadUBDestinataria,
            actividad.OtrosCentrosInstituciones,
            actividad.PlazasTotales,
            actividad.HorasTotales,
            actividad.CentroTrabajoRequerido,
            actividad.ModalidadGestion,
            actividad.FechaInicioImparticion,
            actividad.FechaFinImparticion,
            actividad.ActividadPago,
            actividad.FechaInicio,
            actividad.FechaFin,
            actividad.Lugar,
            actividad.CoordinadorCentreUnitat,
            actividad.CentreTreballeAlumne,
            actividad.CreditosTotalesCRAI,
            actividad.CreditosTotalesSAE,
            actividad.CreditosMinimosSAE,
            actividad.CreditosMaximosSAE,
            actividad.TipusEstudiSAE,
            actividad.CategoriaSAE,
            actividad.CompetenciesSAE,
            actividad.InscripcionInicio,
            actividad.InscripcionFin,
            actividad.InscripcionPlazas,
            actividad.InscripcionListaEspera,
            actividad.InscripcionModalidad,
            actividad.InscripcionRequisitosES,
            actividad.InscripcionRequisitosCA,
            actividad.InscripcionRequisitosEN,
            actividad.ProgramaDescripcionES,
            actividad.ProgramaDescripcionCA,
            actividad.ProgramaDescripcionEN,
            actividad.ProgramaContenidosES,
            actividad.ProgramaContenidosCA,
            actividad.ProgramaContenidosEN,
            actividad.ProgramaObjetivosES,
            actividad.ProgramaObjetivosCA,
            actividad.ProgramaObjetivosEN,
            actividad.ProgramaDuracion,
            actividad.ProgramaInicio,
            actividad.ProgramaFin,
            actividad.EstadoId,
            actividad.FechaCreacion,
            actividad.FechaModificacion,
            actividad.UsuarioAutorId,
            actividad.Preinscripcion,
            actividad.EstadoActividad,
            actividad.AsignaturaId,
            actividad.GrupoAsignatura,
            actividad.DisciplinaRelacionadaId,
            actividad.CosteEstimadoActividad,
            actividad.TiposFinanciacionId,
            actividad.AnoInicialFinanciacion,
            actividad.AnoFinalFinanciacion,
            actividad.PlazasAfectadasDescuento,
            actividad.FechaLimitePago,
            actividad.TPV,
            actividad.Remesa,
            actividad.TiposInscripcionId,
            actividad.FechaAdjudicacionPreinscripcion,
            actividad.Metodologia,
            actividad.SistemaEvaluacion,
            actividad.HorarioYCalendario,
            actividad.IdiomaImparticionId,
            actividad.TiposCertificacionId,
            actividad.MateriaDisciplinaId,
            actividad.AmbitoFormacionId,
            actividad.Observaciones,
            actividad.EspacioImparticion,
            actividad.LugarImparticion,
            actividad.OtrasUbicaciones,
            actividad.UrlPlataformaVirtual,
            actividad.UrlCuestionarioSatisfaccion,
            // Incluir denominacionDescuentoIds como array de IDs
            denominacionDescuentoIds = actividad.DenominacionesDescuento?.Select(dd => dd.DenominacionDescuentoId).ToArray() ?? new int[0],
            // Incluir objetos relacionados
            usuarioAutor = actividad.UsuarioAutor,
            estado = actividad.Estado,
            unidadGestion = actividad.UnidadGestion
        };
        
        return Results.Ok(respuesta);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR en /api/actividades/{id}: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
        return Results.Problem($"Error interno: {ex.Message}\nStack: {ex.StackTrace}");
    }
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
    
    // Cambiar estado a borrador por código
    var estadoBorradorId_Save = await context.EstadosActividad
        .Where(e => e.Codigo == "BORRADOR" && e.Activo)
        .Select(e => e.Id)
        .FirstOrDefaultAsync();
    if (estadoBorradorId_Save == 0) estadoBorradorId_Save = 1;
    actividad.EstadoId = estadoBorradorId_Save;
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

    // Resolver id de estado BORRADOR por código
    var estadoBorradorId_Create = await context.EstadosActividad
        .Where(e => e.Codigo == "BORRADOR" && e.Activo)
        .Select(e => e.Id)
        .FirstOrDefaultAsync();
    if (estadoBorradorId_Create == 0) estadoBorradorId_Create = 1;

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

        // Información general adicional
        TipoActividad = dto.TipoActividad,
        LineaEstrategica = dto.LineaEstrategica,
        ObjetivoEstrategico = dto.ObjetivoEstrategico,
        CodigoRelacionado = dto.CodigoRelacionado,
        ActividadReservada = dto.ActividadReservada.HasValue && dto.ActividadReservada.Value > 0,
        FechaActividad = dto.FechaActividad,
        MotivoCierre = dto.MotivoCierre,
        PersonaSolicitante = dto.PersonaSolicitante,
        Coordinador = dto.Coordinador,
        JefeUnidadGestora = dto.JefeUnidadGestora,
        GestorActividad = dto.GestorActividad,
        FacultadDestinataria = dto.FacultadDestinataria,
        DepartamentoDestinatario = dto.DepartamentoDestinatario,
        CentroUnidadUBDestinataria = dto.CentroUnidadUBDestinataria,
        OtrosCentrosInstituciones = dto.OtrosCentrosInstituciones,
        PlazasTotales = dto.PlazasTotales,
        HorasTotales = dto.HorasTotales,
        CentroTrabajoRequerido = dto.CentroTrabajoRequerido,
        ModalidadGestion = dto.ModalidadGestion,
        FechaInicioImparticion = dto.FechaInicioImparticion,
        FechaFinImparticion = dto.FechaFinImparticion,
        CondicionesEconomicas = dto.CondicionesEconomicas,

        // Inscripción
        InscripcionInicio = dto.InscripcionInicio,
        InscripcionFin = dto.InscripcionFin,
        InscripcionPlazas = dto.InscripcionPlazas,
        InscripcionListaEspera = dto.InscripcionListaEspera,
        InscripcionModalidad = dto.InscripcionModalidad,
        InscripcionRequisitosES = dto.InscripcionRequisitosES,
        InscripcionRequisitosCA = dto.InscripcionRequisitosCA,
        InscripcionRequisitosEN = dto.InscripcionRequisitosEN,

        // Programa
        ProgramaDescripcionES = dto.ProgramaDescripcionES,
        ProgramaDescripcionCA = dto.ProgramaDescripcionCA,
        ProgramaDescripcionEN = dto.ProgramaDescripcionEN,
        ProgramaContenidosES = dto.ProgramaContenidosES,
        ProgramaContenidosCA = dto.ProgramaContenidosCA,
        ProgramaContenidosEN = dto.ProgramaContenidosEN,
        ProgramaObjetivosES = dto.ProgramaObjetivosES,
        ProgramaObjetivosCA = dto.ProgramaObjetivosCA,
        ProgramaObjetivosEN = dto.ProgramaObjetivosEN,
        ProgramaDuracion = dto.ProgramaDuracion,
        ProgramaInicio = dto.ProgramaInicio,
        ProgramaFin = dto.ProgramaFin,

        // UG específicas
        CoordinadorCentreUnitat = dto.CoordinadorCentreUnitat,
        CentreTreballeAlumne = dto.CentreTreballeAlumne,
        CreditosTotalesCRAI = dto.CreditosTotalesCRAI,
        CreditosTotalesSAE = dto.CreditosTotalesSAE,
        CreditosMinimosSAE = dto.CreditosMinimosSAE,
        CreditosMaximosSAE = dto.CreditosMaximosSAE,
        TipusEstudiSAE = dto.TipusEstudiSAE,
        CategoriaSAE = dto.CategoriaSAE,
        CompetenciesSAE = dto.CompetenciesSAE,

        // NUEVOS CAMPOS - INFORMACIÓN GENERAL
        Preinscripcion = dto.Preinscripcion,
        EstadoActividad = dto.EstadoActividad,
        AsignaturaId = dto.AsignaturaId,
        GrupoAsignatura = dto.GrupoAsignatura,
        DisciplinaRelacionadaId = dto.DisciplinaRelacionadaId,

        // NUEVOS CAMPOS - PROGRAMA
        Metodologia = dto.Metodologia,
        SistemaEvaluacion = dto.SistemaEvaluacion,
        HorarioYCalendario = dto.HorarioYCalendario,
        IdiomaImparticionId = dto.IdiomaImparticionId,
        TiposCertificacionId = dto.TiposCertificacionId,
        Observaciones = dto.Observaciones,
        MateriaDisciplinaId = dto.MateriaDisciplinaId,
        EspacioImparticion = dto.EspacioImparticion,
        LugarImparticion = dto.LugarImparticion,
        OtrasUbicaciones = dto.OtrasUbicaciones,
        UrlPlataformaVirtual = dto.UrlPlataformaVirtual,
        UrlCuestionarioSatisfaccion = dto.UrlCuestionarioSatisfaccion,
        AmbitoFormacionId = dto.AmbitoFormacionId,

        // NUEVOS CAMPOS - IMPORTE Y DESCUENTOS
        CosteEstimadoActividad = dto.CosteEstimadoActividad,
        TiposFinanciacionId = dto.TiposFinanciacionId,
        AnoInicialFinanciacion = dto.AnoInicialFinanciacion,
        AnoFinalFinanciacion = dto.AnoFinalFinanciacion,
        PlazasAfectadasDescuento = dto.PlazasAfectadasDescuento,

        // NUEVOS CAMPOS - INSCRIPCIÓN
        FechaLimitePago = dto.FechaLimitePago,
        TPV = dto.TPV,
        Remesa = dto.Remesa,
        TiposInscripcionId = dto.TiposInscripcionId,
        FechaAdjudicacionPreinscripcion = dto.FechaAdjudicacionPreinscripcion,

        EstadoId = estadoBorradorId_Create,
        UsuarioAutorId = usuarioAutorId,
        FechaCreacion = DateTime.UtcNow,
        FechaModificacion = DateTime.UtcNow,
        ActividadPago = dto.ActividadPago ?? false
    };

    context.Actividades.Add(actividad);
    await context.SaveChangesAsync();

    // Manejar selección múltiple de denominaciones de descuento
    if (dto.DenominacionDescuentoIds != null && dto.DenominacionDescuentoIds.Any())
    {
        var denominacionesDescuento = dto.DenominacionDescuentoIds.Select(id => new ActividadDenominacionDescuento
        {
            ActividadId = actividad.Id,
            DenominacionDescuentoId = id,
            FechaCreacion = DateTime.UtcNow
        }).ToList();

        context.ActividadDenominacionDescuentos.AddRange(denominacionesDescuento);
        await context.SaveChangesAsync();
    }

    return Results.Created($"/api/actividades/{actividad.Id}", actividad);
}).RequireAuthorization();

app.MapPut("/api/actividades/{id}", async (int id, UpdateActividadDto dto, UbFormacionContext context, ILogger<Program> logger) =>
{
    try
    {
        logger.LogInformation("=== INICIO ACTUALIZACIÓN ACTIVIDAD {Id} ===", id);
        logger.LogInformation("DTO recibido: {@Dto}", dto);
        
        var actividad = await context.Actividades.FindAsync(id);

        if (actividad == null)
        {
            logger.LogWarning("Actividad {Id} no encontrada", id);
            return Results.NotFound();
        }
        
        logger.LogInformation("Actividad encontrada: {@Actividad}", actividad);

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
        // Convertir ID a boolean
        actividad.ActividadReservada = dto.ActividadReservada.HasValue && dto.ActividadReservada.Value > 0;
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
    
    // NUEVOS CAMPOS - INFORMACIÓN GENERAL
    if (dto.Preinscripcion.HasValue) actividad.Preinscripcion = dto.Preinscripcion.Value;
    if (dto.EstadoActividad != null) actividad.EstadoActividad = dto.EstadoActividad;
    if (dto.AsignaturaId.HasValue) actividad.AsignaturaId = dto.AsignaturaId.Value;
    if (dto.GrupoAsignatura != null) actividad.GrupoAsignatura = dto.GrupoAsignatura;
    if (dto.DisciplinaRelacionadaId.HasValue) actividad.DisciplinaRelacionadaId = dto.DisciplinaRelacionadaId.Value;

    // NUEVOS CAMPOS - PROGRAMA
    if (dto.Metodologia != null) actividad.Metodologia = dto.Metodologia;
    if (dto.SistemaEvaluacion != null) actividad.SistemaEvaluacion = dto.SistemaEvaluacion;
    if (dto.HorarioYCalendario != null) actividad.HorarioYCalendario = dto.HorarioYCalendario;
    if (dto.IdiomaImparticionId.HasValue) actividad.IdiomaImparticionId = dto.IdiomaImparticionId.Value;
    if (dto.TiposCertificacionId.HasValue) actividad.TiposCertificacionId = dto.TiposCertificacionId.Value;
    if (dto.Observaciones != null) actividad.Observaciones = dto.Observaciones;
    if (dto.MateriaDisciplinaId.HasValue) actividad.MateriaDisciplinaId = dto.MateriaDisciplinaId.Value;
    if (dto.EspacioImparticion != null) actividad.EspacioImparticion = dto.EspacioImparticion;
    if (dto.LugarImparticion != null) actividad.LugarImparticion = dto.LugarImparticion;
    if (dto.OtrasUbicaciones != null) actividad.OtrasUbicaciones = dto.OtrasUbicaciones;
    if (dto.UrlPlataformaVirtual != null) actividad.UrlPlataformaVirtual = dto.UrlPlataformaVirtual;
    if (dto.UrlCuestionarioSatisfaccion != null) actividad.UrlCuestionarioSatisfaccion = dto.UrlCuestionarioSatisfaccion;
    if (dto.AmbitoFormacionId.HasValue) actividad.AmbitoFormacionId = dto.AmbitoFormacionId.Value;

    // NUEVOS CAMPOS - IMPORTE Y DESCUENTOS
    if (dto.CosteEstimadoActividad.HasValue) actividad.CosteEstimadoActividad = dto.CosteEstimadoActividad.Value;
    if (dto.TiposFinanciacionId.HasValue) actividad.TiposFinanciacionId = dto.TiposFinanciacionId.Value;
    if (dto.AnoInicialFinanciacion.HasValue) actividad.AnoInicialFinanciacion = dto.AnoInicialFinanciacion.Value;
    if (dto.AnoFinalFinanciacion.HasValue) actividad.AnoFinalFinanciacion = dto.AnoFinalFinanciacion.Value;
    if (dto.PlazasAfectadasDescuento.HasValue) actividad.PlazasAfectadasDescuento = dto.PlazasAfectadasDescuento.Value;

    // NUEVOS CAMPOS - INSCRIPCIÓN
    if (dto.FechaLimitePago.HasValue) actividad.FechaLimitePago = dto.FechaLimitePago.Value;
    if (dto.TPV.HasValue) actividad.TPV = dto.TPV.Value;
    if (dto.Remesa != null) actividad.Remesa = dto.Remesa;
    if (dto.TiposInscripcionId.HasValue) {
        actividad.TiposInscripcionId = dto.TiposInscripcionId.Value;
    }
    if (dto.FechaAdjudicacionPreinscripcion.HasValue) actividad.FechaAdjudicacionPreinscripcion = dto.FechaAdjudicacionPreinscripcion.Value;
    
    // Campos de traducción del título se manejan en la tabla Internacionalizacion
    // TODO: Implementar actualización de internacionalización si es necesario
    
    // Actualizar estado si es borrador
    if (dto.EsBorrador == true)
    {
        var estadoBorradorId_Update = await context.EstadosActividad
            .Where(e => e.Codigo == "BORRADOR" && e.Activo)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();
        if (estadoBorradorId_Update == 0) estadoBorradorId_Update = 1;
        actividad.EstadoId = estadoBorradorId_Update;
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
            Console.WriteLine($"🔍 DEBUG: Procesando subactividad - Titulo: {subDto.Titulo}, FechaInicio: {subDto.FechaInicio}, FechaFin: {subDto.FechaFin}");
            
            var subactividad = new Subactividad
            {
                ActividadId = id,
                Titulo = subDto.Titulo,
                Modalidad = subDto.Modalidad,
                Docente = subDto.Docente,
                Descripcion = subDto.Descripcion,
                FechaInicio = subDto.FechaInicio,
                FechaFin = subDto.FechaFin,
                HoraInicio = subDto.HoraInicio,
                HoraFin = subDto.HoraFin,
                Duracion = subDto.Duracion,
                Ubicacion = subDto.Ubicacion,
                Aforo = subDto.Aforo,
                Idioma = subDto.Idioma
            };
            context.Subactividades.Add(subactividad);
            Console.WriteLine($"✅ DEBUG: Subactividad agregada - FechaInicio: {subactividad.FechaInicio}, FechaFin: {subactividad.FechaFin}");
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
    
    // Manejar actualización de denominaciones de descuento
    if (dto.DenominacionDescuentoIds != null)
    {
        // Eliminar denominaciones existentes
        var denominacionesExistentes = await context.ActividadDenominacionDescuentos
            .Where(dd => dd.ActividadId == id)
            .ToListAsync();
        context.ActividadDenominacionDescuentos.RemoveRange(denominacionesExistentes);
        
        // Agregar nuevas denominaciones
        if (dto.DenominacionDescuentoIds.Any())
        {
            var nuevasDenominaciones = dto.DenominacionDescuentoIds.Select(denominacionId => new ActividadDenominacionDescuento
            {
                ActividadId = id,
                DenominacionDescuentoId = denominacionId,
                FechaCreacion = DateTime.UtcNow
            }).ToList();

            context.ActividadDenominacionDescuentos.AddRange(nuevasDenominaciones);
        }
    }
    
        await context.SaveChangesAsync();
        
        logger.LogInformation("Actividad {Id} actualizada exitosamente", id);
        return Results.Ok(actividad);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Error al actualizar actividad {Id}: {Message}", id, ex.Message);
        logger.LogError("Stack trace: {StackTrace}", ex.StackTrace);
        return Results.Problem(
            detail: $"Error interno del servidor: {ex.Message}",
            statusCode: 500
        );
    }
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

// Endpoint de estados con lógica de roles (requiere autenticación)
app.MapGet("/api/estados/autenticado", async (UbFormacionContext context, HttpContext httpContext) =>
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

// Workflow: estados (dinámico, sin lógica ad-hoc por rol)
app.MapGet("/api/workflow/estados", async (UbFormacionContext context) =>
{
    var estados = await context.EstadosActividad
        .AsNoTracking()
        .Where(e => e.Activo)
        .OrderBy(e => e.Orden)
        .Select(e => new { e.Id, e.Codigo, e.Nombre, e.Color, e.Orden })
        .ToListAsync();
    return Results.Ok(estados);
}).RequireAuthorization();

// Workflow: transiciones (opcionalmente filtradas por origen y por rol)
app.MapGet("/api/workflow/transiciones", async (string? origen, string? rol, UbFormacionContext context, HttpContext http) =>
{
    var userRol = string.IsNullOrWhiteSpace(rol) ? (http.User.FindFirst("rol")?.Value ?? string.Empty) : rol!;

    var q = context.TransicionesEstado
        .AsNoTracking()
        .Where(t => t.Activo);

    if (!string.IsNullOrWhiteSpace(origen))
        q = q.Where(t => t.EstadoOrigenCodigo == origen);

    if (!string.IsNullOrWhiteSpace(userRol))
        q = q.Where(t => t.RolPermitido == userRol);

    var trans = await q
        .OrderBy(t => t.EstadoOrigenCodigo)
        .ThenBy(t => t.EstadoDestinoCodigo)
        .Select(t => new { t.EstadoOrigenCodigo, t.EstadoDestinoCodigo, t.RolPermitido, t.Accion })
        .ToListAsync();

    return Results.Ok(trans);
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

// (Eliminado endpoint duplicado de /api/unidades-gestion; se mantiene el definido más arriba con RequireAuthorization y proyección)

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
            .Select(v => new { v.Id, v.Valor, v.Descripcion })
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

        // Filtrar por actividades de la unidad de gestión del usuario si no es Admin
        if (currentUserRole != "Admin" && currentUserId.HasValue)
        {
            // Obtener la unidad de gestión del usuario actual
            var usuarioActual = await context.Usuarios.FindAsync(currentUserId.Value);
            if (usuarioActual?.UnidadGestionId.HasValue == true)
            {
                Console.WriteLine($"🔒 DEBUG MENSAJES: Aplicando filtro para usuario no-Admin - Solo mensajes de actividades de la unidad de gestión {usuarioActual.UnidadGestionId}");
                query = query.Where(h => h.Actividad.UnidadGestionId == usuarioActual.UnidadGestionId.Value);
            }
            else
            {
                Console.WriteLine($"🔒 DEBUG MENSAJES: Usuario sin unidad de gestión - Solo mensajes de actividades del usuario {currentUserId}");
                query = query.Where(h => h.Actividad.UsuarioAutorId == currentUserId.Value);
            }
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
                TotalMensajes = h.Mensajes.Count(m => m.Activo && !m.Eliminado),
                MensajesNoLeidos = currentUserId.HasValue ? 
                    h.Mensajes.Count(m => m.Activo && !m.Eliminado && !m.MensajesUsuarios.Any(mu => mu.UsuarioId == currentUserId.Value && mu.Leido)) : 0,
                UltimoMensaje = h.Mensajes
                    .Where(m => m.Activo && !m.Eliminado)
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
                        context.Mensajes.Any(m => m.Id == mu.MensajeId && m.HiloMensajeId == hiloId && m.Activo && !m.Eliminado))
            .ToListAsync();

        // Marcar como leídos
        foreach (var mensajeUsuario in mensajesNoLeidos)
        {
            mensajeUsuario.Leido = true;
            mensajeUsuario.FechaLectura = DateTime.UtcNow;
        }

        // También crear registros para mensajes que no tienen registro de lectura
        var mensajesSinRegistro = await context.Mensajes
            .Where(m => m.HiloMensajeId == hiloId && m.Activo && !m.Eliminado &&
                       !context.MensajesUsuarios.Any(mu => mu.MensajeId == m.Id && mu.UsuarioId == usuarioId))
            .Select(m => m.Id)
            .ToListAsync();

        foreach (var mensajeId in mensajesSinRegistro)
        {
            context.MensajesUsuarios.Add(new MensajeUsuario
            {
                MensajeId = mensajeId,
                UsuarioId = usuarioId,
                Leido = true,
                FechaLectura = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();

        return Results.Ok(new { mensajesMarcados = mensajesNoLeidos.Count + mensajesSinRegistro.Count() });
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

        // Notificar por email a gestores/participantes (excepto el autor del mensaje)
        try
        {
            var config = httpContext.RequestServices.GetRequiredService<IConfiguration>();
            var smtpSection = config.GetSection("Smtp");
            var notifSection = config.GetSection("Notifications");
            var notifEnabled = notifSection.GetValue<bool>("Enabled");
            if (notifEnabled)
            {
                var host = smtpSection.GetValue<string>("Host");
                var port = smtpSection.GetValue<int>("Port");
                var enableSsl = smtpSection.GetValue<bool>("EnableSsl");
                var userSmtp = smtpSection.GetValue<string>("User");
                var pass = smtpSection.GetValue<string>("Password");
                var fromEmail = smtpSection.GetValue<string>("FromEmail");
                var fromName = smtpSection.GetValue<string>("FromName");
                // El fallback por configuración está deshabilitado: sólo emails reales de BD

                using var client = new System.Net.Mail.SmtpClient(host, port)
                {
                    EnableSsl = enableSsl,
                    DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(userSmtp, pass),
                    Timeout = 15000
                };

                // Destinatarios: todos los participantes del hilo y autor de la actividad (si tienen email), excepto el autor del nuevo mensaje
                var actividadRef = await context.Actividades.FindAsync(hilo.ActividadId);
                var destinatarios = new List<string>();

                // Participantes con email
                var participantesIds = await context.Mensajes
                    .Where(m => m.HiloMensajeId == hilo.Id && m.Activo && !m.Eliminado)
                    .Select(m => m.UsuarioId)
                    .Distinct()
                    .ToListAsync();
                var participantesConEmail = await context.Usuarios
                    .Where(u => participantesIds.Contains(u.Id) && u.Id != usuarioId && !string.IsNullOrEmpty(u.Email))
                    .Select(u => u.Email!)
                    .ToListAsync();
                destinatarios.AddRange(participantesConEmail);

                // Autor de la actividad si no es el autor del mensaje
                if (actividadRef?.UsuarioAutorId.HasValue == true && actividadRef.UsuarioAutorId.Value != usuarioId)
                {
                    var autor = await context.Usuarios.FindAsync(actividadRef.UsuarioAutorId.Value);
                    if (!string.IsNullOrEmpty(autor?.Email)) destinatarios.Add(autor!.Email!);
                }

                // fallback deshabilitado: si no hay destinatarios, no se envía
                Console.WriteLine($"📧 Notificación mensaje: candidatos={string.Join(",", destinatarios)}");
                var subject = $"[UB] Nuevo mensaje en actividad #{hilo.ActividadId}: '{actividadRef?.Titulo ?? hilo.Titulo}'";
                var editarUrl = $"http://localhost:8080/editar-actividad.html?id={hilo.ActividadId}";
                var preheader = $"Nuevo mensaje en actividad #{hilo.ActividadId}";
                var brandColor = "#0d6efd";
                var html = $@"<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>{subject}</title>
<style>
  .wrapper {{ width:100% !important; background:#f5f7fa; padding:20px 0; }}
  .container {{ width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; }}
  .brandbar {{ background:{brandColor}; color:#ffffff; padding:12px 20px; font-family:Arial,Helvetica,sans-serif; }}
  .brandtbl {{ width:100%; }}
  .logoImg {{ width:36px; height:36px; border-radius:6px; display:block; }}
  .brandName {{ font-size:16px; font-weight:700; padding-left:10px; font-family:Arial,Helvetica,sans-serif; }}
  .header {{ background:#f3f6ff; color:#0f172a; padding:16px 24px; font-family:Arial,Helvetica,sans-serif; font-size:18px; font-weight:bold; border-bottom:1px solid #e5e7eb; }}
  .content {{ padding:24px; font-family:Arial,Helvetica,sans-serif; color:#111827; font-size:14px; line-height:1.5; }}
  .muted {{ color:#6b7280; font-size:12px; }}
  .btn {{ display:inline-block; padding:10px 16px; background:{brandColor}; color:#fff !important; text-decoration:none; border-radius:6px; font-weight:bold; }}
  .footer {{ padding:16px 24px; background:#f9fafb; color:#6b7280; font-family:Arial,Helvetica,sans-serif; font-size:12px; }}
  .quote {{ border-left:3px solid #e5e7eb; padding-left:12px; color:#374151; font-style:italic; background:#fafafa; }}
  .table {{ width:100%; border-collapse:collapse; }}
  .row {{ border-bottom:1px solid #e5e7eb; }}
  .cellK {{ width:180px; padding:8px 0; color:#6b7280; }}
  .cellV {{ padding:8px 0; color:#111827; font-weight:bold; }}
  a {{ color:#0d6efd; }}
</style></head>
<body class='wrapper'>
  <div style='display:none; max-height:0; overflow:hidden; mso-hide:all;'>{preheader}</div>
  <table role='presentation' class='container' cellpadding='0' cellspacing='0' width='600'>
    <tr><td class='brandbar'>
      <table role='presentation' class='brandtbl' cellpadding='0' cellspacing='0'>
        <tr>
          <td style='width:40px;'><img class='logoImg' src='http://localhost:8080/img/logo_ub.png' alt='UB'></td>
          <td class='brandName'>UB Formación</td>
        </tr>
      </table>
    </td></tr>
    <tr><td class='header'>Nuevo mensaje en actividad</td></tr>
    <tr><td class='content'>
      <p>Se ha publicado un nuevo mensaje en la actividad <strong>{System.Net.WebUtility.HtmlEncode(actividadRef?.Titulo ?? hilo.Titulo)}</strong>.</p>
      <table role='presentation' class='table'>
        <tr class='row'><td class='cellK'>ID Actividad</td><td class='cellV'>#{hilo.ActividadId}</td></tr>
        <tr class='row'><td class='cellK'>Hilo</td><td class='cellV'>{System.Net.WebUtility.HtmlEncode(hilo.Titulo)}</td></tr>
        <tr class='row'><td class='cellK'>Fecha</td><td class='cellV'>{DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC</td></tr>
      </table>
      <p class='muted'>Resumen del mensaje:</p>
      <p class='quote'>{System.Net.WebUtility.HtmlEncode((mensaje.Contenido ?? string.Empty).Length > 300 ? mensaje.Contenido.Substring(0,300) + "…" : mensaje.Contenido ?? string.Empty)}</p>
      <p style='margin:16px 0;'>
        <a href='{editarUrl}' class='btn'>Abrir actividad</a>
      </p>
      <p class='muted'>Si no has iniciado sesión, se te solicitará al abrir el enlace.</p>
    </td></tr>
    <tr><td class='footer'>Este es un mensaje automático del sistema UB Formación.</td></tr>
  </table>
</body></html>";

                var mail = new System.Net.Mail.MailMessage()
                {
                    From = new System.Net.Mail.MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = html,
                    IsBodyHtml = true
                };
                var únicos = destinatarios.Distinct().ToList();
                foreach (var to in únicos)
                {
                    mail.To.Add(to);
                }
                if (únicos.Count > 0)
                {
                    try
                    {
                        await client.SendMailAsync(mail);
                        Console.WriteLine($"📧 Enviado nuevo mensaje a: {string.Join(",", únicos)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error enviando correo (mensaje): {ex.Message}\n{ex}");
                    }
                }
                else
                {
                    Console.WriteLine("ℹ️ Sin destinatarios (mensaje): no se envía correo.");
                }
            }
        }
        catch { }

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
                TotalMensajes = h.Mensajes.Count(m => m.Activo && !m.Eliminado),
                MensajesNoLeidos = usuarioId.HasValue ? 
                    h.Mensajes.Count(m => m.Activo && !m.Eliminado && !m.MensajesUsuarios.Any(mu => mu.UsuarioId == usuarioId.Value && mu.Leido)) : 0,
                UltimoMensaje = h.Mensajes
                    .Where(m => m.Activo && !m.Eliminado)
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

// Endpoint para obtener historial completo de cambios de estado
app.MapGet("/api/actividades/{actividadId}/historial-estados", async (int actividadId, UbFormacionContext context) =>
{
    try
    {
        var historial = await context.CambiosEstadoActividad
            .Where(c => c.ActividadId == actividadId && c.Activo)
            .Include(c => c.UsuarioCambio)
            .Include(c => c.EstadoAnterior)
            .Include(c => c.EstadoNuevo)
            .OrderByDescending(c => c.FechaCambio)
            .Select(c => new
            {
                c.Id,
                c.ActividadId,
                EstadoAnterior = new { c.EstadoAnterior.Id, c.EstadoAnterior.Nombre, c.EstadoAnterior.Codigo },
                EstadoNuevo = new { c.EstadoNuevo.Id, c.EstadoNuevo.Nombre, c.EstadoNuevo.Codigo },
                c.DescripcionMotivos,
                c.FechaCambio,
                UsuarioCambio = new { c.UsuarioCambio.Id, c.UsuarioCambio.Username, c.UsuarioCambio.Rol }
            })
            .ToListAsync();

        return Results.Ok(historial);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error obteniendo historial de estados: {ex.Message}");
    }
});

// Endpoint para editar descripción de cambio de estado
app.MapPut("/api/actividades/cambios-estado/{cambioId}", async (int cambioId, HttpContext httpContext, UbFormacionContext context, CambioEstadoDto cambioDto) =>
{
    try
    {
        // Obtener el usuario actual del token JWT
        var userIdClaim = httpContext.User.FindFirst("sub") ?? 
                          httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var usuarioId))
            return Results.Unauthorized();

        var cambio = await context.CambiosEstadoActividad.FindAsync(cambioId);
        if (cambio == null)
            return Results.NotFound("Cambio de estado no encontrado");

        // Solo permitir editar si es el usuario que lo creó o es Admin
        var usuario = await context.Usuarios.FindAsync(usuarioId);
        var isAdmin = usuario?.Rol == "Admin";
        
        if (cambio.UsuarioCambioId != usuarioId && !isAdmin)
            return Results.Forbid();

        // Actualizar la descripción
        cambio.DescripcionMotivos = cambioDto.DescripcionMotivos;
        await context.SaveChangesAsync();

        return Results.Ok(new { message = "Descripción actualizada correctamente" });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error actualizando descripción: {ex.Message}");
    }
}).RequireAuthorization();

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

        // Validaciones de archivos
        const long maxFileSize = 10 * 1024 * 1024; // 10MB
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif", ".txt", ".xlsx", ".xls" };
        
        foreach (var archivo in archivos)
        {
            if (archivo.Length > maxFileSize)
                return Results.BadRequest($"El archivo {archivo.FileName} es demasiado grande. Máximo permitido: 10MB");
            
            var extension = Path.GetExtension(archivo.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
                return Results.BadRequest($"Tipo de archivo no permitido: {extension}. Tipos permitidos: {string.Join(", ", allowedExtensions)}");
            
            // Sanitizar nombre de archivo
            var sanitizedFileName = Path.GetFileNameWithoutExtension(archivo.FileName)
                .Replace(" ", "_")
                .Replace("..", "")
                .Replace("/", "")
                .Replace("\\", "");
            
            if (string.IsNullOrEmpty(sanitizedFileName))
                return Results.BadRequest("Nombre de archivo inválido");
        }

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
                var sanitizedFileName = Path.GetFileNameWithoutExtension(archivo.FileName)
                    .Replace(" ", "_")
                    .Replace("..", "")
                    .Replace("/", "")
                    .Replace("\\", "");
                var extension = Path.GetExtension(archivo.FileName);
                var fileName = $"{Guid.NewGuid()}_{sanitizedFileName}{extension}";
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

        // Verificar permisos según matriz de transiciones y rol
        var estadoAnteriorId = actividad.EstadoId;
        var estadoAnterior = await context.EstadosActividad.FindAsync(estadoAnteriorId);
        if (estadoAnterior == null) return Results.BadRequest("Estado actual no válido");
        var fromCodigo = estadoAnterior.Codigo;
        var toCodigo = nuevoEstado.Codigo;
        var normalizedRole = NormalizeRole(userRole);
        if (!await IsAllowedDb(context, fromCodigo, toCodigo, normalizedRole))
        {
            return Results.Forbid();
        }

        // Obtener el estado anterior (ya disponible)

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

        // Notificación por email a gestores implicados
        try
        {
            var config = httpContext.RequestServices.GetRequiredService<IConfiguration>();
            var smtpSection = config.GetSection("Smtp");
            var notifSection = config.GetSection("Notifications");
            var notifEnabled = notifSection.GetValue<bool>("Enabled");
            if (notifEnabled)
            {
                var host = smtpSection.GetValue<string>("Host");
                var port = smtpSection.GetValue<int>("Port");
                var enableSsl = smtpSection.GetValue<bool>("EnableSsl");
                var user = smtpSection.GetValue<string>("User");
                var pass = smtpSection.GetValue<string>("Password");
                var fromEmail = smtpSection.GetValue<string>("FromEmail");
                var fromName = smtpSection.GetValue<string>("FromName");
                // Fallback deshabilitado: no usar DefaultRecipientOverride

                using var client = new System.Net.Mail.SmtpClient(host, port)
                {
                    EnableSsl = enableSsl,
                    DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new System.Net.NetworkCredential(user, pass),
                    Timeout = 15000
                };

                // Destinatarios: siguiente rol implicado según workflow
                var destinatarios = new List<string>();
                var autor = actividad.UsuarioAutorId.HasValue ? await context.Usuarios.FindAsync(actividad.UsuarioAutorId.Value) : null;
                var usuarioCambio = await context.Usuarios.FindAsync(usuarioId);
                
                // Determinar siguiente rol implicado según estado destino
                var siguienteRol = DeterminarSiguienteRolImplicado(nuevoEstado.Codigo, actividad.UnidadGestionId);
                Console.WriteLine($"📧 Workflow: Estado {nuevoEstado.Codigo} -> Siguiente rol: {siguienteRol}");
                
                if (!string.IsNullOrEmpty(siguienteRol))
                {
                    // Buscar usuarios del siguiente rol en la misma UG
                    var usuariosSiguienteRol = await context.Usuarios
                        .Where(u => u.UnidadGestionId == actividad.UnidadGestionId && 
                                   u.Rol == siguienteRol && 
                                   u.Activo && 
                                   !string.IsNullOrEmpty(u.Email) &&
                                   u.Id != usuarioId) // No notificar al que hizo el cambio
                        .Select(u => u.Email!)
                        .ToListAsync();
                    
                    destinatarios.AddRange(usuariosSiguienteRol);
                    Console.WriteLine($"📧 Usuarios {siguienteRol} en UG {actividad.UnidadGestionId}: {string.Join(",", usuariosSiguienteRol)}");
                }
                
                // Fallback: si no hay siguiente rol o no hay usuarios, notificar al autor original (si no es quien hizo el cambio)
                if (destinatarios.Count == 0 && autor != null && autor.Id != usuarioId && !string.IsNullOrEmpty(autor.Email))
                {
                    destinatarios.Add(autor.Email);
                    Console.WriteLine($"📧 Fallback: notificando al autor original {autor.Email}");
                }
                Console.WriteLine($"📧 Notificación estado: candidatos={string.Join(",", destinatarios)}");
                var subject = $"[UB] Actividad #{actividad.Id} cambió a '{nuevoEstado.Nombre}'";
                var editarUrl = $"http://localhost:8080/editar-actividad.html?id={actividad.Id}";
                var preheader = $"Actividad #{actividad.Id} cambió a '{nuevoEstado.Nombre}'";
                var brandColor = "#0d6efd";
                var html = $@"<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='x-ua-compatible' content='ie=edge'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<title>{subject}</title>
<style>
  /* Estilos básicos inline-friendly para Outlook Classic */
  .wrapper {{ width:100% !important; background:#f5f7fa; padding:20px 0; }}
  .container {{ width:600px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; }}
  .brandbar {{ background:{brandColor}; color:#ffffff; padding:12px 20px; font-family:Arial,Helvetica,sans-serif; }}
  .brandtbl {{ width:100%; }}
  .logoImg {{ width:36px; height:36px; border-radius:6px; display:block; }}
  .brandName {{ font-size:16px; font-weight:700; padding-left:10px; font-family:Arial,Helvetica,sans-serif; }}
  .header {{ background:#f3f6ff; color:#0f172a; padding:16px 24px; font-family:Arial,Helvetica,sans-serif; font-size:18px; font-weight:bold; border-bottom:1px solid #e5e7eb; }}
  .content {{ padding:24px; font-family:Arial,Helvetica,sans-serif; color:#111827; font-size:14px; line-height:1.5; }}
  .badge {{ display:inline-block; padding:4px 10px; background:{brandColor}; color:#fff; border-radius:999px; font-size:12px; }}
  .muted {{ color:#6b7280; font-size:12px; }}
  .btn {{ display:inline-block; padding:10px 16px; background:{brandColor}; color:#fff !important; text-decoration:none; border-radius:6px; font-weight:bold; }}
  .footer {{ padding:16px 24px; background:#f9fafb; color:#6b7280; font-family:Arial,Helvetica,sans-serif; font-size:12px; }}
  .table {{ width:100%; border-collapse:collapse; }}
  .row {{ border-bottom:1px solid #e5e7eb; }}
  .cellK {{ width:200px; padding:8px 0; color:#6b7280; }}
  .cellV {{ padding:8px 0; color:#111827; font-weight:bold; }}
  a {{ color:#0d6efd; }}
  /* Responsive reducido para compatibilidad */
  .container {{ width:100% !important; max-width:600px; }}
  /* Para Outlook / Apple Mail: forzar links azules */
  a#xapple {{ color: inherit !important; text-decoration: none !important; }}
</style></head>
<body class='wrapper'>
  <div style='display:none; max-height:0; overflow:hidden; mso-hide:all;'>{preheader}</div>
  <table role='presentation' class='container' cellpadding='0' cellspacing='0' width='600'>
    <tr><td class='brandbar'>
      <table role='presentation' class='brandtbl' cellpadding='0' cellspacing='0'>
        <tr>
          <td style='width:40px;'><img class='logoImg' src='http://localhost:8080/img/logo_ub.png' alt='UB'></td>
          <td class='brandName'>UB Formación</td>
        </tr>
      </table>
    </td></tr>
    <tr><td class='header'>Cambio de estado de actividad</td></tr>
    <tr><td class='content'>
      <p>La actividad <strong>{System.Net.WebUtility.HtmlEncode(actividad.Titulo)}</strong> ha cambiado su estado a <span class='badge'>{System.Net.WebUtility.HtmlEncode(nuevoEstado.Nombre)}</span>.</p>
      <table role='presentation' class='table'>
        <tr class='row'><td class='cellK'>ID Actividad</td><td class='cellV'>#{actividad.Id}</td></tr>
        <tr class='row'><td class='cellK'>Título</td><td class='cellV'>{System.Net.WebUtility.HtmlEncode(actividad.Titulo)}</td></tr>
        <tr class='row'><td class='cellK'>Estado anterior</td><td class='cellV'>{System.Net.WebUtility.HtmlEncode(estadoAnterior?.Nombre ?? "Desconocido")}</td></tr>
        <tr class='row'><td class='cellK'>Estado nuevo</td><td class='cellV'>{System.Net.WebUtility.HtmlEncode(nuevoEstado.Nombre)}</td></tr>
        <tr class='row'><td class='cellK'>Descripción/motivos</td><td class='cellV'>{System.Net.WebUtility.HtmlEncode(solicitud.DescripcionMotivos ?? "(sin descripción)")}</td></tr>
        <tr class='row'><td class='cellK'>Fecha</td><td class='cellV'>{DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC</td></tr>
      </table>
      <p style='margin:16px 0;'>
        <a href='{editarUrl}' class='btn'>Abrir actividad</a>
      </p>
      <p class='muted'>Si no has iniciado sesión, se te solicitará al abrir el enlace.</p>
    </td></tr>
    <tr><td class='footer'>Este es un mensaje automático del sistema UB Formación.</td></tr>
  </table>
</body></html>";

                var únicos = destinatarios.Distinct().ToList();
                if (únicos.Count > 0)
                {
                    var mail = new System.Net.Mail.MailMessage()
                    {
                        From = new System.Net.Mail.MailAddress(fromEmail, fromName),
                        Subject = subject,
                        Body = html,
                        IsBodyHtml = true
                    };
                    foreach (var to in únicos)
                    {
                        mail.To.Add(to);
                    }
                    try
                    {
                        await client.SendMailAsync(mail);
                        Console.WriteLine($"📧 Enviado cambio estado a: {string.Join(",", únicos)}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error enviando correo (estado): {ex.Message}\n{ex}");
                    }
                }
                else
                {
                    Console.WriteLine("ℹ️ Sin destinatarios (estado): no se envía correo.");
                }
            }
        }
        catch { /* evitar que el fallo de correo rompa la respuesta */ }

        return Results.Ok(cambioDto);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error cambiando estado: {ex.Message}");
    }
}).RequireAuthorization();

// Endpoint: transiciones permitidas para una actividad y el usuario actual
app.MapGet("/api/actividades/{id}/transiciones", async (int id, HttpContext httpContext, UbFormacionContext context) =>
{
    Console.WriteLine($"🔥🔥🔥 ENDPOINT LLAMADO: /api/actividades/{id}/transiciones 🔥🔥🔥");
    Console.WriteLine($"🔍 DEBUG: Transiciones solicitadas para actividad {id}");
    
    var userIdClaim = httpContext.User.FindFirst("sub") ?? httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
    if (userIdClaim == null) {
        Console.WriteLine("🔍 DEBUG: No se encontró userIdClaim");
        return Results.Unauthorized();
    }
    
    var userRole = httpContext.User.FindFirst("rol")?.Value;
    Console.WriteLine($"🔍 DEBUG: userRole: {userRole}");
    
    var normalizedRole = await NormalizeRoleAsync(userRole, context);
    Console.WriteLine($"🔍 DEBUG: normalizedRole: {normalizedRole}");
    
    if (string.IsNullOrWhiteSpace(normalizedRole)) {
        Console.WriteLine("🔍 DEBUG: normalizedRole está vacío");
        return Results.Unauthorized();
    }

    var actividad = await context.Actividades.FindAsync(id);
    if (actividad == null) {
        Console.WriteLine($"🔍 DEBUG: Actividad {id} no encontrada");
        return Results.NotFound("Actividad no encontrada");
    }

    var estadoActual = await context.EstadosActividad.FindAsync(actividad.EstadoId);
    if (estadoActual == null) {
        Console.WriteLine($"🔍 DEBUG: Estado {actividad.EstadoId} no encontrado");
        return Results.BadRequest("Estado actual no válido");
    }

    var fromCodigo = estadoActual.Codigo;
    Console.WriteLine($"🔍 DEBUG: Estado actual: {fromCodigo} (ID: {actividad.EstadoId})");
    
    // Buscar el rol normalizado por código
    var rolNormalizado = await context.RolesNormalizados
        .Where(r => r.Codigo == normalizedRole && r.Activo)
        .FirstOrDefaultAsync();
    
    if (rolNormalizado == null) {
        Console.WriteLine($"🔍 DEBUG: No se encontró rol normalizado para código: {normalizedRole}");
        return Results.Ok(new List<object>());
    }
    
    Console.WriteLine($"🔍 DEBUG: Rol normalizado encontrado: {rolNormalizado.Codigo} (ID: {rolNormalizado.Id})");
    
    List<string> destinosCod;
    if (string.Equals(rolNormalizado.Codigo, "ADMIN", StringComparison.OrdinalIgnoreCase))
    {
        // Admin: puede ir a cualquier estado distinto del actual
        destinosCod = await context.EstadosActividad
            .Where(e => e.Activo && e.Codigo != fromCodigo)
            .Select(e => e.Codigo)
            .ToListAsync();
    }
    else
    {
        // Mapear el rol normalizado al rol original usado en las transiciones
        var rolOriginal = MapNormalizedRoleToOriginal(rolNormalizado.Codigo);
        
        destinosCod = await context.TransicionesEstado
            .Where(t => t.Activo && t.EstadoOrigenCodigo == fromCodigo && t.RolPermitido == rolOriginal)
            .Select(t => t.EstadoDestinoCodigo)
            .Distinct()
            .ToListAsync();
    }
    
    Console.WriteLine($"🔍 DEBUG: Transiciones encontradas: {string.Join(", ", destinosCod)}");
    
    // Simplificar la consulta para evitar problemas con OPENJSON
    var destinos = new List<object>();
    foreach (var codigo in destinosCod)
    {
        var estado = await context.EstadosActividad
            .Where(e => e.Codigo == codigo)
            .Select(e => new { e.Id, e.Codigo, e.Nombre, e.Color })
            .FirstOrDefaultAsync();
        if (estado != null)
        {
            Console.WriteLine($"🔍 DEBUG: Estado encontrado: {estado.Codigo} - {estado.Nombre}");
            destinos.Add(estado);
        }
    }
    
    Console.WriteLine($"🔍 DEBUG: Total destinos devueltos: {destinos.Count}");
    return Results.Ok(destinos);
}).RequireAuthorization();

// Helpers de workflow (DB) - Sistema robusto con base de datos
static async Task<string> NormalizeRoleAsync(string? rol, UbFormacionContext context)
{
    if (string.IsNullOrWhiteSpace(rol)) return string.Empty;
    
    Console.WriteLine($"🔍 DEBUG: Normalizando rol: '{rol}'");
    
    // Buscar en mapeo de roles
    var mapeo = await context.MapeoRoles
        .Include(m => m.RolNormalizado)
        .Where(m => m.RolOriginal == rol && m.Activo)
        .FirstOrDefaultAsync();
    
    if (mapeo?.RolNormalizado != null)
    {
        Console.WriteLine($"🔍 DEBUG: Rol '{rol}' normalizado a: '{mapeo.RolNormalizado.Codigo}'");
        return mapeo.RolNormalizado.Codigo;
    }
    
    Console.WriteLine($"🔍 DEBUG: No se encontró mapeo para rol: '{rol}'");
    return string.Empty;
}

// Función de compatibilidad (mantener para otros endpoints que la usen)
static string NormalizeRole(string? rol)
{
    if (string.IsNullOrWhiteSpace(rol)) return string.Empty;
    return rol switch
    {
        "Admin" => "Admin",
        "Gestor" => "Coordinador Tecnico",
        "Usuario" => "Docente/Dinamizador",
        "Coordinador/Técnico" => "Coordinador Tecnico",
        "Coordinador Tecnico" => "Coordinador Tecnico",
        _ => rol
    };
}

static async Task<bool> IsAllowedDb(UbFormacionContext context, string fromCodigo, string toCodigo, string userRole)
{
    Console.WriteLine($"🔍 DEBUG: IsAllowedDb - fromCodigo: '{fromCodigo}', toCodigo: '{toCodigo}', userRole: '{userRole}'");
    
    // Admin tiene permiso para todas las transiciones
    if (string.Equals(userRole, "Admin", StringComparison.OrdinalIgnoreCase) || string.Equals(userRole, "ADMIN", StringComparison.OrdinalIgnoreCase))
    {
        Console.WriteLine($"🔍 DEBUG: Usuario Admin - permitido");
        return true;
    }
    
    // Normalizar el rol del usuario
    var normalizedUserRole = await NormalizeRoleAsync(userRole, context);
    Console.WriteLine($"🔍 DEBUG: Rol normalizado: '{normalizedUserRole}'");
    
    // Buscar transiciones usando RolPermitido (string) directamente
    // Mapear el rol normalizado al rol original usado en las transiciones
    var rolOriginal = MapNormalizedRoleToOriginal(normalizedUserRole);
    
    // Verificar si existe la transición
    var transicionExiste = await context.TransicionesEstado
        .AnyAsync(t => t.Activo && 
                      t.EstadoOrigenCodigo == fromCodigo && 
                      t.EstadoDestinoCodigo == toCodigo && 
                      t.RolPermitido == rolOriginal);
    
    Console.WriteLine($"🔍 DEBUG: Transición existe: {transicionExiste}");
    
    // Si no existe, mostrar todas las transiciones disponibles para debug
    if (!transicionExiste)
    {
        var transicionesDisponibles = await context.TransicionesEstado
            .Where(t => t.Activo && t.EstadoOrigenCodigo == fromCodigo)
            .Select(t => new { t.EstadoDestinoCodigo, t.RolPermitido })
            .ToListAsync();
        
        Console.WriteLine($"🔍 DEBUG: Transiciones disponibles desde '{fromCodigo}':");
        foreach (var t in transicionesDisponibles)
        {
            Console.WriteLine($"  - {fromCodigo} → {t.EstadoDestinoCodigo} (Rol: {t.RolPermitido})");
        }
    }
    
    return transicionExiste;
}

// Función para mapear rol normalizado al rol original usado en transiciones
static string MapNormalizedRoleToOriginal(string normalizedRole)
{
    Console.WriteLine($"🔍 DEBUG: Mapeando rol normalizado '{normalizedRole}' a rol original");
    
    var rolOriginal = normalizedRole switch
    {
        "DOCENTE" => "Docente",
        "TECNICO" => "TecnicoFormacion", 
        "COORDINADOR" => "CoordinadorFormacion",
        "RESPONSABLE" => "ResponsableUnidad",
        "SOPORTE" => "SoporteAdmin",
        "ADMIN" => "Admin",
        _ => normalizedRole // Si no se encuentra mapeo, usar el rol tal como está
    };
    
    Console.WriteLine($"🔍 DEBUG: Rol original mapeado: '{rolOriginal}'");
    return rolOriginal;
}

// Función para determinar el siguiente rol implicado según el estado destino
static string? DeterminarSiguienteRolImplicado(string estadoCodigo, int? unidadGestionId)
{
    return estadoCodigo switch
    {
        "BORRADOR" => null, // No hay siguiente rol, el autor puede seguir editando
        "ENVIADA" => "Coordinador de Formación", // Coordinador debe revisar
        "EN_REVISION" => "Coordinador de Formación", // Coordinador debe aprobar/rechazar
        "VALIDACION_UNIDAD" => "Responsable de Unidad", // Responsable debe validar
        "DEFINICION" => "Coordinador/Técnico", // Técnico debe completar definición
        "REVISION_ADMINISTRATIVA" => "Soporte Administrativo", // Soporte debe revisar
        "PUBLICADA" => null, // Estado final, no hay siguiente rol
        "CANCELADA" => null, // Estado final
        "RECHAZADA" => null, // Estado final
        _ => null // Estado desconocido
    };
}

// (Eliminado duplicado de /api/actividades/publicas)

// ==========================
// Endpoint de Preinscripciones
// ==========================
app.MapPost("/api/preinscripciones", async (PreInscripcionDto dto, UB.Actividad1.API.Services.PreInscripcionService preInscripcionService, UbFormacionContext context) =>
{
    try
    {
        Console.WriteLine($"🔍 DEBUG: Recibida preinscripción para actividad {dto.ActividadId}");
        
        // Validar que la actividad existe y está publicada
        var actividad = await context.Actividades
            .Include(a => a.Estado)
            .FirstOrDefaultAsync(a => a.Id == dto.ActividadId);
            
        if (actividad == null)
        {
            Console.WriteLine($"❌ Actividad {dto.ActividadId} no encontrada");
            return Results.BadRequest("Actividad no encontrada");
        }
        
        if (actividad.Estado?.Codigo != "PUBLICADA")
        {
            Console.WriteLine($"❌ Actividad {dto.ActividadId} no está publicada (estado: {actividad.Estado?.Codigo})");
            return Results.BadRequest("La actividad no está disponible para preinscripciones");
        }
        
        Console.WriteLine($"✅ Actividad {dto.ActividadId} validada, enviando a iFormalia...");
        
        // Enviar preinscripción al servicio externo
        var resultado = await preInscripcionService.EnviarPreinscripcion(dto);
        
        if (resultado.Exito)
        {
            Console.WriteLine($"✅ Preinscripción enviada correctamente para {dto.Email}");
            return Results.Ok(new { 
                success = true, 
                message = resultado.Mensaje,
                actividadId = dto.ActividadId,
                email = dto.Email,
                detallesHttp = resultado.DetallesHttp
            });
        }
        else
        {
            Console.WriteLine($"❌ Error en preinscripción: {resultado.Mensaje}");
            return Results.BadRequest(new { 
                success = false, 
                message = resultado.Mensaje,
                detallesHttp = resultado.DetallesHttp
            });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR EN /api/preinscripciones: {ex.Message}");
        return Results.Problem($"Error interno: {ex.Message}");
    }
});

// Fallback al index (público si existe) para rutas no-API
app.MapFallback(async context =>
{
    // NO interceptar rutas de API - dejar que se manejen por los endpoints específicos
    // Solo manejar rutas que no sean API
    if (context.Request.Path.HasValue && !context.Request.Path.Value.StartsWith("/api/"))
    {
        var publicIndex = Path.Combine(webRootPath, "index-publico.html");
        var fallbackFile = File.Exists(publicIndex)
            ? publicIndex
            : Path.Combine(webRootPath, "index.html");
        if (File.Exists(fallbackFile))
        {
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.SendFileAsync(fallbackFile);
        }
    }
});

// Endpoint temporal para ejecutar SQL y agregar campos nuevos
app.MapPost("/api/admin/execute-sql", async (HttpContext context, UbFormacionContext dbContext) =>
{
    try
    {
        Console.WriteLine("🔧 DEBUG: Ejecutando SQL para agregar campos nuevos...");
        
        // SQL para agregar campos nuevos a la tabla Actividades
        var sqlCommands = new[]
        {
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Metodologia') ALTER TABLE [dbo].[Actividades] ADD [Metodologia] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'SistemaEvaluacion') ALTER TABLE [dbo].[Actividades] ADD [SistemaEvaluacion] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'HorarioYCalendario') ALTER TABLE [dbo].[Actividades] ADD [HorarioYCalendario] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Observaciones') ALTER TABLE [dbo].[Actividades] ADD [Observaciones] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EspacioImparticion') ALTER TABLE [dbo].[Actividades] ADD [EspacioImparticion] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'LugarImparticion') ALTER TABLE [dbo].[Actividades] ADD [LugarImparticion] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'OtrasUbicaciones') ALTER TABLE [dbo].[Actividades] ADD [OtrasUbicaciones] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'UrlPlataformaVirtual') ALTER TABLE [dbo].[Actividades] ADD [UrlPlataformaVirtual] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'UrlCuestionarioSatisfaccion') ALTER TABLE [dbo].[Actividades] ADD [UrlCuestionarioSatisfaccion] NVARCHAR(MAX) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'CosteEstimadoActividad') ALTER TABLE [dbo].[Actividades] ADD [CosteEstimadoActividad] DECIMAL(18, 2) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EstadoActividad') ALTER TABLE [dbo].[Actividades] ADD [EstadoActividad] NVARCHAR(50) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Remesa') ALTER TABLE [dbo].[Actividades] ADD [Remesa] NVARCHAR(50) NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TiposInscripcionId') ALTER TABLE [dbo].[Actividades] ADD [TiposInscripcionId] INT NULL;",
            "IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'FechaAdjudicacionPreinscripcion') ALTER TABLE [dbo].[Actividades] ADD [FechaAdjudicacionPreinscripcion] DATE NULL;"
        };
        
        var results = new List<string>();
        
        foreach (var sql in sqlCommands)
        {
            try
            {
                await dbContext.Database.ExecuteSqlRawAsync(sql);
                var fieldName = sql.Split('\'')[1]; // Extraer nombre del campo
                results.Add($"✅ Campo {fieldName} agregado exitosamente");
                Console.WriteLine($"✅ Campo {fieldName} agregado exitosamente");
            }
            catch (Exception ex)
            {
                var fieldName = sql.Split('\'')[1];
                results.Add($"⚠️ Campo {fieldName}: {ex.Message}");
                Console.WriteLine($"⚠️ Campo {fieldName}: {ex.Message}");
            }
        }
        
        return Results.Ok(new { 
            success = true, 
            message = "Script SQL ejecutado", 
            results = results 
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ ERROR ejecutando SQL: {ex.Message}");
        return Results.Problem($"Error ejecutando SQL: {ex.Message}");
    }
}).RequireAuthorization();

app.Run();

// ==========================
// Clases para parámetros de endpoints
// ==========================
public class PublicActividadesQuery
{
    public int? UnidadGestionId { get; set; }
    public string? Search { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public string? TipoActividad { get; set; }
    public bool? CursoGratuito { get; set; }
}




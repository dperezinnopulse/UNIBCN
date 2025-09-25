using System.Net.Http;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddCors();

var app = builder.Build();
var contentRoot = builder.Environment.ContentRootPath;

// Configurar el pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Configurar CORS
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

// Proxy para las peticiones API al backend
app.Map("/api/{**path}", async (HttpContext context, IHttpClientFactory httpClientFactory) =>
{
    var path = context.Request.Path.Value?.Replace("/api/", "");
    var queryString = context.Request.QueryString.Value;
    var backendUrl = $"http://localhost:5001/api/{path}{queryString}";
    
    using var client = httpClientFactory.CreateClient();
    
    // Copiar headers importantes (Content-Type se maneja en el contenido, no en headers)
    // if (context.Request.Headers.ContainsKey("Content-Type"))
    // {
    //     client.DefaultRequestHeaders.Add("Content-Type", context.Request.Headers["Content-Type"].ToString());
    // }
    
    // Copiar header de autorización
    if (context.Request.Headers.ContainsKey("Authorization"))
    {
        client.DefaultRequestHeaders.Add("Authorization", context.Request.Headers["Authorization"].ToString());
    }
    
    try
    {
        HttpResponseMessage response;
        
        if (context.Request.Method == "POST")
        {
            using var content = new StreamContent(context.Request.Body);
            // Copiar Content-Type del request original
            if (context.Request.Headers.ContainsKey("Content-Type"))
            {
                content.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(context.Request.Headers["Content-Type"].ToString());
            }
            response = await client.PostAsync(backendUrl, content);
        }
        else if (context.Request.Method == "PUT")
        {
            using var content = new StreamContent(context.Request.Body);
            // Copiar Content-Type del request original
            if (context.Request.Headers.ContainsKey("Content-Type"))
            {
                content.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(context.Request.Headers["Content-Type"].ToString());
            }
            response = await client.PutAsync(backendUrl, content);
        }
        else if (context.Request.Method == "DELETE")
        {
            response = await client.DeleteAsync(backendUrl);
        }
        else
        {
            response = await client.GetAsync(backendUrl);
        }
        
        var responseContent = await response.Content.ReadAsStringAsync();
        context.Response.StatusCode = (int)response.StatusCode;
        context.Response.ContentType = response.Content.Headers.ContentType?.ToString() ?? "application/json";
        await context.Response.WriteAsync(responseContent);
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"{{\"error\":\"Error de proxy: {ex.Message}\"}}");
    }
});

// Servir archivos estáticos SOLO desde wwwroot (única fuente de verdad)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(contentRoot, "..", "wwwroot")),
    RequestPath = ""
});

// Servir manual HTML desde docs/manual-usuario bajo /manual
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(contentRoot, "..", "docs", "manual-usuario")),
    RequestPath = "/manual"
});

// Servir imágenes del manual desde test-artifacts/manual bajo /manual/assets
var manualAssetsPath = Path.Combine(contentRoot, "..", "test-artifacts", "manual");
if (Directory.Exists(manualAssetsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(manualAssetsPath),
        RequestPath = "/manual/assets"
    });
}

// Servir capturas generales (raíz de test-artifacts) bajo /manual/assets-root
var testArtifactsPath = Path.Combine(contentRoot, "..", "test-artifacts");
if (Directory.Exists(testArtifactsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(testArtifactsPath),
        RequestPath = "/manual/assets-root"
    });
}

// Redirigir la raíz a index.html
app.MapGet("/", () => Results.Redirect("/index.html"));

app.Run("http://localhost:8080");

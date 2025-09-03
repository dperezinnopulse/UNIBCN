using System.Net.Http;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddHttpClient();

var app = builder.Build();

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
    var backendUrl = $"http://localhost:5001/api/{path}";
    
    using var client = httpClientFactory.CreateClient();
    
    // Copiar headers importantes
    if (context.Request.Headers.ContainsKey("Content-Type"))
    {
        client.DefaultRequestHeaders.Add("Content-Type", context.Request.Headers["Content-Type"].ToString());
    }
    
    try
    {
        HttpResponseMessage response;
        
        if (context.Request.Method == "POST")
        {
            using var content = new StreamContent(context.Request.Body);
            response = await client.PostAsync(backendUrl, content);
        }
        else if (context.Request.Method == "PUT")
        {
            using var content = new StreamContent(context.Request.Body);
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

// Servir archivos estáticos desde el directorio Frontend
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "..", "Frontend")),
    RequestPath = ""
});

// Redirigir la raíz a index.html
app.MapGet("/", () => Results.Redirect("/index.html"));

app.Run("http://localhost:8080");

using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Endpoint simple
app.MapGet("/", () => "¡API funcionando!");

Console.WriteLine("🚀 Iniciando API...");
Console.WriteLine($"📅 Fecha: {DateTime.Now}");

app.Run();

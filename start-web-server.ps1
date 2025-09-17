# Servidor web simple usando .NET
$port = 8080
$frontendPath = "C:\DEV\UNI BCN\Frontend"

Write-Host "🚀 Iniciando servidor web en puerto $port..."
Write-Host "📁 Sirviendo archivos desde: $frontendPath"
Write-Host "🌐 URL: http://localhost:$port"
Write-Host ""

# Usar .NET para crear un servidor web simple
$serverCode = @"
using System;
using System.IO;
using System.Net;
using System.Text;

class SimpleWebServer
{
    static void Main()
    {
        string url = "http://localhost:$port/";
        string rootPath = @"$frontendPath";
        
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add(url);
        listener.Start();
        
        Console.WriteLine($"Servidor iniciado en {url}");
        Console.WriteLine($"Sirviendo archivos desde: {rootPath}");
        Console.WriteLine("Presiona Ctrl+C para detener...");
        
        while (listener.IsListening)
        {
            try
            {
                HttpListenerContext context = listener.GetContext();
                HttpListenerRequest request = context.Request;
                HttpListenerResponse response = context.Response;
                
                string path = request.Url.LocalPath;
                if (path == "/") path = "/index.html";
                
                string filePath = Path.Combine(rootPath, path.TrimStart('/'));
                
                if (File.Exists(filePath))
                {
                    string content = File.ReadAllText(filePath);
                    string extension = Path.GetExtension(filePath);
                    
                    string mimeType = extension switch
                    {
                        ".html" => "text/html",
                        ".js" => "application/javascript",
                        ".css" => "text/css",
                        ".json" => "application/json",
                        _ => "text/plain"
                    };
                    
                    byte[] buffer = Encoding.UTF8.GetBytes(content);
                    response.ContentType = mimeType;
                    response.ContentLength64 = buffer.Length;
                    response.OutputStream.Write(buffer, 0, buffer.Length);
                    
                    Console.WriteLine($"✅ {request.HttpMethod} {path} - 200 OK");
                }
                else
                {
                    string notFound = $"Archivo no encontrado: {path}";
                    byte[] buffer = Encoding.UTF8.GetBytes(notFound);
                    response.StatusCode = 404;
                    response.ContentLength64 = buffer.Length;
                    response.OutputStream.Write(buffer, 0, buffer.Length);
                    
                    Console.WriteLine($"❌ {request.HttpMethod} {path} - 404 Not Found");
                }
                
                response.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
        
        listener.Stop();
    }
}
"@

# Crear archivo temporal con el código del servidor
$tempFile = [System.IO.Path]::GetTempFileName() + ".cs"
$serverCode | Out-File -FilePath $tempFile -Encoding UTF8

# Compilar y ejecutar el servidor
try {
    & "C:\Program Files\dotnet\dotnet.exe" run --project $tempFile
} catch {
    Write-Host "Error al ejecutar el servidor: $_"
} finally {
    if (Test-Path $tempFile) { Remove-Item $tempFile -Force }
}

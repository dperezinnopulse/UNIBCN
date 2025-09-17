# Servidor web simple para el frontend
$port = 8080
$frontendPath = "C:\DEV\UNI BCN\Frontend"

Write-Host "🚀 Iniciando servidor web en puerto $port..."
Write-Host "📁 Sirviendo archivos desde: $frontendPath"
Write-Host "🌐 URL: http://localhost:$port"

# Crear un servidor HTTP simple usando PowerShell
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }
        
        $filePath = Join-Path $frontendPath $url.TrimStart("/")
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = Get-Content $filePath -Raw
            $extension = [System.IO.Path]::GetExtension($filePath)
            
            # Determinar el tipo MIME
            $mimeType = switch ($extension) {
                ".html" { "text/html" }
                ".js" { "application/javascript" }
                ".css" { "text/css" }
                ".json" { "application/json" }
                default { "text/plain" }
            }
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentType = $mimeType
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        } else {
            $response.StatusCode = 404
            $notFound = "Archivo no encontrado: $url"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
}

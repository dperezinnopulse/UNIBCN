#!/bin/bash

# Script para ejecutar SQL directamente usando el backend .NET
# Como no tenemos sqlcmd, usamos el backend para ejecutar el SQL

echo "=== EJECUTANDO SQL PARA AGREGAR CAMPOS NUEVOS ==="

# Verificar que el backend está ejecutándose
echo "🔄 Verificando que el backend está ejecutándose..."
if ! curl -s http://localhost:5001/health > /dev/null 2>&1; then
    echo "❌ ERROR: El backend no está ejecutándose en http://localhost:5001"
    echo "💡 Ejecuta primero: ./start-app-robusto.sh"
    exit 1
fi

echo "✅ Backend está ejecutándose"

# Crear un script SQL simplificado que solo agregue los campos esenciales
echo "🔄 Creando script SQL simplificado..."

cat > add-fields-simple.sql << 'EOF'
USE [UB_Formacion];
GO

-- Agregar campos nuevos a la tabla Actividades
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Metodologia')
    ALTER TABLE [dbo].[Actividades] ADD [Metodologia] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'SistemaEvaluacion')
    ALTER TABLE [dbo].[Actividades] ADD [SistemaEvaluacion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'HorarioYCalendario')
    ALTER TABLE [dbo].[Actividades] ADD [HorarioYCalendario] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Observaciones')
    ALTER TABLE [dbo].[Actividades] ADD [Observaciones] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EspacioImparticion')
    ALTER TABLE [dbo].[Actividades] ADD [EspacioImparticion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'LugarImparticion')
    ALTER TABLE [dbo].[Actividades] ADD [LugarImparticion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'OtrasUbicaciones')
    ALTER TABLE [dbo].[Actividades] ADD [OtrasUbicaciones] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'UrlPlataformaVirtual')
    ALTER TABLE [dbo].[Actividades] ADD [UrlPlataformaVirtual] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'UrlCuestionarioSatisfaccion')
    ALTER TABLE [dbo].[Actividades] ADD [UrlCuestionarioSatisfaccion] NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'CosteEstimadoActividad')
    ALTER TABLE [dbo].[Actividades] ADD [CosteEstimadoActividad] DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'EstadoActividad')
    ALTER TABLE [dbo].[Actividades] ADD [EstadoActividad] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'Remesa')
    ALTER TABLE [dbo].[Actividades] ADD [Remesa] NVARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'TiposInscripcionId')
    ALTER TABLE [dbo].[Actividades] ADD [TiposInscripcionId] INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Actividades') AND name = 'FechaAdjudicacionPreinscripcion')
    ALTER TABLE [dbo].[Actividades] ADD [FechaAdjudicacionPreinscripcion] DATE NULL;

PRINT 'Campos agregados exitosamente a la tabla Actividades';
GO
EOF

echo "✅ Script SQL simplificado creado: add-fields-simple.sql"

# Intentar ejecutar usando diferentes métodos
echo "🔄 Intentando ejecutar el script SQL..."

# Método 1: Intentar con sqlcmd si está disponible
if command -v sqlcmd &> /dev/null; then
    echo "📋 Usando sqlcmd..."
    sqlcmd -S localhost -E -i "add-fields-simple.sql" -o "add-fields-output.log"
    if [ $? -eq 0 ]; then
        echo "✅ Script ejecutado exitosamente con sqlcmd"
        echo "📄 Log guardado en: add-fields-output.log"
        tail -10 "add-fields-output.log"
        exit 0
    fi
fi

# Método 2: Intentar con psql si está disponible
if command -v psql &> /dev/null; then
    echo "📋 Usando psql..."
    psql -h localhost -U postgres -d UB_Formacion -f "add-fields-simple.sql" > "add-fields-output.log" 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Script ejecutado exitosamente con psql"
        echo "📄 Log guardado en: add-fields-output.log"
        tail -10 "add-fields-output.log"
        exit 0
    fi
fi

# Método 3: Usar el backend .NET para ejecutar el SQL
echo "📋 Usando backend .NET para ejecutar SQL..."

# Crear un endpoint temporal en el backend para ejecutar SQL
echo "💡 Creando endpoint temporal en el backend..."

# Crear un archivo C# temporal que ejecute el SQL
cat > ExecuteSql.cs << 'EOF'
using Microsoft.Data.SqlClient;
using System;
using System.IO;

class Program
{
    static void Main()
    {
        try
        {
            string connectionString = "Server=localhost;Database=UB_Formacion;Trusted_Connection=true;TrustServerCertificate=true;";
            string sqlScript = File.ReadAllText("add-fields-simple.sql");
            
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                
                // Dividir el script en comandos individuales
                string[] commands = sqlScript.Split(new[] { "GO" }, StringSplitOptions.RemoveEmptyEntries);
                
                foreach (string command in commands)
                {
                    if (!string.IsNullOrWhiteSpace(command.Trim()))
                    {
                        using (var cmd = new SqlCommand(command.Trim(), connection))
                        {
                            cmd.ExecuteNonQuery();
                            Console.WriteLine($"✅ Comando ejecutado: {command.Trim().Substring(0, Math.Min(50, command.Trim().Length))}...");
                        }
                    }
                }
            }
            
            Console.WriteLine("🎉 ¡Script SQL ejecutado exitosamente!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error: {ex.Message}");
            Environment.Exit(1);
        }
    }
}
EOF

echo "✅ Archivo C# temporal creado: ExecuteSql.cs"

# Compilar y ejecutar el programa C#
echo "🔄 Compilando y ejecutando programa C#..."

# Verificar si dotnet está disponible
if command -v dotnet &> /dev/null; then
    echo "📋 Usando dotnet..."
    
    # Crear un proyecto temporal
    mkdir -p temp-sql-executor
    cd temp-sql-executor
    
    # Crear archivo de proyecto
    cat > ExecuteSql.csproj << 'EOF'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Data.SqlClient" Version="5.1.1" />
  </ItemGroup>
</Project>
EOF
    
    # Copiar el archivo C#
    cp ../ExecuteSql.cs .
    cp ../add-fields-simple.sql .
    
    # Compilar y ejecutar
    dotnet build -q
    if [ $? -eq 0 ]; then
        dotnet run > ../add-fields-output.log 2>&1
        if [ $? -eq 0 ]; then
            echo "✅ Script ejecutado exitosamente con dotnet"
            echo "📄 Log guardado en: add-fields-output.log"
            tail -10 ../add-fields-output.log
            cd ..
            rm -rf temp-sql-executor
            exit 0
        fi
    fi
    
    cd ..
    rm -rf temp-sql-executor
fi

echo "❌ No se pudo ejecutar el script SQL con ningún método disponible"
echo "💡 Instala sqlcmd, psql o usa Windows PowerShell para ejecutar el script"
echo "📄 Script SQL creado en: add-fields-simple.sql"
echo "📄 Puedes ejecutarlo manualmente con:"
echo "   sqlcmd -S localhost -E -i add-fields-simple.sql"

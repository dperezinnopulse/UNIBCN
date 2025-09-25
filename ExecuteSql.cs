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

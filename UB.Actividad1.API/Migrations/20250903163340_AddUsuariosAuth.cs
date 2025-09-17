using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UB.Actividad1.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuariosAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "EstadosActividad",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "EstadosActividad",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "EstadosActividad",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "EstadosActividad",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.AlterColumn<bool>(
                name: "InscripcionListaEspera",
                table: "Actividades",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<bool>(
                name: "ActividadPago",
                table: "Actividades",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Rol = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UnidadGestionId = table.Column<int>(type: "int", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Usuarios_UnidadesGestion_UnidadGestionId",
                        column: x => x.UnidadGestionId,
                        principalTable: "UnidadesGestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_UnidadGestionId",
                table: "Usuarios",
                column: "UnidadGestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Username",
                table: "Usuarios",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.AlterColumn<bool>(
                name: "InscripcionListaEspera",
                table: "Actividades",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "ActividadPago",
                table: "Actividades",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "EstadosActividad",
                columns: new[] { "Id", "Activo", "Codigo", "Color", "Descripcion", "Nombre", "Orden" },
                values: new object[,]
                {
                    { 1, true, "BOR", "#6c757d", null, "Borrador", 1 },
                    { 2, true, "ENV", "#fd7e14", null, "Enviada", 2 },
                    { 3, true, "ACE", "#2ecc71", null, "Aceptada", 4 },
                    { 4, true, "SUB", "#dc3545", null, "Subsanar", 3 }
                });
        }
    }
}

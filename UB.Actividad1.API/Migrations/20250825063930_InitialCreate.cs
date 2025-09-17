using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UB.Actividad1.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EstadosActividad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstadosActividad", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UnidadesGestion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnidadesGestion", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Actividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    AnioAcademico = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Lugar = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EstadoId = table.Column<int>(type: "int", nullable: false),
                    UnidadGestionId = table.Column<int>(type: "int", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actividades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Actividades_EstadosActividad_EstadoId",
                        column: x => x.EstadoId,
                        principalTable: "EstadosActividad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Actividades_UnidadesGestion_UnidadGestionId",
                        column: x => x.UnidadGestionId,
                        principalTable: "UnidadesGestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Internacionalizaciones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    Idioma = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Campo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Valor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Internacionalizaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Internacionalizaciones_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Participantes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Apellidos = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DNI = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TipoParticipante = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FechaInscripcion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participantes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Participantes_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subactividades",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FechaInicio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Lugar = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Responsable = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subactividades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subactividades_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Actividades_EstadoId",
                table: "Actividades",
                column: "EstadoId");

            migrationBuilder.CreateIndex(
                name: "IX_Actividades_UnidadGestionId",
                table: "Actividades",
                column: "UnidadGestionId");

            migrationBuilder.CreateIndex(
                name: "IX_EstadosActividad_Codigo",
                table: "EstadosActividad",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Internacionalizaciones_ActividadId_Idioma_Campo",
                table: "Internacionalizaciones",
                columns: new[] { "ActividadId", "Idioma", "Campo" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Participantes_ActividadId",
                table: "Participantes",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_Subactividades_ActividadId",
                table: "Subactividades",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_UnidadesGestion_Codigo",
                table: "UnidadesGestion",
                column: "Codigo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Internacionalizaciones");

            migrationBuilder.DropTable(
                name: "Participantes");

            migrationBuilder.DropTable(
                name: "Subactividades");

            migrationBuilder.DropTable(
                name: "Actividades");

            migrationBuilder.DropTable(
                name: "EstadosActividad");

            migrationBuilder.DropTable(
                name: "UnidadesGestion");
        }
    }
}

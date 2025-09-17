using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UB.Actividad1.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCambioEstadoActividad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsuarioAutorId",
                table: "Actividades",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActividadAdjuntos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    NombreArchivo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RutaArchivo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TipoMime = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TamañoBytes = table.Column<long>(type: "bigint", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    FechaSubida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsuarioSubidaId = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadAdjuntos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActividadAdjuntos_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActividadAdjuntos_Usuarios_UsuarioSubidaId",
                        column: x => x.UsuarioSubidaId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CambiosEstadoActividad",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    EstadoAnteriorId = table.Column<int>(type: "int", nullable: false),
                    EstadoNuevoId = table.Column<int>(type: "int", nullable: false),
                    DescripcionMotivos = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FechaCambio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UsuarioCambioId = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CambiosEstadoActividad", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CambiosEstadoActividad_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CambiosEstadoActividad_EstadosActividad_EstadoAnteriorId",
                        column: x => x.EstadoAnteriorId,
                        principalTable: "EstadosActividad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CambiosEstadoActividad_EstadosActividad_EstadoNuevoId",
                        column: x => x.EstadoNuevoId,
                        principalTable: "EstadosActividad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CambiosEstadoActividad_Usuarios_UsuarioCambioId",
                        column: x => x.UsuarioCambioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HilosMensajes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HilosMensajes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HilosMensajes_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Mensajes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HiloMensajeId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Contenido = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Asunto = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    Eliminado = table.Column<bool>(type: "bit", nullable: false),
                    FechaEliminacion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mensajes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Mensajes_HilosMensajes_HiloMensajeId",
                        column: x => x.HiloMensajeId,
                        principalTable: "HilosMensajes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Mensajes_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Adjuntos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MensajeId = table.Column<int>(type: "int", nullable: false),
                    NombreArchivo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    RutaArchivo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TipoMime = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TamañoBytes = table.Column<long>(type: "bigint", nullable: false),
                    FechaSubida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Adjuntos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Adjuntos_Mensajes_MensajeId",
                        column: x => x.MensajeId,
                        principalTable: "Mensajes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MensajesUsuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MensajeId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Leido = table.Column<bool>(type: "bit", nullable: false),
                    FechaLectura = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MensajesUsuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MensajesUsuarios_Mensajes_MensajeId",
                        column: x => x.MensajeId,
                        principalTable: "Mensajes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MensajesUsuarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Actividades_UsuarioAutorId",
                table: "Actividades",
                column: "UsuarioAutorId");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadAdjuntos_ActividadId",
                table: "ActividadAdjuntos",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadAdjuntos_UsuarioSubidaId",
                table: "ActividadAdjuntos",
                column: "UsuarioSubidaId");

            migrationBuilder.CreateIndex(
                name: "IX_Adjuntos_MensajeId",
                table: "Adjuntos",
                column: "MensajeId");

            migrationBuilder.CreateIndex(
                name: "IX_CambiosEstadoActividad_ActividadId",
                table: "CambiosEstadoActividad",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_CambiosEstadoActividad_EstadoAnteriorId",
                table: "CambiosEstadoActividad",
                column: "EstadoAnteriorId");

            migrationBuilder.CreateIndex(
                name: "IX_CambiosEstadoActividad_EstadoNuevoId",
                table: "CambiosEstadoActividad",
                column: "EstadoNuevoId");

            migrationBuilder.CreateIndex(
                name: "IX_CambiosEstadoActividad_UsuarioCambioId",
                table: "CambiosEstadoActividad",
                column: "UsuarioCambioId");

            migrationBuilder.CreateIndex(
                name: "IX_HilosMensajes_ActividadId",
                table: "HilosMensajes",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensajes_HiloMensajeId",
                table: "Mensajes",
                column: "HiloMensajeId");

            migrationBuilder.CreateIndex(
                name: "IX_Mensajes_UsuarioId",
                table: "Mensajes",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_MensajesUsuarios_MensajeId_UsuarioId",
                table: "MensajesUsuarios",
                columns: new[] { "MensajeId", "UsuarioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MensajesUsuarios_UsuarioId",
                table: "MensajesUsuarios",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Actividades_Usuarios_UsuarioAutorId",
                table: "Actividades",
                column: "UsuarioAutorId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Actividades_Usuarios_UsuarioAutorId",
                table: "Actividades");

            migrationBuilder.DropTable(
                name: "ActividadAdjuntos");

            migrationBuilder.DropTable(
                name: "Adjuntos");

            migrationBuilder.DropTable(
                name: "CambiosEstadoActividad");

            migrationBuilder.DropTable(
                name: "MensajesUsuarios");

            migrationBuilder.DropTable(
                name: "Mensajes");

            migrationBuilder.DropTable(
                name: "HilosMensajes");

            migrationBuilder.DropIndex(
                name: "IX_Actividades_UsuarioAutorId",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "UsuarioAutorId",
                table: "Actividades");
        }
    }
}

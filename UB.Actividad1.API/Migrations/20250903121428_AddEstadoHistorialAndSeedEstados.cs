using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace UB.Actividad1.API.Migrations
{
    /// <inheritdoc />
    public partial class AddEstadoHistorialAndSeedEstados : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Actividades_EstadosActividad_EstadoId",
                table: "Actividades");

            migrationBuilder.DropForeignKey(
                name: "FK_Actividades_UnidadesGestion_UnidadGestionId",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "Orden",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "Apellidos",
                table: "Participantes");

            migrationBuilder.DropColumn(
                name: "DNI",
                table: "Participantes");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Participantes");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Participantes");

            migrationBuilder.DropColumn(
                name: "TipoParticipante",
                table: "Participantes");

            migrationBuilder.RenameColumn(
                name: "Responsable",
                table: "Subactividades",
                newName: "Ubicacion");

            migrationBuilder.RenameColumn(
                name: "Lugar",
                table: "Subactividades",
                newName: "Docente");

            migrationBuilder.RenameColumn(
                name: "FechaInscripcion",
                table: "Participantes",
                newName: "FechaModificacion");

            migrationBuilder.AddColumn<int>(
                name: "Aforo",
                table: "Subactividades",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Duracion",
                table: "Subactividades",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaModificacion",
                table: "Subactividades",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "HoraFin",
                table: "Subactividades",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HoraInicio",
                table: "Subactividades",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Idioma",
                table: "Subactividades",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Modalidad",
                table: "Subactividades",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Participantes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Rol",
                table: "Participantes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ActividadPago",
                table: "Actividades",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ActividadReservada",
                table: "Actividades",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CategoriaSAE",
                table: "Actividades",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CentreTreballeAlumne",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CentroTrabajoRequerido",
                table: "Actividades",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CentroUnidadUBDestinataria",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CodigoRelacionado",
                table: "Actividades",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompetenciesSAE",
                table: "Actividades",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CondicionesEconomicas",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Coordinador",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoordinadorCentreUnitat",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CreditosMaximosSAE",
                table: "Actividades",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CreditosMinimosSAE",
                table: "Actividades",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CreditosTotalesCRAI",
                table: "Actividades",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CreditosTotalesSAE",
                table: "Actividades",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DepartamentoDestinatario",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FacultadDestinataria",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaActividad",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaFinImparticion",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaInicioImparticion",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GestorActividad",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "HorasTotales",
                table: "Actividades",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InscripcionFin",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InscripcionInicio",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InscripcionListaEspera",
                table: "Actividades",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "InscripcionModalidad",
                table: "Actividades",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "InscripcionPlazas",
                table: "Actividades",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InscripcionRequisitosCA",
                table: "Actividades",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InscripcionRequisitosEN",
                table: "Actividades",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InscripcionRequisitosES",
                table: "Actividades",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JefeUnidadGestora",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LineaEstrategica",
                table: "Actividades",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModalidadGestion",
                table: "Actividades",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MotivoCierre",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ObjetivoEstrategico",
                table: "Actividades",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtrosCentrosInstituciones",
                table: "Actividades",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonaSolicitante",
                table: "Actividades",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlazasTotales",
                table: "Actividades",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaContenidosCA",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaContenidosEN",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaContenidosES",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaDescripcionCA",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaDescripcionEN",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaDescripcionES",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ProgramaDuracion",
                table: "Actividades",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ProgramaFin",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ProgramaInicio",
                table: "Actividades",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaObjetivosCA",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaObjetivosEN",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramaObjetivosES",
                table: "Actividades",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoActividad",
                table: "Actividades",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipusEstudiSAE",
                table: "Actividades",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActividadEstadoHistorial",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    EstadoId = table.Column<int>(type: "int", nullable: false),
                    FechaCambio = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadEstadoHistorial", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActividadEstadoHistorial_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActividadEstadoHistorial_EstadosActividad_EstadoId",
                        column: x => x.EstadoId,
                        principalTable: "EstadosActividad",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Dominios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dominios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EntidadesOrganizadoras",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NifCif = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Web = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PersonaContacto = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EsPrincipal = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntidadesOrganizadoras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EntidadesOrganizadoras_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ImportesDescuentos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActividadId = table.Column<int>(type: "int", nullable: false),
                    ImporteBase = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    TipoImpuesto = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PorcentajeDescuento = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CodigoPromocional = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CondicionesES = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CondicionesCA = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CondicionesEN = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportesDescuentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImportesDescuentos_Actividades_ActividadId",
                        column: x => x.ActividadId,
                        principalTable: "Actividades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ValoresDominio",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DominioId = table.Column<int>(type: "int", nullable: false),
                    Valor = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Orden = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValoresDominio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ValoresDominio_Dominios_DominioId",
                        column: x => x.DominioId,
                        principalTable: "Dominios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_ActividadEstadoHistorial_ActividadId",
                table: "ActividadEstadoHistorial",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadEstadoHistorial_EstadoId",
                table: "ActividadEstadoHistorial",
                column: "EstadoId");

            migrationBuilder.CreateIndex(
                name: "IX_Dominios_Nombre",
                table: "Dominios",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EntidadesOrganizadoras_ActividadId",
                table: "EntidadesOrganizadoras",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_ImportesDescuentos_ActividadId",
                table: "ImportesDescuentos",
                column: "ActividadId");

            migrationBuilder.CreateIndex(
                name: "IX_ValoresDominio_DominioId_Valor",
                table: "ValoresDominio",
                columns: new[] { "DominioId", "Valor" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Actividades_EstadosActividad_EstadoId",
                table: "Actividades",
                column: "EstadoId",
                principalTable: "EstadosActividad",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Actividades_UnidadesGestion_UnidadGestionId",
                table: "Actividades",
                column: "UnidadGestionId",
                principalTable: "UnidadesGestion",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Actividades_EstadosActividad_EstadoId",
                table: "Actividades");

            migrationBuilder.DropForeignKey(
                name: "FK_Actividades_UnidadesGestion_UnidadGestionId",
                table: "Actividades");

            migrationBuilder.DropTable(
                name: "ActividadEstadoHistorial");

            migrationBuilder.DropTable(
                name: "EntidadesOrganizadoras");

            migrationBuilder.DropTable(
                name: "ImportesDescuentos");

            migrationBuilder.DropTable(
                name: "ValoresDominio");

            migrationBuilder.DropTable(
                name: "Dominios");

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

            migrationBuilder.DropColumn(
                name: "Aforo",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "Duracion",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "FechaModificacion",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "HoraFin",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "HoraInicio",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "Idioma",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "Modalidad",
                table: "Subactividades");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Participantes");

            migrationBuilder.DropColumn(
                name: "Rol",
                table: "Participantes");

            migrationBuilder.DropColumn(
                name: "ActividadPago",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ActividadReservada",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CategoriaSAE",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CentreTreballeAlumne",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CentroTrabajoRequerido",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CentroUnidadUBDestinataria",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CodigoRelacionado",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CompetenciesSAE",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CondicionesEconomicas",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "Coordinador",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CoordinadorCentreUnitat",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CreditosMaximosSAE",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CreditosMinimosSAE",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CreditosTotalesCRAI",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "CreditosTotalesSAE",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "DepartamentoDestinatario",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "FacultadDestinataria",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "FechaActividad",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "FechaFinImparticion",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "FechaInicioImparticion",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "GestorActividad",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "HorasTotales",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionFin",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionInicio",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionListaEspera",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionModalidad",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionPlazas",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionRequisitosCA",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionRequisitosEN",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "InscripcionRequisitosES",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "JefeUnidadGestora",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "LineaEstrategica",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ModalidadGestion",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "MotivoCierre",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ObjetivoEstrategico",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "OtrosCentrosInstituciones",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "PersonaSolicitante",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "PlazasTotales",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaContenidosCA",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaContenidosEN",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaContenidosES",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaDescripcionCA",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaDescripcionEN",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaDescripcionES",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaDuracion",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaFin",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaInicio",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaObjetivosCA",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaObjetivosEN",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "ProgramaObjetivosES",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "TipoActividad",
                table: "Actividades");

            migrationBuilder.DropColumn(
                name: "TipusEstudiSAE",
                table: "Actividades");

            migrationBuilder.RenameColumn(
                name: "Ubicacion",
                table: "Subactividades",
                newName: "Responsable");

            migrationBuilder.RenameColumn(
                name: "Docente",
                table: "Subactividades",
                newName: "Lugar");

            migrationBuilder.RenameColumn(
                name: "FechaModificacion",
                table: "Participantes",
                newName: "FechaInscripcion");

            migrationBuilder.AddColumn<int>(
                name: "Orden",
                table: "Subactividades",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Apellidos",
                table: "Participantes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DNI",
                table: "Participantes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Participantes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Participantes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoParticipante",
                table: "Participantes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Actividades_EstadosActividad_EstadoId",
                table: "Actividades",
                column: "EstadoId",
                principalTable: "EstadosActividad",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Actividades_UnidadesGestion_UnidadGestionId",
                table: "Actividades",
                column: "UnidadGestionId",
                principalTable: "UnidadesGestion",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UB.Actividad1.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRobustRoleSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Usuarios",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RolesNormalizados",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolesNormalizados", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MapeoRoles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RolOriginal = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RolNormalizadoId = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapeoRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapeoRoles_RolesNormalizados_RolNormalizadoId",
                        column: x => x.RolNormalizadoId,
                        principalTable: "RolesNormalizados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransicionesEstado",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstadoOrigenCodigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EstadoDestinoCodigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Accion = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    RolPermitido = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RolPermitidoId = table.Column<int>(type: "int", nullable: true),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    RolNormalizadoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransicionesEstado", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransicionesEstado_RolesNormalizados_RolNormalizadoId",
                        column: x => x.RolNormalizadoId,
                        principalTable: "RolesNormalizados",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapeoRoles_RolNormalizadoId",
                table: "MapeoRoles",
                column: "RolNormalizadoId");

            migrationBuilder.CreateIndex(
                name: "IX_MapeoRoles_RolOriginal_RolNormalizadoId",
                table: "MapeoRoles",
                columns: new[] { "RolOriginal", "RolNormalizadoId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolesNormalizados_Codigo",
                table: "RolesNormalizados",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransicionesEstado_EstadoOrigenCodigo_EstadoDestinoCodigo_RolPermitido",
                table: "TransicionesEstado",
                columns: new[] { "EstadoOrigenCodigo", "EstadoDestinoCodigo", "RolPermitido" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransicionesEstado_RolNormalizadoId",
                table: "TransicionesEstado",
                column: "RolNormalizadoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapeoRoles");

            migrationBuilder.DropTable(
                name: "TransicionesEstado");

            migrationBuilder.DropTable(
                name: "RolesNormalizados");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Usuarios");
        }
    }
}

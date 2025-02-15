using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Authentication.Migrations
{
    /// <inheritdoc />
    public partial class paramaterupdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Parameters_Intents_IntentId",
                table: "Parameters");

            migrationBuilder.DropIndex(
                name: "IX_Parameters_IntentId",
                table: "Parameters");

            migrationBuilder.DropColumn(
                name: "IntentId",
                table: "Parameters");

            migrationBuilder.AddColumn<int>(
                name: "ParametersId",
                table: "Intents",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Intents_ParametersId",
                table: "Intents",
                column: "ParametersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Intents_Parameters_ParametersId",
                table: "Intents",
                column: "ParametersId",
                principalTable: "Parameters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Intents_Parameters_ParametersId",
                table: "Intents");

            migrationBuilder.DropIndex(
                name: "IX_Intents_ParametersId",
                table: "Intents");

            migrationBuilder.DropColumn(
                name: "ParametersId",
                table: "Intents");

            migrationBuilder.AddColumn<int>(
                name: "IntentId",
                table: "Parameters",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Parameters_IntentId",
                table: "Parameters",
                column: "IntentId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Parameters_Intents_IntentId",
                table: "Parameters",
                column: "IntentId",
                principalTable: "Intents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

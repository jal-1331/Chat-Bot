using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Authentication.Migrations
{
    /// <inheritdoc />
    public partial class date_time_demobooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PreferredDateTime",
                table: "DemoBookings",
                newName: "Time");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "Parameters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "Parameters",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Date",
                table: "DemoBookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Parameters");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Parameters");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "DemoBookings");

            migrationBuilder.RenameColumn(
                name: "Time",
                table: "DemoBookings",
                newName: "PreferredDateTime");
        }
    }
}

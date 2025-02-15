using System.ComponentModel.DataAnnotations;

namespace Authentication.Models
{
    public class Intent
    {
        [Key]
        public int Id { get; set; }                   // Auto-generated ID

        public string Type { get; set; } = string.Empty;  // Intent type ('ticket-creation', 'login', etc.)

        // Relationship: One IntentDto has one ParametersDto
        public Parameters Parameters { get; set; } = new Parameters();

    }
}

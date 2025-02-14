namespace Authentication.Models
{
    public class Intent
    {
        public int Id { get; set; }                   // Auto-generated ID
        public int MessageId { get; set; }            // Foreign Key (MsgDto)

        public string Type { get; set; } = string.Empty;  // Intent type ('ticket-creation', 'login', etc.)

        // Relationship: One IntentDto has one ParametersDto
        public Parameters Parameters { get; set; } = new Parameters();

        // Navigation Property
        public Message Message { get; set; }
    }
}

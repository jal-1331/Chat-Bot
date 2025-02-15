namespace Authentication.DTOs
{
    public class IntentDto
    {
        public int Id { get; set; }                   // Auto-generated ID
        
        public string Type { get; set; } = string.Empty;  // Intent type ('ticket-creation', 'login', etc.)

        // Relationship: One IntentDto has one ParametersDto
        public ParametersDto Parameters { get; set; } = new ParametersDto();

        
    }
}

namespace Authentication.DTOs
{
    public class ParametersDto
    {
        public int Id { get; set; }                     // Auto-generated ID
        public int IntentDtoId { get; set; }           // Foreign Key (IntentDto)

        public string TicketTitle { get; set; } = string.Empty;
        public string TicketDescription { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string TicketId { get; set; } = string.Empty;

        // Navigation Property
        public IntentDto Intent { get; set; }
    }
}

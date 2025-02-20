using System.ComponentModel.DataAnnotations;

namespace Authentication.Models
{
    public class Parameters
    {
        [Key]
        public int Id { get; set; }                     // Auto-generated ID
        public string TicketTitle { get; set; } = string.Empty;
        public string TicketDescription { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string TicketId { get; set; } = string.Empty;
        public string PrefferedDateTime { get; set; } = string.Empty;

    }
}

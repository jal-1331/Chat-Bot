namespace Authentication.Models
{
    public class Ticket
    {
        public int Id { get; set; }                  // Primary Key
        public string Title { get; set; } = string.Empty;         // Brief title or subject of the ticket
        public string Description { get; set; } = string.Empty;    // Detailed description of the issue or ticket details
        public DateTime? CreatedAt { get; set; } = DateTime.Now;     // Timestamp for when the ticket was created
        public DateTime? ResolvedAt { get; set; }   // Timestamp for when the ticket was resolved
        public TicketStatus Status { get; set; } = TicketStatus.Open;   // Enum to indicate the status of the ticket
        public int CreatedByUserId { get; set; }    // Foreign key to the user who created the ticket
    }

    public enum TicketStatus
    {
        Open,         
        InProgress,   
        Resolved,     
        Closed
    }
}

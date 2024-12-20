namespace Authentication.Models
{
    public class Chat
    {
        public int Id { get; set; }                        // Unique identifier for the chat
        public int UserId { get; set; }                   // ID of the user who started the chat
        public DateTime DateOfChat { get; set; }          // Date of the chat
        public DateTime? StartedAt { get; set; }          // Timestamp when the chat started
        public DateTime? EndedAt { get; set; }            // Timestamp when the chat ended (optional)
        public List<Message> Messages { get; set; } = []; // List of messages in the chat
    }

}

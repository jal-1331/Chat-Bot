namespace Authentication.Models
{
    public class Message
    {
        public int Id { get; set; }                       // Unique identifier for the message
        public int ChatId { get; set; }                   // ID of the chat this message belongs to
        public string Content { get; set; } = string.Empty;             // The message content
        public string SenderType { get; set; } = string.Empty;           // Indicates 'User' or 'Bot' as sender
        public string MessageType { get; set; } = string.Empty;          // Indicates 'Question' or 'Answer'
        public DateTime SentAt { get; set; }             // Timestamp when the message was sent
    }

}

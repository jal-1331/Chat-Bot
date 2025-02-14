namespace Authentication.Models
{
    public class Message
    {
        public int Id { get; set; }                   // Auto-generated ID
        public int ChatId { get; set; }               // Chat ID
        public string Content { get; set; } = string.Empty;  // Response content
        public string SenderType { get; set; } = string.Empty;  // 'User' or 'Bot'
        public DateTime SentAt { get; set; }         // Timestamp (maps to Flask timestamp)

        // Relationship: One MsgDto can have multiple intents
        public List<Intent> Intents { get; set; } = new List<Intent>();
    }

}

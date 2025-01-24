namespace Authentication.DTOs
{
    public class MessageDto
    {
        public int? Id { get; set; }                       
        public int? ChatId { get; set; }                   
        public string? Content { get; set; }             
        public string? SenderType { get; set; }
        public string? MessageType { get; set; }         
        public DateTime? SentAt { get; set; }

        public List<ConversationDto>? conversations { get; set; }
        public string? ErrorMsg { get; set; }
    }
}

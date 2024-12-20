using Authentication.Models;

namespace Authentication.DTOs
{
    public class ChatDto
    {
        public int? Id { get; set; }                        
        public int? UserId { get; set; }                   
        public DateTime? DateOfChat { get; set; }          
        public DateTime? StartedAt { get; set; }          
        public DateTime? EndedAt { get; set; }            
        public List<Message>? Messages { get; set; }

        public string? ErrorMsg;
    }
}

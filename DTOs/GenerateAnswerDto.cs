namespace Authentication.DTOs
{
    public class GenerateAnswerDto
    {
        public string? question {  get; set; }
        //public string? answer { get; set; }
        public string? response { get; set; }

        public string? type { get; set; }

        public string? context { get; set; }
        public List<IntentDto> intents { get; set; } = new List<IntentDto>();
        public List<ConversationDto> conversations { get; set; } = [];

    }
}

namespace Authentication.DTOs
{
    public class GenerateAnswerDto
    {
        public string? question {  get; set; }
        //public string? answer { get; set; }
        public string? response { get; set; }

        public string? type { get; set; }

        public string? context { get; set; }

        public List<ConversationDto> conversations { get; set; } = [];

    }
}

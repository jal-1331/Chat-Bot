namespace Authentication.Models
{
    public class DemoBooking
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        //public string PreferredDateTime { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

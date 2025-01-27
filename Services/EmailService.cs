using Authentication.Models;
using MailKit.Net.Smtp;
using MimeKit;

namespace Authentication.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(emailSettings["SenderEmail"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = message
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(emailSettings["SMTPServer"], int.Parse(emailSettings["Port"]!), MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(emailSettings["SenderEmail"], emailSettings["SenderPassword"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
        public async Task SendTicketNotificationAsync(string toEmail, Ticket ticket)
        {
            string subject = $"Ticket Created: {ticket.Title}";
            string body = $@"
                Hello,

                Your ticket has been successfully created. Here are the details:

                Ticket ID: {ticket.Id}
                Title: {ticket.Title}
                Description: {ticket.Description}
                Status: {ticket.Status}
                Created At: {ticket.CreatedAt}

                Thank you for using our service!

                Regards,
                Support Team
            ";

            await SendEmailAsync(toEmail, subject, body);
        }
        public async Task SendTicketStatusAsync(string toEmail, Ticket ticket)
        {
            string subject = $"Ticket Status Update: {ticket.Title}";
            string body = $@"
            Hello,

            Here is the current status of your ticket:

            Ticket ID: {ticket.Id}
            Title: {ticket.Title}
            Status: {ticket.Status}
            Updated At: {ticket.ResolvedAt ?? DateTime.Now}

            Thank you for using our service!

            Regards,
            Support Team
        ";

            await SendEmailAsync(toEmail, subject, body);
        }

        public string GenerateOtp(int length = 6)
        {
            var random = new Random();
            var otp = new string(Enumerable.Repeat("0123456789", length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            return otp;
        }

    }
}

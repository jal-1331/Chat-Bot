using Authentication.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Authentication.DTOs;
namespace Authentication.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options  ) : base(options){ }
        public DbSet<User> Users { get; set; }

        public DbSet<Chat> Chats { get; set; }

        public DbSet<Message> Messages { get; set; }
        public DbSet<Intent> Intents { get; set; }
        public DbSet<Parameters> Parameters { get; set; }

        public DbSet<DemoBooking> DemoBookings { get; set; }

        public DbSet<Ticket> Tickets { get; set; }
    }
}

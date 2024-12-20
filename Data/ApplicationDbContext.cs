using Authentication.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
namespace Authentication.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options  ) : base(options){ }
        public DbSet<User> Users { get; set; }
    }
}

using Authentication.Models;
using System.Collections.Generic;

namespace Authentication.Data
{
    public class ApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options  ) : base(options){ }
        public DbSet<User> Users { get; set; }
    }
}

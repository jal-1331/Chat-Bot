using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data.Repositories
{
    public class MessageRepository
    {
        private readonly ApplicationDbContext _context;
        public MessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Message?> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync<Message>(m => id == m.Id);
        }

        public async Task<Message?> SaveMessage(Message msg)
        {
            await _context.Messages.AddAsync(msg);
            _context.SaveChanges();
            return msg;
        }
    }
}

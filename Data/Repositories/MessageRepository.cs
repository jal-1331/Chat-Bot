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

        public async Task<List<Message>> GetMessageByChatId(int id)
        {
            return await _context.Messages.Where(m => m.ChatId == id).ToListAsync();
        }

        public async Task<List<Message>> DeleteMessages(List<Message> msgs)
        {
            _context.Messages.RemoveRange(msgs);
            await _context.SaveChangesAsync();
            return msgs;
        }
        public async Task<int> DeleteMessage(int id)
        {
            //return await _context.Database.ExecuteSqlRawAsync("DELETE FROM Messages WHERE Id = {0}", id);
            _context.Messages.Remove((await GetMessage(id))!);
            await _context.SaveChangesAsync();
            return id;
        }
    }
}

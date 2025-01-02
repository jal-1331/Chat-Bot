using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data.Repositories
{
    public class ChatRepository
    {
        private readonly ApplicationDbContext _context;
        public ChatRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Chat?> GetChat(int id)
        { 
            return await _context.Chats.Include(c => c.Messages).FirstOrDefaultAsync<Chat>(c => id == c.Id);
        }

        public async Task<Chat?> SaveChat(Chat chat)
        {
            await _context.Chats.AddAsync(chat);
            await _context.SaveChangesAsync();
            return chat;
        }

        public async Task<Chat?> UpdateChat(Chat chat)
        {
            _context.Update(chat);
            await _context.SaveChangesAsync();
            return chat;
        }

        public async Task<List<Chat>?> GetByChatsUserId(int userId)
        {
            return await _context.Chats.Include(c => c.Messages).Where(c => userId == c.UserId).ToListAsync();
        }

        public async Task<int> DeleteChats(List<Chat> chats)
        {
            _context.Chats.RemoveRange(chats);
            int x = await _context.SaveChangesAsync();

            return x;
        }
    }
}

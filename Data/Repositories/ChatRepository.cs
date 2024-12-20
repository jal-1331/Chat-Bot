﻿using Authentication.Models;
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
            return await _context.Chats.FirstOrDefaultAsync<Chat>(c => id == c.Id);
        }

        public async Task<Chat?> SaveChat(Chat chat)
        {
            await _context.Chats.AddAsync(chat);
            _context.SaveChanges();
            return chat;
        }

        public async Task<Chat?> UpdateChat(Chat chat)
        {
            _context.Update(chat);
            await _context.SaveChangesAsync();
            return chat;
        }
    }
}

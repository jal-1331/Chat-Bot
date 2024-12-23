using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data.Repositories
{
    public class TicketRepository
    {
        private readonly ApplicationDbContext _context;
        public TicketRepository(ApplicationDbContext context) { _context = context; }

        public async Task<Ticket> SaveTicket(Ticket ticket)
        {
            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        } 

        public async Task<Ticket?> GetTicket(int id)
        {
            return await _context.Tickets.FirstOrDefaultAsync<Ticket>(t => t.Id == id);
        }

        public async Task<Ticket?> UpdateTicket(Ticket ticket)
        {
            _context.Tickets.Update(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }

        public async Task<int> DeleteTicket(int id)
        {
            _context.Tickets.Remove((await GetTicket(id))!);
            int x = await _context.SaveChangesAsync();
            return x;
        }
    }
}

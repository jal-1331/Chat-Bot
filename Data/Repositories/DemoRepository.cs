using Authentication.Models;
using System;
using Microsoft.EntityFrameworkCore;


namespace Authentication.Data.Repositories
{
    public class DemoRepository
    {
        private readonly ApplicationDbContext _context;

        public DemoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> BookDemoAsync(DemoBooking demoBooking)
        {
            await _context.DemoBookings.AddAsync(demoBooking);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<DemoBooking>> GetAllBookingsAsync()
        {
            return await _context.DemoBookings.ToListAsync();
        }
    }

}

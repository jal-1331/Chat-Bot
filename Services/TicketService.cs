using Authentication.Data.Repositories;
using Authentication.Models;
using System.Globalization;

namespace Authentication.Services
{
    public class TicketService
    {
        private readonly TicketRepository _ticketRepo;
        private readonly UserRepository _userRepo;
        public TicketService(TicketRepository ticketRepo, UserRepository userRepo)
        {
            _ticketRepo = ticketRepo;
            _userRepo = userRepo;
        }
        public async Task<Ticket> CreateTicket(Ticket t, string email)
        {
            t.CreatedAt = DateTime.Now;
            t.Status = TicketStatus.Open;
            t.CreatedByUserId = (await _userRepo.GetByEmailAsync(email)).Id;
            return await _ticketRepo.SaveTicket(t);
        } 

        public async Task<Ticket> GetTicketById(int id)
        {
            try
            {
                Ticket? t = await _ticketRepo.GetTicket(id);
                if (t == null) 
                { 
                    return new Ticket() { Id = -1};
                }
                else
                {
                    return t;
                }
            }
            catch (Exception ex) { 
                return new Ticket() { Id = -1};
            }
        }

        public async Task<int> DeleteTicketById(int id)
        { 
            return await _ticketRepo.DeleteTicket(id);
        }

        public async Task<Ticket> UpdateTicketStatus(Ticket t, string status)
        {
            if(status == "InProgress")
            {
                t.Status = TicketStatus.InProgress;
            }
            else if (status == "Closed")
            {
                t.Status = TicketStatus.Closed;
            }
            else if (status == "Resolved")
            {
                t.Status = TicketStatus.Resolved;
            }
            else if (status == "Open")
            {
                t.Status = TicketStatus.Open;
            }

            if (await _ticketRepo.UpdateTicket(t) == null){ 
                return new Ticket() { Id = -1 };
            }
            else
            {
                return t;
            }
        }
    }
}

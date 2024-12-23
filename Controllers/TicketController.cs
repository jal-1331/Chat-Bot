using Authentication.Models;
using Authentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;
        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        [Authorize]
        public async Task<Ticket> Get(int id)
        {
            return await _ticketService.GetTicketById(id);
        }

        [Authorize]
        [HttpPost]
        public async Task<Ticket> Post(Ticket t)
        {
            return await _ticketService.CreateTicket(t);
        }

        [Authorize]
        [HttpPost]
        [Route("UpdateStatus")]
        public async Task<Ticket> Update(int id, string status)
        {
            Ticket t = await _ticketService.GetTicketById(id);
            return await _ticketService.UpdateTicketStatus(t, status);
        }

        [Authorize]
        [HttpDelete]
        public async Task<int> Delete(int id)
        {
            return await _ticketService.DeleteTicketById(id);
        }
    }
}

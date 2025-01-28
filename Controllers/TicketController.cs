using Authentication.DTOs;
using Authentication.Models;
using Authentication.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

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
            string? token = await Request.HttpContext.GetTokenAsync("access_token");
            string email = GetJwtTokenData(token!).Email;
            return await _ticketService.CreateTicket(t, email);
        }

        [Authorize]
        [HttpPost]
        [Route("UpdateStatus")]
        public async Task<Ticket> Update(Ticket t)
        {
            //Ticket t = await _ticketService.GetTicketById(id);
            return await _ticketService.UpdateTicketStatus(t, t.Status.ToString());
        }

        [Authorize]
        [HttpDelete]
        public async Task<int> Delete(int id)
        {
            return await _ticketService.DeleteTicketById(id);
        }
        [HttpPost("send-status-email")]
        public async Task<IActionResult> SendStatusEmail(int ticketId)
        {
            string? token = await Request.HttpContext.GetTokenAsync("access_token");
            string email = GetJwtTokenData(token!).Email;
            bool success = await _ticketService.SendTicketStatusByEmail(ticketId, email);
            if (!success)
            {
                return NotFound(new { message = "Ticket not found or email could not be sent." });


            }
            return Ok(new { message = "Email sent successfully." });
        }
        private LoginDto GetJwtTokenData(String jwttoken)
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(jwttoken);

            LoginDto data = new()
            {
                Email = token.Payload.Values.First().ToString()!
            };
            return data;
        }
    }

}

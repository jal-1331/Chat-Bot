using Authentication.DTOs;
using Authentication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }
        [HttpGet]
        [Route("new")]
        [Authorize]
        public async Task<ChatDto> Get()
        {
            string? token = await Request.HttpContext.GetTokenAsync("access_token");
            LoginDto data = GetJwtTokenData(token!);
            return await _chatService.NewChat(data.Email);
        }
        
        public LoginDto GetJwtTokenData(String jwttoken)
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

using Authentication.DTOs;
using Authentication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.Reflection.Metadata.Ecma335;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly  UserService _userService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }
        [HttpGet]
        [Route("new")]
        [Authorize]
        public async Task<ChatDto> GetNew()
        {
            string? token = await Request.HttpContext.GetTokenAsync("access_token");
            LoginDto data = GetJwtTokenData(token!);
            return await _chatService.NewChat(data.Email);
        }

        [HttpGet]
        [Authorize]
        public async Task<ChatDto> Get(int id)
        {
            return await _chatService.GetChatByIdWithAnswers(id);
        }

        [HttpGet]
        [Authorize]
        [Route("Clear")]
        public async Task<ChatDto> Clear(int id)
        {
            return await _chatService.ClearChat(id);
        }
        [HttpGet]
        [Authorize]
        [Route("ByUserId")]
        public async Task<List<ChatDto>> GetByUserId()
        {
            string? token = await Request.HttpContext.GetTokenAsync("access_token");
            LoginDto data = GetJwtTokenData(token!);
            string email = data.Email;
            return await _chatService.GetChatsByUserId(email);
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

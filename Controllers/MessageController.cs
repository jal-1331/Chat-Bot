using Authentication.DTOs;
using Authentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private MessageService _messageService;
        public MessageController(MessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost]
        [Route("GenerateAnswer")]
        [Authorize]
        public async Task<MessageDto> GenerateAnwer(MessageDto message)
            
        {
            message.SenderType = "User";
            message.MessageType = "Question";
            message.SentAt = DateTime.Now;
            return await _messageService.GenerateAnswer(message);
            
        }

        [HttpGet]
        [Authorize]
        public async Task<MessageDto> Get(int id)
        {
            return await _messageService.GetMessageById(id);
        }

        [HttpDelete]
        [Authorize]
        public async Task<MessageDto> Delete(int id)
        {
            return await _messageService.DeleteMessageById(id);
        }
    }
}

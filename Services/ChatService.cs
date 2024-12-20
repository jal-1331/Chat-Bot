using Authentication.Data.Repositories;
using Authentication.DTOs;
using Authentication.Models;
using AutoMapper;
using Microsoft.Identity.Client;

namespace Authentication.Services
{
    public class ChatService
    {
        private readonly ChatRepository _chatRepo;
        private readonly UserRepository _userRepo;
        private readonly IMapper _mapper;
        public ChatService(ChatRepository chatRepo, UserRepository userRepo)
        {
            _chatRepo = chatRepo;
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<MessageDto, Message>();
                cfg.CreateMap<ChatDto, Chat>();
                cfg.CreateMap<Message, MessageDto>();
                cfg.CreateMap<Chat, ChatDto>();
            });
            _mapper = configuration.CreateMapper();
            _userRepo = userRepo;
        }

        public async Task<ChatDto> NewChat(string email) {
            try
            {
                User u = await _userRepo.GetByEmailAsync(email);
                Chat c = _mapper.Map<Chat>(new ChatDto()
                {
                    UserId = u.Id,
                    DateOfChat = DateTime.Now,
                    StartedAt = DateTime.Now
                });
                if (await _chatRepo.SaveChat(c) == null)
                {
                    return new ChatDto()
                    {
                        ErrorMsg = "Error in creating a chat"
                    };
                }
                else {
                    return _mapper.Map<ChatDto>(c);
                }
                
            }
            catch (Exception e){
                return new ChatDto()
                {
                    ErrorMsg = e.Message
                };
            }
            
        }
        
    }
}

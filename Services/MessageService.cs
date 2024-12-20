using Authentication.Data.Repositories;
using Authentication.DTOs;
using Authentication.Models;
using AutoMapper;

namespace Authentication.Services
{
    public class MessageService
    {
        private MessageRepository _messageRepo;
        private ChatRepository _chatRepo;
        readonly IMapper mapper;
        public MessageService(MessageRepository messageRepo, ChatRepository chatRepository) {
            _messageRepo = messageRepo;
            _chatRepo = chatRepository;
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<MessageDto, Message>();
                cfg.CreateMap<ChatDto, Chat>();
                cfg.CreateMap<Message, MessageDto>();
                cfg.CreateMap<Chat, ChatDto>();
            });
            mapper = configuration.CreateMapper();
        }
        public async Task<MessageDto> GenerateAnswer(MessageDto msg)
        {
            try
            {
                Message message = mapper.Map<Message>(msg);
                Chat? chat = await _chatRepo.GetChat(message.ChatId);
                if (chat == null) {
                    return new MessageDto { ErrorMsg = "Message belongs to no Chat" };
                }
                else
                {
                    // flask api call { }
                    
                    Message answer = new Message()
                    {
                        ChatId = chat.Id,
                        Content = "Response from the model",
                        SenderType = "Bot",
                        MessageType = "Answer",
                        SentAt = DateTime.Now,
                    };

                    if(await _messageRepo.SaveMessage(answer) == null)
                    {
                        return new MessageDto { ErrorMsg = "Error in saving the message" };
                    }
                    chat.Messages.Add(answer);
                    if(await _chatRepo.UpdateChat(chat) == null)
                    {
                        return new MessageDto { ErrorMsg = "Error in adding message to chat" };
                    }
                    return mapper.Map<MessageDto>(answer);
                }
            }
            catch (Exception ex) {
                return new MessageDto { ErrorMsg = ex.Message };
            }
        }
    }
}

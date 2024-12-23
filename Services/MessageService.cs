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
        private readonly IMapper _mapper;
        public MessageService(MessageRepository messageRepo, ChatRepository chatRepository)
        {
            _messageRepo = messageRepo;
            _chatRepo = chatRepository;
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<MessageDto, Message>();
                cfg.CreateMap<ChatDto, Chat>();
                cfg.CreateMap<Message, MessageDto>();
                cfg.CreateMap<Chat, ChatDto>();
            });
            _mapper = configuration.CreateMapper();
        }
        public async Task<MessageDto> GenerateAnswer(MessageDto msg)
        {
            try
            {
                Message message = _mapper.Map<Message>(msg);
                Chat? chat = await _chatRepo.GetChat(message.ChatId);
                if (chat == null)
                {
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

                    if (await _messageRepo.SaveMessage(answer) == null)
                    {
                        return new MessageDto { ErrorMsg = "Error in saving the message" };
                    }
                    chat.Messages.Add(answer);
                    if (await _chatRepo.UpdateChat(chat) == null)
                    {
                        return new MessageDto { ErrorMsg = "Error in adding message to chat" };
                    }
                    return _mapper.Map<MessageDto>(answer);
                }
            }
            catch (Exception ex)
            {
                return new MessageDto { ErrorMsg = ex.Message };
            }
        }

        public async Task<List<MessageDto>> DeleteMessagesWithChatId(int id)
        {
            try
            {
                List<Message>? msgs = await _messageRepo.GetMessageByChatId(id);
                if (msgs == null || msgs.Count == 0)
                {
                    return [new MessageDto() {
                        ErrorMsg = "Error in fetching messages of the given chat id"
                    }];
                }
                else
                {
                    if (await _messageRepo.DeleteMessages(msgs) == null)
                    {
                        return [new MessageDto() {
                            ErrorMsg = "Error in Deleting the Messages acc to chat id"
                        }];
                    }
                    else
                    {
                        List<MessageDto> l = [];
                        foreach (var msg in msgs)
                        {
                            l.Add(_mapper.Map<MessageDto>(msg));
                        }
                        return l;
                    }
                }
            }
            catch (Exception ex)
            {
                return

                    [new MessageDto()
                    {
                        ErrorMsg = ex.Message
                    }];

            }
        }

        public async Task<MessageDto> GetMessageById(int id)
        {
            try
            {
                Message? m = await _messageRepo.GetMessage(id);
                if (m == null)
                {
                    return new MessageDto { ErrorMsg = "Error in fectching the message" };
                }
                else
                {
                    return _mapper.Map<MessageDto>(m);
                }
            }
            catch (Exception e)
            {
                return new MessageDto { ErrorMsg = e.Message };
            }
        }
        public async Task<MessageDto> DeleteMessageById(int id)
        {
            try
            {
                if (await _messageRepo.DeleteMessage(id) == 0)
                {
                    return new MessageDto()
                    {
                        ErrorMsg = "Error in Deleting the message"
                    };
                }
                else
                {
                    return new MessageDto();
                }
            }
            catch (Exception e)
            {
                return new MessageDto()
                {
                    ErrorMsg = e.Message
                };
            }
        }
    }
}

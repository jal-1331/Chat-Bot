using Authentication.Data.Repositories;
using Authentication.DTOs;
using Authentication.Models;
using AutoMapper;
using System;
using System.Text.Json;

namespace Authentication.Services
{
    public class MessageService
    {
        private MessageRepository _messageRepo;
        private ChatRepository _chatRepo;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly ILogger<MessageService> _logger;
        //private readonly ChatService _chatService;
        public MessageService(MessageRepository messageRepo, ChatRepository chatRepository, HttpClient httpClient, ILogger<MessageService> logger)
        {
            _messageRepo = messageRepo;
            _chatRepo = chatRepository;
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<MessageDto, Message>();
                cfg.CreateMap<ChatDto, Chat>();
                cfg.CreateMap<Message, MessageDto>();
                cfg.CreateMap<Chat, ChatDto>();
                cfg.CreateMap<IntentDto, Intent>();
                cfg.CreateMap<Intent, IntentDto>();
                cfg.CreateMap<ParametersDto, Parameters>();
                cfg.CreateMap<Parameters, ParametersDto>();
            });
            _mapper = configuration.CreateMapper();
            _httpClient = httpClient;
            _logger = logger;
            //_chatService = chatService;
        }
        public async Task<MessageDto> GenerateAnswer(MessageDto msg, int i)
        {
            if (i == 3)
            {
                return new MessageDto() { ErrorMsg = "Error even after 3 time api calling" };
            }
            try
            {
                Message question = _mapper.Map<Message>(msg);
                Chat? chat = await _chatRepo.GetChat(question.ChatId);
                if (chat == null)
                {
                    return new MessageDto { ErrorMsg = "Message belongs to no Chat" };
                }
                else
                {
                    var jsonContent = new StringContent(
                        JsonSerializer.Serialize<GenerateAnswerDto>(new GenerateAnswerDto() { question = question.Content , conversations = msg.conversations}),
                        System.Text.Encoding.UTF8,
                        "application/json");
                    //_logger.LogInformation("{}", await jsonContent.ReadAsStringAsync());
                    //var res = await _httpClient.PostAsync("http://127.0.0.1:5000/askLlama", jsonContent);
                    var res = await _httpClient.PostAsync("http://127.0.0.1:5000/askLlama2", jsonContent);
                    //_logger.LogInformation("{}", res);
                    //Console.WriteLine("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
                    var data = JsonSerializer.Deserialize<GenerateAnswerDto>(await res.Content.ReadAsStringAsync());
                    //Console.WriteLine(data.intents[0].Parameters);
                    List<Intent> intents = [];
                    foreach (var item in data!.intents)
                    {
                        intents.Add(_mapper.Map<Intent>(item));
                    }

                    Message answer = new()
                    {
                        ChatId = chat.Id,
                        Content = data!.response ?? "Answer is not written in the response",
                        MessageType="Answer",
                        //Content = data,
                        SenderType = "Bot",
                        //Intents = intents,
                        SentAt = DateTime.Now,
                    };

                    if (await _messageRepo.SaveMessage(question) == null || await _messageRepo.SaveMessage(answer) == null)
                    {
                        return new MessageDto { ErrorMsg = "Error in saving the message" };
                    }
                    //if (data?.Intents != null)
                    //{
                    //    foreach (var intent in data.Intents)
                    //    {
                    //        var intentDto = new IntentDto
                    //        {
                    //            Type = intent.Type
                    //        };

                    //        // Add parameters to the intent
                    //        if (intent.Parameters != null)
                    //        {
                    //            var parametersDto = new ParametersDto
                    //            {
                    //                TicketTitle = intent.Parameters.TicketTitle,
                    //                TicketDescription = intent.Parameters.TicketDescription,
                    //                Email = intent.Parameters.Email,
                    //                Otp = intent.Parameters.Otp,
                    //                Name = intent.Parameters.Name,
                    //                TicketId = intent.Parameters.TicketId
                    //            };

                    //            intentDto.Parameters = parametersDto;
                    //        }

                    //        // Save the intent with parameters
                    //        await _messageRepo.SaveIntent(intentDto);
                    //    }
                    //}
                    //chat.Messages.Add(answer);
                    //if (await _chatRepo.UpdateChat(chat) == null)
                    //{
                    //    return new MessageDto { ErrorMsg = "Error in adding message to chat" };
                    //}
                    answer.Intents = intents;
                    Console.WriteLine(answer.Content, answer.Intents);
                    return _mapper.Map<MessageDto>(answer);
                }
            }
            catch (Exception ex)
            {
                await GenerateAnswer(msg, i+1);
                return new MessageDto { ErrorMsg = ex.Message };
            }
        }

        public async Task<MessageDto> GenerateAnswerWithoutLogin(MessageDto messageDto)
        {
            try
            {
                Message question = _mapper.Map<Message>(messageDto);
                var jsonContent = new StringContent(
                        JsonSerializer.Serialize<GenerateAnswerDto>(new GenerateAnswerDto() { question = question.Content }),
                        System.Text.Encoding.UTF8,
                        "application/json");
                //_logger.LogInformation("{}", await jsonContent.ReadAsStringAsync());
                var res = await _httpClient.PostAsync("http://127.0.0.1:5000/askLlama2", jsonContent);
                var data = JsonSerializer.Deserialize<GenerateAnswerDto>(await res.Content.ReadAsStringAsync());

                List<Intent> intents = [];
                foreach (var item in data!.intents)
                {
                    intents.Add(_mapper.Map<Intent>(item));
                }

                Message answer = new()
                {
                    //ChatId = chat.Id,
                    Content = data!.response ?? "Answer is not written in the response",
                    MessageType = "Answer",
                    //Content = data,
                    SenderType = "Bot",
                    //Intents = intents,
                    SentAt = DateTime.Now,
                };
                answer.Intents = intents;
                return _mapper.Map<MessageDto>(answer);

            }
            catch (Exception ex) {
                return new MessageDto()
                {
                    ErrorMsg = ex.Message
                };
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
                MessageDto m = await GetMessageById(id);
                if (await _messageRepo.DeleteMessage(id) == 0)
                {
                    return new MessageDto()
                    {
                        ErrorMsg = "Error in Deleting the message: "
                    };
                }
                else
                {
                    //also have to remove the message from all the chat it was present
                    int x = await DeleteMessageFromChat(m);
                    if (x!=0)
                    {
                        return new MessageDto()
                        {
                            ErrorMsg = "Error in delete the message from the chats: "+x
                        };
                    }
                    else
                    {
                        return new MessageDto();
                    }
                    
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

        public async Task<int> DeleteMessageFromChat(MessageDto msg)
        {
            Message m = _mapper.Map<Message>(msg);
            Chat? c = await _chatRepo.GetChat(m.ChatId);
            if (c == null)
            {
                return 0;
            }
            else
            {
                if (!c.Messages.Remove(m))
                {
                    return 0;
                }
                else
                {
                    if (await _chatRepo.UpdateChat(c) == null)
                    {
                        return 1;
                    }
                    else
                    {
                        return 2;
                    }
                }

            }
        }
    }
}

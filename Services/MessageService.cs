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
            });
            _mapper = configuration.CreateMapper();
            _httpClient = httpClient;
            _logger = logger;
            //_chatService = chatService;
        }
        public async Task<MessageDto> GenerateAnswer(MessageDto msg)
        {
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
                    // flask api call { }

                    //var jsonContent = new StringContent(
                    //    JsonSerializer.Serialize<GenerateAnswerDto>(new GenerateAnswerDto() { question= question.Content, context= @"Renewable energy refers to energy derived from natural resources that are replenished constantly. 
                    //    Unlike fossil fuels, renewable energy sources like solar, wind, hydro, and geothermal energy produce little to no greenhouse gas emissions, 
                    //    making them environmentally friendly and sustainable. Solar energy is harnessed from the sun using photovoltaic cells or solar panels. 
                    //    Wind energy, captured through wind turbines, is another clean source of power that has seen widespread adoption in recent years. 
                    //    Hydropower utilizes flowing water to generate electricity, often through dams or natural water sources. 
                    //    Geothermal energy taps into the heat from within the Earth's crust, providing a reliable source of clean energy.

                    //    One of the key advantages of renewable energy is its ability to reduce dependence on non-renewable energy sources like coal, oil, and gas. 
                    //    This shift not only mitigates environmental degradation but also enhances energy security for nations. Additionally, the deployment of renewable energy technologies creates job opportunities and stimulates economic growth. 
                    //    For instance, the installation and maintenance of wind turbines and solar panels require a skilled workforce, contributing to job creation in local communities.

                    //    However, renewable energy also faces challenges, such as high initial investment costs and intermittency issues. 
                    //    For example, solar panels generate power only during daylight hours, and wind turbines rely on the availability of wind. 
                    //    Despite these challenges, technological advancements and government incentives are driving the adoption of renewables, making them an integral part of a sustainable energy future." }),
                    //    System.Text.Encoding.UTF8,
                    //    "application/json");

                    //var res = await _httpClient.PostAsync("http://127.0.0.1:5000/ask", jsonContent);
                    //var data = JsonSerializer.Deserialize<GenerateAnswerDto>(await res.Content.ReadAsStringAsync());
                    //var data = await res.Content.ReadAsStringAsync();

                    var jsonContent = new StringContent(
                        JsonSerializer.Serialize<GenerateAnswerDto>(new GenerateAnswerDto() { question = question.Content }),
                        System.Text.Encoding.UTF8,
                        "application/json");
                    _logger.LogInformation("{}", await jsonContent.ReadAsStringAsync());
                    var res = await _httpClient.PostAsync("http://127.0.0.1:5000/askLlama", jsonContent);
                    var data = JsonSerializer.Deserialize<GenerateAnswerDto>(await res.Content.ReadAsStringAsync());

                    Message answer = new()
                    {
                        ChatId = chat.Id,
                        Content = data!.answer ?? "Answer is not written in the response",
                        //Content = data,
                        SenderType = "Bot",
                        MessageType = "Answer",
                        SentAt = DateTime.Now,
                    };

                    if (await _messageRepo.SaveMessage(question) == null || await _messageRepo.SaveMessage(answer) == null)
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
                var res = await _httpClient.PostAsync("http://127.0.0.1:5000/askLlama", jsonContent);
                var data = JsonSerializer.Deserialize<GenerateAnswerDto>(await res.Content.ReadAsStringAsync());

                MessageDto answer = new()
                {
                    //ChatId = chat.,
                    Content = data!.answer ?? "Answer is not written in the response",
                    //Content = data,
                    SenderType = "Bot",
                    MessageType = "Answer",
                    SentAt = DateTime.Now,
                };
                return answer;

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

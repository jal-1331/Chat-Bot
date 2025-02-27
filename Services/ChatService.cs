﻿using Authentication.Data.Repositories;
using Authentication.DTOs;
using Authentication.Models;
using AutoMapper;
using Microsoft.Identity.Client;
using System;

namespace Authentication.Services
{
    public class ChatService
    {
        private readonly ChatRepository _chatRepo;
        private readonly UserRepository _userRepo;
        private readonly MessageService _messageService;
        //private readonly UserRepository _userRepository;
        private readonly IMapper _mapper;
        public ChatService(ChatRepository chatRepo, UserRepository userRepo, MessageService messageService)
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
            _messageService = messageService;
        }

        public async Task<ChatDto> NewChat(string email)
        {
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
                else
                {
                    return _mapper.Map<ChatDto>(c);
                }

            }
            catch (Exception e)
            {
                return new ChatDto()
                {
                    ErrorMsg = e.Message
                };
            }

        }

        public async Task<ChatDto> GetChatByIdWithAnswers(int id)
        {
            try
            {
                Chat? c = await _chatRepo.GetChat(id);
                
                if (c == null)
                {
                    return new ChatDto()
                    {
                        ErrorMsg = "Error in Fetching the Chat"
                    };
                }
                else
                {
                    c.StartedAt = DateTime.Now;
                    //DeleteChatsWithNoMessages();
                    return _mapper.Map<ChatDto>(c);
                }
            }
            catch (Exception e)
            {
                return new ChatDto()
                {
                    ErrorMsg = e.Message
                };
            }

        }

        public async Task<List<ChatDto>> GetChatsByUserId(string email)
        {
            try
            {
                User u = await _userRepo.GetByEmailAsync(email);
                List<Chat>? l = await _chatRepo.GetByChatsUserId(u.Id);
                if(l == null)
                {
                    return [new ChatDto(){ 
                        ErrorMsg = "Error in retirving the chats acc to userid"
                    }];
                }
                else
                {
                    
                    l = await DeleteChatsWithNoMessages(l);
                    List<ChatDto> chatDtos = [];
                    foreach (var chat in l)
                    {
                        chatDtos.Add(_mapper.Map<ChatDto>(chat));
                    }
                    return chatDtos;
                }

            }
            catch (Exception e) {
                return [new ChatDto(){
                        ErrorMsg = e.Message
                    }];
            }
        }

        public async Task<ChatDto> ClearChat(int id)
        {
            try
            {
                Chat? c = await _chatRepo.GetChat(id);
                //c.StartedAt = DateTime.Now;
                if (c == null)
                {
                    return new ChatDto()
                    {
                        ErrorMsg = "Error in Fetching the Chat"
                    };
                }
                else
                {
                    c.Messages = [];
                    if(await _chatRepo.UpdateChat(c) == null)
                    {
                        return new ChatDto()
                        {
                            ErrorMsg = "Error in Updating the Chat"
                        };
                    }
                    else
                    {
                        await _messageService.DeleteMessagesWithChatId(id);
                        return _mapper.Map<ChatDto>(c);
                    }
                    
                }
            }
            catch (Exception e)
            {
                return new ChatDto();
            }
        }

        public async Task<List<Chat>> DeleteChatsWithNoMessages(List<Chat> chats)
        {
            //List<Chat> deleteChats = [];
            List<Chat> deleteChats = [], l = [];
            //List<ChatDto> l = [];
            foreach (var chat in chats)
            {
                if(chat.Messages!.Count == 0 && chat.DateOfChat.ToString()!.Split('T')[0] != DateTime.Now.ToString().Split('T')[0])
                {
                    deleteChats.Add(chat);
                    
                }
                else
                {
                    l.Add(chat);
                }
            }
            await _chatRepo.DeleteChats(deleteChats);
            //}
            return l;
        }
    }
}

//when chat->chatdto and chatdto->chat then the these two chat are consider different and these generates error of two instances of same primarykey - {Id} om same entity
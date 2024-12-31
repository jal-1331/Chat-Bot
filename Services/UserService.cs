using Authentication.Data.Repositories;
using Authentication.DTOs;
using Authentication.Models;

namespace Authentication.Services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;
        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto> GetUser(string email)
        {
            User u = await _userRepository.GetByEmailAsync(email);
            return new UserDto()
            {
                Id = u.Id,
                Email = u.Email,
            };
        }
    }
}

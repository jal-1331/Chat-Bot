using Authentication.Data.Repositories;
using Authentication.Models;
using Authentication.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace Authentication.Services

{
    public class AuthService
    {
        private readonly UserRepository _userRepository;
        private readonly string _jwtSecret;
        private readonly EmailService _emailService;

        
        public AuthService(UserRepository userRepository, string jwtSecret, EmailService emailService)
        {
            _userRepository = userRepository;
            _jwtSecret = jwtSecret;
            _emailService = emailService;
        }
        public async Task<string> SignUpAsync(SignUpDto model)
        {
            var existingUser = await _userRepository.GetByEmailAsync(model.Email);
            if (existingUser != null) {
                return "Email already exists.";
            }
            var passwordHasher = new PasswordHasher<User>();
            var user = new User
            {
                Email = model.Email,
                PasswordHash = passwordHasher.HashPassword(null, model.Password)
            };
            await _userRepository.AddUserAsync(user);
            return "User registered successfully.";
        }
        public async Task<string?> LoginAsync(LoginDto model)
        {
            var user = await _userRepository.GetByEmailAsync(model.Email);
            if (user == null) return null;

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(null, user.PasswordHash, model.Password);
            if (result == PasswordVerificationResult.Failed) return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Email, user.Email) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        static string Otp="";
        public async Task<string> SendOtpInEmail(string toEmail)
        {
            Otp = _emailService.GenerateOtp();
            await _emailService.SendEmailAsync(toEmail, "Your One-time Otp", $"Your One-Time Otp is:- {Otp}");
            return Otp;
        }
        public int ValidateOtp(string otp)
        {
            if(otp == Otp)
            {
                return 1;
            }
            else
            {
                return 0;
            }
            //return Otp;
        }
    }
}

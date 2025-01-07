using Authentication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Authentication.DTOs;
using System.Text.Json.Serialization;
using System.Text.Json;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("signup")]
        public async Task<IActionResult> signup([FromBody] SignUpDto model)
        {
            var result = await _authService.SignUpAsync(model);
            if (result == "Email already exists.") return BadRequest(result);
            return Ok(result);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var token = await _authService.LoginAsync(model);
            if (token == null) return Unauthorized("Invalid email or password.");
            return Ok(new { token });
        }
        [HttpGet]
        [Route("LoginViaOtp")]
        public async Task<string> LoginViaOtp(String toEmail)
        {
            string token = await _authService.SendOtpInEmail(toEmail);
            //string jsonString = JsonSerializer.Serialize(new { msg = $"Sent Otp to your email. Please provide it for Verification."});
            return token;
        }

        [HttpGet]
        [Authorize]
        [Route("VerifyOtp")]
        public async Task<int> VerifyOtp(string otp)
        {
            string ? token = await Request.HttpContext.GetTokenAsync("access_token");
            LoginDto l = GetJwtTokenData(token!);
            int i = _authService.ValidateOtp(otp, l.Email);
            return i;
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

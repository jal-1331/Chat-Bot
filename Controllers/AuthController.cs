using Authentication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Authentication.DTOs;
using System.Text.Json.Serialization;
using System.Text.Json;
using System;

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
            string otp = await _authService.SendOtpInEmail(toEmail);
            string jsonString = JsonSerializer.Serialize(new { msg = $"Sent Otp to your email. Please provide it for Verification."});
            return jsonString;
        }

        [HttpGet]
        [Route("VerifyOtp")]
        public int VerifyOtp(string otp)
        {
            int i = _authService.ValidateOtp(otp);
            return i;
        }
    }
}

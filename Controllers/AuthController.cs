using Authentication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Authentication.DTOs;

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

    }
}

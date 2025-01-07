using Authentication.DTOs;
using Authentication.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemoController : ControllerBase
    {
        private readonly DemoService _demoService;

        public DemoController(DemoService demoService)
        {
            _demoService = demoService;
        }

        [HttpPost("Book")]
        public async Task<IActionResult> BookDemo([FromBody] BookDemoDto demoDto)
        {
            if (demoDto == null || string.IsNullOrEmpty(demoDto.Name) ||
                string.IsNullOrEmpty(demoDto.Email))
            {
                return BadRequest(new { success = false, message = "Invalid input." });
            }

            var isBooked = await _demoService.BookDemoAsync(demoDto);
            if (isBooked)
            {
                return Ok(new { success = true, message = "Demo booked successfully!" });
            }

            return StatusCode(500, new { success = false, message = "Failed to book demo." });
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _demoService.GetAllBookingsAsync();
            return Ok(bookings);
        }
    }
}

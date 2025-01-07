using Authentication.Data.Repositories;
using Authentication.DTOs;
using Authentication.Models;

namespace Authentication.Services
{
    public class DemoService
    {
        private readonly DemoRepository _repository;

        public DemoService(DemoRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> BookDemoAsync(BookDemoDto demoDto)
        {
            var demoBooking = new DemoBooking
            {
                Name = demoDto.Name,
                Email = demoDto.Email,
                PreferredDateTime = demoDto.PreferredDateTime
            };

            return await _repository.BookDemoAsync(demoBooking);
        }

        public async Task<List<DemoBooking>> GetAllBookingsAsync()
        {
            return await _repository.GetAllBookingsAsync();
        }
    }

}

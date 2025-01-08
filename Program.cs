using Authentication.DTOs;
using Authentication.Data.Repositories;
using Authentication.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Authentication.Data;
using Microsoft.Extensions.Caching.Memory;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//builder.Services.AddLogging();

builder.Services.AddScoped<UserRepository>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<AuthService>(provider => new AuthService(provider.GetRequiredService<UserRepository>(), "Jhh7TTIiWyhjsKRHbpJPQcAWygYU620QaEnMEYBV-9M=", new EmailService(builder.Configuration), provider.GetService<IMemoryCache>()!));

builder.Services.AddScoped<MessageRepository>();
builder.Services.AddScoped<ChatRepository>();

builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<MessageService>();

builder.Services.AddScoped<TicketRepository>();
builder.Services.AddScoped<TicketService>();

builder.Services.AddScoped<DemoRepository>();
builder.Services.AddScoped<DemoService>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("Jhh7TTIiWyhjsKRHbpJPQcAWygYU620QaEnMEYBV-9M=")),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5500") // Frontend URL
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

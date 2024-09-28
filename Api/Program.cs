using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Backend;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Helpers;
using Backend.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

Log.Information("Starting web host - Consultorio Backend");
Log.Information("Environment: {Environment}", Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));

var builder = WebApplication.CreateBuilder(args);

try
{
    builder.Configuration
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", optional: true, reloadOnChange: true);

    builder.Services.AddLogging(loggingBuilder =>
    {
        loggingBuilder.ClearProviders();
        loggingBuilder.AddSerilog(dispose: true);
    });

    builder.Services.AddHttpContextAccessor();

    DBContext.Schema = "public";

    builder.Services.AddPooledDbContextFactory<DBContext>(
        dbContextOptions => dbContextOptions
            .UseSqlServer(builder.Configuration.GetConnectionString("Backend"))
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
    );

    builder.Services.AddDbContextPool<DBContext>(
        dbContextOptions => dbContextOptions
            .UseSqlServer(builder.Configuration.GetConnectionString("Backend"))
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
    );

    builder.Services.AddTransient<DBContext>();

    builder.Services.AddScoped<IEnvironmentService, EnvironmentService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IPatientService, PatientService>();
   
    builder.Services.AddScoped<IValidator<AuthInputDTO>, AuthInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthForgotInputDTO>, AuthForgotInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthTokenInputDTO>, AuthTokenInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthPasswordInputDTO>, AuthPasswordInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthUserInputDTO>, AuthUserInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<UserInputDTO>, UserInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<PatientInputDTO>, PatientInputDTO.Validate>();


    builder.Services
        .AddFluentValidationAutoValidation()
        .AddFluentValidationClientsideAdapters();

    builder.WebHost.UseKestrel();
    builder.WebHost.UseIISIntegration();
    builder.WebHost.UseIIS();

    builder.Services.AddCors(option =>
    {
        option.AddPolicy("allowedOrigin",
            builder => builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed((host) => true)
                .AllowCredentials()
        );
    });

    builder.Services.AddSignalR();

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI();

    app.UseCors("allowedOrigin");
    app.UseWebSockets();
    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Unhandled exception");
}
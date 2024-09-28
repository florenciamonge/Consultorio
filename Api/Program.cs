using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Backend;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Helpers;
using Backend.Services;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;


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
    
    //DbContext
    builder.Services.AddTransient<DBContext>();
    
    //Services
    builder.Services.AddScoped<IEnvironmentService, EnvironmentService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IPatientService, PatientService>();

    //Validators
    builder.Services.AddScoped<IValidator<AuthInputDTO>, AuthInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthForgotInputDTO>, AuthForgotInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthTokenInputDTO>, AuthTokenInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthPasswordInputDTO>, AuthPasswordInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<AuthUserInputDTO>, AuthUserInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<UserInputDTO>, UserInputDTO.Validate>();
    builder.Services.AddScoped<IValidator<PatientInputDTO>, PatientInputDTO.Validate>();
   
    //Helpers
    Auth.Configuration = builder.Configuration.GetSection("Auth");

    var secret = builder.Configuration.GetSection("Auth").GetSection("Key");
    var key = Encoding.ASCII.GetBytes(secret.Value!);
    builder.Services
        .AddHttpContextAccessor()
        .AddAuthorization()
        .AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

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
using Microsoft.AspNetCore.Mvc;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController()]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;

    private readonly IAuthService _service;

    private readonly IEnvironmentService _env;

    public AuthController(ILogger<AuthController> logger, IAuthService service, IEnvironmentService env)
    {
        _logger = logger;
        _service = service;
        _env = env;
    }

    [HttpPut("ValidateToken")]
    public async Task<Response<AuthOutputDTO>> ValidateToken(AuthTokenInputDTO e) => await _service.ValidateToken(e);

    [HttpPut("DefinePassword")]
    public async Task<Response<AuthOutputDTO>> DefinePassword(AuthPasswordInputDTO e) => await _service.DefinePassword(e);

    [HttpPut("ForgetPassword")]
    public async Task<Response<AuthOutputDTO>> ForgotPassword(AuthForgotInputDTO e) => await _service.ForgotPassword(e);

    [HttpPut("ChangePassword")]
    public async Task<Response<AuthOutputDTO>> ChangePassword(AuthPasswordInputDTO e) => await _service.ChangePassword(e);

    [HttpPost("Login")]
    public async Task<Response<AuthOutputDTO>> Login(AuthInputDTO e) => await _service.Login(e);

    [HttpPut("VerifyPassword")]
    public async Task<Response<TokenOutputDTO>> VerifyToken(string e) => await _service.VerifyToken(e);

    [HttpPut("Logout")]
    public async Task<Response<AuthOutputDTO>> Logout(string e) => await _service.Logout(e);
}
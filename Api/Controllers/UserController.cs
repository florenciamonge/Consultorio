using Microsoft.AspNetCore.Mvc;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.DTOs;

namespace Backend.Controllers;

[ApiController()]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;

    private readonly IUserService _service;

    private readonly IEnvironmentService _env;

    public UserController(ILogger<UserController> logger, IUserService service, IEnvironmentService env)
    {
        _logger = logger;
        _service = service;
        _env = env;
    }

    [HttpGet("get")]
    public Task<Response<UserOutputDTO>> UserGet(long id) => _service.UserGet(id);

    [HttpGet("all")]
    public async Task<Response<List<UserOutputDTO>>> UserAll() => await _service.UserAll();

    [HttpGet("list")]
    public async Task<Response<List<UserOutputDTO>>> UserList(int? opcion) => await _service.UserList(opcion);

    [HttpGet("filtering")]
    public async Task<Response<List<UserOutputDTO>>> UserFiltering(string search) => await _service.UserFiltering(search);

    [HttpGet("canbedeleted")]
    public Response<Dictionary<long, List<GenericOutputDTO>>> UserCanBeDeleted([FromQuery] long[] ids) => _service.UserCanBeDeleted(ids);

    [HttpPost("insert")]
    public async Task<Response<UserOutputDTO>> UserInsert(UserInputDTO e) => await _service.UserInsert(e);

    [HttpPut("update")]
    public async Task<Response<UserOutputDTO>> UserUpdate(UserInputDTO e) => await _service.UserUpdate(e);

    [HttpDelete("delete")]
    public async Task<Response<Dictionary<long, GenericOutputDTO>>> UserDelete(List<long> ids) => await _service.UserDelete(ids);

    [HttpDelete("reduce")]
    public async Task<Response<Dictionary<long, GenericOutputDTO>>> UserReduce() => await _service.UserReduce();
}
using Backend.DTOs;
using Backend.Helpers;

namespace Backend.Interfaces
{
    public interface IEnvironmentService
    {
        Task<Response<List<PropertyDTO>>> Properties();

        Task<Response<List<Dictionary<string, List<PropertyDTO>>>>> PropertiesForSelect();
    }
}

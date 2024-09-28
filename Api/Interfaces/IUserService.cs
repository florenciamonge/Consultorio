using Backend.DTOs;
using Backend.Helpers;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        Task<Response<UserOutputDTO>> UserGet(long id);

        Task<Response<List<UserOutputDTO>>> UserAll();

        Task<Response<List<UserOutputDTO>>> UserList(int? opcion);

        Task<Response<List<UserOutputDTO>>> UserFiltering(string search);

        Task<Response<UserOutputDTO>> UserInsert(UserInputDTO e);

        Task<Response<UserOutputDTO>> UserUpdate(UserInputDTO e);

        Task<Response<Dictionary<long, GenericOutputDTO>>> UserDelete(List<long> ids);

        Task<Response<Dictionary<long, GenericOutputDTO>>> UserReduce();

        Response<Dictionary<long, List<GenericOutputDTO>>> UserCanBeDeleted(long[] ids);
    }
}

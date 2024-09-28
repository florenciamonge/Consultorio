using Backend.DTOs;
using Backend.Helpers;

namespace Backend.Interfaces
{
    public interface IPatientService
    {
        Task<Response<PatientOutputDTO>> AccessoryGet(long id);

        Task<Response<List<PatientOutputDTO>>> AccessoryAll();

        Task<Response<List<PatientOutputDTO>>> AccessoryList();

        Task<Response<List<PatientOutputDTO>>> AccessoryFiltering(string search);

        Task<Response<PatientOutputDTO>> AccessoryInsert(PatientInputDTO e);

        Task<Response<PatientOutputDTO>> AccessoryUpdate(PatientInputDTO e);

        Task<Response<Dictionary<long, GenericOutputDTO>>> AccessoryDelete(List<long> ids);

        Task<Response<Dictionary<long, GenericOutputDTO>>> AccessoryReduce();

        Response<Dictionary<long, List<GenericOutputDTO>>> AccessoryCanBeDeleted(long[] ids);
    }
}

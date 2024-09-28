using Backend.DTOs;
using Backend.Helpers;

namespace Backend.Interfaces
{
    public interface IPatientService
    {
        Task<Response<PatientOutputDTO>> PatientGet(long id);

        Task<Response<List<PatientOutputDTO>>> PatientAll();

        Task<Response<List<PatientOutputDTO>>> PatientList();

        Task<Response<List<PatientOutputDTO>>> PatientFiltering(string search);

        Task<Response<PatientOutputDTO>> PatientInsert(PatientInputDTO e);

        Task<Response<PatientOutputDTO>> PatientUpdate(PatientInputDTO e);

        Task<Response<Dictionary<long, GenericOutputDTO>>> PatientDelete(List<long> ids);

        Task<Response<Dictionary<long, GenericOutputDTO>>> PatientReduce();

        Response<Dictionary<long, List<GenericOutputDTO>>> PatientCanBeDeleted(long[] ids);
    }
}

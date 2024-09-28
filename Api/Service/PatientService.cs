using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using static Backend.Helpers.Headers;
using static Backend.Helpers.Values;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System.Data.SqlTypes;

namespace Backend.Services
{
    public class PatientService : IPatientService
    {
        private readonly IHttpContextAccessor _accessor;
        private readonly IValidator<PatientInputDTO> _validator;
        private readonly EnvironmentService _env;
        private readonly DBContext _context;
        private readonly string _entity;
        private readonly WebInfo _webInfo;

        public PatientService(IHttpContextAccessor accessor, IValidator<PatientInputDTO> validator, DBContext context)
        {
            _context = context;
            _accessor = accessor;
            _validator = validator;
            _env = new EnvironmentService(_context, _accessor);
            _entity = nameof(Patient);
            _webInfo = GetWebInfo(_accessor);
        }

        public async Task<Response<PatientOutputDTO>> PatientGet(long id)
        {
            var response = new Response<PatientOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("id", id));

            try
            {
                var o = await _context.Patient
                    .Where(x => x.Id == id && x.Deleted == false)
                    .Select(r => new PatientOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,

                    }).FirstOrDefaultAsync();

                if (o == null)
                    response.FinishedWithError(ReturnMessages.NotFound(_entity, id));
                else
                    response.FinishedSuccessfully(o);
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<List<PatientOutputDTO>>> PatientAll()
        {
            var response = new Response<List<PatientOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name);

            try
            {
                response.FinishedSuccessfully(
                    await _context.Patient
                    .Where(x => x.Deleted == false)
                    .Select(r => new PatientOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,
                    }).ToListAsync());
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<List<PatientOutputDTO>>> PatientList()
        {
            var response = new Response<List<PatientOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name);

            try
            {
                response.FinishedSuccessfully(
                    await _context.Patient
                    .Where(x => x.Deleted == false)
                    .Select(r => new PatientOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,
                    }).ToListAsync());
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<List<PatientOutputDTO>>> PatientFiltering(string search)
        {
            var response = new Response<List<PatientOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("search", search));

            try
            {
                response.FinishedSuccessfully(
                    await _context.Patient
                    .Where(x => x.Deleted == false &&
                        (
                            x.Name.ToLower().Contains(search.ToLower())
                        ))
                    .Select(r => new PatientOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name
                    }).ToListAsync());
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<PatientOutputDTO>> PatientInsert(PatientInputDTO e)
        {
            var response = new Response<PatientOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("e", e));

            try
            {
                var result = _validator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                else
                {
                    using (var transaction = _context.Database.BeginTransactionAsync())
                    {
                        try
                        {   
                            if (Auth.ValidateToken(_webInfo.Token).Renovated == false){
                              response.FinishedWithError(InnerCode.C710ExpiredToken, ReturnMessages.ExpiredToken());
                              return response;  
                            }

                            var code = await _context.Patient.FirstOrDefaultAsync(x => x.DNI == e.DNI && x.Deleted == false);
                            if (code != null){
                                response.FinishedWithError(InnerCode.C131CodeDuplicate, ReturnMessages.AlreadyExists(_entity, "CODE"));
                                return response;
                            }

                            var r = new Patient(); r.FillInsertFromDTO(e);
                            r.CreatedUserID = _webInfo.UserID;

                            r.Stamp(e.Action!);

                            await _context.Patient.AddAsync(r);

                            await _context.SaveChangesAsync();

                            await transaction.Result.CommitAsync();

                            var o = new PatientOutputDTO(); o.FillFromEntity(r);
                            o.Id = r.Id;

                            response.InnerMessage = ReturnMessages.Success(_entity, r.Id, ReturnMessages.Insert);
                            response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                            response.FinishedSuccessfully(o, transaction.Result.TransactionId.ToString());
                        }
                        catch (Exception ex)
                        {
                            await transaction.Result.RollbackAsync();
                            response.FinishedWithError(ex, transaction.Result.TransactionId.ToString());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public async Task<Response<PatientOutputDTO>> PatientUpdate(PatientInputDTO e)
        {
            var response = new Response<PatientOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("e", e));

            try
            {
                var result = _validator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var r = _context.Exists<Patient>(e.Id);

                if (r == null)
                    response.FinishedWithError(ReturnMessages.NotFound(_entity, e.Id));
                else
                {
                    using (var transaction = _context.Database.BeginTransactionAsync())
                    {
                        try
                        {   
                            if (Auth.ValidateToken(_webInfo.Token).Renovated == false){
                              response.FinishedWithError(InnerCode.C710ExpiredToken, ReturnMessages.ExpiredToken());
                              return response;  
                            }
                            r.FillUpdateFromDTO(e);
                            r.UpdatedUserID = _webInfo.UserID;
                            r.Stamp(e.Action!);

                            _context.Update(r);

                            if (e.ToUpdate != null && e.ToUpdate.Count > 0)
                            {
                                if (e.ToUpdate.Contains("Name")) {r.Name = e.Name;}
                                if (e.ToUpdate.Contains("DNI")){
                                   var dniExists  = await _context.Patient.AnyAsync(x => x.Id != e.Id && x.DNI == e.DNI && x.DNI != null);
                                    if (dniExists){
                                        response.FinishedWithError(InnerCode.C131CodeDuplicate, ReturnMessages.AlreadyExists(_entity, "CODE"));
                                        return response;
                                    }
                                    else{r.DNI = e.DNI;} 
                                }    
                            }

                            await _context.SaveChangesAsync();

                            var o = new PatientOutputDTO(); o.FillFromEntity(r);
                            o.Id = r.Id;

                            await transaction.Result.CommitAsync();

                            response.InnerMessage = ReturnMessages.Success(_entity, o.Id, ReturnMessages.Update);
                            response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                            response.FinishedSuccessfully(o, transaction.Result.TransactionId.ToString());
                        }
                        catch (Exception ex)
                        {
                            await transaction.Result.RollbackAsync();
                            response.FinishedWithError(ex, transaction.Result.TransactionId.ToString());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public async Task<Response<Dictionary<long, GenericOutputDTO>>> PatientDelete(List<long> ids)
        {
            var response = new Response<Dictionary<long, GenericOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("ids", ids));

            var output = new Dictionary<long, GenericOutputDTO>();

            try
            {
                if (Auth.ValidateToken(_webInfo.Token).Renovated == false){
                    response.FinishedWithError(InnerCode.C710ExpiredToken, ReturnMessages.ExpiredToken());
                    return response;  
                }
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        ids.ForEach(id =>
                        {
                            var r = _context.Exists<Patient>(id);

                            if (r == null)
                            {
                                output.Add(id, new GenericOutputDTO
                                {
                                    InnerCode = InnerCode.C620SelectByPKNotFound,
                                    InnerMessage = ReturnMessages.NotFound(_entity, id),
                                    Succeeded = false
                                });
                            }
                            else
                            {
                                r.Stamp(Values.Action.Delete);
                                r.UpdatedUserID = _webInfo.UserID;
                                _context.SoftDelete(r);

                                output.Add(id, new GenericOutputDTO
                                {
                                    InnerCode = InnerCode.C000,
                                    InnerMessage = ReturnMessages.Success(_entity, id, ReturnMessages.Delete),
                                    Succeeded = true
                                });
                            }
                        });

                        await _context.SaveChangesAsync();
                        transaction.Commit();

                        response.InnerMessage = ReturnMessages.Success(_entity, ids);
                        response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                        response.FinishedSuccessfully(output, transaction.TransactionId.ToString());
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        response.FinishedWithError(ex, transaction.TransactionId.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public async Task<Response<Dictionary<long, GenericOutputDTO>>> PatientReduce()
        {
            var response = new Response<Dictionary<long, GenericOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name);

            var output = new Dictionary<long, GenericOutputDTO>();

            try
            {
                if (Auth.ValidateToken(_webInfo.Token).Renovated == false){
                    response.FinishedWithError(InnerCode.C710ExpiredToken, ReturnMessages.ExpiredToken());
                    return response;  
                }
                var ids = _context.Patient.Where(x => x.Deleted == true).ToListAsync();

                if (ids.Result.Count > 0)
                {
                    using (var transaction = _context.Database.BeginTransaction())
                    {
                        try
                        {
                            _context.RemoveRange(ids.Result);
                            
                            await _context.SaveChangesAsync();
                            transaction.Commit();

                            response.InnerMessage = ReturnMessages.Success(_entity, ids.Result.Select(x => x.Id).ToList());
                            response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                            response.FinishedSuccessfully(output, transaction.TransactionId.ToString());
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            response.FinishedWithError(ex, transaction.TransactionId.ToString());
                        }
                    }
                }
                else
                {
                    response.InnerMessage = ReturnMessages.ReduceNothingToDo(_entity);
                    response.FinishedSuccessfully(output);
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public Response<Dictionary<long, List<GenericOutputDTO>>> PatientCanBeDeleted(long[] ids)
        {
            var response = new Response<Dictionary<long, List<GenericOutputDTO>>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("ids", ids));

            var output = new Dictionary<long, List<GenericOutputDTO>>();

            try
            {
                if (Auth.ValidateToken(_webInfo.Token).Renovated == false){
                    response.FinishedWithError(InnerCode.C710ExpiredToken, ReturnMessages.ExpiredToken());
                    return response;  
                }
                ids.ToList<long>().ForEach(id =>
                {
                    output.Add(id, new List<GenericOutputDTO>());

                    var r = _context.Exists<Patient>(id);

                    if (r == null)
                    {
                        output[id].Add(new GenericOutputDTO
                        {
                            InnerCode = InnerCode.C620SelectByPKNotFound,
                            InnerMessage = ReturnMessages.NotFound(_entity, id),
                            Succeeded = false
                        });
                    }         
                });

                response.InnerMessage = ReturnMessages.Success(_entity, ids.ToList<long>());
                response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                response.FinishedSuccessfully(output);
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }
    }
}
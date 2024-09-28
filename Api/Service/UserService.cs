using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using static Backend.Helpers.Headers;
using static Backend.Helpers.Values;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _accessor;
        private readonly IValidator<UserInputDTO> _validator;
        private readonly EnvironmentService _env;
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;
        private readonly string _entity;
        private readonly WebInfo _webInfo;

        public UserService(IHttpContextAccessor accessor, IValidator<UserInputDTO> validator, DBContext context, IConfiguration configuration)
        {
            _context = context;
            _accessor = accessor;
            _validator = validator;
            _env = new EnvironmentService(_context, _accessor);
            _entity = nameof(User);
            _webInfo = GetWebInfo(_accessor);
            _configuration = configuration;
        }

        public async Task<Response<UserOutputDTO>> UserGet(long id)
        {
            var response = new Response<UserOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("id", id));

            try
            {
                var o = await _context.User
                    .Where(x => x.Id == id && x.Deleted == false)
                    .Select(r => new UserOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Surname = r.Surname,
                        Username = r.Username,
                        Email = r.Email!,
                        StatusId = (long)r.Status!.ValueInt!,
                        StatusText = r.Status!.TextES,
                        Administrative = r.Administrative,
                        Doctor= r.Doctor,
                     
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

        public async Task<Response<List<UserOutputDTO>>> UserAll()
        {
            var response = new Response<List<UserOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name);

            try
            {
                response.FinishedSuccessfully(
                    await _context.User
                    .Include(r => r.Status)
                    .Where(x => x.Deleted == false)
                    .Select(r => new UserOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Surname = r.Surname,
                        Username = r.Username,
                        Email = r.Email!,
                        StatusId = (long)r.Status!.ValueInt!,
                        StatusText = r.Status!.TextES,
                        Administrative = r.Administrative,
                        Doctor= r.Doctor,
                    }).ToListAsync());
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<List<UserOutputDTO>>> UserList(int? opcion)
        {
            var response = new Response<List<UserOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name);

            try
            {
                if (opcion != null)
                {
                   switch (opcion)
                    {
                        case 1:
                            response.FinishedSuccessfully(
                            await _context.User
                           .Where(x => x.Deleted == false && x.Doctor == true)
                           .Select(r => new UserOutputDTO
                           {
                              Id = r.Id,
                              Name = r.Name,
                              Surname = r.Surname,
                              Username = r.Username,
                              Administrative = r.Administrative,
                              Doctor = r.Doctor
                            }).ToListAsync()); 
                            break;
                        case 2:
                            response.FinishedSuccessfully(
                            await _context.User
                           .Where(x => x.Deleted == false && x.Administrative == true)
                           .Select(r => new UserOutputDTO
                           {
                              Id = r.Id,
                              Name = r.Name,
                              Surname = r.Surname,
                              Username = r.Username,
                              Administrative = r.Administrative,
                              Doctor = r.Doctor
                            }).ToListAsync()); 
                            break;
                        default:
                            response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.NotFound(_entity, opcion.ToString()!));
                            break;
                    }
                    
                }
                else{
                   response.FinishedSuccessfully(
                    await _context.User
                    .Where(x => x.Deleted == false)
                    .Select(r => new UserOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Surname = r.Surname,
                        Username = r.Username,
                        Administrative = r.Administrative,
                        Doctor = r.Doctor
                    }).ToListAsync()); 
                }
               
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<List<UserOutputDTO>>> UserFiltering(string search)
        {
            var response = new Response<List<UserOutputDTO>>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("search", search));

            try
            {
                response.FinishedSuccessfully(
                    await _context.User
                    .Include(r => r.Status)
                    .Where(x =>
                        x.Deleted == false &&
                        (
                            x.Name.Contains(search) ||
                            x.Surname.Contains(search) ||
                            x.Username.Contains(search) ||
                            x.Email!.Contains(search)
                        ))
                    .Include(x => x.Status)
                    .Select(r => new UserOutputDTO
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Surname = r.Surname,
                        Username = r.Username,
                        Administrative = r.Administrative,
                        Doctor = r.Doctor,
                        Email = r.Email!,
                        StatusId = (int)r.Status!.ValueInt!,
                        StatusText = r.Status!.TextES,
                    }).ToListAsync());
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<UserOutputDTO>> UserInsert(UserInputDTO e)
        {
            var response = new Response<UserOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("e", e));

            try
            {
                var result = _validator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                    string passwordStrength = _env.IsStrongPassword(e.Password!, _configuration);

                    switch (passwordStrength)
                    {
                        case "LENGTH_ERROR":
                        response.FinishedWithError(InnerCode.C151ShortPassword,ReturnMessages.ShortPassword());
                        return response;

                        case "CHARACTER_ERROR":
                        response.FinishedWithError(InnerCode.C155NoCharacterPassword,ReturnMessages.NoCharacterPassword());
                        return response;

                        case "UPPERCASE_ERROR":
                        response.FinishedWithError(InnerCode.C153NoUppercasePassword,ReturnMessages.NoUppercasePassword());
                        return response;

                        case "LOWERCASE_ERROR":
                        response.FinishedWithError(InnerCode.C152NoLowercasePassword,ReturnMessages.NoLowercasePassword());
                        return response;

                        case "LETTERS_OR_NUMBERS_ERROR":
                        response.FinishedWithError(InnerCode.C154NoLettersOrNumbersPassword,ReturnMessages.NoLettersOrNumbersPassword());
                        return response;

                    }

                var username = await _context.User.FirstOrDefaultAsync(x => x.Username == e.Username && x.Username != string.Empty && x.Deleted == false);
                var email = await _context.User.FirstOrDefaultAsync(x => x.Email == e.Email && x.Email != null && x.Deleted == false);

                if (username!= null)
                    response.FinishedWithError(InnerCode.C110UsernameDuplicate, ReturnMessages.AlreadyExists(_entity, "USERNAME"));
                else if (email!= null)
                    response.FinishedWithError(InnerCode.C120EmailDuplicate, ReturnMessages.AlreadyExists(_entity, "EMAIL"));
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
                            var r = new User(); r.FillInsertFromDTO(e);

                             if (!string.IsNullOrEmpty(e.Password))
                            {
                                r.StatusId = _env.GetPropertyByValue("userStatus", Values.UserStatus.Active.GetHashCode());
                                r.Password = Auth.HashPassword(e.Password);
                            }
                            
                            r.Stamp(e.Action!);
                            r.CreatedUserID = _webInfo.UserID;
                            await _context.User.AddAsync(r);
                            await _context.SaveChangesAsync();
                           

                            var token = Auth.CreateToken(r);
                            var tokenOutputDTO = Auth.ValidateToken(token);

                            if (tokenOutputDTO.ValidTo != DateTime.MinValue)
                            {   
                                Token t;
                                t = new Token(token, r.Id, TokenType.Session);       
                                await _context.AddAsync(t);
                                await _context.SaveChangesAsync();

                                tokenOutputDTO.FillFromEntity(t);

                                var o = new UserOutputDTO(); o.FillFromEntity(r);
                                o.TokenOutputDTO = tokenOutputDTO;
                                
                                await transaction.Result.CommitAsync();
                                o.Id = r.Id;
                                response.InnerMessage = ReturnMessages.Success(_entity, r.Id, ReturnMessages.Insert);
                                response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                                response.FinishedSuccessfully(o, transaction.Result.TransactionId.ToString());
                                
                            }
                            else{
                                await transaction.Result.RollbackAsync();
                                response.FinishedWithError($"Token validation failed for user {e.Username}");
                            }
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
        
        public async Task<Response<UserOutputDTO>> UserUpdate(UserInputDTO e)
        {
            var response = new Response<UserOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("e", e));

            try
            {
                var result = _validator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var r =  await _context.User.Where(x => x.Id == e.Id).FirstOrDefaultAsync();

                if (r == null)
                {response.FinishedWithError(ReturnMessages.NotFound(_entity, e.Id));}
                
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
                            r.Stamp(e.Action!);
                            r.UpdatedUserID = _webInfo.UserID;
                            _context.Update(r);

                            if (e.ToUpdate != null && e.ToUpdate.Count > 0)
                            {
                                if (e.ToUpdate.Contains("Name")) {r.Name = e.Name;}
                                if (e.ToUpdate.Contains("Surname")){ r.Surname = e.Surname;}
                                if (e.ToUpdate.Contains("StatusId")){ r.StatusId =  _env.GetPropertyByValue("userStatus", e.StatusId);}
                                if (e.ToUpdate.Contains("Administrative")){ r.Administrative = e.Administrative;}
                                if (e.ToUpdate.Contains("Doctor")){ r.Doctor = e.Doctor;}   
                                if (e.ToUpdate!.Contains("Username")){
                                    var usernameExists = await _context.User.AnyAsync(x => x.Id != e.Id && x.Username == e.Username && x.Surname != string.Empty);
                                    if (usernameExists){
                                        response.FinishedWithError(InnerCode.C110UsernameDuplicate, ReturnMessages.AlreadyExists(_entity, "USERNAME"));
                                        return response;
                                    }
                                    else{r.Username = e.Username;}
                                    }
                                if (e.ToUpdate!.Contains("Email")){
                                    var emailExists  = await _context.User.AnyAsync(x => x.Id != e.Id && x.Email == e.Email && x.Email != null);
                                    if (emailExists){
                                        response.FinishedWithError(InnerCode.C120EmailDuplicate, ReturnMessages.AlreadyExists(_entity, "EMAIL"));
                                        return response;
                                    }
                                else{r.Email = e.Email;} 
                                }
                            }
                                           
                              await _context.SaveChangesAsync();

                              var o = new UserOutputDTO(); o.FillFromEntity(r);
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

        public async Task<Response<Dictionary<long, GenericOutputDTO>>> UserDelete(List<long> ids)
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
                using (var transaction = _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                        ids.ForEach(id =>
                        {
                            var r = _context.Exists<User>(id);

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
                        await transaction.Result.CommitAsync();

                        response.InnerMessage = ReturnMessages.Success(_entity, ids);
                        response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                        response.FinishedSuccessfully(output, transaction.Result.TransactionId.ToString());
                    }
                    catch (Exception ex)
                    {
                        await transaction.Result.RollbackAsync();
                        response.FinishedWithError(ex, transaction.Result.TransactionId.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public async Task<Response<Dictionary<long, GenericOutputDTO>>> UserReduce()
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
                var ids = _context.User.Where(x => x.Deleted == true).ToListAsync();

                if (ids.Result.Count > 0)
                {
                    using (var transaction = _context.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            ids.Result.Select(x => x.Id).ToList().ForEach(id =>
                            {
                                var tokens = _context.Token.Where(x => x.UserId == id).ToListAsync();

                                _context.Token.RemoveRange(tokens.Result);

                                output.Add(id, new GenericOutputDTO
                                {
                                    InnerCode = InnerCode.C000,
                                    InnerMessage = ReturnMessages.Success(_entity, id, ReturnMessages.Delete),
                                    Extra = ExtraMessages.Reduce("Token", "TokenId", tokens.Result.Select(x => x.Id).ToList()),
                                    Succeeded = true
                                });
                            });

                            _context.RemoveRange(ids.Result);

                            await _context.SaveChangesAsync();
                            await transaction.Result.CommitAsync();

                            response.InnerMessage = ReturnMessages.Success(_entity, ids.Result.Select(x => x.Id).ToList());
                            response.TokenOutputDTO = Auth.ValidateToken(_webInfo.Token);
                            response.FinishedSuccessfully(output, transaction.Result.TransactionId.ToString());
                        }
                        catch (Exception ex)
                        {
                            await transaction.Result.RollbackAsync();
                            response.FinishedWithError(ex, transaction.Result.TransactionId.ToString());
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

        public Response<Dictionary<long, List<GenericOutputDTO>>> UserCanBeDeleted(long[] ids)
        {
            throw new NotImplementedException();
        }
    }
}
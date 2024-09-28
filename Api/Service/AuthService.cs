using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;
using static Backend.Helpers.Values;
using static Backend.Helpers.Headers;
using System.Text.RegularExpressions;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly DBContext _context;
        private readonly IHttpContextAccessor _accessor;
        private readonly IValidator<AuthInputDTO> _authValidator;
        private readonly IValidator<AuthForgotInputDTO> _authForgotValidator;
        private readonly IValidator<AuthTokenInputDTO> _tokenValidator;
        private readonly IValidator<AuthPasswordInputDTO> _passwordValidator;
        private readonly IValidator<AuthUserInputDTO> _userValidator;
        private readonly EnvironmentService _env;
        private readonly IConfiguration _configuration;
        private readonly string _entity;
        private readonly WebInfo _webInfo;
        private readonly string _domain;

        public AuthService(DBContext context,
            IHttpContextAccessor accessor,
            IValidator<AuthInputDTO> authValidator,
            IValidator<AuthForgotInputDTO> authForgotValidator,
            IValidator<AuthTokenInputDTO> tokenValidator,
            IValidator<AuthPasswordInputDTO> passwordValidator,
            IValidator<AuthUserInputDTO> userValidator,
            IConfiguration configuration)
        {
            _context = context;
            _accessor = accessor;
            _authValidator = authValidator;
            _authForgotValidator = authForgotValidator;
            _tokenValidator = tokenValidator;
            _passwordValidator = passwordValidator;
            _userValidator = userValidator;
            _configuration = configuration;
            _env = new EnvironmentService(_context, _accessor);
            _entity = nameof(Auth);
            _webInfo = GetWebInfo(_accessor);
            _domain = _configuration.GetValue<string>("Domain")!;
        }

        public async Task<Response<AuthOutputDTO>> Me()
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name, new ResponseParams("id", _webInfo.UserID));

            try
            {
                var r = await _context.Token.FirstOrDefaultAsync(x => (x.Value == _webInfo.Token && x.Deleted == false));

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, _webInfo.Token));
                else
                {
                    var tokenOutputDTO = Auth.ValidateToken(_webInfo.Token);

                    if (r.Status == TokenStatus.Expired || r.Status == TokenStatus.Used)
                    {
                        response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, $"Status: {r.Status} - ValidTo: {tokenOutputDTO.ValidTo} - UpdatedAt: {r.UpdatedAt}"));
                    }
                    else
                    {
                        if (tokenOutputDTO.ValidTo > DateTime.UtcNow)
                        {
                            var o = await _context.User
                                .Where(x => x.Id == _webInfo.UserID && x.Deleted == false)
                                .Select(r => new AuthOutputDTO
                                {
                                    Id = r.Id,
                                    Name = r.Name,
                                    Surname = r.Surname,
                                    Username = r.Username,
                                    Email = r.Email!,
                                    StatusId = r.StatusId,
                                    StatusText = r.Status!.TextES,
                                    Administrative = r.Administrative,
                                    Doctor = r.Doctor,

                                }).FirstOrDefaultAsync();

                            if (o == null)
                                response.FinishedWithError(ReturnMessages.NotFound(_entity, _webInfo.UserID));
                            else
                            {
                                o.TokenOutputDTO = tokenOutputDTO;
                                response.FinishedSuccessfully(o);
                            }
                        }
                        else
                        {
                            r.Status = TokenStatus.Expired;
                            _context.Update(r);
                            await _context.SaveChangesAsync();

                            response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, $"Status: {r.Status} - ValidTo: {tokenOutputDTO.ValidTo} - UpdatedAt: {r.UpdatedAt}"));
                        }
                    }
                }
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public async Task<Response<TokenOutputDTO>> VerifyToken(string e)
        {
            var response = new Response<TokenOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("input", e));

            try
            {
                var r = await _context.Token.FirstOrDefaultAsync(x => (x.Value == e && x.Deleted == false));

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, e));
                else
                {
                    var tokenOutputDTO = Auth.ValidateToken(e);

                    if (r.Status == TokenStatus.Expired || r.Status == TokenStatus.Used)
                    {
                        response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, $"Status: {r.Status} - ValidTo: {tokenOutputDTO.ValidTo} - UpdatedAt: {r.UpdatedAt}"));
                    }
                    else
                    {
                        if (tokenOutputDTO.ValidTo > DateTime.UtcNow)
                        {
                            response.InnerMessage = ReturnMessages.Success("Validate Token");
                            response.FinishedSuccessfully(tokenOutputDTO);
                        }
                        else
                        {
                            r.Status = TokenStatus.Expired;
                            _context.Update(r);
                            await _context.SaveChangesAsync();

                            response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, $"Status: {r.Status} - ValidTo: {tokenOutputDTO.ValidTo} - UpdatedAt: {r.UpdatedAt}"));
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

        public async Task<Response<AuthOutputDTO>> ValidateToken(AuthTokenInputDTO e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("input", e));

            try
            {
                var result = _tokenValidator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var r = await _context.Token.FirstOrDefaultAsync(x => (x.Value == e.Value && x.Type == e.Type && x.Deleted == false));

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound("Token", e.Value));
                else
                {
                    var tokenOutputDTO = Auth.ValidateToken(e.Value);

                    if (r.Status == TokenStatus.Expired || r.Status == TokenStatus.Used)
                    {
                        response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus("Token", $"Status: {r.Status} - ValidTo: {tokenOutputDTO.ValidTo} - UpdatedAt: {r.UpdatedAt}"));
                    }
                    else
                    {
                        if (tokenOutputDTO.ValidTo > DateTime.UtcNow)
                        {
                            var u = await _context.User.FirstOrDefaultAsync(x => (x.Id == r.UserId && x.Deleted == false));

                            if (u is null)
                                response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound("User", e.Value));
                            else
                            {
                                switch ((Values.UserStatus)_env.GetPropertyById("userStatus", u.StatusId))
                                {
                                    case Values.UserStatus.ChangePassword:
                                        response.InnerMessage = ReturnMessages.Success($"[REDIRECT TO CHANGE PASSWORD] User Status: {Values.UserStatus.ChangePassword}");
                                        break;
                                    case Values.UserStatus.PendingValidation:
                                        response.InnerMessage = ReturnMessages.Success($"[REDIRECT TO DEFINE NEW PASSWORD] User Status: {Values.UserStatus.PendingValidation}");
                                        break;
                                    default:
                                        response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus("User", $"Status: {u.StatusId}"));
                                        break;
                                }

                                var o = new AuthOutputDTO(); o.FillFromEntity(r);
                                o.TokenOutputDTO = tokenOutputDTO;

                                response.FinishedSuccessfully(o);
                            }
                        }
                        else
                        {
                            r.Status = TokenStatus.Expired;
                            _context.Update(r);
                            await _context.SaveChangesAsync();

                            response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, $"Status: {r.Status} - ValidTo: {tokenOutputDTO.ValidTo} - UpdatedAt: {r.UpdatedAt}"));
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

        public async Task<Response<AuthOutputDTO>> DefinePassword(AuthPasswordInputDTO e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("userOrMail", _webInfo.UserID),
                new ResponseParams("password", "********"));

            try
            {
                var result = _passwordValidator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var t = await _context.Token.FirstOrDefaultAsync(x =>
                    x.Value == e.Token &&
                    x.Status == TokenStatus.Active &&
                    x.Deleted == false);

                if (t is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound("Token", e.Token!));
                else
                {
                    var r = await _context.User.FirstOrDefaultAsync(x => x.Id == t.UserId & x.StatusId == _env.GetPropertyByValue("userStatus", Values.UserStatus.PendingValidation.GetHashCode()));

                    if (r is null)
                        response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound("User", t.UserId));
                    else
                    {
                        using (var transaction = _context.Database.BeginTransactionAsync())
                        {
                            try
                            {
                                r.StatusId = _env.GetPropertyByValue("userStatus", Values.UserStatus.Active.GetHashCode());

                                string passwordStrength = IsStrongPassword(e.Value!);
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

                                r.Password = Auth.HashPassword(e.Value!);

                                r.Stamp(Values.Action.Update);

                                _context.Update(r);

                                await _context.SaveChangesAsync();

                                var o = new AuthOutputDTO(); o.FillFromEntity(r);
                                o.Status = (UserStatus)_env.GetPropertyById("userStatus", r.StatusId);

                               
                            }
                            catch (Exception ex)
                            {
                                await transaction.Result.RollbackAsync();
                                response.FinishedWithError(ex, transaction.Result.TransactionId.ToString());
                            }
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

        public async Task<Response<AuthOutputDTO>> ForgotPassword(AuthForgotInputDTO e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
            new ResponseParams("userOrEmail", e.UserOrEmail));

            try
            {
                var result = _authForgotValidator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var r = await _context.User.FirstOrDefaultAsync(x => x.Username == e.UserOrEmail|| x.Email == e.UserOrEmail);

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, e.UserOrEmail!));
                else
                {
                    using (var transaction = _context.Database.BeginTransactionAsync())
                    {
                        try
                        {
                            r.FillInsertFromDTO(e);

                            r.StatusId = _env.GetPropertyByValue("userStatus", Values.UserStatus.ChangePassword.GetHashCode());
                            r.Password = Auth.HashPassword("secret");
                            r.Stamp(e.Action!);
                            _context.Update(r);

                            await _context.SaveChangesAsync();

                            var token = Auth.CreateToken(r);
                            var tokenOutputDTO = Auth.ValidateToken(token);

                            if (tokenOutputDTO.ValidTo != DateTime.MinValue)
                            {
                                var t = new Token(token, r.Id, TokenType.PasswordRecovery);

                                await _context.AddAsync(t);
                                await _context.SaveChangesAsync();

                                tokenOutputDTO.FillFromEntity(t);

                                var o = new AuthOutputDTO(); o.FillFromEntity(r);
                                o.TokenOutputDTO = tokenOutputDTO;

                            }
                            else
                                response.FinishedWithError($"Token validation failed for user {e.UserOrEmail}");
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

        public async Task<Response<AuthOutputDTO>> ChangePassword(AuthPasswordInputDTO e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("password", "********"));

            try
            {
                var result = _passwordValidator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }
                
                //Validar la fortaleza de la contraseña
                string passwordStrength = IsStrongPassword(e.Confirmation!);

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

                var r = await _context.User.FirstOrDefaultAsync(x => x.Id == e.UserId & x.StatusId == _env.GetPropertyByValue("userStatus", Values.UserStatus.Active.GetHashCode()));

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, e!.UserId));
                else
                {
                    using (var transaction = _context.Database.BeginTransactionAsync())
                    {
                        try
                        {   
                            if (Values.ChangePasswordType.Change.GetHashCode() == e.TypeId)
                            {
                                if (!Auth.VerifyHashedPassword(r.Password!, e.Value!))
                                {
                                    // La contraseña proporcionada no coincide con la almacenada en la base de datos
                                    response.FinishedWithError(InnerCode.C150PasswordInvalid,ReturnMessages.InvalidPassword());
                                    return response;
                                }
                                else{
                                    r.Password = Auth.HashPassword(e.Confirmation!);
                                }
                            }
                            if (Values.ChangePasswordType.Reestablish.GetHashCode()== e.TypeId)
                            {
                               if (e.Confirmation != null){
                               // La contraseña nueva pasa las validaciones y se puede asignar como nueva pass
                               r.Password = Auth.HashPassword(e.Confirmation!);
                               }
                            }

                            r.Stamp(Values.Action.Update);

                            await _context.SaveChangesAsync();

                            var o = new AuthOutputDTO(); o.FillFromEntity(r);

                            await transaction.Result.CommitAsync();

                            response.InnerMessage = ReturnMessages.Success(_entity, o.Id, ReturnMessages.Update);
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

        // Método para validar la fortaleza de la contraseña
        private string IsStrongPassword(string password)
        {
            var length = _configuration.GetValue<int>("PasswordStrength:Length");
            var characters = _configuration.GetValue<string>("PasswordStrength:Characters")!;
            var requiresUpperCase = _configuration.GetValue<bool>("PasswordStrength:Upper/LowerCase");
            var requiresLettersOrNumbers = _configuration.GetValue<bool>("PasswordStrength:Letters/Numbers");
            
            // Validar longitud, al menos una mayúscula o minúscula, y letras o números
            if (password.Length <= length)
            {
                return "LENGTH_ERROR";
            }
            if (Regex.IsMatch(password, characters))
            {
                return "CHARACTER_ERROR"; 
            }
            if (requiresUpperCase && !password.Any(char.IsUpper))
            {
                return "UPPERCASE_ERROR"; 
            }
            if (requiresUpperCase && !password.Any(char.IsLower))
            {
               return "LOWERCASE_ERROR";
            }
            if (requiresLettersOrNumbers && !password.Any(char.IsDigit))
            {
               return "LETTERS_OR_NUMBERS_ERROR"; 
            }
            else
            {
                return "STRONG_PASSWORD";
            }
        }

        public async Task<Response<AuthOutputDTO>> UpdateAccount(AuthUserInputDTO e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("userOrEmail", _webInfo.UserID));

            try
            {
                var result = _userValidator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var r = await _context.User.FirstOrDefaultAsync(x => (x.Id == _webInfo.UserID && x.Deleted == false));

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, _webInfo.UserID));
                else
                {
                    if (r.StatusId != _env.GetPropertyById("userStatus", Values.UserStatus.Active.GetHashCode()))
                        response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, e.Username));
                    else
                    {
                        using (var transaction = _context.Database.BeginTransaction())
                        {
                            try
                            {
                                r.FillUpdateFromDTO(e);
                                r.Stamp(e.Action!);
                                _context.Update(r);

                                await _context.SaveChangesAsync();

                                var o = new AuthOutputDTO(); o.FillFromEntity(r);
                                o.Id = r.Id;

                                transaction.Commit();

                                response.InnerMessage = ReturnMessages.Success(_entity, o.Id, ReturnMessages.Update);
                                response.FinishedSuccessfully(o, transaction.TransactionId.ToString());
                            }
                            catch (Exception ex)
                            {
                                transaction.Rollback();
                                response.FinishedWithError(ex, transaction.TransactionId.ToString());
                            }
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

        public async Task<Response<AuthOutputDTO>> Login(AuthInputDTO e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("userOrMail", e.UserOrEmail),
                new ResponseParams("password", "********"));

            try
            {
                var result = _authValidator.Validate(e);
                if (!result.IsValid)
                {
                    response.FinishedWithInputValidationErrors(result.Errors);
                    return response;
                }

                var r = await _context.User.FirstOrDefaultAsync(x => (x.Username == e.UserOrEmail || x.Email == e.UserOrEmail) && x.Deleted == false);

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, e.UserOrEmail!));
                else
                {
                    if (r.StatusId != _env.GetPropertyByValue("userStatus", Values.UserStatus.Active.GetHashCode()))
                        response.FinishedWithError(InnerCode.C640RowInvalidStatus, ReturnMessages.InvalidStatus(_entity, e.UserOrEmail!));

                    else if ((r.Administrative == true && r.Doctor == false) || (r.Administrative == false  && r.Doctor == true))
                        response.FinishedWithError(InnerCode.C670RowValidation, ReturnMessages.RowValidation(_entity, e.UserOrEmail!));

                    else if (!Auth.VerifyHashedPassword(r.Password!, e.Password!))
                        response.FinishedWithError(InnerCode.C670RowValidation, ReturnMessages.RowValidation(_entity, e.UserOrEmail!));
                    else
                    {  
                        var token = Auth.CreateToken(r);
                        var tokenOutputDTO = Auth.ValidateToken(token);

                        if (tokenOutputDTO.ValidTo != DateTime.MinValue)
                        {
                            var t = new Token(token, r.Id, TokenType.Session);

                            using (var transaction = _context.Database.BeginTransactionAsync())
                            {
                                try
                                {
                                    await _context.AddAsync(t);
                                    await _context.SaveChangesAsync();

                                    var o = new AuthOutputDTO(); o.FillFromEntity(r);
                                    o.Status = (Values.UserStatus)_env.GetPropertyById("userStatus", r.StatusId);
                                    o.TokenOutputDTO = tokenOutputDTO;

                                    _context.Update(r);
                                    await _context.SaveChangesAsync();

                                    await transaction.Result.CommitAsync();

                                    response.InnerMessage = ReturnMessages.Success("Create Token");
                                    response.FinishedSuccessfully(o, transaction.Result.TransactionId.ToString());
                                }
                                catch (Exception ex)
                                {
                                    await transaction.Result.RollbackAsync();
                                    response.FinishedWithError(ex, transaction.Result.TransactionId.ToString());
                                }
                            }
                        }
                        else
                            response.FinishedWithError($"Token validation failed for user {e.UserOrEmail}");
                    }
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public async Task<Response<AuthOutputDTO>> Logout(string e)
        {
            var response = new Response<AuthOutputDTO>();
            response.Start(MethodBase.GetCurrentMethod()!.Name,
                new ResponseParams("input", e));

            try
            {
                var r = await _context.Token.FirstOrDefaultAsync(x => x.Value == e && x.Deleted == false);

                if (r is null)
                    response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound(_entity, e));
                else
                {
                    var user = await _context.User.FirstOrDefaultAsync(x => x.Id.Equals(r.UserId) && x.Deleted == false);
                    if (user is null)
                        response.FinishedWithError(InnerCode.C660RowNotFound, ReturnMessages.NotFound("User", e));
                    else
                    {
                        r.Status = TokenStatus.Inactive;
                        _context.Update(r);
                        await _context.SaveChangesAsync();

                        var tokenOutputDTO = new TokenOutputDTO()
                        {
                            Id = r.Id,
                            Status = r.Status,
                            Value = r.Value
                        };
                        var o = new AuthOutputDTO(); o.FillFromEntity(user!);
                        o.TokenOutputDTO = tokenOutputDTO;
                        response.InnerMessage = ReturnMessages.Success("User logout");
                        response.FinishedSuccessfully(o);
                    }
                }
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }
    }
}
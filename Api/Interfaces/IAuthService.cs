using Backend.DTOs;
using Backend.Helpers;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<Response<AuthOutputDTO>> Me();

        Task<Response<TokenOutputDTO>> VerifyToken(string e);

        Task<Response<AuthOutputDTO>> ValidateToken(AuthTokenInputDTO e);

        Task<Response<AuthOutputDTO>> DefinePassword(AuthPasswordInputDTO e);

        Task<Response<AuthOutputDTO>> ForgotPassword(AuthForgotInputDTO e);

        Task<Response<AuthOutputDTO>> ChangePassword(AuthPasswordInputDTO e);

        Task<Response<AuthOutputDTO>> UpdateAccount(AuthUserInputDTO e);

        Task<Response<AuthOutputDTO>> Login(AuthInputDTO e);

        Task<Response<AuthOutputDTO>> Logout(string e);


    }
}

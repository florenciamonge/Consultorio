using Backend.Helpers;
using FluentValidation;

namespace Backend.DTOs
{
    public class AuthInputDTO : BaseDTO
    {
        public AuthInputDTO()
        {
            UserOrEmail = string.Empty;
            Password = string.Empty;
        }

        public string UserOrEmail { get; set; }
        public string Password { get; set; }
        public class Validate : AbstractValidator<AuthInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.UserOrEmail).NotEmpty().NotNull();
                RuleFor(x => x.Password).NotEmpty().NotNull();
            }
        }
    }

    public class AuthUserInputDTO : BaseDTO
    {
        public AuthUserInputDTO()
        {
            Name = string.Empty;
            Surname = string.Empty;
            Username = string.Empty;
            Email = string.Empty;
        }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        public class Validate : AbstractValidator<AuthUserInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.Name).NotEmpty().NotNull();
                RuleFor(x => x.Surname).NotEmpty().NotNull();
                RuleFor(x => x.Username).NotEmpty().NotNull();
                RuleFor(x => x.Email).NotEmpty().NotNull().EmailAddress();
            }
        }
    }

    public class AuthTokenInputDTO : BaseDTO
    {
        public AuthTokenInputDTO()
        {
            Value = string.Empty;
            Type = 0;
        }
        public string Value { get; set; }
        public Values.TokenType Type { get; set; }

        public class Validate : AbstractValidator<AuthTokenInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.Value).NotEmpty().NotNull();
                RuleFor(x => x.Type).NotEmpty().NotNull();
            }
        }
    }

    public class AuthPasswordInputDTO : BaseDTO
    {
        public AuthPasswordInputDTO()
        {
            Value = string.Empty;
            Confirmation = string.Empty;
            Token = string.Empty;
            TypeId = 0;
        }

        public int? UserId { get; set; }
        public string? Value { get; set; }
        public string? Confirmation { get; set; }
        public string? Token { get; set; }
        //Identifica el tipo de Cambio de contraseña que desea
        public int TypeId { get; set; }

        public class Validate : AbstractValidator<AuthPasswordInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.Value).NotEmpty().NotNull().When(x => x.Action == Values.Action.Create);
            }
        }
    }

    public class AuthForgotInputDTO : BaseDTO
    {
        public AuthForgotInputDTO()
        {
            UserOrEmail = string.Empty;
        }

        public string UserOrEmail { get; set; }
        public class Validate : AbstractValidator<AuthForgotInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.UserOrEmail).NotEmpty().NotNull();
            }
        }
    }

    public class AuthOutputDTO : BaseDTO
    {
        public AuthOutputDTO()
        {
            Id = 0;
            Name = string.Empty;
            Surname = string.Empty;
            Username = string.Empty;
            Email = string.Empty;
            Administrative = false;
            Doctor = false;
            Status = Values.UserStatus.Inactive;
            StatusId = this.StatusId.GetHashCode();
            StatusText = string.Empty;
        }

        public long Id { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public bool Administrative { get; set; }

        public bool Doctor { get; set; }

        public Values.UserStatus Status { get; set; }

        public long StatusId { get; set; }

        public string StatusText { get; set; }

        public long? LastConnection { get; set; }

        public TokenOutputDTO? TokenOutputDTO { get; set; }
    }
}
using FluentValidation;
using Backend.Helpers;

namespace Backend.DTOs
{
    public class UserInputDTO : BaseDTO
    {
        public UserInputDTO()
        {
            Name = string.Empty;
            Surname = string.Empty;
            Username = string.Empty;
            StatusId = 0;
            Password = string.Empty;
            Email =  null;
            Administrative = false;
            Doctor = false;
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public long StatusId { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public bool Administrative { get; set; }
        public bool Doctor { get; set; }

        public class Validate : AbstractValidator<UserInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.Name)
                    .NotEmpty()
                    .NotNull()
                    .When(x => x.Action == Values.Action.Create || (x.Action == Values.Action.Update && x.ToUpdate != null && x.ToUpdate!.Contains("Name")));

                RuleFor(x => x.Surname)
                    .NotEmpty()
                    .NotNull()
                    .When(x => x.Action == Values.Action.Create || (x.Action == Values.Action.Update && x.ToUpdate != null && x.ToUpdate!.Contains("Surname")));

                RuleFor(x => x.Username)
                    .NotEmpty()
                    .NotNull()
                    .When(x => x.Action == Values.Action.Create || (x.Action == Values.Action.Update && x.ToUpdate != null && x.ToUpdate!.Contains("Username")));
                }
        }
    }

    public class UserOutputDTO : BaseDTO
    {
        public UserOutputDTO()
        {
            Id = 0;
            Name = string.Empty;
            Surname = string.Empty;
            Username = string.Empty;
            Password = string.Empty;
            Email = string.Empty;
            StatusId = 0;
            StatusText = string.Empty;
            TokenOutputDTO = new TokenOutputDTO();
        }

        public long Id { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public string? Email { get; set; }

        public long StatusId { get; set; }

        public string StatusText { get; set; }

        public TokenOutputDTO TokenOutputDTO { get; set; }

        public bool Administrative { get; set; }

        public bool Doctor { get; set; }
    }
}
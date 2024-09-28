using FluentValidation;
using Backend.Helpers;

namespace Backend.DTOs
{
    public class PatientInputDTO : BaseDTO
    {
        public PatientInputDTO()
        {
            Name = string.Empty;
            DNI = string.Empty;
            
        }


        public long Id { get; set; }
        public string Name { get; set; }
        public string DNI { get; set; }
       

        public class Validate : AbstractValidator<PatientInputDTO>
        {
            public Validate()
            {
                RuleFor(x => x.Name)
                    .NotEmpty()
                    .NotNull()
                    .When(x => x.Action == Values.Action.Create || (x.Action == Values.Action.Update && x.ToUpdate != null && x.ToUpdate!.Contains("Name")));
            }
        }
    }

    public class PatientOutputDTO : BaseDTO
    {
        public PatientOutputDTO()
        {
            Id = 0;
            Name = string.Empty;
        }

        public long Id { get; set; }
        public string Name { get; set; }

    }
}
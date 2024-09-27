using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    
    public class Patient : BaseModel
    {
        public Patient()
        {
            Name = string.Empty;
            Surname = string.Empty;
            Phone = string.Empty;
            Email = string.Empty;
            StatusId = 0;
            HealthInsurance = false;
        }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }
        
        [Required]
        public string Phone { get; set; }

        public string? Email { get; set; }

        [Required]
        public long StatusId { get; set; }

        [Required]
        public virtual PropertyValue? Status { get; set; }

        [Required]
        public bool HealthInsurance { get; set; }

    }
}
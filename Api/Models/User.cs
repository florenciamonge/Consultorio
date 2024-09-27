using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    
    public class User : BaseModel
    {
        public User()
        {
            Name = string.Empty;
            Surname = string.Empty;
            Username = string.Empty;
            Password = string.Empty;
            Email = string.Empty;
            StatusId = 0;
            Administrative = false;
        }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string? Password { get; set; }

        public string? Email { get; set; }

        [Required]
        public long StatusId { get; set; }

        [Required]
        public virtual PropertyValue? Status { get; set; }

        [Required]
        public bool Administrative { get; set; }

        [Required]
        public bool Doctor { get; set; }

    }
}
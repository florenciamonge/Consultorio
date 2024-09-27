using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using static Backend.Helpers.Auth;
using static Backend.Helpers.Values;

namespace Backend.Models
{
    [Index(nameof(Value), IsUnique = true)]
    public class Token : BaseModel
    {
        public Token(string value, long userId, TokenType type)
        {
            Value = value;
            UserId = userId;
            Type = type;
            Status = TokenStatus.Active;
        }

        [Required]
        public string Value { get; set; }

        [Required]
        public TokenStatus Status { get; set; }

        [Required]
        public TokenType Type { get; set; }

        [Required]
        public long UserId { get; set; }

        [Required]
        public virtual User? User { get; set; }
    }
}
using static Backend.Helpers.Values;

namespace Backend.DTOs
{
    public class TokenOutputDTO : BaseDTO
    {
        public TokenOutputDTO()
        {
            Id = 0;
            Value = string.Empty;
            ValidFrom = DateTime.MinValue;
            ValidTo = DateTime.MinValue;
            MaximumExpirationTime = DateTime.MinValue;
            Claims = new Dictionary<string, string>();
            Renovated = false;
            Error = string.Empty;
        }

        public long Id { get; set; }

        public string Value { get; set; }

        public TokenStatus Status { get; set; }

        public DateTime ValidFrom { get; set; }

        public DateTime ValidTo { get; set; }

        public DateTime MaximumExpirationTime { get; set; }

        public Dictionary<string, string> Claims { get; set; }

        public bool Renovated { get; set; }

        public string Error { get; set; }
    }
}
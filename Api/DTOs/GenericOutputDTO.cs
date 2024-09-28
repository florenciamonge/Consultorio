using Backend.Helpers;

namespace Backend.DTOs
{
    public class GenericOutputDTO
    {
        public GenericOutputDTO()
        {
            Succeeded = false;
            InnerCode = InnerCode.C000;
            InnerMessage = string.Empty;
            Extra = string.Empty;
            ExecuteStarted = DateTime.Now;
            ExecuteFinished = DateTime.Now;
            Error = string.Empty;
        }

        public bool Succeeded { get; set; }

        public InnerCode InnerCode { get; set; }

        public string InnerMessage { get; set; }

        public string Extra { get; set; }

        public DateTime ExecuteStarted { get; set; }

        public DateTime ExecuteFinished { get; set; }

        public double TimeInSeconds { get { return (ExecuteFinished - ExecuteStarted).TotalSeconds; } }

        public string Error { get; set; }
    }
}
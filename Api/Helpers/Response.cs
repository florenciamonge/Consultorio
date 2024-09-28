using System.Text.Json.Serialization;
using Backend.DTOs;
using FluentValidation.Results;
using Newtonsoft.Json;
using Serilog;

namespace Backend.Helpers
{
    public class ResponseParams
    {
        public string? Name { get; set; }
        public object? Value { get; set; }

        public ResponseParams(string? name, object? value = null)
        {
            Name = name;
            Value = value;
        }
    }

    public static class ReturnMessages
    {
        public const string
        Insert = "Inserted",
        Update = "Updated",
        Delete = "Deleted";
        public static string NotFound(string entity, long? id) => $"{entity} with id {id} not found";
        public static string NotFound(string entity, string input) => $"{entity} with input {input} not found";
        public static string InvalidStatus(string entity, string input) => $"{entity} invalid status with input {input}";
        public static string RowValidation(string entity, string input) => $"{entity} row validation failed with input {input}";
        public static string RowRelation(string entity, string relation, long id) => $"{entity} - Active {relation} relation with id {id}";
        public static string AlreadyExists(string entity, string fields) => $"{entity} with this {fields} already exists";
        public static string Success(string entity, long id, string action) => $"{entity} with Id {id} - The value was {action} correctly";
        public static string Success(string action) => $"Action executed correctly ({action})";
        public static string Success(string entity, List<long> ids) => $"{entity} with Ids [{string.Join(", ", ids)}] - See details of each value in the response";
        public static string ReduceNothingToDo(string entity) => $"{entity} Reduce - Nothing to do";
        public static string CaptchaFailed() => "CAPTCHA validation failed";
        public static string InvalidPassword() => "Password invalid";
        public static string ExpiredToken() => "ExpiredToken";
        public static string ShortPassword() => "Short Password";
        public static string NoCharacterPassword() => "The password must have one of these symbols: !@#$%^&*()_+<>?";
        public static string NoUppercasePassword()=> "The password must have UpperCase letters";
        public static string NoLowercasePassword() => "The password must have LowerCase letters";
        public static string NoLettersOrNumbersPassword() => "The password must have letters and numbers";
    }

    public static class ExtraMessages
    {
        public static string Reduce(string entity, string relation, List<long> ids) => $"Reduce on {entity} with {relation} ids [{string.Join(", ", ids)}]";
    }

    public enum InnerCode
    {
        C000 = 0,
        C100Error = 100,
        C110UsernameDuplicate =110,
        C120EmailDuplicate =120,
        C131CodeDuplicate =131,
        C140BoxInvalid = 140,
        C141AlternativeNotExist = 141,
        C150PasswordInvalid = 150,
        C151ShortPassword = 151,
        C152NoLowercasePassword = 152,
        C153NoUppercasePassword = 153,
        C154NoLettersOrNumbersPassword = 154,
        C155NoCharacterPassword = 155,
        C160BoxWithWorkOrderInitialed = 160,
        C170WorkOrderInitialedWithOtherBox = 170,
        C600DatabaseFKValidation = 600,
        C610AssociatedRegister = 610,
        C620SelectByPKNotFound = 620,
        C630WorkOrderExists = 630,
        C640RowInvalidStatus = 640,
        C650RowCantBeDeleted = 650,
        C660RowNotFound = 660,
        C670RowValidation = 670,
        C680InputValidation = 680,
        C690RowCantBeInvalid = 690,
        C700CaptchaFailed = 700,
        C710ExpiredToken = 710
    }

    public class Response<T>
    {
        public Response()
        {
            Method = "Internal";
            Succeeded = false;
            InnerCode = InnerCode.C000;
            InnerMessage = string.Empty;
            Transaction = string.Empty;
            ExecuteStarted = DateTime.Now;
            ExecuteFinished = DateTime.Now;
            Error = string.Empty;
            Debug = string.Empty;
        }

        private string Method { get; set; }

        public string DataType { get { return typeof(T).Name; } }

        public bool Succeeded { get; private set; }

        public InnerCode InnerCode { get; private set; }

        public string InnerMessage { get; set; }

        public string Transaction { get; set; }

        public TokenOutputDTO? TokenOutputDTO { get; set; }

        public DateTime ExecuteStarted { get; private set; }

        public DateTime ExecuteFinished { get; private set; }

        public double TimeInSeconds { get { return (ExecuteFinished - ExecuteStarted).TotalSeconds; } }

        public string Error { get; private set; }

        public string Debug { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public T? Data { get; private set; }

        public void Start()
        {
            Start("Internal");
        }

        public void Start(string method, params ResponseParams[] methodParams)
        {
            ExecuteStarted = DateTime.Now;
            Method = method;
            if (methodParams != null)
                Log.Information($"Start {Method}{Environment.NewLine}{methodParams.ToAudit()}");
            else
                Log.Information($"Start {Method}");
        }

        public void FinishedSuccessfully(T? data, string transaction = "")
        {
            InnerCode = InnerCode.C000;
            InnerMessage = InnerMessage == string.Empty ? "Success" : InnerMessage;
            Transaction = transaction != "" ? $"ID {transaction} committed" : string.Empty;
            Succeeded = true;
            Data = data;
            ExecuteFinished = DateTime.Now;
            Audit();
        }

        internal void FinishedWithInputValidationErrors(List<ValidationFailure> errors)
        {
            InnerCode = InnerCode.C680InputValidation;
            InnerMessage = "Input Validations details in the Error property";
            Error = string.Join(" - ", errors.Select(i => $"{i.ErrorCode} | ${i.ErrorMessage}").ToList());
            Succeeded = false;
            ExecuteFinished = DateTime.Now;
            Audit();
        }

        public void FinishedWithError(string error)
        {
            InnerCode = InnerCode.C100Error;
            InnerMessage = error;
            Error = error;
            Succeeded = false;
            ExecuteFinished = DateTime.Now;
            Audit();
        }

        public void FinishedWithError(InnerCode code, string error)
        {
            InnerCode = code;
            InnerMessage = error;
            Error = error;
            Succeeded = false;
            ExecuteFinished = DateTime.Now;
            Audit();
        }

        public void FinishedWithError(Exception ex, string transaction = "")
        {
            InnerCode = InnerCode.C100Error;
            InnerMessage = "Error details in the Error property";
            Transaction = transaction != "" ? $"ID {transaction} rollback" : string.Empty;
            Error = $"{ex.Message} - {ex.InnerException?.Message} - {ex.StackTrace}";
            ExecuteFinished = DateTime.Now;
            Audit();
        }

        private void Audit()
        {
            Log.Information($"Finish {Method}{Environment.NewLine}{this.ToAudit()}");
        }
    }
}
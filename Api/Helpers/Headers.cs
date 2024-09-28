using Serilog;

namespace Backend.Helpers
{
    public static class Headers
    {
        public struct WebInfo
        {
            public int UserID { get; set; }
            public bool Administrative { get; set; }
            public bool Doctor { get; set; }
            public string Token { get; set; }
            public object Audit { get; set; }
        }
        public static WebInfo GetWebInfo(IHttpContextAccessor _accessor)
        {
            var headers = _accessor.HttpContext!.Request.Headers;

            var audit = new
            {
                RemoteIpAddress = _accessor.HttpContext.Connection.RemoteIpAddress?.ToString(),
                RemotePort = _accessor.HttpContext.Connection.RemotePort.ToString(),
                User_Agent = _accessor.HttpContext.Request.Headers.UserAgent.ToString(),
                UserId = _accessor.HttpContext.Request.Headers["userID"].ToString(),
            };
            
            var user_agent2 = _accessor.HttpContext.Request.Headers.Age;

            Log.Information($"UserConnectionData: {audit.ToAudit()}");
            
            return new WebInfo
            {
                Token = headers["Authorization"].ToString(),
                Audit = audit,
    
                UserID = int.TryParse(headers["userID"], out var valueUserID) ? valueUserID : 0,
                Administrative = bool.TryParse(headers["administrative"], out var administrativeValue) && administrativeValue,
                Doctor = bool.TryParse(headers["doctor"], out var doctorValue) && doctorValue
            };
        }

    }
}
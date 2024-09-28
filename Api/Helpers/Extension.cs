using Newtonsoft.Json;

namespace Backend.Helpers
{
    public static class Extensions
    {
        public static string ToAudit(this object data)
        {
            string rtn = string.Empty;
            try
            {
                rtn = JsonConvert.SerializeObject(data, Newtonsoft.Json.Formatting.Indented);
            }
            catch
            {
                rtn = $"{data.GetType().ToString()}  - No Audit";
            }
            return rtn;
        }

        public static DateTime ToDateTime(this long data)
        {
            DateTime dateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            dateTime = dateTime.AddMilliseconds(data).ToLocalTime();
            return dateTime;
        }
    }
}
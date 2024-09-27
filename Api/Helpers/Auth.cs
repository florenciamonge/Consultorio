using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.DTOs;
using Backend.Models;
using static Backend.Helpers.Values;
using System.Text.Json.Serialization;

namespace Backend.Helpers
{
    public static class Auth
    {
        public static IConfigurationSection? Configuration { get; set; }

        public static string CreateToken(User user)
        {
            var key = Configuration!.GetValue<string>("Key");
            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key!));

            var tokenHandler = new JwtSecurityTokenHandler();
             
            var claims = new List<Claim>
            {
                new Claim("User.Id", user.Id.ToString()),
                new Claim("User.Name", user.Name),
                new Claim("User.Surname", user.Surname),
                new Claim("User.Username", user.Username),
            };
            if (!string.IsNullOrEmpty(user.Email))
            {
                claims.Add(new Claim("User.Email", user.Email));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(Configuration!.GetValue<string>("Expires")!)),
                Issuer = Configuration!.GetValue<string>("Issuer"),
                Audience = Configuration!.GetValue<string>("Audience"),
                SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public static TokenOutputDTO ValidateToken(string token)
        {
            var r = new TokenOutputDTO();
            try
            {
                var key = Configuration!.GetValue<string>("Key");
                var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key!));
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = Configuration!.GetValue<string>("Issuer"),
                    ValidAudience = Configuration!.GetValue<string>("Audience"),
                    IssuerSigningKey = securityKey
                }, out SecurityToken validatedToken);

                r.Status = TokenStatus.Active;

                securityToken!.Claims.ToList().ForEach(c => r.Claims.Add(c.Type, c.Value));

                var validTo = securityToken.ValidFrom.AddMinutes(double.Parse(Configuration!.GetValue<string>("Expires")!));

                r.Value = token;

                var currentTime = DateTime.UtcNow; // Obtiene la fecha y hora actual en formato UTC

                // Convertir la fecha y hora actual a la zona horaria de Argentina
                TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                DateTime validToArgentinaTime = TimeZoneInfo.ConvertTimeFromUtc(validTo, argentinaTimeZone);
                DateTime currentArgentinaTime = TimeZoneInfo.ConvertTimeFromUtc(currentTime, argentinaTimeZone);


                var timeUntilExpiration = currentArgentinaTime - validToArgentinaTime;

                if (timeUntilExpiration.Minutes < double.Parse(Configuration!.GetValue<string>("MaximumExpirationTime")!))
                {
                   // El tiempo restante es menor o igual a la duración máxima del token, renuevo el token
                   r.Value = RenewToken(token);
                   r.Renovated = true;
                   r.Status = TokenStatus.Active;
                   return r;
                }
                if (timeUntilExpiration.Minutes >= double.Parse(Configuration!.GetValue<string>("MaximumExpirationTime")!))
                {
                   r.Value = token;
                   r.Renovated = false;
                   r.Error =  "710";
                }

            }
            catch (SecurityTokenExpiredException ex)
            {
                r.Value = token;
                r.ValidTo = TimeZoneInfo.ConvertTimeFromUtc(ex.Expires, TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time"));
                r.Renovated = false;
                return r;
            }
            return r;
        }

        public static string RenewToken(string expiredToken)
        {
           // Lógica para generar un nuevo token válido
           var key = Configuration!.GetValue<string>("Key");
           var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key!));

           var tokenHandler = new JwtSecurityTokenHandler();
           var tokenDescriptor = new SecurityTokenDescriptor
           {
               Subject = new ClaimsIdentity(new List<Claim>
               {
                 new Claim(ClaimTypes.Name, "UsuarioRenovado"),
               }),
               Expires = DateTime.UtcNow.AddMinutes(double.Parse(Configuration!.GetValue<string>("Expires")!)),
               SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature),
               Issuer = Configuration!.GetValue<string>("Issuer"),
               Audience = Configuration!.GetValue<string>("Audience"),
           };

           var newToken = tokenHandler.CreateToken(tokenDescriptor);
           return tokenHandler.WriteToken(newToken);
        }

        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, 12);
        }

        public static bool VerifyHashedPassword(string hashedPassword, string providedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword);
        }

        public async static Task<bool> ValidateCAPTCHA(string captchaToken)
        {
            using (var httpClient = new HttpClient())
            {
                string url = Configuration!.GetSection("CAPTCHA").GetValue<string>("URL")!;
                string secretKey = Configuration.GetSection("CAPTCHA").GetValue<string>("SecretKey")!;

                var dict = new Dictionary<string, string>();
                dict.Add("secret", secretKey);
                dict.Add("response", captchaToken);

                var httpRequestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(url),
                    Content = new FormUrlEncodedContent(dict)
                };

                var response = await httpClient.SendAsync(httpRequestMessage).Result.Content.ReadFromJsonAsync<ResCaptcha>();

                if (response!.success)
                    return true;
            }
            return false;
        }

        private class ResCaptcha
        {
            public bool success { get; set; }

            [JsonPropertyName("error-codes")]
            public List<string>? error_codes { get; set; }
        }
    }
}
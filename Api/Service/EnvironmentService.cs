using System.Reflection;
using Microsoft.EntityFrameworkCore;

using Backend.DTOs;
using Backend.Helpers;
using Backend.Interfaces;
using System.Text.RegularExpressions;

namespace Backend.Services
{
    public class EnvironmentService : IEnvironmentService
    {
        private readonly DBContext _context;
        private readonly IHttpContextAccessor _accessor;
        private static List<PropertyDTO>? _properties;

        public EnvironmentService(DBContext context, IHttpContextAccessor accessor)
        {
            _context = context;
            _accessor = accessor;
        }

        public async Task<Response<List<Dictionary<string, List<PropertyDTO>>>>> PropertiesForSelect()
        {
            var response = new Response<List<Dictionary<string, List<PropertyDTO>>>>();
            response.Start("PropertiesForSelect");

            try
            {
                List<Dictionary<string, List<PropertyDTO>>> rtn = new List<Dictionary<string, List<PropertyDTO>>>();
                var properties = await _context.PropertyValue
                    .Include(r => r.Property)
                    .Select(
                        r => new PropertyDTO
                        {
                            PropertyId = r.Property!.Id,
                            Name = r.Property.Name,
                            PropertyCode = r.Property.Code,
                            PropertyValueId = r.Id,
                            Code = r.Code,
                            ValueString = r.ValueString,
                            ValueDateTime = r.ValueDateTime,
                            ValueInt = r.ValueInt,
                            ValueFloat = r.ValueFloat,
                            TextES = r.TextES,
                            TextEN = r.TextEN,
                            TextPT = r.TextPT
                        }
                    ).ToListAsync();

                var codes = properties.GroupBy(a => a.PropertyCode).Select(a => a.First()).ToList();

                codes.ForEach(p =>
                {
                    var dictionary = new Dictionary<string, List<PropertyDTO>>();
                    dictionary.Add(p.PropertyCode, properties.Where(a => a.PropertyCode == p.PropertyCode).ToList());
                    rtn.Add(dictionary);
                });

                response.FinishedSuccessfully(rtn);
            }
            catch (Exception ex)
            {
                response.FinishedWithError(ex);
            }
            return response;
        }

        public async Task<Response<List<PropertyDTO>>> Properties()
        {
            var response = new Response<List<PropertyDTO>>();
            response.Start("GetProperties");

            try
            {
                if (_properties == null)
                {
                    _properties = await _context.PropertyValue
                    .Include(r => r.Property)
                    .Select(r => new PropertyDTO
                    {
                        PropertyId = r.Property!.Id,
                        Name = r.Property.Name,
                        PropertyCode = r.Property.Code,
                        PropertyValueId = r.Id,
                        Code = r.Code,
                        ValueString = r.ValueString,
                        ValueDateTime = r.ValueDateTime,
                        ValueInt = r.ValueInt,
                        ValueFloat = r.ValueFloat,
                        TextES = r.TextES,
                        TextEN = r.TextEN,
                        TextPT = r.TextPT
                    }).ToListAsync();
                }

                response.FinishedSuccessfully(_properties);
            }
            catch (Exception e)
            {
                response.FinishedWithError(e);
            }
            return response;
        }

        public long GetPropertyByValue(string code, long value)
        {
            if (_properties == null)
            {
                _properties = _context.PropertyValue
                .Include(r => r.Property)
                .Select(r => new PropertyDTO
                {
                    PropertyId = r.Property!.Id,
                    Name = r.Property.Name,
                    PropertyCode = r.Property.Code,
                    PropertyValueId = r.Id,
                    Code = r.Code,
                    ValueString = r.ValueString,
                    ValueDateTime = r.ValueDateTime,
                    ValueInt = r.ValueInt,
                    ValueFloat = r.ValueFloat,
                    TextES = r.TextES,
                    TextEN = r.TextEN,
                    TextPT = r.TextPT
                }).ToList();
            }

            var property = _properties!.FirstOrDefault(r => r.PropertyCode == code && r.ValueInt == value);
            return property!.PropertyValueId;
        }

        public int GetPropertyById(string code, long id)
        {
            if (_properties == null)
            {
                _properties = _context.PropertyValue
                .Include(r => r.Property)
                .Select(r => new PropertyDTO
                {
                    PropertyId = r.Property!.Id,
                    Name = r.Property.Name,
                    PropertyCode = r.Property.Code,
                    PropertyValueId = r.Id,
                    Code = r.Code,
                    ValueString = r.ValueString,
                    ValueDateTime = r.ValueDateTime,
                    ValueInt = r.ValueInt,
                    ValueFloat = r.ValueFloat,
                    TextES = r.TextES,
                    TextEN = r.TextEN,
                    TextPT = r.TextPT
                }).ToList();
            }

            var property = _properties!.FirstOrDefault(r => r.PropertyCode == code && r.PropertyValueId == id);
            return property!.ValueInt ?? -1;
        }

        public List<long> GetProperties(string code, List<int> value)
        {
            if (_properties == null)
            {
                _properties = _context.PropertyValue
                .Include(r => r.Property)
                .Select(r => new PropertyDTO
                {
                    PropertyId = r.Property!.Id,
                    Name = r.Property.Name,
                    PropertyCode = r.Property.Code,
                    PropertyValueId = r.Id,
                    Code = r.Code,
                    ValueString = r.ValueString,
                    ValueDateTime = r.ValueDateTime,
                    ValueInt = r.ValueInt,
                    ValueFloat = r.ValueFloat,
                    TextES = r.TextES,
                    TextEN = r.TextEN,
                    TextPT = r.TextPT
                }).ToList();
            }

            return _properties!.Where(r => r.PropertyCode == code && value.Contains(r.ValueInt ?? 0))
                .ToList()
                .Select(r => r.PropertyValueId)
                .ToList();
        }

         // Método para validar la fortaleza de la contraseña
        public string IsStrongPassword(string password, IConfiguration _configuration)
        {
            var length = _configuration.GetValue<int>("PasswordStrength:Length");
            var characters = _configuration.GetValue<string>("PasswordStrength:Characters")!;
            var requiresUpperCase = _configuration.GetValue<bool>("PasswordStrength:Upper/LowerCase");
            var requiresLettersOrNumbers = _configuration.GetValue<bool>("PasswordStrength:Letters/Numbers");
            
            // Validar longitud, al menos una mayúscula o minúscula, y letras o números
            if (password.Length < length)
            {
                return "LENGTH_ERROR";
            }
            if (!ContainsCharacter(password, characters))
            {
                return "CHARACTER_ERROR"; 
            }
            if (requiresUpperCase && !password.Any(char.IsUpper))
            {
                return "UPPERCASE_ERROR"; 
            }
            if (requiresUpperCase && !password.Any(char.IsLower))
            {
               return "LOWERCASE_ERROR";
            }
            if (requiresLettersOrNumbers && !password.Any(char.IsDigit))
            {
               return "LETTERS_OR_NUMBERS_ERROR"; 
            }
            else
            {
                return "STRONG_PASSWORD";
            }
        }

        private static bool ContainsCharacter(string password, string caracteres)
        {
        foreach (char c in password)
        {
            if (caracteres.Contains(c))
            {
                return true;
            }
        }
        return false;
        }
    }
}
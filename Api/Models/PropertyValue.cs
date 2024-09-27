using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    [Index(nameof(Code), IsUnique = true)]
    public class PropertyValue : BaseModel
    {
        public PropertyValue()
        {
            PropertyCode = string.Empty;
            Code = string.Empty;
            TextES = string.Empty;
            TextEN = string.Empty;
            TextPT = string.Empty;
        }

        [Required]
        public string PropertyCode { get; set; }

        [Required]
        public long PropertyId { get; set; }

        [Required]
        public virtual Property? Property { get; set; }
        
        [Required]
		public string Code { get; set; }

        public string? ValueString { get; set; }
        
        public DateTime? ValueDateTime { get; set; }
        
        public int? ValueInt { get; set; }
        
        public float? ValueFloat { get; set; }
        
        [Required]		
        public string TextES { get; set; }
        
        [Required]
        public string TextEN { get; set; }
        
        [Required]
		public string TextPT { get; set; }
		
        public string? Description { get; set; }
    }
}
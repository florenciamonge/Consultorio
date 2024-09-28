namespace Backend.DTOs
{
    public class PropertyDTO : BaseDTO
    {
        public PropertyDTO()
        {
            PropertyId = 0;
            PropertyValueId = 0;
            Name = string.Empty;
            Type = string.Empty;
            Code = string.Empty;

            PropertyCode = string.Empty;
            ValueString = null;
            ValueDateTime = null;
            ValueInt = null;
            ValueFloat = null;
            TextES = string.Empty;
            TextEN = string.Empty;
            TextPT = string.Empty;
        }

        public long PropertyId { get; set; }

        public long PropertyValueId { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public string Code { get; set; }

        public string PropertyCode { get; set; }

        public string? ValueString { get; set; }

        public DateTime? ValueDateTime { get; set; }

        public int? ValueInt { get; set; }

        public float? ValueFloat { get; set; }

        public string TextES { get; set; }

        public string TextEN { get; set; }

        public string TextPT { get; set; }

        public string? PropertyValueDescription { get; set; }
    }
}
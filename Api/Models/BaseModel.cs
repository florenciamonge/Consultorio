using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.DTOs;
using Backend.Helpers;

namespace Backend.Models
{
    public partial class BaseModel
    {
        public long Id { get; set; }

        [Required]
        public long CreatedAt { get; private set; }

        [Required]
        public long UpdatedAt { get; private set; }

        [Required]
        public bool Deleted { get; set; } = false;

        public int? CreatedUserID { get; set; }

        [ForeignKey("CreatedUserID")]
        [NotMapped]
        public virtual User? CreatedUser { get; set; }

        public int? UpdatedUserID { get; set; }

        [ForeignKey("UpdatedUserID")]
        [NotMapped]
        public virtual User? UpdatedUser { get; set; }

        public virtual void FillInsertFromDTO(object dto)
        {
            this.GetType().GetProperties().ToList().ForEach(p =>
            {
                var property = dto.GetType().GetProperty(p.Name);
                if (property != null)
                {
                    p.SetValue(this, property.GetValue(dto, null));
                }
            });
        }

        public virtual void FillUpdateFromDTO(object dto)
        {
            this.GetType().GetProperties().ToList().ForEach(p =>
            {
                if ((((BaseDTO)dto).ToUpdate == null) || ((BaseDTO)dto).ToUpdate!.Count == 0 || ((BaseDTO)dto).ToUpdate!.Contains(p.Name))
                {
                    var property = dto.GetType().GetProperty(p.Name);
                    if (property != null)
                    {
                        p.SetValue(this, property.GetValue(dto, null));
                    }
                }
            });
        }

        public virtual void Stamp(Values.Action action)
        {
            if (action == Values.Action.Create)
            {
                this.CreatedAt = ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
                this.UpdatedAt = ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
            }
            else if (action == Values.Action.Update)
            {
                this.UpdatedAt = ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
            }
            else if (action == Values.Action.Delete)
            {
                this.UpdatedAt = ((DateTimeOffset)DateTime.Now).ToUnixTimeMilliseconds();
            }
        }
    }
}
using Backend.Helpers;

namespace Backend.DTOs
{
    public interface IBaseDTO
    {
        Values.Action Action { get; set; }

        List<string>? ToUpdate { get; set; }

        void FillFromEntity(object entity);
    }
    public class BaseDTO : IBaseDTO
    {
        public Values.Action Action { get; set; }

        public List<string>? ToUpdate { get; set; }

        public BaseDTO()
        {
            Action = Values.Action.Custom;
            ToUpdate = new List<string>();
        }

        public virtual void FillFromEntity(object entity)
        {
            this.GetType().GetProperties().ToList().ForEach(p =>
            {
                var property = entity.GetType().GetProperty(p.Name);
                if (property != null)
                {
                    p.SetValue(this, property.GetValue(entity, null));
                }
            });
        }
    }
}
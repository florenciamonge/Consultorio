namespace Backend.Helpers
{
    public class Values
    {
        public enum TokenType
        {
            Session = 1,
            PasswordRecovery = 2,
            PasswordValidation = 4,
            EmailChange = 5
        }

        public enum TokenStatus
        {
            Active = 1,
            Expired = 2,
            Used = 3,
            Corrupted = 4,
            Inactive = 5
        }

        public enum Action
        {
            Custom = 0,
            Create = 1,
            Update = 2,
            Delete = 3,
        }

        public enum UserStatus
        {
            Inactive = 0,
            Active = 1,
            PendingValidation = 2,
            ChangePassword = 3,
            Blocked = 4,
        }

         public enum ChangePasswordType
        {
            Reestablish = 1,
            Change = 2
        }

        
    }
}